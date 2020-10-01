import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

const UserShowLists = ({
  allLists,
  setListsChange,
  stocktake,
  stocktake_id,
}) => {
  const [assignedLists, setAssignedLists] = useState([]);
  const [stocktakeInstance, setStocktakeInstance] = useState([]);

  //get the lists that have been assigned to the user
  const checkAssignedDuties = async () => {
    try {
      const stocktake_id = localStorage.getItem("stocktake");
      const id = localStorage.getItem("id");
      const body = { id, stocktake_id };
      const response = await fetch("/routes/stocklists/userassignedlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
      setAssignedLists(parseRes);
      console.log(parseRes);
      if (parseRes.length > 0) {
        setAssignedLists(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // mark the stocklist as complete when finished.
  const markComplete = async (id) => {
    try {
      const body = { id, stocktakeInstance };
      const response = await fetch("/stocktake/markascomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await response.json();
      setListsChange(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setStocktakeInstance(stocktake_id);
    setListsChange(false);
    checkAssignedDuties();
    // eslint-disable-next-line
  }, [allLists]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h3 className="text-center mb-4">Your Assigned Stock Areas</h3>
          {assignedLists.map((list) => (
            <div key={list.stocklist_id} className="card">
              <div className="card-body">
                <h5 className="card-title">{list.stocklist_name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Special Instructions
                </h6>
                <p className="card-text">{list.user_message}</p>
                {!list.completed ? (
                  <Link
                    to={`count/${list.stocklist_id}/${stocktakeInstance}`}
                    className="btn btn-primary"
                  >
                    Count
                  </Link>
                ) : null}
                {list.completed ? (
                  <Fragment>
                      <h6 className="text-success">Complete</h6>
                  </Fragment>
                ) : (
                  <Fragment> 
                     <button
                        className="btn btn-success ml-1"
                        onClick={(e) => {
                          markComplete(list.stocklist_id);
                        }}
                      >
                        Mark as complete
                      </button>
                  </Fragment>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserShowLists;
