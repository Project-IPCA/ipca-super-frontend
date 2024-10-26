import { List, ListItem, ListItemPrefix } from "@material-tailwind/react";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

function Footer() {
  const LIST_ITEM_STYLES =
    "select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900";

  return (
    <>
      <List>
        <ListItem className={LIST_ITEM_STYLES}>
          <ListItemPrefix>
            <ArrowLeftStartOnRectangleIcon
              strokeWidth={2.5}
              className="h-5 w-5"
            />
          </ListItemPrefix>
          Sign Out
        </ListItem>
      </List>
    </>
  );
}

export default Footer;
