import React, { Fragment, useEffect, useState } from "react";
import _ from "lodash";
import CountModal from "./CountModal";

// component is required for QR scan function, when the QR scanner detects a valid QR code it will display the modal for counting that product.
const Bottle = (props) => {
  const [product, setProduct] = useState({});

  const {
    result,
    hasResult,
    hasScanned,
    setPairBool,
    setQuantity,
  } = props;
  const stocktake = localStorage.getItem("stocktake");

  // fetch the product from the relevant id
  const getBottle = async () => {
    // only make the API call if a result has been found
    if (result !== null && !hasResult && !hasScanned) {
      setPairBool("hasScanned", true);
      try {
        const body = { result, stocktake };
        const response = await fetch("/stocktake/productfromid", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        });

        const parseData = await response.json();

        setProduct(parseData[0]);
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
    // eslint-disable-next-line
  }, [result]);

  return !_.isEmpty(product) ? (
    <Fragment>
      <div className="row">
        <br />
        <CountModal
          product={product}
          stocktakeid={stocktake}
          setQuantity={setQuantity}
        />
      </div>
    </Fragment>
  ) : (
    <h4>No bottle found </h4>
  );
};

export default Bottle;
