import { Button, Chip, Typography } from "@material-tailwind/react";
import { GroupChapterPermission } from "../redux/studentDetailSlice";
import { LockClosedIcon } from "@heroicons/react/24/solid";

interface Props {
  chapterList: GroupChapterPermission[];
}

function ChapterListCard({ chapterList }: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {chapterList?.map((chapter) => (
        <div
          className="flex justify-between items-center gap-x-4 py-6 px-6"
          key={chapter.chapter_id}
        >
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              {!chapter.allow_access ? (
                <LockClosedIcon className="w-5 h-5 mb-1" />
              ) : null}
              <Typography variant="h6">
                {chapter.chapter_idx}. {chapter.chapter_name}
              </Typography>
            </div>
            <div className="flex items-center gap-x-2">
              <Typography variant="paragraph" className="text-sm">
                Allow Submit
              </Typography>
              <Chip
                className="w-fit"
                variant="ghost"
                color={chapter.allow_submit ? "green" : "red"}
                size="sm"
                value={chapter.allow_submit ? "ALLOW" : "DENY"}
              />
            </div>
          </div>

          <div className="flex items-center  gap-x-8 ">
            {chapter.items.map((item) => (
              <Button
                color={item.marking === item.full_mark ? "green" : "gray"}
                size="sm"
                variant="outlined"
                className="w-16 h-16 flex flex-col justify-center items-center !p-2"
                key={`${item.chapter_idx}.${item.item_idx}`}
              >
                <span className="block mb-1">Item {item.item_idx}</span>
                <span className="block">
                  {item.marking}/{item.full_mark}
                </span>
              </Button>
            ))}
            <div className="text-center">
              <Typography variant="h6">Score</Typography>
              <Typography variant="h6">
                {chapter.items.reduce((score, item) => score + item.marking, 0)}
                /{chapter.chapter_full_mark}
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChapterListCard;
