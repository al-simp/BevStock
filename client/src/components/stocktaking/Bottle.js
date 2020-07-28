import React, { useEffect, useState } from "react";
import _ from "lodash";

const Bottle = (props) => {
  const [bottle, setBottle] = useState({});

  const { result, hasScanned, hasResult, setPairBool } = props;
  

  const getBottle = async () => {
    
    if (result !== null && !hasResult && !hasScanned) {
      console.log("result", result, "scanned", hasScanned, "hasResult", hasResult)
        setPairBool("hasScanned", true);
      try {
        const response = await fetch(
          `http://localhost:5000/products/${result}`,
          {
            method: "GET",
            headers: { token: localStorage.token },
          }
        );

        const parseData = await response.json();
        
        console.log(parseData.length);
        setBottle(parseData);
        console.log(parseData);
        setPairBool("hasResult", true);
        console.log(bottle);
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

  return !_.isEmpty(bottle) ? <h1>{bottle[0].product_name}</h1> : <h1>No bottle found</h1>
};

export default Bottle;
