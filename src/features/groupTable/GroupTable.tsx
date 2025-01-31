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
import { Group, Staffs } from "../myGroupsList/redux/myGroupListSlice";
import { truncate } from "lodash";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDayFromDayEnum } from "../../utils";
import RoleProtection from "../../components/roleProtection/RoleProtection";
import { GROUP_ADMIN } from "../../constants/constants";

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
              {groups.map((group) => (
                <tr key={group.group_id} className="even:bg-blue-gray-50/50 ">
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
                      {`${getDayFromDayEnum(group.day, i18n.language)}, ${group.time_start} - ${group.time_end}`}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {group.student_amount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {`${group.instructor.f_name} ${group.instructor.l_name}`}
                    </Typography>
                  </td>
                  <td className="p-4">
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
                  <td className="p-2">
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <IconButton
                          variant="text"
                          disabled={
                            !!userId &&
                            !(
                              group.instructor.supervisor_id === userId ||
                              group.staffs.find((s) => s.staff_id === userId)
                            )
                          }
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          className="flex justify-start items-center gap-2"
                          onClick={() => navigate(`/group/${group.group_id}`)}
                        >
                          <EyeIcon className="w-5 h-5" />
                          {t("common.table.action.view")}
                        </MenuItem>
                        {handleSetGroupId && handleFormOpen && (
                          <>
                            <RoleProtection acceptedPermission={[GROUP_ADMIN]}>
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
              ))}
            </tbody>
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
