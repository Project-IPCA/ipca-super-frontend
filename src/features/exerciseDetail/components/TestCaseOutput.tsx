import { Typography } from "@material-tailwind/react";
import { forwardRef } from "react";

const TestCaseOutput = forwardRef<HTMLDivElement, { output: string }>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="w-full bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-auto min-h-fit"
      >
        <Typography variant="small" className="whitespace-pre break-words">
          {props.output}
        </Typography>
      </div>
    );
  },
);

export default TestCaseOutput;
