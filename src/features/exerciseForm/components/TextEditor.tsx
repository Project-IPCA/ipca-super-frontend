import { createPortal } from "react-dom";
import katex from "katex";
import "katex/dist/katex.css";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  List,
  Input,
  Button,
  ListItem,
  IconButton,
  Typography,
  ListItemPrefix,
  Dialog,
  DialogBody,
  DialogHeader,
  Checkbox,
  Textarea,
  DialogFooter,
} from "@material-tailwind/react";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND,
  RangeSelection,
  LexicalEditor,
  BaseSelection,
  $getRoot,
  $insertNodes,
  LexicalCommand,
  createCommand,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import {
  $isListNode,
  REMOVE_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  QuoteNode,
  HeadingNode,
  $isHeadingNode,
  $createQuoteNode,
  $createHeadingNode,
} from "@lexical/rich-text";
import {
  $isCodeNode,
  $createCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  AutoLinkNode,
  LinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $wrapNodes, $isAtNodeEnd } from "@lexical/selection";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import {
  $getNearestNodeOfType,
  $wrapNodeInElement,
  mergeRegister,
} from "@lexical/utils";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HashtagIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { $createImageNode, ImageNode } from "./ImageNode";
import { $createEquationNode, EquationNode } from "./EquationNode";
import { ErrorBoundary } from "react-error-boundary";
import KatexRenderer from "./KatexRenderer";
import { useTranslation } from "react-i18next";

const LowPriority = 1;

type CommandPayload = {
  equation: string;
  inline: boolean;
};

const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> = createCommand(
  "INSERT_EQUATION_COMMAND",
);

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
} as const;

type BlockType = keyof typeof blockTypeToBlockName;

function Divider() {
  return <div className="mx-1 h-6 w-px bg-gray-400" />;
}

function Placeholder() {
  return (
    <div className="z-[9999] pointer-events-none absolute left-2.5 top-4 inline-block select-none overflow-hidden text-base font-normal text-gray-400"></div>
  );
}

function Select({
  onChange,
  className,
  options,
  value,
}: {
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  className: string;
  options: string[];
  value: string;
}) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: MutableRefObject<HTMLDivElement | null>;
  setShowBlockOptionsDropDown: Dispatch<SetStateAction<boolean>>;
}) {
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: Event) => {
        const target = event.target as Node;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <List
      className="absolute z-[9999] flex flex-col gap-0.5 rounded-lg border border-blue-gray-50 bg-white p-1"
      ref={dropDownRef}
    >
      <ListItem
        selected={blockType === "paragraph"}
        className="rounded-md py-2"
        onClick={formatParagraph}
      >
        <ListItemPrefix>
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M19 7V5L5 5V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12 5L12 19M12 19H10M12 19H14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Normal
      </ListItem>
      <ListItem
        selected={blockType === "h1"}
        className="rounded-md py-2"
        onClick={formatLargeHeading}
      >
        <ListItemPrefix>
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M7 9V7L17 7V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12 7V17M12 17H10M12 17H14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Large Heading
      </ListItem>
      <ListItem
        selected={blockType === "h2"}
        className="rounded-md py-2"
        onClick={formatSmallHeading}
      >
        <ListItemPrefix>
          <svg
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M3 7L3 5L17 5V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M10 5L10 19M10 19H12M10 19H8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M13 14L13 12H21V14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M17 12V19M17 19H15.5M17 19H18.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Small Heading
      </ListItem>
      <ListItem
        selected={blockType === "ul"}
        className="rounded-md py-2"
        onClick={formatBulletList}
      >
        <ListItemPrefix>
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M8 6L20 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4 6.01L4.01 5.99889"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4 12.01L4.01 11.9989"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4 18.01L4.01 17.9989"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M8 12L20 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M8 18L20 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Bullet List
      </ListItem>
      <ListItem
        selected={blockType === "ol"}
        className="rounded-md py-2"
        onClick={formatNumberedList}
      >
        <ListItemPrefix>
          <svg
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M9 5L21 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M5 7L5 3L3.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M5.5 14L3.5 14L5.40471 11.0371C5.46692 10.9403 5.50215 10.8268 5.47709 10.7145C5.41935 10.4557 5.216 10 4.5 10C3.50001 10 3.5 10.8889 3.5 10.8889C3.5 10.8889 3.5 10.8889 3.5 10.8889L3.5 11.1111"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4 19L4.5 19C5.05228 19 5.5 19.4477 5.5 20V20C5.5 20.5523 5.05228 21 4.5 21L3.5 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3.5 17L5.5 17L4 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M9 12L21 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M9 19L21 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Numbered List
      </ListItem>
      <ListItem
        selected={blockType === "quote"}
        className="rounded-md py-2"
        onClick={formatQuote}
      >
        <ListItemPrefix>
          <svg
            className="h-5 w-5"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
          >
            <path
              d="M10 12H5C4.44772 12 4 11.5523 4 11V7.5C4 6.94772 4.44772 6.5 5 6.5H9C9.55228 6.5 10 6.94772 10 7.5V12ZM10 12C10 14.5 9 16 6 17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>
            <path
              d="M20 12H15C14.4477 12 14 11.5523 14 11V7.5C14 6.94772 14.4477 6.5 15 6.5H19C19.5523 6.5 20 6.94772 20 7.5V12ZM20 12C20 14.5 19 16 16 17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Quote
      </ListItem>
      <ListItem
        selected={blockType === "code"}
        className="rounded-md py-2"
        onClick={formatCode}
      >
        <ListItemPrefix>
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="h-5 w-5"
          >
            <path
              d="M13.5 6L10 18.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M6.5 8.5L3 12L6.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M17.5 8.5L21 12L17.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </ListItemPrefix>
        Code
      </ListItem>
    </List>
  );
}

function positionEditorElement(editor: HTMLDivElement, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(
    null,
  );

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement() as Element;
    if (
      selection !== null &&
      nativeSelection &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect: DOMRect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div
      ref={editorRef}
      className="absolute -left-[10000px] -top-[10000px] z-[9999] -mt-1.5 w-full max-w-xs rounded-lg border border-gray-300 bg-white opacity-0 transition-opacity duration-500"
    >
      {isEditMode ? (
        <Input
          crossOrigin=""
          ref={inputRef}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
          className="border-gray-200 !border-t-gray-200 focus:!border-gray-900 focus:!border-t-gray-900"
          labelProps={{
            className: "hidden",
          }}
        />
      ) : (
        <>
          <div className="relative box-border flex w-full items-center justify-between rounded-lg border-0 bg-white px-3 py-2 font-[inherit] text-gray-900">
            <Typography
              as="a"
              variant="small"
              color="blue"
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-8 block overflow-hidden text-ellipsis whitespace-nowrap font-normal no-underline hover:underline"
            >
              {linkUrl}
            </Typography>
            <IconButton
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                  clipRule="evenodd"
                />
              </svg>
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

export function InsertEquationDialog({
  activeEditor,
  onClose,
  open,
  initialEquation = "",
}: {
  open: boolean;
  activeEditor: LexicalEditor;
  onClose: () => void;
  initialEquation?: string;
}): JSX.Element {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);

  const onEquationConfirm = () => {
    activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
      equation,
      inline,
    });
    onClose();
  };

  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: "#F44336",
        output: "html",
        strict: "warn",
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  const handleClose = () => {
    onClose();
    setEquation("");
    setInline(true);
  };

  return (
    <Dialog size="sm" open={open} handler={handleClose} className="p-4">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          {t("feature.exercise_form.equation.title")}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="small"
            color="blue-gray"
            className="text-left font-medium"
          >
            {t("feature.exercise_form.equation.inline")}
          </Typography>
          <Checkbox
            defaultChecked
            crossOrigin=""
            onClick={() => setInline(!inline)}
          />
        </div>
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 text-left font-medium"
          >
            {t("feature.exercise_form.equation.equation")}
          </Typography>
          {inline ? (
            <Input
              value={equation}
              crossOrigin=""
              color="gray"
              size="md"
              placeholder={t("feature.exercise_form.equation.equation")}
              className={"focus:!border-t-gray-900 !border-t-blue-gray-200"}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setEquation(e.target.value)}
            />
          ) : (
            <Textarea
              value={equation}
              color="gray"
              size="md"
              placeholder={t("feature.exercise_form.equation.equation")}
              className={"focus:!border-t-gray-900 !border-t-blue-gray-200"}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => setEquation(e.target.value)}
            />
          )}
        </div>
        {equation !== "" && (
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              {t("feature.exercise_form.equation.visual")}
            </Typography>
            <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
              <KatexRenderer
                equation={equation}
                inline={inline}
                onDoubleClick={() => null}
              />
            </ErrorBoundary>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          className="ml-auto"
          onClick={() => {
            onEquationConfirm();
            handleClose();
          }}
        >
          {t("common.button.submit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function ToolbarPlugin({ onChange }: { onChange?: (val: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  const [showEquation, setShowEquation] = useState(false);
  useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? (element.getTag() as BlockType)
            : (element.getType() as BlockType);
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  if (!onChange) {
    return null;
  }

  return (
    <div
      className="m-1 flex items-center gap-0.5 rounded-lg bg-gray-100 p-1"
      ref={toolbarRef}
    >
      {supportedBlockTypes.has(blockType) && (
        <>
          <Button
            variant="text"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            className="flex items-center gap-1 font-medium capitalize"
            aria-label="Formatting Options"
          >
            {blockTypeToBlockName[blockType]}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body,
            )}
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <Select
            className="appearance-none rounded-md bg-transparent px-2 py-1 outline-none hover:bg-gray-900/10"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
        </>
      ) : (
        <>
          <IconButton
            variant={isBold ? "filled" : "text"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            aria-label="Format Bold"
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="h-5 w-5"
            >
              <path
                d="M12 11.6667H8M12 11.6667C12 11.6667 15.3333 11.6667 15.3333 8.33333C15.3333 5.00002 12 5 12 5C12 5 12 5 12 5H8.6C8.26863 5 8 5.26863 8 5.6V11.6667M12 11.6667C12 11.6667 16 11.6667 16 15.3333C16 19 12 19 12 19C12 19 12 19 12 19H8.6C8.26863 19 8 18.7314 8 18.4V11.6667"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
            </svg>
          </IconButton>
          <IconButton
            variant={isItalic ? "filled" : "text"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            aria-label="Format Italics"
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="h-5 w-5"
            >
              <path
                d="M11 5L14 5M17 5L14 5M14 5L10 19M10 19L7 19M10 19L13 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </IconButton>
          <IconButton
            variant={isCode ? "filled" : "text"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            aria-label="Insert Code"
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="h-5 w-5"
            >
              <path
                d="M13.5 6L10 18.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M6.5 8.5L3 12L6.5 15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17.5 8.5L21 12L17.5 15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </IconButton>
          <IconButton
            onClick={insertLink}
            variant={isLink ? "filled" : "text"}
            aria-label="Insert Link"
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="h-5 w-5"
            >
              <path
                d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </IconButton>
          <Divider />
          <IconButton
            variant={!true ? "filled" : "text"}
            aria-label="Add Image"
            onClick={() => {
              inputRef?.current?.click();
            }}
          >
            <PhotoIcon className="w-5 h-5" />
          </IconButton>
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();

                reader.onload = () => {
                  const base64 = reader.result as string;
                  editor.update(() => {
                    const node = $createImageNode({
                      src: base64,
                      altText: file.name,
                    });
                    $insertNodes([node]);
                  });
                };

                reader.readAsDataURL(file);
              }
              e.target.value = "";
            }}
          />
          <IconButton
            variant={false ? "filled" : "text"}
            onClick={() => setShowEquation(!showEquation)}
          >
            <HashtagIcon className="w-4 h-4" />
          </IconButton>
          <InsertEquationDialog
            open={showEquation}
            activeEditor={editor}
            onClose={() => setShowEquation(!showEquation)}
          />

          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
        </>
      )}
    </div>
  );
}

function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        "EquationsPlugins: EquationsNode not registered on editor",
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

function MyOnChangePlugin({
  onChange,
  value,
}: {
  onChange?: (val: string) => void;
  value: string;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!!onChange) {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor);
          onChange(htmlString);
        });
      });
    } else {
      editor.setEditable(false);
    }
  }, [editor, onChange]);

  const updateHTML = (editor: LexicalEditor, value: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(value, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);
    $getRoot().clear();
    $getRoot().select();
    $insertNodes(nodes);
  };

  useEffect(() => {
    if (editor && !onChange) {
      editor.update(() => {
        updateHTML(editor, value);
      });
    }
  }, [value, editor, onChange]);

  return null;
}

function TextEditor({
  value,
  onChange,
  errors,
  exerciseId,
  isEdit = true,
}: {
  value: string;
  onChange?: (val: string) => void;
  errors?: any;
  exerciseId?: string;
  isEdit?: boolean;
}) {
  const editorConfig = {
    namespace: "MyEditor",
    onError(error: Error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
      EquationNode,
    ],
    editorState: exerciseId
      ? (editor: LexicalEditor) => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().clear();
          $getRoot().select();
          $insertNodes(nodes);
        }
      : undefined,
  };

  const getEditorBorder = () => {
    if (!onChange) {
      return "border-none";
    }
    return errors.content
      ? "!border-red-500 focus-within:!border-red-500"
      : "focus-within:!border-gray-900 border-blue-gray-200";
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={`${isEdit ? "z-[999]" : "z-[0]"} relative overflow-hidden w-full ${
          !!onChange ? "rounded-xl" : "rounded-none"
        } border  focus-within:!border-2  border-blue-gray-200 bg-white text-left font-normal leading-5 text-gray-900 
          ${getEditorBorder()}
          `}
      >
        <ToolbarPlugin onChange={onChange} />
        <div
          className={`relative ${
            !!onChange ? "rounded-b-lg" : "rounded-none"
          } border-opacity-5 bg-white ${
            !!onChange ? "h-[300px]" : ""
          } overflow-auto `}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={` w-full lexical ${
                  !!onChange ? "min-h-[280px]" : ""
                } resize-none  text-base caret-gray-900 outline-none
                ${!!onChange ? "py-4 px-2.5" : "py-0 px-0"}`}
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <EquationsPlugin />
          <MyOnChangePlugin onChange={onChange} value={value} />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
export default TextEditor;
