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
  async function checkAssignedDuties() {
    try {
      const stocktake_id = localStorage.getItem("stocktake");
      const id = localStorage.getItem("user");
      const body = { id, stocktake_id };
      console.log(body);
      const response = await fetch(
        "/routes/stocklists/userassignedlists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
      setAssignedLists(parseRes);
      if (parseRes.length > 0) {
        setAssignedLists(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function markComplete(id) {
    const message = document.getElementById(`${id}`).value;
    try {
      const body = { id, stocktakeInstance, message };
      const response = await fetch(
        "/stocktake/markascomplete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      await response.json();
      setListsChange(true);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    setStocktakeInstance(stocktake_id);
    setListsChange(false);
    checkAssignedDuties();
  }, [allLists]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4>Your Assigned Stock Areas</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Stock Area</th>
                <th>Count</th>
                <th>Manager Message</th>
                <th>Your Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {console.log(assignedLists)}
              {assignedLists.map((list) => (
                <tr key={list.stocklist_id}>
                  <td>{list.stocklist_name}</td>
                  <td>
                    <Link
                      to={`count/${list.stocklist_id}/${stocktakeInstance}`}
                      className="btn btn-primary"
                    >
                      Count
                    </Link>
                  </td>
                  <td>{list.user_message}</td>
                  {list.completed ? (
                    <Fragment>
                      <td>{list.completed_message}</td>
                      <td>Complete</td>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <td>
                        <textarea
                          id={`${list.stocklist_id}`}
                          cols="40"
                          rows="2"
                        ></textarea>
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={(e) => {
                            markComplete(list.stocklist_id);
                          }}
                        >
                          Mark as complete
                        </button>
                      </td>
                    </Fragment>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserShowLists;
