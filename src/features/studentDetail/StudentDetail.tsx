import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Card, IconButton, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchStudentChapterList,
  fetchStudentInfo,
  getStudentDetailState,
} from "./redux/studentDetailSlice";
import { useEffect, useState } from "react";
import StudentSummary from "./components/StudentSummary";
import { Bounce, toast } from "react-toastify";
import ChapterListCard from "./components/ChapterListCard";
import { ExerciseDetail } from "../exerciseDetail";

export interface ExerciseData {
  studentId: string;
  chapterIdx: number;
  itemId: number;
}

function StudentDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openExercise, setOpenExercise] = useState<boolean>(false);
  const [exerciseSelected, setExerciseSelected] = useState<ExerciseData | null>(
    null,
  );
  const studentState = useAppSelector(getStudentDetailState);
  const { studentId } = useParams();

  const studentInfo = studentState[String(studentId)]?.studentInfo;
  const chapterList = studentState[String(studentId)]?.chapterList;
  const error = studentState[String(studentId)]?.error;

  const handleExerciseOpen = () => setOpenExercise(true);
  const handleExerciseClse = () => setOpenExercise(false);
  const handleSetExercise = (exercise: ExerciseData) =>
    setExerciseSelected(exercise);

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
  }, [error]);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentInfo(studentId));
      dispatch(fetchStudentChapterList(studentId));
    }
  }, [dispatch, studentId]);

  return (
    <>
      <ExerciseDetail
        open={openExercise}
        handleClose={handleExerciseClse}
        exerciseData={exerciseSelected}
      />
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <Typography variant="h3">Student {studentInfo?.kmitl_id}</Typography>
      </div>
      <StudentSummary studentInfo={studentInfo} />
      <Card className="border-[1px]  mt-8" shadow={false}>
        <ChapterListCard
          studentId={String(studentId)}
          chapterList={chapterList}
          handleExerciseOpen={handleExerciseOpen}
          handleSetExercise={handleSetExercise}
        />
      </Card>
    </>
  );
}

export default StudentDetail;
