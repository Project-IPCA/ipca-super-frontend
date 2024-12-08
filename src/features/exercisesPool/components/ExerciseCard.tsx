import { Card, CardBody, Checkbox, Typography } from "@material-tailwind/react";
import { LabItem } from "../redux/ExercisesPoolSlice";

interface Props {
  level: string;
  labItems: LabItem[];
  selectedItems: string[];
}

function ExerciseCard({ level, labItems, selectedItems }: Props) {
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
              key={item.item_id}
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
    </Card>
  );
}

export default ExerciseCard;
