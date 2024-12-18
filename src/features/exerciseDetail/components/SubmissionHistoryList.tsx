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
import { TABS_MENU, TABS_VALUE } from "../constants";
import SubmissionView from "./SubmissionView";
import { ConfirmModal } from "../../../components";
import { StudentInfo } from "../../studentDetail/redux/studentDetailSlice";
import { useAppDispatch } from "../../../hooks/store";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { parseInt } from "lodash";

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
  const dispatch = useAppDispatch();
  const [tabSelected, setTabSelected] = useState<string>(TABS_VALUE.single);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const { studentId, chapterIdx, problemIdx } = useParams();

  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleOpenConfirm = () => setOpenConfirm(true);

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
        toast.success("Submission has rejected.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
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

  console.log(submissionHistory);

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
        title="Reject Submission?"
        description={
          <>
            Are you sure you want to reject student submission for chapter{" "}
            {exerciseDetail?.chapter_index} ({exerciseDetail?.chapter_name})
            problem {exerciseDetail?.level} ({exerciseDetail?.name}), submiited
            by{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>
            ? This process cannot be undone.
          </>
        }
        confirmLabel="Confirm"
        type="error"
        handleClose={handleCloseConfirm}
        handleSubmit={handleSubmit}
      />
      <Card className="border-[1px] h-full ">
        <CardBody>
          <div className="flex lg:flex-row flex-col justify-between items-center pb-6">
            <Typography variant="h4" className="pt-1 ">
              Submission History
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
                <Typography>No submissions found at the moment.</Typography>
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
                  />
                )}
                {tabSelected === TABS_VALUE.compare && (
                  <div className="w-full flex lg:flex-row flex-col gap-x-10">
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
