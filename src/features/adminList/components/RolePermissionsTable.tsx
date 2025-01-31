import { Card, Checkbox, Typography } from "@material-tailwind/react";
import { ROLE, ROLE_PERMISSION } from "../../../constants/constants";
import { useTranslation } from "react-i18next";
import { RolePermission } from "../redux/AdminListSlice";

interface Props {
  handleSetRolePermissions: (role: string, perm: string) => void;
  rolePermissions: RolePermission[];
}

function RolePermissionsTable({
  handleSetRolePermissions,
  rolePermissions,
}: Props) {
  const { t } = useTranslation();

  const tableHeader = Array.isArray(
    t("feature.admin_list.modal.th_list", { returnObjects: true }),
  )
    ? (t("feature.admin_list.modal.th_list", {
        returnObjects: true,
      }) as string[])
    : [];

  const permissionRow = [
    {
      role: t("feature.admin_list.modal.role.ta"),
      value: ROLE.ta,
    },
    {
      role: t("feature.admin_list.modal.role.exe"),
      value: ROLE.executive,
    },
  ];

  const getCheck = (role: string, perm: string) => {
    const permission = rolePermissions.find((r) => r.role === role);
    if (permission?.permission.includes(perm)) {
      return true;
    }
    return false;
  };

  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHeader.map((head, index) => (
              <th
                key={head}
                className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${index !== 0 ? "text-center" : ""}`}
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
          {permissionRow.map(({ role, value }, index) => {
            const isLast = index === permissionRow.length - 1;
            const classes = isLast
              ? "p-4 text-center"
              : "p-4 border-b border-blue-gray-50 text-center";

            return (
              <tr key={value}>
                <td className={`${classes} text-start`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {role}
                  </Typography>
                </td>
                {ROLE_PERMISSION.map((perm) => (
                  <td
                    className={classes}
                    key={perm}
                    onChange={() => handleSetRolePermissions(value, perm)}
                  >
                    <Checkbox
                      crossOrigin=""
                      defaultChecked={getCheck(value, perm)}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

export default RolePermissionsTable;
