import { Bounce, toast } from "react-toastify";

interface ToastProps {
  variant: "error" | "success";
  message?: string | null;
}

export const showToast = ({ variant, message }: ToastProps) => {
  const toastConfig = {
    position: "bottom-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
  switch (variant) {
    case "success":
      toast.success(message, toastConfig);
      break;
    case "error":
      const newMessage = message ? message : "Something went wrong";
      toast.error(newMessage, toastConfig);
      break;
    default:
      break;
  }
};
