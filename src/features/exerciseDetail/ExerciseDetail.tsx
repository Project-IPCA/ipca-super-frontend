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
import TextEditor from "../exerciseForm/components/TextEditor";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

function ExerciseDetail() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
      showToast({
        variant: "error",
        message: error.error,
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
        <Typography variant="h3">
          {t("feature.exercise_detail.title")}
        </Typography>
      </div>
      <Card className="border-[1px] mb-4">
        <CardBody>
          <Typography variant="small" className="font-medium">
            {t("feature.exercise_detail.label.chapter")}{" "}
            {exerciseDetail?.chapter_index}{" "}
            {t("feature.exercise_detail.label.chapter")} {exerciseDetail?.level}
          </Typography>
          <Typography variant="h4" className="pt-1 pb-2">
            {exerciseDetail?.name || ""}
          </Typography>
          <TextEditor value={exerciseDetail?.content ?? ""} isEdit={false} />
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
