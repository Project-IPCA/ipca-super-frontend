import { Card, Typography } from "@material-tailwind/react";
import { Staffs } from "../groupForm/redux/groupFormSlice";
import { TABLE_HEAD } from "./constants";

//TODO need to imporve after this
interface Props {
  staffs: Staffs[];
}

function AdminTable({ staffs }: Props) {
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
              {staffs.map((staff) => (
                <tr
                  key={staff.supervisor_id}
                  className="even:bg-blue-gray-50/50 "
                >
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {staff.f_name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {staff.l_name}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export default AdminTable;
