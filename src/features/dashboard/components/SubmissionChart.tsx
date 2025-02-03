import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function SubmissionChart() {
  const { t } = useTranslation();
  const chartConfig = {
    type: "area",
    height: 300,
    series: [
      {
        name: t("feature.dashboard.chart.submission_time"),
        data: Array.from(
          { length: 7 },
          () => Math.floor(Math.random() * 1000) + 1,
        ),
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
        categories: [
          "08.00",
          "10.00",
          "12.00",
          "14.00",
          "16.00",
          "18.00",
          "20.00",
        ],
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
        <Typography variant="h5" color="blue-gray">
          {t("feature.dashboard.chart.submission")}
        </Typography>
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}

export default SubmissionChart;
