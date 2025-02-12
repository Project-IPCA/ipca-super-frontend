import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import {
  AssignedExerciseRequest,
  fetchExercisesPool,
  LabItem,
  updateAssignedExercise,
} from "../redux/ExercisesPoolSlice";
import { useNavigate, useParams } from "react-router-dom";
import { OPTIONS_VALUE } from "../constants";
import { useMemo, useState } from "react";
import { useAppDispatch } from "../../../hooks/store";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";
import { parseInt } from "lodash";

interface Props {
  level: string;
  labItems: LabItem[];
  chapterId: string;
  selectedItems: string[];
  isUpdateExercise: boolean;
  updateExerciseLevel: number;
  handleToggleForm: () => void;
  handleSetFormUseData: (chapterId: string, level: string) => void;
}

function ExerciseCard({
  level,
  labItems,
  selectedItems,
  chapterId,
  isUpdateExercise,
  updateExerciseLevel,
  handleToggleForm,
  handleSetFormUseData,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groupId, chapterIdx } = useParams();
  const [filter, setFilter] = useState<string>(OPTIONS_VALUE.all);
  const [tempSelected, setTempSelected] = useState<string[]>([
    ...selectedItems,
  ]);

  const selectedItemsSet = useMemo(
    () => new Set(selectedItems),
    [selectedItems],
  );
  const OPTIONS = [
    { label: t("feature.exercise_pool.filter.all"), value: OPTIONS_VALUE.all },
    {
      label: t("feature.exercise_pool.filter.selected"),
      value: OPTIONS_VALUE.selected,
    },
    {
      label: t("feature.exercise_pool.filter.not_selected"),
      value: OPTIONS_VALUE.notSelected,
    },
  ];

  const getItemSelected = (exerciseId: string) => {
    return selectedItemsSet.has(exerciseId);
  };

  const removeSelected = (val: string) => {
    setTempSelected((prev) => prev.filter((item) => item !== val));
  };

  const addSelected = (val: string) => {
    setTempSelected((prev) => [...prev, val]);
  };

  const labItemsFiltered = useMemo(() => {
    if (filter === OPTIONS_VALUE.selected) {
      return labItems.filter((item) => selectedItemsSet.has(item.exercise_id));
    } else if (filter === OPTIONS_VALUE.notSelected) {
      return labItems.filter((item) => !selectedItemsSet.has(item.exercise_id));
    }
    return labItems;
  }, [filter, labItems, selectedItemsSet]);

  const handleUpdatedAssingedExercise = async () => {
    if (groupId && chapterIdx) {
      const request: AssignedExerciseRequest = {
        chapter_id: chapterId,
        group_id: groupId,
        item_id: parseInt(level),
        select_items: tempSelected,
        chapter_idx: parseInt(chapterIdx),
      };
      const resultAction = await dispatch(updateAssignedExercise(request));
      if (updateAssignedExercise.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Exercise has been updated.",
        });
      }
    }
    if (groupId && chapterIdx) {
      dispatch(
        fetchExercisesPool({
          groupId: groupId,
          chapterIdx: parseInt(chapterIdx),
        }),
      );
    }
  };

  return (
    <Card className="border-[1px] ">
      <CardBody>
        <div className="flex justify-between items-center">
          <Typography variant="h5">
            {t("feature.exercise_pool.level")} {level}
          </Typography>
          <div className="w-36">
            <Select
              label={t("feature.exercise_pool.filter.title")}
              value={filter}
              onChange={(val) => {
                if (val) {
                  setFilter(val);
                }
              }}
              containerProps={{
                className: "!min-w-28 ",
              }}
            >
              {OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <Card className="shadow-none border-[1px] mt-3 h-[13.3rem] overflow-scroll">
          {labItemsFiltered.map((item) => (
            <div
              className="border-b-[1px] px-8 py-1 flex justify-start gap-x-8 items-center"
              key={item.exercise_id}
            >
              <Checkbox
                crossOrigin=""
                defaultChecked={getItemSelected(item.exercise_id)}
                onClick={() =>
                  tempSelected.includes(item.exercise_id)
                    ? removeSelected(item.exercise_id)
                    : addSelected(item.exercise_id)
                }
              />
              <Typography
                className="underline hover:text-gray-900 hover:decoration-gray-900 decoration-[1px] decoration-blue-gray-200 transition duration-300 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/exercise_pool/group/${groupId}/chapter/${chapterIdx}/level/${level}/exercise/${item.exercise_id}`,
                  )
                }
              >
                {item.name}
              </Typography>
            </div>
          ))}
          {labItemsFiltered.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
              <Typography>No Exercise Available</Typography>
            </div>
          )}
        </Card>
      </CardBody>
      <CardFooter className="flex justify-end pt-0 gap-x-2">
        <Button
          size="sm"
          variant="outlined"
          loading={isUpdateExercise && parseInt(level) == updateExerciseLevel}
          onClick={() => handleUpdatedAssingedExercise()}
        >
          {t("feature.exercise_pool.button.update")}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            handleSetFormUseData(chapterId, level);
            handleToggleForm();
          }}
        >
          {t("feature.exercise_pool.button.add_exercise")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExerciseCard;
