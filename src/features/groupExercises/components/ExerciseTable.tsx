import {
  Card,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { GroupChapterPermission } from "../redux/groupExercisesSlice";
import {
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { ChapterData } from "../GroupExercises";
import { StatusChip } from "./StatusChip";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  chapterList: GroupChapterPermission[] | [];
  handleSetChapter: (chapterSelected: ChapterData) => void;
  handleAccessFormOpen: () => void;
}

function ExerciseTable({
  chapterList,
  handleSetChapter,
  handleAccessFormOpen,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const tableHeaders = Array.isArray(
    t("feature.group_exercises.th_list", {
      returnObjects: true,
    }),
  )
    ? (t("feature.group_exercises.th_list", {
        returnObjects: true,
      }) as string[])
    : [];
  return (
    <div className="pt-8">
      <Card className="h-full w-full  shadow-none border-[1.5px]">
        <div className=" w-full overflow-scroll rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHeaders.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chapterList.map((exercise) => (
                <tr
                  key={exercise.chapter_id}
                  className="even:bg-blue-gray-50/50 "
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {`${exercise.chapter_index}. ${exercise.name}`}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {exercise.full_mark}
                    </Typography>
                  </td>
                  <td className="p-4 ">
                    <StatusChip
                      type={exercise.allow_access.type}
                      timeStart={exercise.allow_access.time_start}
                      timeEnd={exercise.allow_access.time_end}
                    />
                  </td>
                  <td className="p-4 ">
                    <StatusChip
                      type={exercise.allow_submit.type}
                      timeStart={exercise.allow_submit.time_start}
                      timeEnd={exercise.allow_submit.time_end}
                    />
                  </td>
                  <td className="p-2">
                    <Menu>
                      <MenuHandler>
                        <IconButton variant="text">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          className="flex justify-start items-center gap-2"
                          onClick={() =>
                            navigate(
                              `/exercise_pool/group/${groupId}/chapter/${exercise.chapter_index}`,
                            )
                          }
                        >
                          <EyeIcon className="w-5 h-5" />
                          {t("common.table.action.view")}
                        </MenuItem>
                        <MenuItem
                          className="flex justify-start items-center gap-2"
                          onClick={() => {
                            handleAccessFormOpen();
                            handleSetChapter({
                              chapterId: exercise.chapter_id,
                              chapterIndex: exercise.chapter_index,
                              chapterName: exercise.name,
                            });
                          }}
                        >
                          <Cog6ToothIcon className="w-5 h-5" />
                          {t("common.table.action.perm")}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default ExerciseTable;
