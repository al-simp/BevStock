import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setName(parseRes.user_name);
    } catch (err) {
      console.log(err.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setAuth(false);
    toast.success("Logged out succsessfully!");
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <Fragment>
      <main role="main">
        <div className="jumbotron">
          <button
            className="btn btn-primary float-right"
            onClick={(e) => logout(e)}
          >
            Logout
          </button>
          <div className="container">
            <h1 className="display-3">Hello, {name}!</h1>
            <p>Welcome to your BevStock dashboard.</p>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>Stocktaking</h2>
              <p>
                <Link className="btn btn-secondary" to="/stocktaking">
                  View/Edit Stock Areas
                </Link>
              </p>
              <p>
                <Link className="btn btn-secondary" to="/stocktakelists">
                  Perform a Stocktake
                </Link>
              </p>
            </div>
            <div className="col-md-4">
              <h2>Team Management</h2>
              <p>
                <Link className="btn btn-secondary" to="/team">
                  Team Management
                </Link>
              </p>
            </div>
            <div className="col-md-4">
              <h2>Inventory</h2>
              <p>
                <Link className="btn btn-secondary" to="/inventory">
                  View Inventory
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Dashboard;
