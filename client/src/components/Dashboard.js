import React, { Fragment, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import TopSellerChart from "../components/TopSellerChart";
import ProductAlerts from "../components/inventory/ProductAlerts";
import DashBoardStocktaking from "./DashboardStocktaking";
import StockRecords from "./inventory/StockRecords";
import _ from "lodash";
import "../dashboard.css";

const Dashboard = ({ setAuth, name }) => {
  const [stocktake, setStocktake] = useState(false);
  const [predictedOrder, setPredictedOrder] = useState([]);
  const [levels, setLevels] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [allTimeLabels, setAllTimeLabels] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);

  //get id of stocktake if stocktake in progress
  const stockId = Number(localStorage.getItem("stocktake"));

  //if stock ID exists, set stocktake to true.
  const Stocktake = () => {
    if (stockId !== 0) {
      setStocktake(true);
    }
  };

  const getPredictedOrder = (levels) => {
    setPredictedOrder(
      levels.map((item) => {
        return {
          name: item.product_name,
          predictedOrder: Number(
            Number(item.sum) - item.avg_weekly_sales + item.par_level
          ),
        };
      })
    );
  };

  //find levels with pars for product alerts components.
  const getLevels = async () => {
    try {
      const response = await fetch(
        `/inventory/levels/${localStorage.getItem("laststocktake")}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setLevels(parseRes);
    } catch (err) {
      console.log(err.message);
    }
  };

  //get top selling products for chart (week)
  const getTopSellers = async () => {
    try {
      const response = await fetch(
        `/inventory/topsellers/${localStorage.getItem("laststocktake")}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setGraphLabels(
        parseRes.map((product) => {
          return product.product_name;
        })
      );
      setGraphData(
        parseRes.map((product) => {
          return product.sales;
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //get top selling products for chart (all time)
  const getTopSellersAllTime = async () => {
    try {
      const response = await fetch(`/inventory/alltimetopsellers/`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setAllTimeLabels(
        parseRes.map((product) => {
          return product.product_name;
        })
      );
      setAllTimeData(
        parseRes.map((product) => {
          return product.sum;
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPermission = async () => {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  };

  //get userType for conditional render
  const userType = localStorage.getItem("role");

  useEffect(() => {
    getLevels();
    getTopSellers();
    Stocktake();
    getTopSellersAllTime();
  }, []);

  return userType === "User" ? (
    <Redirect to="/userdashboard" />
  ) : (
    <Fragment>
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">Welcome back, {name}!</h1>
          <div className="btn-toolbar mb-2 mb-md-0"></div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {_.isEmpty(graphLabels) || _.isEmpty(graphData) ? (
              <div>Loading</div>
            ) : (
              <TopSellerChart
                weekData={graphData}
                weekLabels={graphLabels}
                allTimeData={allTimeData}
                allTimeLabels={allTimeLabels}
              />
            )}
          </div>
          <div className="col-md-6">
            {_.isEmpty(levels) ? (
              <div>Loading...</div>
            ) : (
              <ProductAlerts levels={levels} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <StockRecords />
          </div>
          <div className="col-md-6">
            <DashBoardStocktaking stocktake={stocktake} />
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Dashboard;
