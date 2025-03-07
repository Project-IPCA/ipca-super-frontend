import { useEffect, useRef } from "react";
import LogsTable from "./components/LogsTable";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  clearAllGroupActivityLog,
  fetchLastTimeLog,
  FetchLastTimeLogReq,
  getActivityLog,
  getGroupActivityLogStatus,
  pushLogs,
} from "./redux/groupLogSlice";
import { processData } from "../../utils";

const VITE_IPCA_RT = import.meta.env.VITE_IPCA_RT;

const LIMIT_LOG = 20;

interface Props {
  groupId: string;
}

function GroupLogs({ groupId }: Props) {
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  const fetching = useAppSelector(getGroupActivityLogStatus);
  const { logs, total, lastTime } = useAppSelector(getActivityLog);
  const tableRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const isScrolledToTop = () => {
    if (!tableRef.current) return false;
    return tableRef.current.scrollTop === 0;
  };

  const handleScroll = () => {
    if (isScrolledToTop() && logs.length < total) {
      const request: FetchLastTimeLogReq = {
        groupId: groupId,
        limit: LIMIT_LOG,
        lastTime: lastTime,
      };
      dispatch(fetchLastTimeLog(request));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const evtSource = new EventSource(`${VITE_IPCA_RT}/class-log/${groupId}?token=${token}`);
    evtSource.onmessage = (event) => {
      if (event.data) {
        const rawData = JSON.parse(event.data);
        dispatch(pushLogs(processData(rawData)));
        scrollToBottom();
      }
    };
    return () => {
      evtSource.close();
      dispatch(clearAllGroupActivityLog());
    };
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const request: FetchLastTimeLogReq = {
        groupId: groupId,
        limit: LIMIT_LOG,
        lastTime: lastTime,
      };
      dispatch(fetchLastTimeLog(request));
    }
  }, [initialized]);

  useEffect(() => {
    const currentTableRef = tableRef.current;
    if (currentTableRef) {
      currentTableRef.addEventListener("scroll", handleScroll);
      return () => {
        currentTableRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [logs]);

  return (
    <div>
      <LogsTable logs={logs} tableRef={tableRef} loading={fetching} scrollToBottom={scrollToBottom}/>
    </div>
  );
}

export default GroupLogs;
