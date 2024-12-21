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
  const { groupId, chapterIdx } = useParams();
  const key = `${groupId}.${chapterIdx}`;

  const exercisesPool = exercisesPoolState[key]?.chapterDetail;
  const error = exercisesPoolState[key]?.error;

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
        <Typography variant="h3">
          Chapter {chapterIdx} {exercisesPool?.chapter_name}
        </Typography>
      </div>
      <div className="space-y-6">
        {Object.entries(exercisesPool?.lab_list || {}).map(
          ([level, labItems]) => (
            <ExerciseCard
              key={level}
              level={level}
              chapterId={exercisesPool?.chapter_id || ""}
              labItems={labItems}
              selectedItems={exercisesPool?.group_selected_labs[level] || []}
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
