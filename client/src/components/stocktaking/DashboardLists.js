import React, { useEffect, useState } from "react";

const DashboardLists = ({ stocktake }) => {
  const [allLists, setAllLists] = useState([]);
  const getLists = async () => {
    try {
      const response = await fetch("/stocklists/", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setAllLists(parseRes);
    } catch (error) {
        console.error(error.message);
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  return !stocktake ? (
    <div>
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
  ) : (<div>Stockatke in progress</div>);
};
export default DashboardLists;
