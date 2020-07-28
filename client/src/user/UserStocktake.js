import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

//components
import UserShowLists from "./UserShowLists";

const UserStocktake = ({ setAuth }) => {
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);

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
          <div>
          </div>
        </div>
      </div>
      <div>
        <UserShowLists allLists={allLists} />
      </div>
    </main>
  );
};

export default UserStocktake;
