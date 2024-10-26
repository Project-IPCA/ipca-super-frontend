import { Outlet } from "react-router-dom";
import { Card, IconButton, Navbar, Typography } from "@material-tailwind/react";
import Header from "./components/Header";
import Profile from "./components/Profile";
import MenuList from "./components/MenuList";
import Footer from "./components/Footer";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import DrawerMenu from "./components/DrawerMenu";

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCloseDrawer = () => setDrawerOpen(false);
  return (
    <>
      <DrawerMenu isOpen={drawerOpen} onClose={handleCloseDrawer} />
      <Card className="h-screen fixed max-w-[20rem] mx-auto p-6 shadow-md overflow-scroll z-20 lg:block hidden">
        <Header />
        <Profile />
        <MenuList />
        <Footer />
      </Card>
      <Navbar className="fixed top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 lg:hidden block">
        <div className="flex text-blue-gray-900  h-full">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={() => setDrawerOpen(true)}
          >
            <Bars3BottomLeftIcon className="h-6 w-6" />
          </IconButton>
          <Typography
            as="a"
            className="mr-4 ml-2 mt-1 cursor-pointer  font-medium "
          >
            IPCA
          </Typography>
        </div>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Layout;
