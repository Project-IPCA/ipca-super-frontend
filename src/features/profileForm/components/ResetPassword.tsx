import { Input } from "@material-tailwind/react";
import { UseFormRegister } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import { useTranslation } from "react-i18next";

interface Props {
  register: UseFormRegister<ProfileInfo>;
}

function ResetPassword({ register }: Props) {
  const { t } = useTranslation();
  return (
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
