import { List, ListItem, ListItemPrefix } from "@material-tailwind/react";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "../../hooks/store";
import { setLogoutState } from "../../features/loginForm/redux/loginFormSlice";
import { logout } from "../redux/layoutSlice";
import { useNavigate } from "react-router-dom";
import { createElement } from "react";
import { resetState } from "../../store/store";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const LIST_ITEM_STYLES =
    "select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const footerMenuItems = [
    {
      label: t("layout.default.menu.sign_out"),
      icon: ArrowLeftStartOnRectangleIcon,
      path: "/login",
      next: async () => {
        await dispatch(logout());
        dispatch(setLogoutState());
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(resetState());
      },
    },
  ];

  return (
    <>
      <List>
        {footerMenuItems.map((menu) => (
          <ListItem
            key={menu.label}
            className={LIST_ITEM_STYLES}
            onClick={() => {
              menu.next();
              navigate(menu.path);
            }}
          >
            <ListItemPrefix>
              {createElement(menu.icon, {
                className: "h-5 w-5",
                strokeWidth: 2.5,
              })}
            </ListItemPrefix>
            {menu.label}
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Footer;
