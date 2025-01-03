import { Card, Tooltip, Typography } from "@material-tailwind/react";
import { ActivityLog } from "../GroupLogs";
import { TABLE_HEAD } from "../constants";
import LogRow from "./LogRow";
import { format } from "date-fns";
import { RefObject } from "react";

interface Props {
  logs: ActivityLog[];
  tableRef: RefObject<HTMLDivElement>;
}

function LogsTable({ logs, tableRef }: Props) {
  return (
    <>
      <Card className="h-full w-full shadow-none border-[1.5px]">
        <div
          className="w-full overflow-scroll rounded-lg h-[80vh]"
          ref={tableRef}
        >
          <table className="w-full min-w-max text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head.name}
                    className={`w-[${head.size}px] border-b border-blue-gray-100 bg-blue-gray-50 p-2 text-center`}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head.name}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.log_id} className="even:bg-blue-gray-50/50 ">
                  <td className="p-2">
                    <Tooltip
                      content={format(log.timestamp, "MMM dd, yyyy HH:mm:ss")}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal whitespace-nowrap overflow-x-hidden w-[150px]"
                      >
                        {format(log.timestamp, "MMM dd, yyyy HH:mm:ss")}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip content={log.remote_ip}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal whitespace-nowrap overflow-x-hidden w-[70px]"
                      >
                        {log.remote_ip}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip content={log.agent}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal whitespace-nowrap overflow-x-hidden w-[150px]"
                      >
                        {log.agent}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip content={log.page_name}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal whitespace-nowrap overflow-x-hidden w-[140px]"
                      >
                        {log.page_name}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip content={log.username}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal whitespace-nowrap overflow-x-hidden w-[70px]"
                      >
                        {log.username}
                      </Typography>
                    </Tooltip>
                  </td>
                  <td className="p-2 w-[500px]">
                    <LogRow action={log.action} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export default LogsTable;
