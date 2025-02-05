import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

interface Props {
  statsScoreChapter: number[];
}

const AvgScoreChapterChart = ({ statsScoreChapter }: Props) => {
  const { t } = useTranslation();
  const chartConfig = {
    type: "bar",
    height: 300,
    series: [
      {
        name: t("feature.dashboard.chart.avg_score"),
        data: statsScoreChapter,
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
        categories: Array.from(
          { length: statsScoreChapter.length },
          (_, index: number) => [
            t("feature.dashboard.chart.ch"),
            `${index + 1}`,
          ],
        ),
      },
      yaxis: {
        max: 10,
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
          {t("feature.dashboard.chart.avg_score_ch")}
        </Typography>
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default AvgScoreChapterChart;
