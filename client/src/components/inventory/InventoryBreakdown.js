import React, { Fragment, useState, useEffect } from "react";

//component to display a model that breaks doen where stock is located, by area
const InventoryBreakdown = ({ product_id, id, name }) => {
    const [breakdown, setBreakdown] = useState([]);
  const product = product_id;

//get the inventory breakdown
  const getInventoryBreakdown = async () => {
    try {
      const body = { id, product };
      const response = await fetch(
        "/routes/inventory/breakdown",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await response.json();
      setBreakdown(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };


  useEffect(() => {
    getInventoryBreakdown();
    // eslint-disable-next-line 
  }, []);

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-sm btn-info"
        data-toggle="modal"
        data-target={`#id${product_id}`}
      >
        View Breakdown
      </button>
      <div className="modal" id={`id${product_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{name}</h4>
            </div>
            <div className="modal-body"></div>
            <table>
            <thead>
                <tr>
                    <th>Area</th>
                    <th>Quantity</th>
                </tr>
            </thead>
    <tbody>
        {breakdown.map((list) => (
            <tr key={list.stocklist_name}>
            <td>{list.stocklist_name}</td>
            <td>{list.sum}</td>
            </tr>
        ))}
    </tbody>
    </table>
            <div className="modal-footer">
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

export default InventoryBreakdown;
