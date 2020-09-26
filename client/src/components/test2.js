import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import _ from "lodash";

const Test2 = () => {
  const [products, setProducts] = useState([]);
  const prevStocktake = localStorage.getItem("secondlaststocktake");
  const currentStocktake = localStorage.getItem("laststocktake");
  const [sales, setSales] = useState([]);
  const [data, setData] = useState();
  const [labels, setLabels] = useState([]);
  const [productsChange, setProductsChange] = useState([]);

  async function getProducts() {
    try {
      const response = await fetch(
        "https://localhost:5000/products/get/distinct",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await response.json();
      setProducts(parseRes);
      setProductsChange(true);
    } catch (error) {
      console.error(error.message);
    }
  }
  const writeSales = (product_id, sales, stocktake) => {
  try {
      const body = { product_id, sales, stocktake };
      fetch("https://localhost:5000/inventory/writesales", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  const getSalesNumbers = async (products) => {
    var promises = products.map((product) => {
      return getSalesData(product.product_id);
    });
    promises.forEach((promise) => {
      promise.then((result) => {
        writeSales(result.product_id, result.sales, currentStocktake);
      });
    });
  };

  const getSalesData = async (product) => {
    try {
      const body = { prevStocktake, currentStocktake, product };
      const response = await fetch(`https://localhost:5000/inventory/sales`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProducts();
    if (!_.isEmpty(products)) {
      Promise.all(products)
        .then(getSalesNumbers(products))
        .then(
          sales.forEach((sale) => {
            console.log(sale);
          })
        )
        .then(console.log(labels));
      Promise.all(sales).then(
        sales.forEach((sale) => {
          console.log(sale);
        })
      );
    }
  }, [productsChange]);

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      TEST2
      <button onClick={(e) => writeSales(6, 0, currentStocktake)}>CLICK</button>
    </main>
  );
};

export default Test2;
