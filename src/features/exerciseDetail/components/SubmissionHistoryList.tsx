import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import {
  AssignedExercise,
  cancelStudentSubmission,
  fetchSubmissionHistory,
  SubmissionHistory,
} from "../redux/ExerciseDetailSlice";
import { useEffect, useMemo, useState } from "react";
import { TABS_VALUE } from "../constants";
import SubmissionView from "./SubmissionView";
import { ConfirmModal } from "../../../components";
import { StudentInfo } from "../../studentDetail/redux/studentDetailSlice";
import { useAppDispatch } from "../../../hooks/store";
import { useParams } from "react-router-dom";
import { parseInt } from "lodash";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";

export interface SubmissionResult {
  actual: string;
  expected: string;
  is_passed: boolean;
  testcase_no: number;
  show_to_student: boolean;
}

interface Props {
  submissionHistory: SubmissionHistory[];
  exerciseDetail: AssignedExercise | null;
  studentInfo: StudentInfo | null;
}

function SubmissionHistoryList({
  submissionHistory,
  exerciseDetail,
  studentInfo,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [tabSelected, setTabSelected] = useState<string>(TABS_VALUE.single);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const { studentId, chapterIdx, problemIdx } = useParams();

  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleOpenConfirm = () => setOpenConfirm(true);

  const TABS_MENU = [
    {
      label: t("feature.exercise_detail.submission.single_view"),
      value: TABS_VALUE.single,
    },
    {
      label: t("feature.exercise_detail.submission.compare_view"),
      value: TABS_VALUE.compare,
    },
  ];

  const [submissionSelected, setSubmissionSelected] = useState({
    first: "",
    second: "",
  });

  const reversedSubmissions = useMemo(
    () => (submissionHistory ? [...submissionHistory].reverse() : []),
    [submissionHistory],
  );

  const handleSubmit = async () => {
    if (reversedSubmissions && reversedSubmissions[0]) {
      const resultAction = await dispatch(
        cancelStudentSubmission(reversedSubmissions[0].submission_id),
      );
      if (cancelStudentSubmission.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Submission has rejected.",
        });
      }
      if (studentId && chapterIdx && problemIdx && exerciseDetail) {
        await dispatch(
          fetchSubmissionHistory({
            studentId: studentId,
            chapterIdx: parseInt(chapterIdx),
            itemId: parseInt(problemIdx),
          }),
        );
      }
      handleCloseConfirm();
    }
  };

  useEffect(() => {
    if (submissionHistory && submissionHistory.length > 0) {
      const initSubmission =
        submissionHistory[submissionHistory.length - 1].submission_id;
      setSubmissionSelected({
        first: initSubmission,
        second: initSubmission,
      });
    }
  }, [submissionHistory]);

  return (
    <>
      <ConfirmModal
        open={openConfirm}
        title={t("feature.exercise_detail.modal.title")}
        description={
          <>
            {t("feature.exercise_detail.modal.msg1")}{" "}
            {exerciseDetail?.chapter_index} ({exerciseDetail?.chapter_name}){" "}
            {t("feature.exercise_detail.modal.msg2")} {exerciseDetail?.level} (
            {exerciseDetail?.name}), {t("feature.exercise_detail.modal.msg3")}{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>
            {t("feature.exercise_detail.modal.msg4")}
          </>
        }
        confirmLabel={t("feature.exercise_detail.modal.confirm")}
        type="error"
        handleClose={handleCloseConfirm}
        handleSubmit={handleSubmit}
      />
      <Card className="border-[1px] h-full w-full ">
        <CardBody>
          <div className="flex lg:flex-row flex-col justify-between items-center pb-6">
            <Typography variant="h4" className="pt-1 ">
              {t("feature.exercise_detail.submission.title")}
            </Typography>
            {submissionHistory && submissionHistory.length !== 0 && (
              <div className="lg:w-80 w-full">
                <Tabs value={tabSelected}>
                  <TabsHeader>
                    {TABS_MENU.map(({ label, value }) => (
                      <Tab
                        key={value}
                        value={value}
                        onClick={() => setTabSelected(value)}
                      >
                        <Typography variant="small">{label}</Typography>
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
              </div>
            )}
          </div>
          {submissionHistory &&
            (submissionHistory.length === 0 ? (
              <>
                <Typography>
                  {t("feature.exercise_detail.submission.no_submission")}
                </Typography>
              </>
            ) : (
              <>
                {tabSelected === TABS_VALUE.single && (
                  <SubmissionView
                    submissionId={submissionSelected.first}
                    onSelect={(val) =>
                      setSubmissionSelected((prev) => ({ ...prev, first: val }))
                    }
                    submissions={reversedSubmissions}
                    handleOpenConfirm={handleOpenConfirm}
                    isCompare={false}
                  />
                )}
                {tabSelected === TABS_VALUE.compare && (
                  <div className="w-full flex lg:flex-row flex-col lg:gap-x-10">
                    <SubmissionView
                      submissionId={submissionSelected.first}
                      onSelect={(val) =>
                        setSubmissionSelected((prev) => ({
                          ...prev,
                          first: val,
                        }))
                      }
                      submissions={reversedSubmissions}
                      handleOpenConfirm={handleOpenConfirm}
                      isCompare={true}
                    />
                    <SubmissionView
                      submissionId={submissionSelected.second}
                      onSelect={(val) =>
                        setSubmissionSelected((prev) => ({
                          ...prev,
                          second: val,
                        }))
                      }
                      submissions={reversedSubmissions}
                      handleOpenConfirm={handleOpenConfirm}
                      isCompare={true}
                    />
                  </div>
                )}
              </>
            ))}
        </CardBody>
      </Card>
    </>
  );
}

export default SubmissionHistoryList;
