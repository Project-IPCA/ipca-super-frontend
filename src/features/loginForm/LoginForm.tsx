import { Button, Input, Typography } from "@material-tailwind/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  clearErrorState,
  getLoginState,
  loginUser,
} from "./redux/loginFormSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

type LoginInput = {
  username: string;
  password: string;
};

function LoginForm() {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<LoginInput>();
  const dispatch = useAppDispatch();
  const loginState = useAppSelector(getLoginState);
  const [pendingLogin, setPendingLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginState.username && loginState.password) {
      dispatch(
        loginUser({
          username: loginState.username,
          password: loginState.password,
        }),
      );
    }
  }, [dispatch, loginState.password, loginState.username]);

  useEffect(() => {
    if (loginState.error !== null) {
      setPendingLogin(false);
      showToast({
        variant: "error",
        message: loginState.error.error,
      });

      dispatch(clearErrorState());
    }
  }, [dispatch, loginState.error]);

  useEffect(() => {
    if (loginState.token) {
      navigate("/my-groups");
      setPendingLogin(false);
    }
  }, [loginState.token]);

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    setPendingLogin(true);
    dispatch(
      loginUser({
        username: data.username,
        password: data.password,
      }),
    );
  };

  return (
    <form
      className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-1 flex flex-col gap-6">
        <Typography variant="h6" color="blue-gray" className="-mb-3">
          {t("feature.login_form.label.username")}
        </Typography>
        <Input
          {...register("username")}
          crossOrigin=""
          size="lg"
          placeholder={t("feature.login_form.placeholder.username")}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <Typography variant="h6" color="blue-gray" className="-mb-3">
          {t("feature.login_form.label.password")}
        </Typography>
        <Input
          {...register("password")}
          crossOrigin=""
          type="password"
          size="lg"
          placeholder={t("feature.login_form.placeholder.password")}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
      <Button
        className="mt-6 flex justify-center items-center gap-x-3"
        fullWidth
        type="submit"
        disabled={pendingLogin}
        loading={pendingLogin}
      >
        {t("feature.login_form.button.sign_in")}
      </Button>
    </form>
  );
}

export default LoginForm;
