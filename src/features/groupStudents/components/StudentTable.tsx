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
  const navigate = useNavigate();
  const getTableHeader = () => {
    const labs = labInfo.map(
      (lab) => `Lab ${lab.chapter_idx} (${lab.full_mark})`
    );
    return [
      "Avatar",
      "Status",
      "Allow Submit",
      "Student ID",
      "Name",
      ...labs,
      "Total",
      "Midterm",
      "Actions",
    ];
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
                          ? "Online"
                          : "Ofline"
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
                      value={student.can_submit ? "Allow" : "Deny"}
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
                        0
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
                          View
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
                          Permission
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
            Page {page} of {pages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleChangePage("prev")}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleChangePage("next")}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default StudentTable;
