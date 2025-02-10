import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import {
  getDashboardStatus,
  StatsSubmissionTime,
} from "../redux/DashboardSlice";
import { useMemo } from "react";
import { useAppSelector } from "../../../hooks/store";
import { AreaChartSkeleton } from "../../../components";

interface Props {
  statsSubmissionTime: StatsSubmissionTime;
}

function SubmissionChart({ statsSubmissionTime }: Props) {
  const { t } = useTranslation();
  const isFetching = useAppSelector(getDashboardStatus);

  const submissionList = useMemo(() => {
    return (
      statsSubmissionTime &&
      statsSubmissionTime?.date_list.map((date) => date.slice(5))
    );
  }, [statsSubmissionTime]);

  const chartConfig = {
    type: "area",
    height: 300,
    series: [
      {
        name: t("feature.dashboard.chart.submission_time"),
        data: statsSubmissionTime?.submissions_list,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: submissionList,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  } as { options: ApexOptions };

  return (
    <Card className="border-[1px]">
      <CardBody>
        {isFetching ? (
          <Typography
            as="div"
            variant="h5"
            className="h-4 w-60 rounded-full bg-gray-300 mb-3"
          >
            &nbsp;
          </Typography>
        ) : (
          <Typography variant="h5" color="blue-gray">
            {t("feature.dashboard.chart.submission")}
          </Typography>
        )}
        {isFetching ? <AreaChartSkeleton /> : <Chart {...chartConfig} />}
      </CardBody>
    </Card>
  );
}

export default SubmissionChart;
