interface Props {
  groupId: string;
}

import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  fetchTotalStudents,
  FetchTotalStudentsRequest,
  fetchTotalSubmissions,
  FetchTotalRequest,
  getDashboard,
  fetchStatsScoreChapter,
  fetchStatsSubmissionTime,
  getDashboardError,
  clearDashboardError,
} from "../dashboard/redux/DashboardSlice";
import StatsCard from "../dashboard/components/StatsCard";
import AvgScoreChapterChart from "../dashboard/components/AvgScoreChapterChart";
import SubmissionChart from "../dashboard/components/SubmissionChart";
import {
  clearGroupDashboardError,
  fetchStudentRanking,
  getGroupDashboard,
  getGroupDashboardError,
} from "./redux/groupDashboardSlice";
import { showToast } from "../../utils/toast";
import StudentRankingList from "./components/StudentRankingList";
import {
  getOnlineStudents,
  setOnlineStudents,
  VITE_IPCA_RT,
} from "../groupStudents/redux/GroupStudentsSlice";

function GroupDashboard({ groupId }: Props) {
  const dispatch = useAppDispatch();
  const error = useAppSelector(getGroupDashboardError);
  const dashboardError = useAppSelector(getDashboardError);
  const onlineStudent = useAppSelector(getOnlineStudents);
  const {
    totalStudents,
    totalSubmissions,
    statsScoreChapter,
    statsSubmissionTime,
  } = useAppSelector(getDashboard);

  const { studentRanking } = useAppSelector(getGroupDashboard);

  const initialized = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!initialized.current && groupId) {
      initialized.current = true;
      const stuRequest: FetchTotalStudentsRequest = {
        groupId: groupId,
        status: null,
        year: null,
      };
      dispatch(fetchTotalStudents(stuRequest));
      const basicRequest: FetchTotalRequest = {
        groupId: groupId,
        year: null,
      };
      dispatch(fetchTotalSubmissions(basicRequest));
      dispatch(fetchStatsScoreChapter(basicRequest));
      dispatch(fetchStatsSubmissionTime(basicRequest));
      dispatch(fetchStudentRanking(groupId));
    }
    return () => {};
  }, [dispatch, initialized, groupId]);

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const evtSource = new EventSource(
      `${VITE_IPCA_RT}/online-students/${groupId}?token=${token}`,
    );
    evtSource.onmessage = (event) => {
      if (event.data) {
        const rawData = JSON.parse(event.data);
        dispatch(setOnlineStudents(rawData));
      }
    };
    return () => {
      evtSource.close();
    };
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
      });
    }
    if (dashboardError) {
      showToast({
        variant: "error",
        message: dashboardError.error,
      });
    }
    dispatch(clearGroupDashboardError());
    dispatch(clearDashboardError());
  }, [error, dashboardError]);

  const statsData = [
    {
      title: t("feature.group_dashboard.card.students"),
      icon: <UserIcon />,
      value: totalStudents?.total_students,
    },
    {
      title: t("feature.group_dashboard.card.online"),
      icon: <AcademicCapIcon />,
      value: onlineStudent.length,
    },
    {
      title: t("feature.group_dashboard.card.offline"),
      icon: <UserGroupIcon />,
      value: totalStudents.total_students - onlineStudent.length,
    },
    {
      title: t("feature.group_dashboard.card.submission"),
      icon: <CheckCircleIcon />,
      value: totalSubmissions?.total_submissions,
    },
  ];

  return (
    <>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1  gap-6 pb-6">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={stat.icon}
            label={stat.title}
            value={stat.value as number}
          />
        ))}

        <div className="lg:col-span-3 md:col-span-2 col-span-1">
          <AvgScoreChapterChart statsScoreChapter={statsScoreChapter} />
        </div>
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <StudentRankingList studentRanking={studentRanking} />
        </div>
        <div className="lg:col-span-4 md:col-span-2 col-span-1">
          <SubmissionChart statsSubmissionTime={statsSubmissionTime} />
        </div>
      </div>
    </>
  );
}

export default GroupDashboard;
