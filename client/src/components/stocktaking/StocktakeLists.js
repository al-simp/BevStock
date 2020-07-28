import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

//components
import ShowLists from "./ShowLists";

const StocktakeLists = ({ setAuth }) => {
  const [stocktakeData, setStocktakeData] = useState(0);
  const [stocktake, setStocktake] = useState(false);
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);

  const dateString = Date().toString();

  let stocktake_id = 0;

  const createStocktake = () => {
    setStocktake(window.confirm("Sure?"));
  };

  const getStocktakeData = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/stocktake/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      setStocktakeData(response.json());
      console.log(stocktakeData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const newStocktake = async () => {
    if (stocktake) {
      console.log("hello");
      try {
        const response = await fetch("http://localhost:5000/stocktake/new", {
          method: "POST",
          headers: { token: localStorage.token },
        });
        const result = await response.json();
        setStocktakeData(result.rows[0].stocktake_id);
        console.log(stocktakeData);
        console.log(result.rows);
        stocktake_id = result.rows[0].stocktake_id;
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const getLists = async () => {
    try {
      const response = await fetch("http://localhost:5000/stocklists/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();
      setLists(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out succsessfully!");
  };

  useEffect(() => {
    getLists();
    newStocktake();
    setListsChange(false);
    setStocktakeData(stocktakeData);
  }, [listsChange, stocktake]);

  return !stocktake ? (
    <main role="main">
      <div className="jumbotron">
        <button
          className="btn btn-primary float-right"
          onClick={(e) => logout(e)}
        >
          Logout
        </button>
        <div className="container">
          <h1 className="display-3">Stocktake</h1>
          <h4>Create a new stocktaking record for {dateString}?</h4>
          <button className="btn btn-info" onClick={createStocktake}>
            Start Stocktake
          </button>
        </div>
      </div>
    </main>
  ) : (
    <main role="main">
      <div className="jumbotron">
        <div className="container">
          <h1 className="display-3">Stocktake</h1>
          <h4>Stocktake in progress : {dateString}</h4>
        </div>
      </div>
      <div>
        <ShowLists
          allLists={allLists}
          setListsChange={setListsChange}
          stocktake={stocktake}
          stocktakeData={stocktakeData}
        />
      </div>
    </main>
  );
};

export default StocktakeLists;
