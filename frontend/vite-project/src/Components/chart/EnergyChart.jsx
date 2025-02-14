import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const EnergyChart = ({ data, chartType }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: data.map((item) => item.timestamp),
        datasets: [
          {
            label: "Energy Consumption",
            data: data.map((item) => item.measurementValue),
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, chartType]);

  return (
    <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%", maxHeight: "100%" }}
      ></canvas>
    </div>
  );
};

export default EnergyChart;
