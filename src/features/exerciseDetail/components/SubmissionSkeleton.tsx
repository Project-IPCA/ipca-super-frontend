import {
  Button,
  Card,
  CardBody,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

function SubmissionSkeleton() {
  const { t } = useTranslation();
  return (
    <Card className="border-[1px] h-full w-full ">
      <CardBody>
        <div className="flex lg:flex-row flex-col justify-between items-center pb-6">
          <Typography
            as="div"
            className="block mt-1 h-5 w-56 rounded-full bg-gray-300"
          >
            &nbsp;
          </Typography>
          <Typography
            as="div"
            className="block mt-1 h-8 w-56 rounded-lg bg-gray-300"
          >
            &nbsp;
          </Typography>
        </div>

        <div className="w-44">
          <Select disabled containerProps={{ className: "!min-w-28" }}>
            <Option>{""}</Option>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-4">
          <Typography
            as="div"
            variant="h5"
            className="block h-5 w-36 rounded-full bg-gray-300"
          >
            &nbsp;
          </Typography>

          <Button
            className="w-full sm:w-fit"
            variant="outlined"
            disabled
            size="sm"
            color="red"
          >
            {t("feature.exercise_detail.button.reject")}
          </Button>
        </div>

        <div className="flex justify-between items-center pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Typography
              as="div"
              className="block h-3 w-72 rounded-full bg-gray-300"
            >
              &nbsp;
            </Typography>
          </div>
          <Typography
            as="div"
            className="block h-6 w-10 rounded-lg bg-gray-300"
          >
            &nbsp;
          </Typography>
        </div>
        <div className="pt-4">
          <Typography as="div" className="h-4 w-36 rounded-lg bg-gray-300">
            &nbsp;
          </Typography>
          <Typography as="div" className="h-20 mt-3 rounded-lg bg-gray-300">
            &nbsp;
          </Typography>
        </div>
        <div className="pt-4">
          <Typography as="div" className="h-4 w-36 rounded-lg bg-gray-300">
            &nbsp;
          </Typography>
          <Typography as="div" className="h-20 mt-3 rounded-lg bg-gray-300">
            &nbsp;
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default SubmissionSkeleton;
