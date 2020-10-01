import React, { useState, useEffect, Fragment } from "react";
import Moment from "react-moment";
import moment from "moment";

import { toast } from "react-toastify";

// Parent component of showlists, takes care of stocktake starting and ending.
import ShowLists from "./ShowLists";

const StocktakeLists = () => {
  const [stocktake, setStocktake] = useState(false);
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);
  const [products, setProducts] = useState([]);
  const [allCounted, setAllCounted] = useState(false);
  const [distinctProducts, setDistinctProducts] = useState([]);
  const [stocktakeDue, setStocktakeDue] = useState(false);
  const currentStocktake = localStorage.getItem("laststocktake");
  const dateString = Date().toString();

  const stocktake_id = localStorage.getItem("stocktake");

  // check if a stocktake is in progress. 
  const checkStocktake = () => {
    if (stocktake_id !== null) {
      setStocktake(true);
    } else {
      var now = moment();
      var date = moment(localStorage.getItem("nextstocktakedate"));
      if (now < date) {
        setStocktakeDue(true);
      } else {
        setStocktakeDue(false);
      }
    }
  };

  // get the products. 
  const getProducts = async (id) => {
    try {
      const productsResponse = await fetch("/stocktake/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const productsResult = await productsResponse.json();
      setProducts(productsResult.rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  //create a new record for the product passed in as params.
  const createRecord = (id) => {
    try {
      const stockId = localStorage.getItem("stocktake");
      const body = { id, stockId };

      fetch("/stocktake/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //Creates a new record in the stocktake table, and new stocktake records for each product.
  const newStocktake = async () => {
    //check a stocktake is not already in progress
    if (!stocktake && stocktake_id === null) {
      try {
        //insert new record into stocktake table
        const response = await fetch("/stocktake/new", {
          method: "POST",
          headers: { token: localStorage.token },
        });
        const result = await response.json();
        //set stocktake and stocktakedate in local storage
        localStorage.setItem("stocktake", result.rows[0].stocktake_id);
        localStorage.setItem("stocktakedate", result.rows[0].stocktake_date);
        //create a new record for each product
        products.forEach((product) => {
          createRecord(product.product_stocklist_id);
        });
      } catch (err) {
        console.log(err.message);
      }
      //set stocktake boolean to true
      setStocktake(true);
    }
  };

  // get the lists to pass into the ShowLists component because unidirectional data-flow. 
  const getLists = async () => {
    try {
      const response = await fetch("/routes/stocklists/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();
      setLists(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // check all assigned lists are marked as complete when trying to end a stocktake. 
  const checkAllCounted = async () => {
    try {
      const response = await fetch("/routes/stocklists/inprogress", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();

      if (parseData.length > 0) {
        setAllCounted(false);
      } else {
        setAllCounted(true);
      }
    } catch (error) {}
  };

  //CALCULATING AND WRITING SALES TO THE DATABASE AFTER STOCKTAKE HAS ENDED

  //get a list of distinct products for caluculating sales
  const getDistinctProducts = async () => {
    try {
      const response = await fetch("/routes/products/get/distinct", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setDistinctProducts(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  //get the sales data, wait for promise to resolve then write to the database in sales_record table
  const getAndWriteSalesNumbers = async (products) => {
    var promises = products.map((product) => {
      return getSalesData(
        product.product_id,
        Number(currentStocktake),
        Number(currentStocktake) + 1
      );
    });
    promises.forEach((promise) => {
      promise.then((result) => {
        writeSales(result.product_id, result.sales, stocktake_id);
      });
    });
  };

  //write the sales numbers into the db
  const writeSales = (product_id, sales, stocktake) => {
    try {
      const body = { product_id, sales, stocktake };
      fetch("/routes/inventory/writesales", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //get sales data
  const getSalesData = async (product, prevStocktake, currentStocktake) => {
    try {
      const body = { prevStocktake, currentStocktake, product };
      const response = await fetch(`/routes/inventory/sales`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return await response.json();
    } catch (error) {
      console.error(error.message);
    }
  };

  //onclick for end stocktake button
  const endStocktake = (e) => {
    setListsChange(true);
    if (allCounted) {
      e.preventDefault();
      setStocktakeInactive();
      localStorage.setItem("laststocktake", localStorage.getItem("stocktake"));
      localStorage.removeItem("stocktake");
      localStorage.removeItem("stocktakedate");
      var next = moment().add(7, "days");
      localStorage.setItem(
        "nextstocktakedate",
        moment(next).format("YYYY-MM-DDThh:mm:ss")
      );
      setStocktake(false);
      toast.success("Stocktake ended");
      getAndWriteSalesNumbers(distinctProducts);
    } else {
      toast.warning("Not all counts have been completed");
    }
  };

  //set stocktake as inactive in db
  const setStocktakeInactive = async () => {
    try {
      const body = { stocktake_id };
      const response = await fetch("/stocktake/inactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getDistinctProducts();
    checkAllCounted();
    getProducts();
    checkStocktake();
    getLists();
    setListsChange(false);
    if (products.length > 0) {
    }
    // eslint-disable-next-line 
  }, [listsChange]);

  return !stocktake_id ? (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <div className="jumbotron">
        <div className="container">
          <h1 className="display-3">Stocktake</h1>
          {stocktakeDue ? (
            <Fragment>
              <h4>
                Create a new stocktaking record for{" "}
                <Moment date={dateString} format="LL" />?
              </h4>
              <button className="btn btn-info" onClick={newStocktake}>
                Start Stocktake
              </button>
            </Fragment>
          ) : (
            <h4 className="text-success">
              You are all up to date! Next stocktake due on{" "}
              <Moment format="LL">
                {localStorage.getItem("nextstocktakedate")}
              </Moment>
            </h4>
          )}{" "}
        </div>
      </div>
    </main>
  ) : (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <div className="jumbotron">
        <button
          className="btn btn-danger float-right"
          onClick={(e) => endStocktake(e)}
        >
          End Stocktake
        </button>
        <div className="container">
          <h1 className="display-3">Stocktake</h1>
          <h4>
            Stocktake in progress :{" "}
            <Moment
              date={localStorage.getItem("stocktakedate")}
              format="DD/MM/YYYY HH:mm"
            />
          </h4>
        </div>
      </div>
      <div>
        <ShowLists
          allLists={allLists}
          setListsChange={setListsChange}
          stocktake={stocktake}
          stocktake_id={stocktake_id}
        />
      </div>
    </main>
  );
};

export default StocktakeLists;
