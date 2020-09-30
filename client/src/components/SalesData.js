import React, { useEffect, useState } from "react";
import PdfSales from "./PdfSales";

// component to show sales data, either for the previous week or all time. 
const SalesData = () => {
  const [search, setSearch] = useState("");
  const [isAllTime, setIsAllTime] = useState([]);
  const [sales, setSales] = useState([]);

  // method for week sales
  const showThisWeek = () => {
    getTopSellers();
    setIsAllTime(false);
  };

  // method for all time sales. 
  const showAllTime = () => {
    setIsAllTime(true);
    getTopSellersAllTime();
  };

  //get top selling products week
  const getTopSellers = async () => {
    try {
      const response = await fetch(
        `/routes/inventory/topsellers/all/${localStorage.getItem(
          "laststocktake"
        )}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setSales(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };

  //get top selling products all time
  const getTopSellersAllTime = async () => {
    try {
      const response = await fetch(`/routes/inventory/alltimetopsellers/all`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setSales(parseRes);
    } catch (error) {
      console.log(error.message);
    }
  };

  // filter to allow the user to search for a specific product. 
  const filteredSales = sales.filter((item) => {
    return item.product_name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    showThisWeek();
    // eslint-disable-next-line
  }, []);

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <h1>
        Sales Data{" "}
        <div
          className="btn-group btn-group-sm float-right"
          role="group"
          aria-label="Basic example"
        >
          <PdfSales sales={sales} isAllTime={isAllTime} />
          <button
            type="button"
            onClick={showThisWeek}
            className={
              !isAllTime ? "btn btn-primary active" : "btn btn-primary"
            }
          >
            This Week
          </button>
          <button
            type="button"
            onClick={showAllTime}
            className={isAllTime ? "btn btn-primary active" : "btn btn-primary"}
          >
            All Time
          </button>
        </div>
      </h1>
      <div className="row">
        <div className="col-9">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-2"></div>
      </div>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Product</th>
            <th>Sales (Units)</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((product) => (
            <tr key={product.product_name}>
              <td>{product.product_name}</td>
              <td>{isAllTime ? product.sum : product.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default SalesData;
