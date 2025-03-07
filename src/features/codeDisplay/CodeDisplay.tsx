import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import {
  getCodeDisplayState,
  getCodeFromMinio,
} from "./redux/CodeDisplaySlice";

interface Props {
  fileName: string;
}

const CodeDisplay = ({ fileName }: Props) => {
  const dispatch = useAppDispatch();
  const codeDisplay = useAppSelector(getCodeDisplayState);

  const code = codeDisplay[fileName]?.code || null;

  useEffect(() => {
    if (fileName && !codeDisplay[fileName]) {
      dispatch(getCodeFromMinio(fileName));
    }
  }, [fileName, codeDisplay]);

  return (
    <CodeMirror
      className="border-[1px]"
      height="auto"
      value={String(code)}
      extensions={[python(), cpp()]}
      readOnly={true}
      editable={false}
      autoFocus={false}
    />
  );
};

export default CodeDisplay;
