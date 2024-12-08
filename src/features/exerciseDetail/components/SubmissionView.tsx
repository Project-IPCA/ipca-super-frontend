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

interface Props {
  submissionId: string;
  onSelect: (value: string) => void;
  submissions: SubmissionHistory[];
  handleOpenConfirm: () => void;
}

function SubmissionView({
  submissionId,
  onSelect,
  submissions,
  handleOpenConfirm,
}: Props) {
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
        ? submissions.findIndex((sub) => sub.result === submissionId) + 1
        : 0,
    [submissions, submissionId],
  );

  const convertStatus = (status: string) => {
    switch (status) {
      case SUBMISSION_STATUS.accepted:
        return "Accepted";
      case SUBMISSION_STATUS.wrongAnswer:
        return "Wrong Answer";
      case SUBMISSION_STATUS.error:
        return "Error";
      case SUBMISSION_STATUS.pending:
        return "Pending";
      case SUBMISSION_STATUS.rejected:
        return "Rejected";
      default:
        return "Not Valid";
    }
  };

  const getStatusColor = () => {
    if (submission?.status === SUBMISSION_STATUS.accepted) {
      return "green";
    }
    return "red";
  };
  return (
    <div className="w-full">
      {" "}
      <div className="w-44">
        <AsyncSelect
          label="Submission"
          value={submissionId}
          onChange={(val) => val && onSelect(val)}
          containerProps={{ className: "!min-w-28" }}
        >
          {submissions.map((submission, index, arr) => (
            <Option
              key={submission.submission_id}
              value={submission.submission_id}
            >
              Submission {arr.length - index}
            </Option>
          ))}
        </AsyncSelect>
      </div>
      {submission && (
        <>
          <div className="flex justify-between items-center pt-4">
            <Typography variant="h5">
              Submission {submissions.length - attempt + 1}
            </Typography>
            {submission.submission_id === submissions[0].submission_id &&
              submission.status === SUBMISSION_STATUS.accepted && (
                <Button
                  variant="outlined"
                  size="sm"
                  color="red"
                  onClick={handleOpenConfirm}
                >
                  Reject Submission
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
                Submitted at{" "}
                {submission
                  ? format(submission?.time_submit, "MMM dd, yyyy HH:mm:ss")
                  : ""}
              </Typography>
            </div>
            <Chip value={`${submission?.marking}/2`} color={getStatusColor()} />
          </div>
          <div className="pt-4">
            <Typography variant="h6" className="mb-2">
              Sourcecode
            </Typography>
            <CodeDisplay fileName={submission.sourcecode_filename} />
          </div>
          <div className="pt-4">
            <Typography variant="h6" className="mb-2">
              Result
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
