import {
  Avatar,
  ListItem,
  Typography,
  ListItemPrefix,
} from "@material-tailwind/react";

function Profile() {
  return (
    <>
      <ListItem className="p-3 select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900">
        <ListItemPrefix>
          <Avatar
            size="sm"
            src="https://www.material-tailwind.com/img/avatar1.jpg"
          />
        </ListItemPrefix>
        <Typography className="mr-auto font-normal text-inherit">
          Brooklyn Alice
        </Typography>
      </ListItem>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export default Profile;
