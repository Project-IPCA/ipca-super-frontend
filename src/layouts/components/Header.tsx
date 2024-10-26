import { Typography } from "@material-tailwind/react";

function Header() {
  return (
    <>
      <div className="mb-2 flex items-center gap-4 p-4">
        <img
          src="https://www.material-tailwind.com/logos/mt-logo.png"
          alt="brand"
          className="h-9 w-9"
        />
        <Typography color="blue-gray" className="text-lg font-bold">
          IPCA Dashboard
        </Typography>
      </div>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export default Header;
