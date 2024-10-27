import { Button, Card, Typography } from "@material-tailwind/react";
import { TABLE_HEAD } from "./constants";
import { Group, Instructor } from "../myGroupsList/redux/myGroupListSlice";
import { truncate, capitalize } from "lodash";

interface Props {
  groups: Group[];
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
  pages: number;
}

function GroupTable({
  groups,
  handleNextPage,
  handlePrevPage,
  page,
  pages,
}: Props) {
  const formatStaffNames = (staffs: Instructor[]): string => {
    const staffList = staffs
      .map((staff) => `${staff.f_name} ${staff.l_name}`)
      .join(",");
    return truncate(staffList, { length: 16, separator: "..." });
  };
  return (
    <>
      <Card className="h-full w-full  shadow-none border-[1.5px]">
        <div className=" w-full overflow-scroll rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
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
              {groups.map((group) => (
                <tr
                  key={group.group_id}
                  className="even:bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {group.group_no}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {group.year}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {group.semester}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {`${capitalize(group.day)}, ${group.time_start} - ${group.time_end}`}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {group.student_amount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {`${group.instructor.f_name} ${group.instructor.l_name}`}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {group.staffs.length > 0
                        ? formatStaffNames(group.staffs)
                        : "No staffs"}
                    </Typography>
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
            <Button variant="outlined" size="sm" onClick={handlePrevPage}>
              Previous
            </Button>
            <Button variant="outlined" size="sm" onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default GroupTable;
