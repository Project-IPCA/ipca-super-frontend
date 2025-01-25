import { Card, CardBody, Typography } from "@material-tailwind/react";
import { LoginForm } from "../../features/loginForm";
import { useTranslation } from "react-i18next";
import Multilingual from "../../components/multilingual/Multilingual";

function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center w-screen h-screen p-6">
      <Card className="border-[1px]">
        <CardBody>
          <div className="flex justify-between">
            <div className="flex-grow">
              <Typography variant="h4" color="blue-gray">
                {t("page.login.title")}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {t("page.login.desc")}
              </Typography>
            </div>
            <div className="w-fit">
              <Multilingual variant="short" />
            </div>
          </div>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
