import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchExercisesPool,
  getExercisesPoolState,
} from "./redux/ExercisesPoolSlice";
import { useEffect } from "react";
import ExerciseCard from "./components/ExerciseCard";

function ExercisesPool() {
  const dispatch = useAppDispatch();
  const exercisesPoolState = useAppSelector(getExercisesPoolState);
  const navigate = useNavigate();
  const { groupId, chapterIdx } = useParams();
  const key = `${groupId}.${chapterIdx}`;

  const exercisesPool = exercisesPoolState[key]?.chapterDetail;

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

  console.log(exercisesPool);

  return (
    <>
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
              labItems={labItems}
              selectedItems={exercisesPool?.group_selected_labs[level] || []}
            />
          ),
        )}
      </div>
    </>
  );
}

export default ExercisesPool;
