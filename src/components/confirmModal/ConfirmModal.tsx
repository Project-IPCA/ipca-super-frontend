import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Type = "error" | "warn" | "default";

interface Props {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmLabel: string;
  type?: Type;
  handleClose: () => void;
  handleSubmit: () => void;
}

function ConfirmModal({
  open,
  title,
  description,
  type = "default",
  confirmLabel,
  handleClose,
  handleSubmit,
}: Props) {
  const { t } = useTranslation();
  const getColor = () => {
    switch (type) {
      case "error":
        return "red";
      case "warn":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Dialog open={open} handler={handleClose}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleClose} className="mr-1">
            {t("common.button.cancel")}
          </Button>
          <Button variant="gradient" color={getColor()} onClick={handleSubmit}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ConfirmModal;
