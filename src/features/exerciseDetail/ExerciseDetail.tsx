import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  fetchAssignedExercise,
  fetchSubmissionHistory,
  getExerciseDetailSlice,
} from "./redux/ExerciseDetailSlice";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionHistoryList from "./components/SubmissionHistoryList";
import {
  fetchStudentInfo,
  getStudentDetailState,
} from "../studentDetail/redux/studentDetailSlice";
import { Bounce, toast } from "react-toastify";
import TextEditor from "../exerciseForm/components/TextEditor";

function ExerciseDetail() {
  const dispatch = useAppDispatch();
  const exerciseDetailState = useAppSelector(getExerciseDetailSlice);
  const studentState = useAppSelector(getStudentDetailState);
  const { studentId, chapterIdx, problemIdx } = useParams();
  const navigate = useNavigate();
  const key = `${studentId}.${chapterIdx}.${problemIdx}`;

  const studentInfo = studentState[String(studentId)]?.studentInfo;
  const exerciseDetail = exerciseDetailState[key]?.exceriseDetail;
  const submissionHistory = exerciseDetailState[key]?.submissionHistory;
  const error = exerciseDetailState[key]?.error;

  useEffect(() => {
    if (error) {
      toast.error(error.error, {
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
  }, [error, dispatch]);

  useEffect(() => {
    if (!exerciseDetail && studentId && chapterIdx && problemIdx) {
      dispatch(
        fetchAssignedExercise({
          studentId: studentId,
          chapterIdx: parseInt(chapterIdx),
          itemId: parseInt(problemIdx),
        }),
      );
    }
  }, [dispatch, exerciseDetail, studentId, chapterIdx, problemIdx]);

  useEffect(() => {
    if (!studentInfo && studentId) {
      dispatch(fetchStudentInfo(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (
      !submissionHistory &&
      exerciseDetail?.chapter_id &&
      studentId &&
      chapterIdx &&
      problemIdx
    ) {
      dispatch(
        fetchSubmissionHistory({
          studentId: studentId,
          chapterIdx: parseInt(chapterIdx),
          itemId: parseInt(problemIdx),
        }),
      );
    }
  }, [
    dispatch,
    submissionHistory,
    exerciseDetail,
    studentId,
    chapterIdx,
    problemIdx,
  ]);

  return (
    <>
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <Typography variant="h3">Exercise</Typography>
      </div>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <Typography variant="small" className="font-medium">
            Chapter {exerciseDetail?.chapter_index} Problem{" "}
            {exerciseDetail?.level}
          </Typography>
          <Typography variant="h4" className="pt-1 pb-2">
            {exerciseDetail?.name || ""}
          </Typography>
          <TextEditor value={exerciseDetail?.content ?? ""} />
        </CardBody>
      </Card>
      <SubmissionHistoryList
        submissionHistory={submissionHistory}
        exerciseDetail={exerciseDetail}
        studentInfo={studentInfo}
      />
    </>
  );
}

export default ExerciseDetail;
