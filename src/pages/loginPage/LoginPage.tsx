import { Card, Typography } from "@material-tailwind/react";
import { LoginForm } from "../../features/loginForm";

function LoginPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="p-6">
        <Typography variant="h4" color="blue-gray">
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Computer Programming Laboratory, KMITL
        </Typography>
        <LoginForm />
      </Card>
    </div>
  );
}

export default LoginPage;
