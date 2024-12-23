import { ReactNode } from "react";

const PageContainer = (props: {
  children: ReactNode;
  submitCodePage?: boolean;
}) => {
  return <div className="lg:ml-80 p-8 lg:mt-0 mt-8">{props.children}</div>;
};

export default PageContainer;
