import React from "react";

import PredictedOrderModal from "./PredictedOrderModal";
// component that compares average weekly sales with stock on site, shows an alert if product is likely to run out, or is out of stock completely
const ProductAlerts = ({ levels }) => {
  return (
    <div>
      <PredictedOrderModal levels={levels} />

      <h6 className="mb-3">Low Product Alerts</h6>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Product</th>
            <th>Avg Weekly Sales</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
        {/* eslint-disable-next-line */}
          {levels.map((item) => {
            if (item.avg_weekly_sales > Number(item.sum)) {
              return (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>{Number(item.avg_weekly_sales).toFixed(2)}</td>
                  {Number(item.sum) === 0 ? (
                    <td>
                      <span className="badge badge-pill badge-danger">
                        Out Of Stock
                      </span>
                    </td>
                  ) : (
                    <td>
                      <span className="badge badge-pill badge-warning">
                        Running Low: {item.sum}
                      </span>
                    </td>
                  )}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductAlerts;
