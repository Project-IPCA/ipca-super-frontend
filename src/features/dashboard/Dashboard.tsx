import { Option, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { AsyncSelect } from "../../components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  fetchMyGroups,
  getMyGroups,
} from "../myGroupsList/redux/myGroupListSlice";
import StatsCard from "./components/StatsCard";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import AvgScoreChapterChart from "./components/AvgScoreChapterChart";
import AvgScoreDeptList from "./components/AvgScoreDeptList";
import SubmissionChart from "./components/SubmissionChart";
import {
  fetchTotalStaffs,
  fetchTotalStudents,
  FetchTotalStudentsRequest,
  fetchTotalSubmissions,
  FetchTotalRequest,
  getDashboard,
  fetchTotalGroups,
  fetchStatsScoreChapter,
  fetchStatsSubmissionTime,
} from "./redux/DashboardSlice";

function Dashboard() {
  const dispatch = useAppDispatch();
  const {
    totalStudents,
    totalStaffs,
    totalSubmissions,
    totalGroups,
    statsScoreChapter,
    statsSubmissionTime,
  } = useAppSelector(getDashboard);
  const initialized = useRef(false);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const { t } = useTranslation();
  const myGroups = useAppSelector(getMyGroups);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchMyGroups({ page: 1, year: "All" }));
      const year = selectedYear === "All" ? null : selectedYear;
      const stuRequest: FetchTotalStudentsRequest = {
        groupId: null,
        status: null,
        year: year,
      };
      dispatch(fetchTotalStudents(stuRequest));
      const basicRequest: FetchTotalRequest = {
        groupId: null,
        year: year,
      };
      dispatch(fetchTotalSubmissions(basicRequest));
      dispatch(fetchTotalGroups(year));
      dispatch(fetchStatsScoreChapter(basicRequest));
      dispatch(fetchTotalStaffs(null));
      dispatch(fetchStatsSubmissionTime(basicRequest));
    }
    return () => {};
  }, [dispatch, initialized]);

  const yearOptions = useMemo(
    () => [
      "All",
      ...[...(myGroups.filters.year || [])]
        .sort((a, b) => b - a)
        .map((year) => year.toString()),
    ],
    [myGroups.filters.year],
  );

  const handleYearChange = (value: string | undefined) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      const year = selectedYear === "All" ? null : selectedYear;
      const stuRequest: FetchTotalStudentsRequest = {
        groupId: null,
        status: null,
        year: year,
      };
      dispatch(fetchTotalStudents(stuRequest));
      const basicRequest: FetchTotalRequest = {
        groupId: null,
        year: year,
      };
      dispatch(fetchTotalSubmissions(basicRequest));
      dispatch(fetchTotalGroups(year));
      dispatch(fetchStatsScoreChapter(basicRequest));
      dispatch(fetchTotalStaffs(null));
      dispatch(fetchStatsSubmissionTime(basicRequest));
    }
  }, [selectedYear, dispatch]);

  const statsData = [
    {
      title: t("feature.dashboard.card.students"),
      icon: <UserIcon />,
      value: totalStudents?.total_students,
    },
    {
      title: t("feature.dashboard.card.groups"),
      icon: <AcademicCapIcon />,
      value: totalGroups?.total_groups,
    },
    {
      title: t("feature.dashboard.card.staffs"),
      icon: <UserGroupIcon />,
      value: totalStaffs?.total_staffs,
    },
    {
      title: t("feature.dashboard.card.submission"),
      icon: <CheckCircleIcon />,
      value: totalSubmissions?.total_submissions,
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center pb-4 ">
        <Typography variant="h3">{t("feature.dashboard.title")}</Typography>
        <div className="w-40">
          <AsyncSelect
            label={t("feature.my_groups_list.filter.year")}
            value={selectedYear ? selectedYear : "All"}
            onChange={handleYearChange}
            containerProps={{
              className: "!min-w-16 ",
            }}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </AsyncSelect>
        </div>
      </div>
      <div className="w-full grid grid-cols-4 gap-6 pb-6">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={stat.icon}
            label={stat.title}
            value={stat.value as number}
          />
        ))}

        <div className="col-span-3">
          <AvgScoreChapterChart />
        </div>
        <div className="col-span-1">
          <AvgScoreDeptList />
        </div>
        <div className="col-span-4">
          <SubmissionChart statsSubmissionTime={statsSubmissionTime} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
