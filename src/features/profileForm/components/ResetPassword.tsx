import { Input, Typography } from "@material-tailwind/react";
import { UseFormRegister } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../hooks/store";
import { getProfileStatus } from "../redux/profileFormSlice";

interface Props {
  register: UseFormRegister<ProfileInfo>;
}

function ResetPassword({ register }: Props) {
  const { t } = useTranslation();
  const isFetching = useAppSelector(getProfileStatus);
  return isFetching ? (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <Typography
          as="div"
          className="block  h-10 w-full rounded-lg bg-gray-300"
          key={index}
        >
          &nbsp;
        </Typography>
      ))}
    </>
  ) : (
    <>
      <Input
        crossOrigin=""
        size="lg"
        placeholder={t("feature.profile.password.new_password")}
        label={t("feature.profile.password.new_password")}
        type="password"
        {...register("new_password")}
      />
      <Input
        crossOrigin=""
        size="lg"
        placeholder={t("feature.profile.password.confirm_password")}
        label={t("feature.profile.password.confirm_password")}
        type="password"
        {...register("confirm_new_password")}
      />
    </>
  );
}

export default ResetPassword;
