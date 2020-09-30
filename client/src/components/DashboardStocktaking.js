import React, { Fragment, useEffect, useState } from "react";
import Moment from "react-moment";

// child component of stocktaking, shows if a sh=tocktake is due. if stocktake is in progress shows assigned lists. 
const DashboardStocktaking = ({ stocktake, stocktake_id, stocktakeDue }) => {
  const [assignedLists, setAssignedLists] = useState([]);
  const [unassignedLists, setUnassignedLists] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const getLists = async () => {
    try {
      const response = await fetch("/routes/stocklists/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setAllLists(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

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

  useEffect(() => {
    getLists();
    getAssignedLists();
    getUnassignedLists();
    // eslint-disable-next-line
  }, []);

  return !stocktake ? (
    <div>
      {stocktakeDue ? (
        <Fragment>
          <h6>
            Stocktaking{" "}
            <small className="text-danger">
              Stocktake Overdue From{" "}
              <Moment format="LL">
                {localStorage.getItem("nextstocktakedate")}
              </Moment>
            </small>
            <a
              type="button"
              className="btn btn-primary btn-sm float-right mb-2"
              href={"/stocktakelists"}
            >
              Stocktake
            </a>
          </h6>
        </Fragment>
      ) : (
        <h6>
          Stocktaking{" "}
          <small className="text-success">
            Next Stocktake{" "}
            <Moment format="LL">
              {localStorage.getItem("nextstocktakedate")}
            </Moment>
          </small>
        </h6>
      )}
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Area</th>
            <th>View/Edit</th>
          </tr>
        </thead>
        <tbody>
          {allLists.map((list) => (
            <tr key={list.stocklist_id}>
              <td>{list.stocklist_name}</td>
              <td>
                <a
                  className="badge badge-pill badge-primary"
                  href={`viewedit/${list.stocklist_id}`}
                >
                  View/Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>
      <h6>
        Stocktaking <small className="text-danger">Stocktake in Progress</small>
      </h6>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Area</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {unassignedLists.map((list) => (
            <tr key={list.stocklist_id}>
              <td>{list.stocklist_name}</td>
              <td>Unassigned</td>
            </tr>
          ))}
          {assignedLists.map((list) => (
            <tr key={list.stocklist_id}>
              <td>{list.stocklist_name}</td>
              <td>Assigned: {list.user_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DashboardStocktaking;
