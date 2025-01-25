import { AsyncSelect } from "../../../components";
import { Button, Chip, Option, Typography } from "@material-tailwind/react";
import { format } from "date-fns";
import { SUBMISSION_STATUS } from "../../../constants/constants";
import { SubmissionResult } from "./SubmissionHistoryList";
import TestCaseResult from "./TestCaseResult";
import TestCaseOutput from "./TestCaseOutput";
import { useMemo } from "react";
import { SubmissionHistory } from "../redux/ExerciseDetailSlice";
import { CodeDisplay } from "../../codeDisplay";
import { useTranslation } from "react-i18next";

interface Props {
  submissionId: string;
  onSelect: (value: string) => void;
  submissions: SubmissionHistory[];
  handleOpenConfirm: () => void;
  isCompare: boolean;
}

function SubmissionView({
  submissionId,
  onSelect,
  submissions,
  handleOpenConfirm,
  isCompare,
}: Props) {
  const { t } = useTranslation();
  const submission = useMemo(
    () =>
      submissions?.find((sub) => sub.submission_id === submissionId) || null,
    [submissions, submissionId],
  );

  const result: SubmissionResult[] =
    submission && submission.result ? JSON.parse(submission.result) : null;

  const attempt = useMemo(
    () =>
      submissions
        ? submissions.findIndex((sub) => sub.submission_id === submissionId) + 1
        : 0,
    [submissions, submissionId],
  );

  const convertStatus = (status: string) => {
    switch (status) {
      case SUBMISSION_STATUS.accepted:
        return t("feature.exercise_detail.submission.status.accepted");
      case SUBMISSION_STATUS.wrongAnswer:
        return t("feature.exercise_detail.submission.status.wrong_answer");
      case SUBMISSION_STATUS.error:
        return t("feature.exercise_detail.submission.status.error");
      case SUBMISSION_STATUS.pending:
        return t("feature.exercise_detail.submission.status.pending");
      case SUBMISSION_STATUS.rejected:
        return t("feature.exercise_detail.submission.status.rejected");
      default:
        return t("feature.exercise_detail.submission.status.not_valid");
    }
  };

  const getStatusColor = () => {
    if (submission?.status === SUBMISSION_STATUS.accepted) {
      return "green";
    }
    return "red";
  };
  return (
    <div className={`${isCompare ? "w-1/2" : "w-full"}`}>
      <div className="w-44">
        <AsyncSelect
          className="z-[9999]"
          label={t("feature.exercise_detail.submission.submission")}
          value={submissionId}
          onChange={(val) => val && onSelect(val)}
          containerProps={{ className: "!min-w-28" }}
        >
          {submissions.map((submission, index, arr) => (
            <Option
              key={submission.submission_id}
              value={submission.submission_id}
            >
              {t("feature.exercise_detail.submission.times")}{" "}
              {arr.length - index}
            </Option>
          ))}
        </AsyncSelect>
      </div>
      {submission && (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-4">
            <Typography variant="h5">
              {t("feature.exercise_detail.submission.times")}{" "}
              {submissions.length - attempt + 1}
            </Typography>
            {submission.submission_id === submissions[0].submission_id &&
              submission.status === SUBMISSION_STATUS.accepted && (
                <Button
                  className="w-full sm:w-fit"
                  variant="outlined"
                  size="sm"
                  color="red"
                  onClick={handleOpenConfirm}
                >
                  {t("feature.exercise_detail.button.reject")}
                </Button>
              )}
          </div>
          <div className="flex justify-between items-center pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip
                value={convertStatus(String(submission?.status))}
                color={getStatusColor()}
                className="rounded-full"
              />
              <Typography variant="small">
                {t("feature.exercise_detail.submission.submitted")}{" "}
                {submission
                  ? format(submission?.time_submit, "dd/MM/yyyy HH:mm:ss")
                  : ""}
              </Typography>
            </div>
            <Chip value={`${submission?.marking}/2`} color={getStatusColor()} />
          </div>
          <div className="pt-4">
            <Typography variant="h6" className="mb-2">
              {t("feature.exercise_detail.submission.code")}
            </Typography>
            <CodeDisplay fileName={submission.sourcecode_filename} />
          </div>
          <div className="pt-4">
            <Typography variant="h6" className="mb-2">
              {t("feature.exercise_detail.submission.result")}
            </Typography>
            {(submission?.status === SUBMISSION_STATUS.accepted ||
              submission?.status === SUBMISSION_STATUS.wrongAnswer ||
              submission?.status === SUBMISSION_STATUS.rejected) &&
              result.map((result, index) => (
                <TestCaseResult
                  key={result.testcase_no}
                  result={result}
                  index={index}
                />
              ))}
            {submission?.status === SUBMISSION_STATUS.error && (
              <TestCaseOutput output={submission.error_message || ""} />
            )}
            {submission?.status === SUBMISSION_STATUS.pending && (
              <TestCaseOutput output={"Run time has rejected"} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SubmissionView;
