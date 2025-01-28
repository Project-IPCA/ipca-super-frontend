import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";

function ErrorPage() {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-red-400" />
        <Typography
          variant="h1"
          color="blue-gray"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl"
        >
          Ooops...Error 500
        </Typography>
        <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          We're Experiencing Technical Difficulties
        </Typography>
      </div>
    </div>
  );
}

export default ErrorPage;
