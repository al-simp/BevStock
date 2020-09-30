import React, { useState, useEffect } from "react";

//components
import AddList from "./AddList";
import ShowLists from "./ShowLists";

// parent of view/edit component, shows the stocklists/areas, will allow to edit if not is stocktake mode. 
const Stocklists = () => {
  const [allLists, setLists] = useState([]);
  const [listsChange, setListsChange] = useState(false);
  const [stocktake, setStocktake] = useState(false);

  //if stock ID exists, set stocktake to true.
  const checkStocktake = () => {
    if (localStorage.getItem("stocktake") !== null) {
      setStocktake(true);
    }
  };

  // get all the stocklists. 
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

  useEffect(() => {
    checkStocktake();
    getLists();
    setListsChange(false);
  }, [listsChange]);

  return (
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
      <div className="jumbotron">
        <div className="container">
          <h1 className="display-3">Stock Areas</h1>
          <div>
            {!stocktake ? (
              <AddList setListsChange={setListsChange} />
            ) : (
              <h6>Cannot edit stock areas when a stocktake is in progress</h6>
            )}
          </div>
        </div>
      </div>
      <div>
        {!stocktake ? (
          <ShowLists allLists={allLists} setListsChange={setListsChange} />
        ) : null}
      </div>
    </main>
  );
};

export default Stocklists;
