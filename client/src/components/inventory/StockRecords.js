import React, { useEffect, useState } from "react";
import Moment from "react-moment";

// component displayed on dashboard that shows the previous stocktake records.
const StockRecords = () => {
  const [stocktakes, setStocktakes] = useState([]);
  const getStoctakes = async () => {
    try {
      const response = await fetch("/routes/inventory/stocktakes", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setStocktakes(parseRes);
    } catch (error) {}
  };

  useEffect(() => {
    getStoctakes();
  }, []);

  return (
    <div>
      <h6>Previous Stocktake Records</h6>
      <div className="table-responsive-sm">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Stocktake</th>
              <th>ID</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {stocktakes.map((stocktake) => (
              <tr key={stocktake.stocktake_id}>
                <td>
                  <Moment date={stocktake.stocktake_date} format="DD/MM/YYYY" />
                </td>
                <td>{stocktake.stocktake_id}</td>
                <td>
                  <a
                    className="badge badge-pill badge-primary"
                    href={`/stocktakerecord/${stocktake.stocktake_id}`}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StockRecords;
