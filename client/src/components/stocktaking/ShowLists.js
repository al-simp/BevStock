import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AssignList from "./AssignList";

// component to show all stocklists, when in a stocktake will show assigned and unassigned lists. Child component of StocktakeLists
const ShowLists = ({ allLists, setListsChange, stocktake, stocktake_id }) => {
  const [assignedLists, setAssignedLists] = useState([]);
  const [unassignedLists, setUnassignedLists] = useState([]);
  const [lists, setLists] = useState([]); //assigned to an empty array
  const [stocktakeInstance, setStocktakeInstance] = useState([]);

  //get the lists that have been assigned to staff
  const getAssignedLists = async () => {
    try {
      const body = { stocktake_id };
      const assignedLists = await fetch("/routes/stocklists/assignedlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await assignedLists.json();
      setAssignedLists(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  //get the unassigned lists
  const getUnassignedLists = async () => {
    try {
      const body = { stocktake_id };
      const unassignedLists = await fetch(
        "/routes/stocklists/unassignedlists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await unassignedLists.json();
      setUnassignedLists(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  // method to unassign a list.
  const unassign = async (id) => {
    try {
      const body = { id, stocktake_id };
      const unassign = await fetch("/routes/stocklists/unassignuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await unassign.json();
      setListsChange(true);
    } catch (error) {}
  };

  //delete list function
  const deleteList = async (id) => {
    try {
      await fetch(`/stocklists/delete/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.token },
      });

      setLists(lists.filter((stocklist) => stocklist.stocklist_id !== id));
    } catch (err) {
      console.error(err.message);
    }

    setListsChange(true);
  };

  useEffect(() => {
    setStocktakeInstance(stocktake_id);
    setLists(allLists);
    setListsChange(false);
    if (stocktake) {
      getAssignedLists();
      getUnassignedLists();
    }
    //eslint-disable-next-line
  }, [allLists]);

  return !stocktake ? (
    <table className="table text-center">
      <thead>
        <tr>
          <th>Stock Area</th>
          <th>Delete</th>
          <th>View/Edit Products</th>
        </tr>
      </thead>
      <tbody>
        {allLists.map((stocklist) => (
          <tr key={stocklist.stocklist_id}>
            <td>{stocklist.stocklist_name}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => deleteList(stocklist.stocklist_id)}
              >
                Delete
              </button>
            </td>
            <td>
              <Link
                to={`viewedit/${stocklist.stocklist_id}`}
                className="btn btn-primary"
              >
                View/Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4>Unassigned Stock Areas</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Stock Area</th>
                <th>Assign to team member</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {unassignedLists.map((stocklist) => (
                <tr key={stocklist.stocklist_id}>
                  <td>{stocklist.stocklist_name}</td>
                  <td>
                    <AssignList
                      name={stocklist.stocklist_name}
                      stocklist_id={stocklist.stocklist_id}
                      setListsChange={setListsChange}
                    />
                  </td>
                  <td>
                    <Link
                      to={`count/${stocklist.stocklist_id}/${stocktakeInstance}`}
                      className="btn btn-primary"
                    >
                      Count
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col">
          <h4>Assigned Stock Areas</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Stock Area</th>
                <th>Assigned to</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {assignedLists.map((list) => (
                <tr key={list.stocklist_id}>
                  <td>{list.stocklist_name}</td>
                  <td>{list.user_name}</td>
                  {list.completed ? (
                    <td>
                      <span className="badge badge-pill badge-success">
                        Completed
                      </span>
                    </td>
                  ) : (
                    <td>
                      <span className="badge badge-pill badge-warning">
                        In Progress
                      </span>
                      <button
                        href="#"
                        className="badge badge-pill badge-danger"
                        onClick={(e) => unassign(list.stocklist_id)}
                      >
                        Unassign
                      </button>
                    </td>
                  )}
                  <td>{list.user_message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowLists;
