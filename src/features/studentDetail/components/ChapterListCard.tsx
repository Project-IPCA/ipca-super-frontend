import { Button, Chip, Typography } from "@material-tailwind/react";

function ChapterListCard() {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 8 }, (_, index) => index).map((item) => (
        <div
          className="flex justify-between items-center py-6 px-6 "
          key={item}
        >
          <div>
            <Typography variant="h6" className="mb-2">
              {item + 1}. Introduction
            </Typography>
            <div className="flex items-center gap-x-2">
              <Typography variant="paragraph" className="text-sm">
                Allow Submit
              </Typography>
              <Chip
                className="w-fit"
                variant="ghost"
                color="green"
                size="sm"
                value={"ALLOW"}
              />
            </div>
          </div>
          <div className="flex gap-x-4">
            {Array.from({ length: 5 }, (_, index) => index).map((item) => (
              <Button color="green" size="sm" className="w-16 h-16 !p-3">
                <span className="block mb-1">Item {item + 1}</span>
                <span className="block">2/2</span>
              </Button>
            ))}
          </div>
          <Typography variant="h6">Score: 10/10</Typography>
        </div>
      ))}
    </div>
  );
}

export default ChapterListCard;
