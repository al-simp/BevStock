import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

const UserDashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [stocktake, setStocktake] = useState({});
  const [hasDuties, setHasDuties] = useState(false);

  async function checkStocktake() {
    try {
      const response = await fetch(
        "/stocktake/activestocktake",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      if (parseRes.length > 0) {
        setStocktake(parseRes);
        localStorage.setItem("stocktake", parseRes[0].stocktake_id);
        localStorage.setItem("stocktakedate", parseRes[0].stocktake_date);
      } else {
        console.log("no stocktake in progress");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getDuties() {
    try {
      const response = await fetch("/dashboard/duties", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      if (parseRes.length > 0) {
        setHasDuties(true);
      }
      console.log(parseRes);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function getName() {
    try {
      const response = await fetch("/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      console.log(parseRes);
      localStorage.setItem("user", parseRes.user_id);
      setName(parseRes.user_name);
    } catch (err) {
      console.log(err.message);
    }
    console.log(name);
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setAuth(false);
  };

  //check if user has been assigned any stocktake duties

  useEffect(() => {
    getDuties();
    getName();
    checkStocktake();
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
              {!_.isEmpty(stocktake) ? (
                <div>
                  <p>
                    Stocktake in progress :{" "}
                    {localStorage.getItem("stocktakedate")}
                  </p>
                  {hasDuties ? (
                    <div>
                      <p>You have been assigned stocktaking duties</p>
                      <p>
                        <Link
                          className="btn btn-secondary"
                          to="/userstocktaking"
                        >
                          View
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <p>You haven't been assigned any stocktakting duties</p>
                  )}
                </div>
              ) : (
                <p>No stocktake in progress</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default UserDashboard;
