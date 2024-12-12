import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { LabItem } from "../redux/ExercisesPoolSlice";
import { useNavigate, useParams } from "react-router-dom";

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
