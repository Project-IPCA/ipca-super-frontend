import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchExercisesPool,
  getExercisesPoolState,
} from "./redux/ExercisesPoolSlice";
import { useEffect, useState } from "react";
import ExerciseCard from "./components/ExerciseCard";
import { ExerciseForm } from "../exerciseForm";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import ExerciseCardSkeleton from "./components/ExerciseCardSkeleton";

export interface FormUseData {
  chapterId: string;
  level: string;
}

function ExercisesPool() {
  const dispatch = useAppDispatch();
  const exercisesPoolState = useAppSelector(getExercisesPoolState);
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formUseData, setFormUseData] = useState<FormUseData>({
    chapterId: "",
    level: "",
  });
  const { t } = useTranslation();
  const { groupId, chapterIdx } = useParams();
  const key = `${groupId}.${chapterIdx}`;

  const exercisesPool = exercisesPoolState[key]?.chapterDetail;
  const error = exercisesPoolState[key]?.error;
  const isFetching = exercisesPoolState[key]?.isFetching;
  const isUpdateExercise = exercisesPoolState[key]?.isUpdateExercise;
  const updateExerciseLevel = exercisesPoolState[key]?.updateExerciseLevel;

  const handleToggleForm = () => setFormOpen(!formOpen);

  const handleSetFormUseData = (chapterId: string, level: string) =>
    setFormUseData({
      chapterId: chapterId,
      level: level,
    });

  useEffect(() => {
    if (!exercisesPool && groupId && chapterIdx) {
      dispatch(
        fetchExercisesPool({
          groupId: groupId,
          chapterIdx: parseInt(chapterIdx),
        }),
      );
    }
  }, [dispatch, exercisesPool, groupId, chapterIdx]);

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
      });
    }
  }, [error]);

  return (
    <>
      <ExerciseForm
        open={formOpen}
        handleToggle={handleToggleForm}
        formUseData={formUseData}
      />
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text">
          <ArrowLeftIcon className="w-5 h-5" onClick={() => navigate(-1)} />
        </IconButton>
        <div className="flex justify-start items-center gap-x-2">
          <Typography variant="h3">
            {t("feature.exercise_pool.title")}{" "}
          </Typography>
          {isFetching ? (
            <Typography
              as="div"
              variant="h3"
              className="h-6 w-32 rounded-full bg-gray-300 "
            >
              &nbsp;
            </Typography>
          ) : (
            <Typography variant="h3">
              {chapterIdx} {exercisesPool?.chapter_name}
            </Typography>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {isFetching
          ? [...Array(2)].map((_, index) => (
              <ExerciseCardSkeleton key={index} />
            ))
          : Object.entries(exercisesPool?.lab_list || {}).map(
              ([level, labItems]) => (
                <ExerciseCard
                  key={level}
                  level={level}
                  chapterId={exercisesPool?.chapter_id || ""}
                  isUpdateExercise={isUpdateExercise}
                  labItems={labItems}
                  updateExerciseLevel={updateExerciseLevel}
                  selectedItems={
                    exercisesPool?.group_selected_labs[level] || []
                  }
                  handleToggleForm={handleToggleForm}
                  handleSetFormUseData={handleSetFormUseData}
                />
              ),
            )}
      </div>
    </>
  );
}

export default ExercisesPool;
