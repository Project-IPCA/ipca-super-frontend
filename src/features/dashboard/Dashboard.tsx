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
  fetchStatsDeptScore,
  getDashboardError,
  clearDashboardError,
} from "./redux/DashboardSlice";
import { showToast } from "../../utils/toast";
import { LANG_LIST, PYTHON_LANG } from "../../constants/constants";

function Dashboard() {
  const dispatch = useAppDispatch();
  const {
    totalStudents,
    totalStaffs,
    totalSubmissions,
    totalGroups,
    statsScoreChapter,
    statsSubmissionTime,
    statsDeptScore,
  } = useAppSelector(getDashboard);
  const initialized = useRef(false);
  const error = useAppSelector(getDashboardError);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectLanguage, setSelectLanguage] = useState<string>(PYTHON_LANG);
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
        language: selectLanguage,
      };
      dispatch(fetchTotalStudents(stuRequest));
      const basicRequest: FetchTotalRequest = {
        groupId: null,
        year: year,
        language: selectLanguage,
      };
      dispatch(fetchTotalSubmissions(basicRequest));
      dispatch(fetchTotalGroups(basicRequest));
      dispatch(fetchStatsScoreChapter(basicRequest));
      dispatch(fetchTotalStaffs(null));
      dispatch(fetchStatsSubmissionTime(basicRequest));
      dispatch(fetchStatsDeptScore(basicRequest));
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
    [myGroups.filters.year]
  );

  const handleYearChange = (value: string | undefined) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  const handleLanguageChange = (value: string | undefined) => {
    if (value) {
      setSelectLanguage(value);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      const year = selectedYear === "All" ? null : selectedYear;
      const stuRequest: FetchTotalStudentsRequest = {
        groupId: null,
        status: null,
        year: year,
        language: selectLanguage,
      };
      dispatch(fetchTotalStudents(stuRequest));
      const basicRequest: FetchTotalRequest = {
        groupId: null,
        year: year,
        language: selectLanguage,
      };
      dispatch(fetchTotalSubmissions(basicRequest));
      dispatch(fetchTotalGroups(basicRequest));
      dispatch(fetchStatsScoreChapter(basicRequest));
      dispatch(fetchTotalStaffs(null));
      dispatch(fetchStatsSubmissionTime(basicRequest));
      dispatch(fetchStatsDeptScore(basicRequest));
    }
  }, [selectedYear, selectLanguage, dispatch]);

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
      });
    }
    dispatch(clearDashboardError());
  }, [error]);

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
      <div className="md:flex justify-between items-center pb-4 ">
        <Typography variant="h3">{t("feature.dashboard.title")}</Typography>
        <div className="grid grid-cols-2 gap-2">
          <div className="md:w-40 w-full">
            <AsyncSelect
              label={t("feature.my_groups_list.filter.language")}
              value={selectLanguage}
              onChange={handleLanguageChange}
              containerProps={{
                className: "!min-w-16 ",
              }}
            >
              {LANG_LIST.map((lang) => (
                <Option key={lang} value={lang}>
                  {lang}
                </Option>
              ))}
            </AsyncSelect>
          </div>
          <div className="md:w-40 w-full">
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
      </div>
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
          <AvgScoreDeptList statsDeptScore={statsDeptScore} />
        </div>
        <div className="lg:col-span-4 md:col-span-2 col-span-1">
          <SubmissionChart statsSubmissionTime={statsSubmissionTime} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
