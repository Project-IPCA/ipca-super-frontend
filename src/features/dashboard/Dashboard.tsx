import {
  Card,
  CardBody,
  CardFooter,
  Option,
  Typography,
} from "@material-tailwind/react";
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
      <div className="w-full grid grid-cols-9 gap-6 pb-6">
        <div className="col-span-2">
          <StatsCard icon={<UserIcon />} label="Total students" value="546" />
        </div>
        <div className="col-span-2">
          <StatsCard
            icon={<AcademicCapIcon />}
            label="Total groups"
            value="21"
          />
        </div>
        <div className="col-span-2">
          <StatsCard icon={<UserGroupIcon />} label="Total staffs" value="45" />
        </div>
        <div className="col-span-3">
          {/*

          <StatsCard
        icon={<CheckCircleIcon />}
        label="Total submissions"
        value="1459"
        />
          */}
          <Card color="gray" variant="gradient" className="h-full">
            <CardBody className="h-full flex flex-col justify-between">
              <div>
                <Typography variant="h6">Upcoming </Typography>
                <Typography variant="h6">Class Schedule</Typography>
              </div>
              <div className="flex items-center gap-x-1">
                <Typography>Today at 13:30 - </Typography>
                <Typography className="underline decoration-[0.5px] cursor-pointer underline-offset-2">
                  Group 118
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-6">
          <AvgScoreChapterChart />
        </div>
        <div className="col-span-3">
          <AvgScoreDeptList />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
