import { Input } from "@material-tailwind/react";
import { UseFormRegister } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";

interface Props {
  register: UseFormRegister<ProfileInfo>;
}

function ResetPassword({ register }: Props) {
  return (
    <>
      <Input
        crossOrigin=""
        size="lg"
        placeholder="New Password"
        label="New Password"
        type="password"
        {...register("new_password")}
      />
      <Input
        crossOrigin=""
        size="lg"
        placeholder="Confirm Password"
        label="Confirm Password"
        type="password"
        {...register("confirm_new_password")}
      />
    </>
  );
}

export default ResetPassword;
