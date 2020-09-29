import React, { useEffect, useState } from "react";

const DashboardStocktaking = ({ stocktake, stocktake_id, setListsChange }) => {
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
      console.log(parseRes);
      setAssignedLists(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  //get the unassigned lists
  const getUnassignedLists = async () => {
    try {
      const body = { stocktake_id };
      const unassignedLists = await fetch("/routes/stocklists/unassignedlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parseRes = await unassignedLists.json();
      console.log(parseRes);
      setUnassignedLists(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getLists();
    getAssignedLists();
    getUnassignedLists();
  }, []);

  return !stocktake ? (
    <div>
      <h6>Stocktaking</h6>
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
      <h6>Stocktaking: Stocktake in Progress</h6>
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
              <td>
              Unassigned
              </td>
            </tr>
          ))}
          {assignedLists.map((list) => (
            <tr key={list.stocklist_id}>
              <td>{list.stocklist_name}</td>
              <td>
              Assigned: {list.user_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DashboardStocktaking;
