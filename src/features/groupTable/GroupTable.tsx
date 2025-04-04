import {
  Button,
  Card,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  getMyGroupsStatus,
  Group,
  Staffs,
} from "../myGroupsList/redux/myGroupListSlice";
import { truncate } from "lodash";
import {
  EyeIcon,
  LockClosedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDayFromDayEnum, isAcceptedPermission } from "../../utils";
import RoleProtection from "../../components/roleProtection/RoleProtection";
import { DASHBOARD_ADMIN, GROUP_ADMIN } from "../../constants/constants";
import { useAppSelector } from "../../hooks/store";
import { getAvailableGroupsStatus } from "../availableGroupList/redux/AvailableGroupListSlice";
import { Fragment } from "react";
import { capitalize } from "lodash";
import { tabsValue } from "../groupDetail/constants";
import usePermission from "../../hooks/usePermission";

interface Props {
  userId?: string;
  groups: Group[];
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleFormOpen: () => void;
  handleSetGroupId: (groupId: string | null) => void;
  page: number;
  pages: number;
}

function GroupTable({
  userId,
  groups,
  handleNextPage,
  handlePrevPage,
  handleFormOpen,
  handleSetGroupId,
  page,
  pages,
}: Props) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const availableGroupFetching = useAppSelector(getAvailableGroupsStatus);
  const myGroupFetching = useAppSelector(getMyGroupsStatus);
  const isFetching = availableGroupFetching || myGroupFetching;
  const { permission } = usePermission();

  const formatStaffNames = (staffs: Staffs[]): string => {
    const staffList = staffs
      .map((staff) => `${staff.f_name} ${staff.l_name}`)
      .join(",");
    return truncate(staffList, { length: 16, separator: "..." });
  };

  const tableHeaders = Array.isArray(
    t("feature.group_table.th_list", {
      returnObjects: true,
    }),
  )
    ? (t("feature.group_table.th_list", {
        returnObjects: true,
      }) as string[])
    : [];

  return (
    <>
      <Card className="h-full w-full  shadow-none border-[1.5px]">
        <div className=" w-full overflow-scroll rounded-lg">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHeaders.map((head, index) => (
                  <th
                    key={head}
                    className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${index === 0 ? "sticky left-0 z-10" : ""}`}
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
                  <tr key={rIndex} className="h-[57px]">
                    {[...Array(tableHeaders.length)].map((_, cIndex) => (
                      <td
                        key={`${rIndex}${cIndex}`}
                        className={`px-5 py-[1.375rem]  bg-white`}
                      >
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
                {groups.map((group, index) => {
                  const classes =
                    index === 9 ? "" : "border-b border-blue-gray-50";
                  return (
                    <Fragment key={group.group_id}>
                      <tr key={group.group_id}>
                        <td
                          className={`p-4 sticky left-0 z-10 ${classes} bg-white`}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {group.group_no}
                          </Typography>
                        </td>
                        <td className={`p-4  ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {group.year}
                          </Typography>
                        </td>
                        <td className={`p-4  ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {group.semester}
                          </Typography>
                        </td>
                        <td className={`p-4  ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {capitalize(group.language)}
                          </Typography>
                        </td>

                        <td className={`p-4 ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {`${getDayFromDayEnum(group.day, i18n.language)}, ${group.time_start} - ${group.time_end}`}
                          </Typography>
                        </td>
                        <td className={`p-4 ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {group.student_amount}
                          </Typography>
                        </td>
                        <td className={`p-4 ${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {`${group.instructor.f_name} ${group.instructor.l_name}`}
                          </Typography>
                        </td>
                        <td className={`p-4 ${classes}`}>
                          {group.staffs.length > 0 ? (
                            <Tooltip
                              content={group.staffs.map((staff) => (
                                <Typography
                                  key={staff.staff_id}
                                  variant="small"
                                  className="font-medium"
                                >{`${staff.f_name} ${staff.l_name}`}</Typography>
                              ))}
                              placement="bottom-start"
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                {formatStaffNames(group.staffs)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-medium"
                            >
                              {t("feature.group_table.tr.no_staff")}
                            </Typography>
                          )}
                        </td>
                        <td className={`p-2 ${classes}`}>
                          <Menu placement="bottom-end">
                            <MenuHandler>
                              <IconButton
                                variant="text"
                                disabled={
                                  !!userId &&
                                  !(
                                    group.instructor.supervisor_id === userId ||
                                    group.staffs.find(
                                      (s) => s.staff_id === userId,
                                    )
                                  )
                                }
                              >
                                {!userId ||
                                (!!userId &&
                                  (group.instructor.supervisor_id === userId ||
                                    group.staffs.find(
                                      (s) => s.staff_id === userId,
                                    ))) ? (
                                  <EllipsisVerticalIcon className="w-5 h-5" />
                                ) : (
                                  <LockClosedIcon className="w-5 h-5" />
                                )}
                              </IconButton>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem
                                className="flex justify-start items-center gap-2"
                                onClick={() =>
                                  navigate(
                                    `/group/${group.group_id}?tab=${isAcceptedPermission(permission || [], [DASHBOARD_ADMIN]) ? tabsValue.OVERVIEW : tabsValue.EXERCISES}`,
                                  )
                                }
                              >
                                <EyeIcon className="w-5 h-5" />
                                {t("common.table.action.view")}
                              </MenuItem>
                              {handleSetGroupId && handleFormOpen && (
                                <>
                                  <RoleProtection
                                    acceptedPermission={[GROUP_ADMIN]}
                                  >
                                    <MenuItem
                                      className="flex justify-start items-center gap-2"
                                      onClick={() => {
                                        handleSetGroupId(group.group_id);
                                        handleFormOpen();
                                      }}
                                    >
                                      <PencilSquareIcon className="w-5 h-5" />
                                      {t("common.table.action.edit")}
                                    </MenuItem>
                                  </RoleProtection>
                                </>
                              )}
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
                {groups.length < 10 &&
                  [...Array(10 - groups.length)].map((_, cIndex) => (
                    <tr key={cIndex} className=" h-[57px]">
                      {[...Array(tableHeaders.length)].map((_, rIndex) => (
                        <td
                          className={
                            cIndex === 9 - groups.length
                              ? ""
                              : "border-b border-blue-gray-50"
                          }
                          key={rIndex}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            &nbsp;
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {t("common.table.page.page")} {pages ? page : 0}{" "}
            {t("common.table.page.of")} {pages}
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" onClick={handlePrevPage}>
              {t("common.table.paginate.prev")}
            </Button>
            <Button variant="outlined" size="sm" onClick={handleNextPage}>
              {t("common.table.paginate.next")}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default GroupTable;
