import { Spinner } from "@material-tailwind/react";

const SpinnerLoading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner className="h-12 w-12" />
    </div>
  );
};

export default SpinnerLoading;
