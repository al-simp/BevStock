import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserShowLists = ({ allLists }) => {
  const [lists, setLists] = useState([]); //assigned to an empty array

  useEffect(() => {
    setLists(allLists);
  }, [allLists]);

  return (
    <Fragment>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Stock Area</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {allLists.map((stocklist) => (
            <tr key={stocklist.stocklist_id}>
              <td>{stocklist.stocklist_name}</td>
              <td>
                <Link className="btn btn-success" to={`count/${stocklist.stocklist_id}`}>
                  Count
                </Link>
              </td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default UserShowLists;
