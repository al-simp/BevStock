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
      if (parseRes.length > 0) {
        setAssignedLists(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // mark the stocklist as complete when finished.
  const markComplete = async (id) => {
    const message = document.getElementById(`${id}`).value;
    try {
      const body = { id, stocktakeInstance, message };
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
            <table className="table table-bordered">
              <tbody>
                <tr key={list.stocklist_id}>
                  <th className="text-center">{list.stocklist_name}</th>
                </tr>
                <tr>
                  {!list.completed ? (
                    <td>
                      <Link
                        to={`count/${list.stocklist_id}/${stocktakeInstance}`}
                        className="btn btn-primary form-control"
                      >
                        Count
                      </Link>
                    </td>
                  ) : null}
                </tr>
                <tr>
                  <th className="text-center">Manager Message</th>
                </tr>
                <tr>
                  <td className="text-center">{list.user_message}</td>
                </tr>
                {list.completed ? (
                  <Fragment>
                    <tr>
                      <th className="text-center">Your Message</th>
                    </tr>
                    <td className="text-center">{list.completed_message}</td>
                    <tr>
                      <td className="text-center">Complete</td>
                    </tr>
                  </Fragment>
                ) : (
                  <Fragment>
                    <td>
                      <textarea
                        className="form-control"
                        id={`${list.stocklist_id}`}
                        cols="40"
                        rows="2"
                      ></textarea>

                      <button
                        className="btn btn-success form-control"
                        onClick={(e) => {
                          markComplete(list.stocklist_id);
                        }}
                      >
                        Mark as complete
                      </button>
                    </td>
                  </Fragment>
                )}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserShowLists;
