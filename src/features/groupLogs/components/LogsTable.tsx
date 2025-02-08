import { useEffect, useRef, RefObject } from "react";
import { Card, Spinner, Tooltip, Typography } from "@material-tailwind/react";
import LogRow from "./LogRow";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ActivityLog } from "../redux/groupLogSlice";

interface Props {
  loading: boolean;
  logs: ActivityLog[];
  tableRef: RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

function LogsTable({ loading, logs, tableRef, scrollToBottom }: Props) {
  const { t } = useTranslation();
  const prevLogsLength = useRef(logs.length);
  const prevScrollHeight = useRef(0);

  const thList = Array.isArray(
    t("feature.group_logs.th_list", {
      returnObjects: true,
    }),
  )
    ? (t("feature.group_logs.th_list", {
        returnObjects: true,
      }) as string[])
    : [];

  const tableHeaders = [
    { name: thList[0], size: 150 },
    { name: thList[1], size: 70 },
    { name: thList[2], size: 150 },
    { name: thList[3], size: 140 },
    { name: thList[4], size: 70 },
    { name: thList[5], size: 500 },
  ];

  useEffect(() => {
    if (tableRef.current && logs.length > prevLogsLength.current) {
      const newScrollHeight = tableRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;

      if (prevScrollHeight.current > 0) {
        tableRef.current.scrollTop = scrollDiff;
      }

      prevScrollHeight.current = newScrollHeight;
      prevLogsLength.current = logs.length;
    }
  }, [loading]);

  useEffect(() => {
    if (tableRef.current && prevScrollHeight.current === 0) {
      prevScrollHeight.current = tableRef.current.scrollHeight;
    }
    scrollToBottom();
  }, []);

  return (
    <Card className="h-full w-full shadow-none border-[1.5px]">
      <div
        className="w-full overflow-scroll rounded-lg h-[80vh]"
        ref={tableRef}
      >
        <table className="w-full min-w-max text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {tableHeaders.map((head) => (
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
            {loading && (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-4">
                  <Spinner className="h-16 w-16 inline-block" />
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.log_id} className="even:bg-blue-gray-50/50">
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
  );
}

export default LogsTable;
