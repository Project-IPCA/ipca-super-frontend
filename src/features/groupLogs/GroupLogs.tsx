import { useEffect, useRef, useState } from "react";
import { pageName, StatusType } from "./constants";
import LogsTable from "./components/LogsTable";

const VITE_IPCA_RT = import.meta.env.VITE_IPCA_RT;

interface Props {
  groupId: string;
}

export interface ActivityLog {
  log_id: string;
  timestamp: Date;
  group_id: string | null;
  username: string;
  remote_ip: string;
  remote_port: number | null;
  agent: string | null;
  page_name: string;
  action: string | ActionData;
  ci: number | null;
}

export interface ActionData {
  stu_id: string;
  job_id: string;
  status: StatusType;
  submission_id: string;
  attempt: string;
  sourcecode_filename: string;
  marking: number | null;
}

function GroupLogs({ groupId }: Props) {
  const initialized = useRef(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const evtSource = new EventSource(`${VITE_IPCA_RT}/class-log/${groupId}`);
      evtSource.onmessage = (event) => {
        if (event.data) {
          const rawData = JSON.parse(event.data);

          const processData = (log: ActivityLog): ActivityLog => {
            if (log.page_name === pageName.ExerciseSubmit) {
              return {
                ...log,
                action: JSON.parse(log.action as string) as ActionData,
              };
            }
            return log;
          };

          if (Array.isArray(rawData)) {
            setLogs(rawData.map(processData));
          } else {
            setLogs((prevLogs) => [...prevLogs, processData(rawData)]);
          }
        }
      };

      return () => {
        evtSource.close();
      };
    }
  }, [initialized]);

  useEffect(() => {
    if (tableRef.current && logs.length > 0) {
      setTimeout(() => {
        tableRef.current?.scrollTo({
          top: tableRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [logs]);

  return (
    <div>
      <LogsTable logs={logs} tableRef={tableRef} />
    </div>
  );
}

export default GroupLogs;
