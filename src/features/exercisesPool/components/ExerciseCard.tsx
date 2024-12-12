import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { LabItem } from "../redux/ExercisesPoolSlice";

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
  const getItemSelected = (exerciseId: string) => {
    return !!selectedItems.find((item) => item === exerciseId);
  };

  return (
    <Card className="border-[1px] ">
      <CardBody>
        <Typography variant="h5">Level {level}</Typography>
        <Card className="shadow-none border-[1px] mt-3 h-48 overflow-scroll">
          {labItems.map((item) => (
            <div
              className="border-b-[1px] px-8 py-1 flex justify-start gap-x-8 items-center"
              key={item.exercise_id}
            >
              <Checkbox
                crossOrigin=""
                defaultChecked={getItemSelected(item.exercise_id)}
              />
              <Typography>{item.name}</Typography>
            </div>
          ))}
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
