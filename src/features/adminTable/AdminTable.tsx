import {
  Card,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { getGroupFormStatus, Staffs } from "../groupForm/redux/groupFormSlice";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE,
  ROLE,
  ROLE_DISPLAY_2_LANGUAGE,
} from "../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { TrashIcon } from "@heroicons/react/24/outline";
import { setSelectAdmin } from "../adminList/redux/AdminListSlice";

interface Props {
  staffs: Staffs[];
  showDeleteBtn: boolean;
  handleOpenAdmin: () => void;
}

function AdminTable({ staffs, showDeleteBtn, handleOpenAdmin }: Props) {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const isFetching = useAppSelector(getGroupFormStatus);
  const tableHeaders = Array.isArray(
    t(
      `${
        showDeleteBtn
          ? "feature.admin_table.beyonder_th_list"
          : "feature.admin_table.th_list"
      }`,
      {
        returnObjects: true,
      }
    )
  )
    ? (t(
        `${
          showDeleteBtn
            ? "feature.admin_table.beyonder_th_list"
            : "feature.admin_table.th_list"
        }`,
        {
          returnObjects: true,
        }
      ) as string[])
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

  const onDeleteAdmin = (staff: Staffs) => {
    dispatch(setSelectAdmin(staff));
    handleOpenAdmin();
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
            {isFetching ? (
              <tbody>
                {[...Array(10)].map((_, rIndex) => (
                  <tr key={rIndex}>
                    {[...Array(tableHeaders.length)].map((_, cIndex) => (
                      <td className="text-center p-5" key={cIndex}>
                        <Typography
                          key={`${rIndex}${cIndex}`}
                          as="div"
                          className="h-3 rounded-full bg-gray-300 "
                        >
                          &nbsp;
                        </Typography>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {staffs.map((staff, index) => {
                  const classes =
                    index === staffs.length - 1
                      ? ""
                      : "border-b border-blue-gray-50";
                  return (
                    <tr key={staff.staff_id}>
                      <td className={`p-4 ${classes}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {staff.f_name}
                        </Typography>
                      </td>
                      <td className={`p-4 ${classes}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {staff.l_name}
                        </Typography>
                      </td>
                      <td className={`p-4 ${classes}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {getRoleDisplay(staff.role)}
                        </Typography>
                      </td>
                      {showDeleteBtn ? (
                        <>
                          <td className={`p-4 ${classes}`}>
                            <Chip
                              className="w-fit"
                              variant="ghost"
                              color={staff.active ? "green" : "red"}
                              size="sm"
                              value={
                                staff.active
                                  ? t("feature.admin_table.stats.active")
                                  : t("feature.admin_table.stats.inactive")
                              }
                            />
                          </td>
                          <td className={`p-4 ${classes}`}>
                            <Menu placement="bottom-end">
                              <MenuHandler>
                                <IconButton variant="text">
                                  <EllipsisVerticalIcon className="w-5 h-5" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem
                                  className="flex justify-start items-center gap-2"
                                  onClick={() => onDeleteAdmin(staff)}
                                >
                                  {staff.active ? (
                                    <TrashIcon className="w-5 h-5" />
                                  ) : (
                                    <ArrowPathIcon className="w-5 h-5" />
                                  )}
                                  {t(
                                    `feature.admin_table.action.${
                                      staff.active == true
                                        ? "delete"
                                        : "restore"
                                    }`
                                  )}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </Card>
    </>
  );
}

export default AdminTable;
