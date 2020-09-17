import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

//components
import UserShowLists from "./UserShowLists";

const UserStocktake = ({ setAuth }) => {
  const [stocktake, setStocktake] = useState(false);
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);

  const stocktake_id = localStorage.getItem("stocktake");

  const checkStocktake = () => {
    console.log("hello")
    if (stocktake_id !== null) {
      console.log("stocktake in progress");
      setStocktake(true);
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
    checkStocktake();
    getLists();
    setListsChange(false);
  }, [listsChange]);

  return (
    <main role="main">
      <div className="jumbotron">
        <button
          className="btn btn-primary float-right"
          onClick={(e) => logout(e)}
        >
          Logout
        </button>
        <div className="container">
          <h1 className="display-3">Stock Areas</h1>
        </div>
      </div>
      <div>
        <UserShowLists allLists={allLists} setListsChange={setListsChange} stocktake={stocktake} stocktake_id={stocktake_id}/>
      </div>
    </main>
  );
};

export default UserStocktake;
