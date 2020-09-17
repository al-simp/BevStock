import React from "react";
import DashboardLists from "./stocktaking/DashboardLists";

const DashBoardStocktaking = ({ stocktake }) => {
  return (
    <div>
    <h6>Stocktaking</h6>
      <DashboardLists stocktake={stocktake} />
    </div>
  );
};

export default DashBoardStocktaking;
