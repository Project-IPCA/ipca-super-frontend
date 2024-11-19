import { Typography } from "@material-tailwind/react";

interface Props {
  label: string;
  value: string | number | undefined;
}

function LabelValueText({ label, value }: Props) {
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
      <Typography className="font-semibold" color="blue-gray">
        {label}
      </Typography>
      <Typography>{getValueText()}</Typography>
    </div>
  );
}

export default LabelValueText;
