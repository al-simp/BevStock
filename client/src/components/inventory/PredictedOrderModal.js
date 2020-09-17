import React, { Fragment, useState, useEffect } from "react";
import PDFPredictedOrder from "./PDFPredictedOrder";
import _ from "lodash";

const PredictedOrderModal = ({ levels }) => {
  const filteredItems = levels.filter(function (el) {
    return el.sum - el.avg_weekly_sales < 0;
  });

  const predictedOrder = filteredItems.map((item) => {
    return {
      id: item.product_id,
      name: item.product_name,
      size: item.product_size,
      category: item.product_category,
      quantity:
        Math.abs(Number(item.sum - item.avg_weekly_sales)) +
        item.avg_weekly_sales,
    };
  });

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-primary btn-sm float-right mb-2"
        data-toggle="modal"
        data-target="#predictedOrder"
      >
        View Predicted Order
      </button>

      <div className="modal" id="predictedOrder">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Predicted Order</h4>
            </div>
            <div className="modal-body"></div>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Category</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {predictedOrder.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="modal-footer">
              {_.isEmpty(predictedOrder) ? null : (
                <PDFPredictedOrder levels={predictedOrder} />
              )}
              <button className="btn btn-success" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PredictedOrderModal;
