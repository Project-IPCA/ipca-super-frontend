import { Typography } from "@material-tailwind/react";
import { ipcaIc } from "../../assets";

function Header() {
  return (
    <>
      <div className="mb-2 flex items-center gap-x-2 px-2 py-4">
        <img src={ipcaIc} alt="brand" className="h-12 w-12" />
        <Typography color="blue-gray" className="text-lg font-bold">
          IPCA Dashboard
        </Typography>
      </div>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export default Header;
