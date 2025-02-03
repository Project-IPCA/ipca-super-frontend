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

function Dashboard() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date(Date.now()).getFullYear().toString(),
  );
  const { t } = useTranslation();
  const myGroups = useAppSelector(getMyGroups);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchMyGroups({ page: 1, year: "All" }));
    }
    return () => {};
  }, [dispatch]);

  const yearOptions = useMemo(
    () => [
      ...[...(myGroups.filters.year || [])]
        .sort((a, b) => b - a)
        .map((year) => year.toString()),
    ],
    [myGroups.filters.year],
  );

  useEffect(() => {
    if (myGroups.filters.year) {
      const latestYear = Math.max(...myGroups.filters.year);
      setSelectedYear(latestYear.toString());
    }
  }, [myGroups]);

  const handleYearChange = (value: string | undefined) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  const statsData = [
    {
      title: t("feature.dashboard.card.students"),
      icon: <UserIcon />,
      value: 685,
    },
    {
      title: t("feature.dashboard.card.groups"),
      icon: <AcademicCapIcon />,
      value: 21,
    },
    {
      title: t("feature.dashboard.card.staffs"),
      icon: <UserGroupIcon />,
      value: 45,
    },
    {
      title: t("feature.dashboard.card.submission"),
      icon: <CheckCircleIcon />,
      value: 3546,
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
          <StatsCard icon={stat.icon} label={stat.title} value={stat.value} />
        ))}

        <div className="col-span-3">
          <AvgScoreChapterChart />
        </div>
        <div className="col-span-1">
          <AvgScoreDeptList />
        </div>
        <div className="col-span-3">
          <SubmissionChart />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
