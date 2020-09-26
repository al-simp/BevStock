import React, { Fragment, useState, useEffect } from "react";

const AssignList = ({ name, stocklist_id, setListsChange }) => {
  const [users, setUsers] = useState([]);
  const stocktake_id = localStorage.getItem("stocktake");

  const getTeamMembers = async () => {
    try {
      const response = await fetch(
        "/teammanagement/users",
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

  async function assignToUser(event, user) {
    event.preventDefault();
    const userMessage = document.getElementById(user.user_id).value;
    console.log(user, userMessage);
    const id = user.user_id;

    const modal = document.getElementById(`id${stocklist_id}`);

    modal.setAttribute("style", "display: none");
    const modalBackdrops = document.getElementsByClassName("modal-backdrop");
    document.body.removeChild(modalBackdrops[0]);

    try {
      const body = { stocklist_id, stocktake_id, id, userMessage };
      const response = await fetch(
        "/stocklists/assignlist",
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
                <tr>
                  <th>Name</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_name}</td>
                    <td>
                      <form
                        onSubmit={(e) => {
                          assignToUser(e, user);
                        }}
                      >
                        <div className="row">
                          <div className="col-7">
                            <textarea
                              className="form-control"
                              id={`${user.user_id}`}
                            />
                          </div>
                          <div className="col">
                            <button
                              className="btn btn-success float-right"
                              type="submit"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </form>
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
