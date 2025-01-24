import { Button, Chip, Typography } from "@material-tailwind/react";
import { GroupChapterPermission } from "../redux/studentDetailSlice";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  studentId: string;
  chapterList: GroupChapterPermission[];
}

function ChapterListCard({ chapterList, studentId }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getItemColor = (
    isSubmit: boolean,
    marking: number,
    fullMark: number,
  ) => {
    if (isSubmit) {
      if (marking === fullMark) {
        return "green";
      } else {
        return "red";
      }
    }
    return "gray";
  };
  return (
    <div className="divide-y divide-gray-200 min-h-screen">
      {chapterList?.map((chapter) => (
        <div
          className="flex justify-between lg:items-center gap-x-4 py-6 px-6 lg:flex-row flex-col "
          key={chapter.chapter_id}
        >
          <div className="md:mb-0 mb-4">
            <div className="flex items-center gap-x-2 mb-2">
              {!chapter.allow_access ? (
                <LockClosedIcon className="w-5 h-5 mb-1" />
              ) : null}
              <Typography variant="h6">
                {chapter.chapter_idx}. {chapter.chapter_name}
              </Typography>
            </div>
            <div className="flex items-center gap-x-2 lg:mb-0 mb-4">
              <Typography variant="paragraph" className="text-sm">
                {t("feature.student_detail.label.allow_submit")}
              </Typography>
              <Chip
                className="w-fit"
                variant="ghost"
                color={chapter.allow_submit ? "green" : "red"}
                size="sm"
                value={
                  chapter.allow_submit
                    ? t("common.table.perm.allow")
                    : t("common.table.perm.deny")
                }
              />
            </div>
          </div>

          <div className="flex items-center  md:gap-x-8 gap-x-2 md:flex-nowrap flex-wrap md:gap-y-0 gap-y-2 ">
            {chapter.items.map((item) => (
              <Button
                onClick={() => {
                  navigate(
                    `/exercise/student/${studentId}/chapter/${chapter.chapter_idx}/problem/${item.item_idx}`,
                  );
                }}
                disabled={!item.is_access}
                color={getItemColor(
                  item.is_submit,
                  item.marking,
                  item.full_mark,
                )}
                size="sm"
                variant={item.is_submit ? "filled" : "outlined"}
                className="w-16 h-16 flex flex-col justify-center items-center !p-2"
                key={`${item.chapter_idx}.${item.item_idx}`}
              >
                <span className="block mb-1">
                  {t("feature.student_detail.item")} {item.item_idx}
                </span>
                <span className="block">
                  {item.marking}/{item.full_mark}
                </span>
              </Button>
            ))}
            <div className="text-center ml-auto md:block hidden">
              <Typography variant="h6">
                {t("feature.student_detail.score")}
              </Typography>
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
