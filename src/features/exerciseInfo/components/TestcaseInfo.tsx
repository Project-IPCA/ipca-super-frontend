import { Button, Typography, Card, Checkbox } from "@material-tailwind/react";
import { Testcase } from "../redux/exerciseInfoSlice";

interface Props {
  index: number;
  testcase: Testcase;
  readOnly: boolean;
  updateTestcaseField?: (
    index: number,
    field: keyof Testcase,
    value: any
  ) => void;
  removeTestcase?: (index: number) => void;
  handleSubmitRun?: (testcase: Testcase) => void;
  handleAddRemoved?: (testcaseId: string) => void;
}

function TestcaseInfo({
  readOnly,
  index,
  testcase,
  updateTestcaseField,
  removeTestcase,
  handleSubmitRun,
  handleAddRemoved,
}: Props) {
  return (
    <Card className="px-5 py-3 bg-white border-[1px] shadow-none mb-4">
      <div className="flex flex-col sm:flex-row items-center w-full pb-2  border-b-[1px]  justify-between">
        <div className="flex justify-between sm:justify-start gap-x-4 items-center border-red-500 border-solid w-full sm:w-fit">
          <Typography variant="h6">Testcase: {index + 1}</Typography>
          <Checkbox
            crossOrigin=""
            label="Show to student"
            disabled={readOnly}
            onChange={() => {
              if (updateTestcaseField) {
                updateTestcaseField(
                  index,
                  "show_to_student",
                  !testcase.show_to_student
                );
              }
            }}
            checked={testcase.show_to_student}
          />
        </div>
        {!readOnly && (
          <div className="flex flex-row-reverse sm:flex-row justify-between w-full sm:w-fit items-center gap-x-2">
            <Button
              size="sm"
              variant="text"
              color="red"
              onClick={() => {
                if (removeTestcase && handleAddRemoved) {
                  removeTestcase(index);
                  if (testcase.testcase_id) {
                    handleAddRemoved(testcase.testcase_id);
                  }
                }
              }}
            >
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (handleSubmitRun) {
                  handleSubmitRun(testcase);
                }
              }}
            >
              Run and Save
            </Button>
          </div>
        )}
      </div>
      <div className="mt-4 flex lg:flex-row flex-col w-full gap-x-2">
        <div className="lg:w-1/2">
          <Typography variant="small" className="mb-2">
            Input
          </Typography>
          {readOnly ? (
            <div className="w-full h-40 bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-auto min-h-fit">
              <Typography
                variant="small"
                className="whitespace-pre break-words"
              >
                {testcase.testcase_content}
              </Typography>
            </div>
          ) : (
            <textarea
              className="w-full h-40 bg-blue-gray-50 text-black p-2 resize-none transition duration-500 ease-in-out focus:border-2 focus:!border-gray-900 !border-blue-gray-200 outline-none"
              disabled={readOnly}
              onChange={(e) => {
                if (updateTestcaseField) {
                  updateTestcaseField(
                    index,
                    "testcase_content",
                    e.target.value
                  );
                }
              }}
              value={testcase.testcase_content}
            />
          )}
        </div>
        <div className="lg:w-1/2 ">
          <Typography variant="small" className="mb-2">
            Output
          </Typography>
          <div className="w-full h-40 bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-auto min-h-fit">
            <Typography variant="small" className="whitespace-pre break-words">
              {testcase.testcase_output}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TestcaseInfo;
