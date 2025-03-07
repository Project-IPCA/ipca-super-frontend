import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  IconButton,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { tabsValue } from "./constants";
import { GroupExercises } from "../groupExercises";
import GroupStudents from "../groupStudents/GroupStudents";
import { GroupLogs } from "../groupLogs";
import { useAppSelector } from "../../hooks/store";
import {
  getGroupExercise,
  getGroupExerciseStatus,
} from "../groupExercises/redux/groupExercisesSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../hooks/usePermission";
import { isAcceptedPermission } from "../../utils";
import { DASHBOARD_ADMIN, GROUP_ADMIN } from "../../constants/constants";
import { GroupDashboard } from "../groupDashboard";
import { getDashboardStatus } from "../dashboard/redux/DashboardSlice";
import { getGroupDashboardStatus } from "../groupDashboard/redux/groupDashboardSlice";
import { getProfileStatus } from "../profileForm/redux/profileFormSlice";
import { getGroupStudentsStatus } from "../groupStudents/redux/GroupStudentsSlice";
import { capitalize } from "lodash";

interface Props {
  groupId: string;
}

function GroupDetail({ groupId }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { permission } = usePermission();
  const defaultTab = searchParams.get("tab") || tabsValue.EXERCISES;
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const groupDetail = useAppSelector(getGroupExercise);
  const dashboardFetching = useAppSelector(getDashboardStatus);
  const groupDashboardFetching = useAppSelector(getGroupDashboardStatus);
  const groupExerciseFetching = useAppSelector(getGroupExerciseStatus);
  const userIdFetching = useAppSelector(getProfileStatus);
  const groupStudentFetching = useAppSelector(getGroupStudentsStatus);

  const isFetching =
    dashboardFetching || groupDashboardFetching || groupExerciseFetching;

  const getIsFetchingByTab = () => {
    switch (activeTab) {
      case tabsValue.OVERVIEW:
        return (
          dashboardFetching || groupDashboardFetching || groupExerciseFetching
        );
      case tabsValue.EXERCISES:
        return userIdFetching || groupStudentFetching || groupExerciseFetching;
      case tabsValue.STUDENTS:
        return groupStudentFetching || groupExerciseFetching;
      default:
        return;
    }
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && Object.values(tabsValue).includes(tab)) {
      setActiveTab(tab);
    } else {
      setSearchParams({ tab: tabsValue.EXERCISES }, { replace: true });
      setActiveTab(tabsValue.EXERCISES);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab }, { replace: true });
  };

  const TABS_MENU = [
    isAcceptedPermission(permission || [], [DASHBOARD_ADMIN])
      ? {
          label: t("feature.group_detail.tab.overview"),
          value: tabsValue.OVERVIEW,
          component: <GroupDashboard groupId={groupId} />,
        }
      : null,

    {
      label: t("feature.group_detail.tab.exercises"),
      value: tabsValue.EXERCISES,
      component: <GroupExercises groupId={groupId} />,
    },
    {
      label: t("feature.group_detail.tab.students"),
      value: tabsValue.STUDENTS,
      component: <GroupStudents groupId={groupId} />,
    },
    isAcceptedPermission(permission || [], [GROUP_ADMIN])
      ? {
          label: t("feature.group_detail.tab.logs"),
          value: tabsValue.ACTIVITY_LOGS,
          component: <GroupLogs groupId={groupId} />,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string; component: ReactNode }[];

  return (
    <>
      <div className="flex justify-start items-center pb-4 gap-x-2">
        <IconButton variant="text" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="w-5 h-5" />
        </IconButton>

        <div className="flex justify-start items-center gap-x-2">
          <Typography variant="h3">
            {t("feature.group_detail.title")}
          </Typography>
          {getIsFetchingByTab() ? (
            <Typography
              as="div"
              variant="h3"
              className="h-6 w-44 rounded-full bg-gray-300 "
            >
              &nbsp;
            </Typography>
          ) : (
            <Typography variant="h3">
              {groupDetail?.group_no || ""} (
              {capitalize(groupDetail?.language || "")})
            </Typography>
          )}
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
          }}
        >
          {TABS_MENU.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleTabChange(value)}
              className={activeTab === value ? "text-gray-900" : ""}
              disabled={isFetching}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {TABS_MENU.map(({ value, component }) => (
            <TabPanel key={value} value={value}>
              <div className="pt-8">{component}</div>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
}

export default GroupDetail;
