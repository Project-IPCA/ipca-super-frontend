import {
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";

import { EyeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { LabInfo, Student } from "../redux/GroupStudentsSlice";
import { profileNone } from "../../../assets";
import { StudentData } from "../GroupStudents";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  page: number;
  pages: number;
  labInfo: LabInfo[];
  students: Student[];
  onlineStudent: string[];
  handlePermFormOpen: () => void;
  handleSetStudent: (student: StudentData) => void;
  handleChangePage: (direction: "next" | "prev") => void;
}

function StudentTable({
  page,
  pages,
  labInfo,
  students,
  onlineStudent,
  handlePermFormOpen,
  handleSetStudent,
  handleChangePage,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableHeadersP1 = Array.isArray(
    t("feature.group_students.th_list.part1", {
      returnObjects: true,
    }),
  )
    ? (t("feature.group_students.th_list.part1", {
        returnObjects: true,
      }) as string[])
    : [];
  const tableHeadersP2 = Array.isArray(
    t("feature.group_students.th_list.part2", {
      returnObjects: true,
    }),
  )
    ? (t("feature.group_students.th_list.part2", {
        returnObjects: true,
      }) as string[])
    : [];
  const getTableHeader = () => {
    const labs = labInfo.map(
      (lab) =>
        `${t("feature.group_students.th_list.lab")} ${lab.chapter_idx} (${lab.full_mark})`,
    );
    return [...tableHeadersP1, ...labs, ...tableHeadersP2];
  };

  return (
    <>
      <Card className="h-full w-full  shadow-none border-[1.5px]">
        <div className=" w-full overflow-scroll rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {getTableHeader().map((head) => (
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
              {students.map((student) => (
                <tr key={student.stu_id} className="even:bg-blue-gray-50/50 ">
                  <td className="p-4">
                    <Avatar
                      src={student.avatar ? student.avatar : profileNone}
                      alt="avatar"
                    />
                  </td>
                  <td className="p-4">
                    <Chip
                      variant="ghost"
                      color={
                        onlineStudent.includes(student.stu_id) ? "green" : "red"
                      }
                      size="sm"
                      value={
                        onlineStudent.includes(student.stu_id)
                          ? t("feature.group_students.online")
                          : t("feature.group_students.offline")
                      }
                      icon={
                        <span
                          className={`mx-auto mt-1 block h-2 w-2 rounded-full ${
                            onlineStudent.includes(student.stu_id)
                              ? "bg-green-900 "
                              : "bg-red-500"
                          } content-['']`}
                        />
                      }
                    />
                  </td>
                  <td className="p-4">
                    <Chip
                      className="w-fit"
                      variant="ghost"
                      color={student.can_submit ? "green" : "red"}
                      size="sm"
                      value={
                        student.can_submit
                          ? t("common.table.perm.allow")
                          : t("common.table.perm.deny")
                      }
                    />
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {student.kmitl_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {`${student.f_name} ${student.l_name}`}
                    </Typography>
                  </td>
                  {Object.entries(student.chapter_score).map(([key, value]) => (
                    <td className="p-4" key={key}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {value}
                      </Typography>
                    </td>
                  ))}
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {Object.values(student.chapter_score).reduce(
                        (total, value) => total + value,
                        0,
                      )}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {student.midterm_score}
                    </Typography>
                  </td>

                  <td className="p-2">
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <IconButton variant="text">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          className="flex justify-start items-center gap-2"
                          onClick={() => navigate(`/student/${student.stu_id}`)}
                        >
                          <EyeIcon className="w-5 h-5" />
                          {t("common.table.action.view")}
                        </MenuItem>
                        <MenuItem
                          className="flex justify-start items-center gap-2"
                          onClick={() => {
                            handleSetStudent({
                              name: `${student.f_name} ${student.l_name}`,
                              kmitlId: student.kmitl_id,
                              studentId: student.stu_id,
                            });
                            handlePermFormOpen();
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
        <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {t("common.table.page.page")} {page} {t("common.table.page.of")}{" "}
            {pages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleChangePage("prev")}
            >
              {t("common.table.paginate.prev")}
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleChangePage("next")}
            >
              {t("common.table.paginate.next")}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default StudentTable;
