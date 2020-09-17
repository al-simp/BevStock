import React, { useEffect, useState } from "react";
import _ from "lodash";
import CountModal from "./CountModal";

const Bottle = (props) => {
  const [bottle, setBottle] = useState({});

  const {
    result,
    hasScanned,
    hasResult,
    setPairBool,
    setProductsChange,
    setQuantity,
  } = props;
  const stocktake = localStorage.getItem("stocktake");

  const getBottle = async () => {
    if (result !== null && !hasResult && !hasScanned) {
      console.log(
        "result",
        result,
        "scanned",
        hasScanned,
        "hasResult",
        hasResult
      );
      setPairBool("hasScanned", true);
      try {
        const body = { result, stocktake };
        const response = await fetch(
          "http://localhost:5000/stocktake/productfromid",
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const parseData = await response.json();

        console.log(parseData.length);
        setBottle(parseData[0]);
        console.log(parseData);
        setPairBool("hasResult", true);
      } catch (err) {
        console.error(err.message);
        setPairBool("hasScanned", false);
      }
    }
  };

  useEffect(() => {
    if (!hasResult) {
      getBottle();
    }
  }, [result, bottle]);

  return !_.isEmpty(bottle) ? (
    <div>
      <CountModal
        product={bottle}
        stocktakeid={stocktake}
        setProductsChange={setProductsChange}
        setQuantity={setQuantity}
      />
    </div>
  ) : (
    <h1>No bottle found</h1>
  );
};

export default Bottle;
