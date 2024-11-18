import { Drawer } from "@material-tailwind/react";
import Header from "./Header";
import Profile from "./Profile";
import MenuList from "./MenuList";
import Footer from "./Footer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  firstName: string;
  lastName: string;
}

function DrawerMenu({
  isOpen,
  onClose,
  profileImage,
  firstName,
  lastName,
}: Props) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      overlayProps={{
        className:
          "fixed inset-0 bg-black bg-opacity-20 h-screen overflow-auto",
      }}
      size={500}
      className="lg:w-full w-3/4"
    >
      <Header />
      <Profile
        profileImage={profileImage}
        firstName={firstName}
        lastName={lastName}
      />
      <MenuList />
      <Footer />
    </Drawer>
  );
}

export default DrawerMenu;
