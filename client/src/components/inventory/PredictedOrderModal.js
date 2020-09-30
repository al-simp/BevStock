import React, { Fragment } from "react";
import PDFPredictedOrder from "./PDFPredictedOrder";
import _ from "lodash";

// modal component that displays a predicted order based on previous consumption
const PredictedOrderModal = ({ levels }) => {
  
  // determine items that will run out in the coming week using a filter
  const filteredItems = levels.filter(function (el) {
    return el.sum - el.avg_weekly_sales < 0;
  });

  // map through filtered items, add the amount of stock needed for a week. 
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
                      <td>{Number(item.quantity).toFixed(0)}</td>
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
