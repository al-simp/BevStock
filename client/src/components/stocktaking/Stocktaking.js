import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

//components
import AddList from "./AddList";
import ShowLists from "./ShowLists";

const Stocklists = ({ setAuth }) => {
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);

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
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
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
            <AddList setListsChange={setListsChange} />
          </div>
        </div>
      </div>
      <div>
        <ShowLists allLists={allLists} setListsChange={setListsChange} />
      </div>
    </main>
  );
};

export default Stocklists;
