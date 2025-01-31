import { Card, Typography } from "@material-tailwind/react";
import { Staffs } from "../groupForm/redux/groupFormSlice";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE,
  ROLE,
  ROLE_DISPLAY_2_LANGUAGE,
} from "../../constants/constants";

interface Props {
  staffs: Staffs[];
}

function AdminTable({ staffs }: Props) {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const tableHeaders = Array.isArray(
    t("feature.admin_table.th_list", {
      returnObjects: true,
    }),
  )
    ? (t("feature.admin_table.th_list", {
        returnObjects: true,
      }) as string[])
    : [];

  const isThLang = () => {
    return i18n.language === LANGUAGE.th;
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case ROLE.student:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.student.th
          : ROLE_DISPLAY_2_LANGUAGE.student.en;
      case ROLE.ta:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.ta.th
          : ROLE_DISPLAY_2_LANGUAGE.ta.en;
      case ROLE.supervisor:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.supervisor.th
          : ROLE_DISPLAY_2_LANGUAGE.supervisor.en;
      case ROLE.executive:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.executive.th
          : ROLE_DISPLAY_2_LANGUAGE.executive.en;
      case ROLE.beyonder:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.beyonder.th
          : ROLE_DISPLAY_2_LANGUAGE.beyonder.en;
      default:
        return isThLang()
          ? ROLE_DISPLAY_2_LANGUAGE.invalid.th
          : ROLE_DISPLAY_2_LANGUAGE.invalid.en;
    }
  };

  return (
    <>
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
              {staffs.map((staff) => (
                <tr key={staff.staff_id} className="even:bg-blue-gray-50/50 ">
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
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {getRoleDisplay(staff.role)}
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
