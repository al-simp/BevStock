import React, { Fragment, useState, useEffect } from "react";

const InventoryBreakdown = ({ product_id, id, name }) => {
    const [breakdown, setBreakdown] = useState([]);
  const product = product_id;


  const getInventoryBreakdown = async () => {
    try {
      const body = { id, product };
      const response = await fetch(
        "https://localhost:5000/inventory/breakdown",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await response.json();
      setBreakdown(parseRes);
      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };


  useEffect(() => {
    getInventoryBreakdown();
  }, []);

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-info"
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
