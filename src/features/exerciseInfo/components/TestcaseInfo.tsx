import { Button, Typography, Card, Checkbox } from "@material-tailwind/react";
import { Testcase } from "../redux/exerciseInfoSlice";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

interface Props {
  index: number;
  testcase: Testcase;
  readOnly: boolean;
  updateTestcaseField?: (
    index: number,
    field: keyof Testcase,
    value: any,
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
  const { t } = useTranslation();
  const inputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      let actualHeight: number;
      if (readOnly && inputRef.current) {
        actualHeight = inputRef.current.offsetHeight;
      } else if (!readOnly && textareaRef.current) {
        actualHeight = textareaRef.current.offsetHeight;
      } else {
        actualHeight = 0;
      }

      const expectedHeight = outputRef.current.offsetHeight;
      const maxHeight = Math.max(actualHeight, expectedHeight);
      if (readOnly && inputRef.current) {
        inputRef.current.style.height = `${maxHeight}px`;
      } else if (!readOnly && textareaRef.current) {
        textareaRef.current.style.height = `${maxHeight}px`;
      }
      outputRef.current.style.height = `${maxHeight}px`;
    }
  }, [testcase, readOnly]);

  return (
    <Card className="px-5 py-3 bg-white border-[1px] shadow-none mb-4">
      <div className="flex flex-col sm:flex-row items-center w-full pb-2  border-b-[1px]  justify-between">
        <div className="flex justify-between sm:justify-start gap-x-4 items-center border-red-500 border-solid w-full sm:w-fit">
          <Typography variant="h6">
            {t("feature.exercise_info.modal.testcase.testcase")}: {index + 1}
          </Typography>
          <Checkbox
            crossOrigin=""
            label={t("feature.exercise_info.modal.testcase.show_stu")}
            disabled={readOnly}
            onChange={() => {
              if (updateTestcaseField) {
                updateTestcaseField(
                  index,
                  "show_to_student",
                  !testcase.show_to_student,
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
              {t("common.button.delete")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (handleSubmitRun) {
                  handleSubmitRun(testcase);
                }
              }}
            >
              {t("feature.exercise_info.modal.testcase.button.run_save")}
            </Button>
          </div>
        )}
      </div>
      <div className="mt-4 flex lg:flex-row flex-col w-full gap-x-2">
        <div className="lg:w-1/2">
          <Typography variant="small" className="mb-2">
            {t("feature.exercise_info.modal.testcase.input")}
          </Typography>
          {readOnly ? (
            <div
              ref={inputRef}
              className="w-full h-40 bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-auto min-h-fit"
            >
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
              ref={textareaRef}
              disabled={readOnly}
              onChange={(e) => {
                if (updateTestcaseField) {
                  updateTestcaseField(
                    index,
                    "testcase_content",
                    e.target.value,
                  );
                }
              }}
              value={testcase.testcase_content}
            />
          )}
        </div>
        <div className="lg:w-1/2 ">
          <Typography variant="small" className="mb-2">
            {t("feature.exercise_info.modal.testcase.output")}
          </Typography>
          <div
            className="w-full h-40 bg-blue-gray-50 text-black whitespace-nowrap p-2 overflow-x-auto min-h-fit"
            ref={outputRef}
          >
            <Typography variant="small" className="whitespace-pre break-words">
              {!testcase.testcase_error
                ? testcase.testcase_output || ""
                : testcase.testcase_error}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TestcaseInfo;
