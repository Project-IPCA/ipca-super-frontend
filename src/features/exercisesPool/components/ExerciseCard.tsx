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
import { LabItem } from "../redux/ExercisesPoolSlice";
import { useNavigate, useParams } from "react-router-dom";
import { OPTIONS, OPTIONS_VALUE } from "../constants";
import { useMemo, useState } from "react";

interface Props {
  level: string;
  labItems: LabItem[];
  chapterId: string;
  selectedItems: string[];
  handleToggleForm: () => void;
  handleSetFormUseData: (chapterId: string, level: string) => void;
}

function ExerciseCard({
  level,
  labItems,
  selectedItems,
  chapterId,
  handleToggleForm,
  handleSetFormUseData,
}: Props) {
  const navigate = useNavigate();
  const { groupId, chapterIdx } = useParams();
  const [filter, setFilter] = useState<string>(OPTIONS_VALUE.all);

  const selectedItemsSet = useMemo(
    () => new Set(selectedItems),
    [selectedItems],
  );

  const getItemSelected = (exerciseId: string) => {
    return selectedItemsSet.has(exerciseId);
  };

  const labItemsFiltered = useMemo(() => {
    if (filter === OPTIONS_VALUE.selected) {
      return labItems.filter((item) => selectedItemsSet.has(item.exercise_id));
    } else if (filter === OPTIONS_VALUE.notSelected) {
      return labItems.filter((item) => !selectedItemsSet.has(item.exercise_id));
    }
    return labItems;
  }, [filter, labItems, selectedItemsSet]);

  return (
    <Card className="border-[1px] ">
      <CardBody>
        <div className="flex justify-between items-center">
          <Typography variant="h5">Level {level}</Typography>
          <div className="w-36">
            <Select
              label="Filter"
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
        <Card className="shadow-none border-[1px] mt-3 h-48 overflow-scroll">
          {labItemsFiltered.map((item) => (
            <div
              className="border-b-[1px] px-8 py-1 flex justify-start gap-x-8 items-center"
              key={item.exercise_id}
            >
              <Checkbox
                crossOrigin=""
                defaultChecked={getItemSelected(item.exercise_id)}
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
      <CardFooter className="flex justify-end pt-0">
        <Button
          onClick={() => {
            handleSetFormUseData(chapterId, level);
            handleToggleForm();
          }}
        >
          Add Exercise
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExerciseCard;
