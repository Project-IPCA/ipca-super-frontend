import { Typography } from "@material-tailwind/react";

interface Props {
  label: string;
  value: string | number | undefined;
}

function InfoText({ label, value }: Props) {
  const getValueText = () => {
    if (!value) {
      if (typeof value === "number") {
        return "0";
      }
      return "-";
    }
    return value;
  };
  return (
    <div className="flex gap-2">
      <Typography className="font-semibold">{label}</Typography>
      <Typography>{getValueText()}</Typography>
    </div>
  );
}

export default InfoText;
