import {
  Avatar,
  ListItem,
  Typography,
  ListItemPrefix,
} from "@material-tailwind/react";
import { profileNone } from "../../assets";
import { useNavigate } from "react-router-dom";

interface Props {
  profileImage: string;
  firstName: string;
  lastName: string;
  handleCloseDrawer: () => void;
}

function Profile({
  profileImage,
  firstName,
  lastName,
  handleCloseDrawer,
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
    handleCloseDrawer();
  };
  return (
    <>
      <ListItem
        className="p-3 select-none hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 hover:text-gray-900 focus:text-gray-900 active:text-gray-900 data-[selected=true]:text-gray-900"
        onClick={() => handleClick()}
      >
        <ListItemPrefix>
          <Avatar size="sm" src={profileImage || profileNone} />
        </ListItemPrefix>
        <Typography className="mr-auto font-normal text-inherit">
          {`${firstName} ${lastName}`}
        </Typography>
      </ListItem>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export default Profile;
