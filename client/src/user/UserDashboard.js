import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserDashboard = ({ setAuth }) => {
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
            <p>Welcome to your BevStock user dashboard.</p>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>Stocktaking</h2>
              <p>
                <Link className="btn btn-secondary" to="/stocktaking">
                  Stocktaking
                </Link>
              </p>
            </div>
            <div className="col-md-4">
              <h2>Inventory</h2>
              <p>
                <Link className="btn btn-secondary" to="/inventory">
                  Inventory
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default UserDashboard;
