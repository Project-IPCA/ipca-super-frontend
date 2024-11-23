import { Card, Typography } from "@material-tailwind/react";
import {
  CheckCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import { SubmissionResult } from "./SubmissionHistoryList";
import TestCaseOutput from "./TestCaseOutput";

interface Props {
  result: SubmissionResult;
  index: number;
}

function TestCaseResult({ result, index }: Props) {
  const actualOutputRef = useRef<HTMLDivElement>(null);
  const expectedOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (actualOutputRef.current && expectedOutputRef.current) {
      const actualHeight = actualOutputRef.current.offsetHeight;
      const expectedHeight = expectedOutputRef.current.offsetHeight;
      const maxHeight = Math.max(actualHeight, expectedHeight);

      actualOutputRef.current.style.height = `${maxHeight}px`;
      expectedOutputRef.current.style.height = `${maxHeight}px`;
    }
  }, [result]);

  return (
    <Card className="px-5 py-3 bg-white border-[1px] shadow-none mb-4">
      <div className="flex items-center w-full gap-x-1  border-b-[1px]">
        <span className="w-5 h-5">
          {result.is_passed ? (
            <CheckCircleIcon className="text-green-400" />
          ) : (
            <XCircleIcon className="text-red-400" />
          )}
        </span>
        {!result.show_to_student ? (
          <span>
            <LockClosedIcon className="w-5 h-5" />
          </span>
        ) : null}
        <Typography variant="h6">Testcase: {index + 1}</Typography>
      </div>

      <div className="mt-4 flex lg:flex-row flex-col w-full gap-x-2">
        <div className="lg:w-1/2">
          <Typography variant="small" className="mb-2">
            Actual Output
          </Typography>
          <TestCaseOutput ref={actualOutputRef} output={result.actual} />
        </div>
        <div className="lg:w-1/2 ">
          <Typography variant="small" className="mb-2">
            Expected Output
          </Typography>
          <TestCaseOutput ref={expectedOutputRef} output={result.expected} />
        </div>
      </div>
    </Card>
  );
}

export default TestCaseResult;
