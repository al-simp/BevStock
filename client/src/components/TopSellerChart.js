import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import _ from "lodash";

const TopSellerChart = ({
  weekData,
  weekLabels,
  allTimeData,
  allTimeLabels,
}) => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isAllTime, setIsAllTime] = useState([]);

  const showThisWeek = () => {
    setData(weekData);
    setLabels(weekLabels);
    setIsAllTime(false);
  };

  const showAllTime = () => {
    setData(allTimeData);
    setLabels(allTimeLabels);
    setIsAllTime(true);
  }

  useEffect(() => {
    showThisWeek();
  }, [])

  return (
    <div>
      <div
        className="btn-group btn-group-sm float-right"
        role="group"
        aria-label="Basic example"
      >
        <button type="button" onClick={showThisWeek} className={!isAllTime ? ("btn btn-primary active") : ("btn btn-primary")}>
          This Week
        </button>
        <button type="button" onClick={showAllTime} className={isAllTime ? ("btn btn-primary active") : ("btn btn-primary")}>
          All Time
        </button>
      </div>
      <h6>Top Sellers</h6>
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        options={{
          legend: {
            display: false,
          },
          title: {
            display: false,
            position: "left",
            text: "Top Selling Products",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default TopSellerChart;
