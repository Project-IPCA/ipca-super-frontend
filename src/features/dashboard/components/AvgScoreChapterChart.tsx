import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const AvgScoreChapterChart = () => {
  const chartConfig = {
    type: "bar",
    height: 550,
    series: [
      {
        name: "Avg. Score",
        data: Array.from(
          { length: 17 },
          () => Math.floor(Math.random() * 10) + 1,
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
        categories: Array.from({ length: 17 }, (_, index: number) => [
          "Ch.",
          `${index + 1}`,
        ]),
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
        <Typography variant="h6">
          Statistics of average score by chapter
        </Typography>
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default AvgScoreChapterChart;
