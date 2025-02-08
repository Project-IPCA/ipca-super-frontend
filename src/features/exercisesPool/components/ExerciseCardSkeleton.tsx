import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

function ExerciseCardSkeleton() {
  const { t } = useTranslation();
  return (
    <Card className="border-[1px] ">
      <CardBody>
        <div className="flex justify-between items-center">
          <Typography
            as="div"
            variant="h3"
            className="h-6 w-32 rounded-full bg-gray-300 "
          >
            &nbsp;
          </Typography>
          <div className="w-36">
            <Select
              label={""}
              containerProps={{
                className: "!min-w-28 ",
              }}
              disabled
            >
              <Option>{""}</Option>
            </Select>
          </div>
        </div>
        <Card className="shadow-none border-[1px] mt-3 h-[13.3rem] overflow-scroll">
          {[...Array(4)].map((_, index) => (
            <div className="border-b-[1px] px-3 py-5 " key={index}>
              <Typography
                as="div"
                className="h-3 w-full rounded-full bg-gray-300 "
              >
                &nbsp;
              </Typography>
            </div>
          ))}
        </Card>
      </CardBody>
      <CardFooter className="flex justify-end pt-0 gap-x-2">
        <Button size="sm" variant="outlined" disabled>
          {t("feature.exercise_pool.button.update")}
        </Button>
        <Button size="sm" disabled>
          {t("feature.exercise_pool.button.add_exercise")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ExerciseCardSkeleton;
