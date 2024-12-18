import {
  List,
  ListItem,
  Accordion,
  Typography,
  AccordionBody,
  ListItemPrefix,
} from "@material-tailwind/react";
import React, { createElement, useState } from "react";

import { UserGroupIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

function MenuList() {
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();

  const handleOpen = (value: any) => {
    setOpen(open === value ? 0 : value);
  };

  const LIST_ITEM_STYLES =
    "select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900";

  const menuItems = [
    {
      label: "Groups",
      icon: UserGroupIcon,
      subItems: [
        {
          label: "My Groups",
          path: "/my-groups",
        },
        {
          label: "Available Groups",
          path: "/groups",
        },
      ],
    },
  ];

  return (
    <>
      <List>
        {menuItems.map((menu, index) => (
          <React.Fragment key={menu.label}>
            {menu.subItems ? (
              <Accordion open={open === index + 1}>
                <ListItem
                  selected={open === index + 1}
                  data-selected={open === index + 1}
                  onClick={() => handleOpen(index + 1)}
                  className="px-3 py-[9px] select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900"
                >
                  <ListItemPrefix>
                    {createElement(menu.icon, {
                      className: "h-5 w-5",
                    })}
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal text-inherit">
                    {menu.label}
                  </Typography>
                  <ChevronDownIcon
                    strokeWidth={3}
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform ${open === index + 1 ? "rotate-180" : ""}`}
                  />
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {menu.subItems.map((subItem) => (
                      <ListItem
                        className={`px-12 ${LIST_ITEM_STYLES}`}
                        key={subItem.label}
                        onClick={() => navigate(subItem.path)}
                      >
                        {subItem.label}
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            ) : (
              <ListItem className={LIST_ITEM_STYLES} key={menu.label}>
                <ListItemPrefix>
                  {createElement(menu.icon, {
                    className: "h-5 w-5",
                  })}
                </ListItemPrefix>
                {menu.label}
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export default MenuList;
