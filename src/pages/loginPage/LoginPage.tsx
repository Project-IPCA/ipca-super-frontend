import { Card, Typography } from "@material-tailwind/react";
import { LoginForm } from "../../features/loginForm";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="p-6">
        <Typography variant="h4" color="blue-gray">
          {t("page.login.title")}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          {t("page.login.desc")}
        </Typography>
        <LoginForm />
      </Card>
    </div>
  );
}

export default LoginPage;
