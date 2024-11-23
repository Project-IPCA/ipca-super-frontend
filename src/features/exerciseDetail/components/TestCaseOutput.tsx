import { Typography } from "@material-tailwind/react";
import { forwardRef } from "react";

const TestCaseOutput = forwardRef<HTMLDivElement, { output: string }>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="w-full bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-scroll"
      >
        {props.output &&
          props.output.split("\n").map((line, index) => (
            <Typography variant="small" key={index}>
              {line}
            </Typography>
          ))}
      </div>
    );
  },
);

export default TestCaseOutput;
