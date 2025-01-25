import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";

export interface SerializedImageNode extends SerializedLexicalNode {
  src: string;
  altText: string;
  width: "inherit" | number;
  height: "inherit" | number;
  maxWidth: number;
}

export const $createImageNode = ({
  altText,
  height,
  maxWidth = 400,
  src,
  width,
}: {
  altText: string;
  height?: number;
  maxWidth?: number;
  src: string;
  width?: number;
}) => {
  return new ImageNode({ altText, height, maxWidth, src, width });
};

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, altText: alt });
    return { node };
  }
  return null;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __height: "inherit" | number;
  __width: "inherit" | number;
  __maxWidth: number;

  constructor({
    src,
    altText,
    maxWidth,
    width,
    height,
    key,
  }: {
    src: string;
    altText: string;
    maxWidth: number;
    width?: "inherit" | number;
    height?: "inherit" | number;
    key?: NodeKey;
  }) {
    super(key);
    this.__altText = altText;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__maxWidth = maxWidth;
    this.__src = src;
  }

  static getType(): string {
    return "image";
  }

  static clone(_node: ImageNode): ImageNode {
    return new ImageNode({
      altText: _node.__altText,
      src: _node.__src,
      height: _node.__height,
      width: _node.__width,
      maxWidth: _node.__maxWidth,
      key: _node.__key,
    });
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          width: this.__width,
          height: this.__height,
          maxWidth: this.__maxWidth,
        }}
      />
    );
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  exportDOM(): DOMExportOutput {
    const image = document.createElement("img");
    image.setAttribute("src", this.__src);
    image.setAttribute("alt", this.__altText);

    return { element: image };
  }

  updateDOM(prevNode: ImageNode): boolean {
    const hasChanged =
      this.__src !== prevNode.__src ||
      this.__altText !== prevNode.__altText ||
      this.__width !== prevNode.__width ||
      this.__height !== prevNode.__height ||
      this.__maxWidth !== prevNode.__maxWidth;

    return hasChanged;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      maxWidth: this.__maxWidth,
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height, maxWidth } = serializedNode;
    return new ImageNode({
      src,
      altText,
      width,
      height,
      maxWidth,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => {
        return { conversion: convertImageElement, priority: 0 };
      },
    };
  }
}
