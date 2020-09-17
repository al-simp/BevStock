import React, { Fragment, useState, useEffect } from "react";

const AssignList = ({ name, stocklist_id, setListsChange }) => {
  const [users, setUsers] = useState([]);
  const stocktake_id = localStorage.getItem("stocktake");

  const getTeamMembers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/teammanagement/users",
        {
          method: "GET",
        }
      );

      const parseRes = await response.json();
      setUsers(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  async function assignToUser(id) {
    try {
      const body = { stocklist_id, stocktake_id, id };
      const response = await fetch(
        "http://localhost:5000/stocklists/assignlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      await response.json();
      setListsChange(true);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getTeamMembers();
  }, []);

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-info"
        data-toggle="modal"
        data-target={`#id${stocklist_id}`}
      >
        Assign
      </button>
      <div className="modal" id={`id${stocklist_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{name}</h4>
            </div>
            <div className="modal-body"></div>
            <table className="table">
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_name}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        data-dismiss="modal"
                        onClick={() => assignToUser(user.user_id)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-footer">
              <button className="btn btn-success" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AssignList;
