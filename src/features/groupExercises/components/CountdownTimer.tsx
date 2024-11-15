import { Chip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { ALLOW_TYPE } from "../../../constants/constants";

interface Props {
  duration: number;
}
function CountdownTimer({ duration }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft]);

  const formatTime = (
    time: number,
  ): { hours: number; minutes: number; seconds: number } => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  const padTime = (unit: number) => {
    return unit.toString().padStart(2, "0");
  };
  return (
    <>
      {timeLeft > 0 ? (
        <div className="flex justify-start items-center gap-[2px]">
          <Chip value={padTime(hours)} size="sm" />
          <Typography>:</Typography>
          <Chip value={padTime(minutes)} size="sm" />
          <Typography>:</Typography>
          <Chip value={padTime(seconds)} size="sm" />
        </div>
      ) : (
        <Chip
          className="w-fit"
          variant="ghost"
          color="red"
          size="sm"
          value={ALLOW_TYPE.deny}
        />
      )}
    </>
  );
}

export default CountdownTimer;
