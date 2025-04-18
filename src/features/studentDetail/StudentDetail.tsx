import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Card, IconButton, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchStudentChapterList,
  fetchStudentInfo,
  getStudentDetailState,
} from "./redux/studentDetailSlice";
import { useEffect } from "react";
import StudentSummary from "./components/StudentSummary";
import ChapterListCard from "./components/ChapterListCard";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

export interface ExerciseData {
  studentId: string;
  chapterIdx: number;
  itemId: number;
}

function StudentDetail() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const studentState = useAppSelector(getStudentDetailState);
  const { studentId } = useParams();

  const studentInfo = studentState[String(studentId)]?.studentInfo;
  const chapterList = studentState[String(studentId)]?.chapterList;
  const error = studentState[String(studentId)]?.error;
  const isFetching = studentState[String(studentId)]?.isFetching;

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
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
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <Typography variant="h3">
          {t("feature.exercise_detail.title")}
        </Typography>
        {isFetching ? (
          <Typography
            as="div"
            variant="h5"
            className="block h-5  w-36 rounded-full bg-gray-300"
          >
            &nbsp;
          </Typography>
        ) : (
          <Typography variant="h3">{studentInfo?.kmitl_id || ""}</Typography>
        )}
      </div>
      <StudentSummary studentInfo={studentInfo} isFetching={isFetching} />
      <Card
        className="border-[1px]  mt-8 sm:mb-0 md:mb-44 lg:mb-0"
        shadow={false}
      >
        <ChapterListCard
          studentId={String(studentId)}
          chapterList={chapterList}
          isFetching={isFetching}
        />
      </Card>
    </>
  );
}

export default StudentDetail;
