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
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import { tabsValue } from "./constants";
import { GroupExercises } from "../groupExercises";
import GroupStudents from "../groupStudents/GroupStudents";
import { GroupLogs } from "../groupLogs";
import { useAppSelector } from "../../hooks/store";
import { getGroupExercise } from "../groupExercises/redux/groupExercisesSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../hooks/usePermission";
import { isAcceptedPermission } from "../../utils";
import { GROUP_ADMIN } from "../../constants/constants";
import { GroupDashboard } from "../groupDashboard";

interface Props {
  groupId: string;
}

function GroupDetail({ groupId }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permission } = usePermission();
  const groupDetail = useAppSelector(getGroupExercise);
  const [activeTab, setActiveTab] = useState<string>(tabsValue.OVERVIEW);

  const TABS_MENU = [
    isAcceptedPermission(permission || [], [GROUP_ADMIN])
      ? {
          label: t("feature.group_detail.tab.overview"),
          value: tabsValue.ACTIVITY_LOGS,
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
          value: tabsValue.OVERVIEW,
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
        <Typography variant="h3">
          {t("feature.group_detail.title")} {groupDetail?.group_no}
        </Typography>
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
              onClick={() => setActiveTab(value)}
              className={activeTab === value ? "text-gray-900" : ""}
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
