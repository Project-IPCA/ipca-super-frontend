import { Typography, Tooltip } from "@material-tailwind/react";
import { ActionData } from "../redux/groupLogSlice";
import { NEGATIVE_ACTION, statusProperties } from "../constants";

interface Props {
  action: ActionData | string;
}

function LogRow({ action }: Props) {
  return typeof action === "string" ? (
    <Tooltip content={action}>
      <div className="flex items-center w-[500px] overflow-x-hidden">
        <Typography
          className={`${
            NEGATIVE_ACTION.includes(action) ||
            ["reject"].includes(action.split(" ")[0])
              ? "bg-red-400"
              : "bg-blue-400"
          } px-2.5 py-[2.5px] rounded-full text-white mr-2`}
        >
          Action
        </Typography>
        <Typography className="whitespace-nowrap text-ellipsis">
          {" "}
          : {action}
        </Typography>
      </div>
    </Tooltip>
  ) : typeof action === "object" ? (
    <div className="w-[500px] text-white">
      <div
        className={`flex flex-row gap-[5px] p-[5px] rounded-t-lg ${
          statusProperties[action.status].color
            ? statusProperties[action.status].color
            : ""
        }`}
      >
        <Typography variant="h6">Action</Typography>
        <Typography className="flex items-center " variant="h6">
          : Exercise submit
        </Typography>
      </div>

      <div className="p-[10px] bg-gray-800 rounded-b-lg">
        {Object.entries(action).map(
          ([key, value]) =>
            !["job_id"].includes(key) && (
              <div key={key} className="flex flex-row gap-[5px]">
                <Typography className="text-right w-[150px]" color="white">
                  {key}
                </Typography>
                <Typography className="flex items-center" color="white">
                  :{" "}
                  {value === undefined || value === null ? "running..." : value}
                </Typography>
              </div>
            )
        )}
      </div>
    </div>
  ) : (
    ""
  );
}

export default LogRow;
