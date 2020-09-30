import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import Moment from "react-moment";
import scales from "../components/images/Scales.png"

// user dashboard component.
const UserDashboard = ({ setAuth }) => {
  const [stocktake, setStocktake] = useState({});
  const [hasDuties, setHasDuties] = useState(false);

  // check if stocktake is in progress.
  const checkStocktake = async () => {
    try {
      const response = await fetch("/stocktake/activestocktake", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      if (parseRes.length > 0) {
        setStocktake(parseRes);
        localStorage.setItem("stocktake", parseRes[0].stocktake_id);
        localStorage.setItem("stocktakedate", parseRes[0].stocktake_date);
      } else {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // get stocktaking duties..
  const getDuties = async () => {
    try {
      const response = await fetch(`routes/dashboard/duties/${localStorage.getItem("id")}`, {
        method: "GET"
      });

      const parseRes = await response.json();
      console.log(parseRes);
      if (parseRes.length > 0) {
        setHasDuties(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // logout method.
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setAuth(false);
  };

  //check if user has been assigned any stocktake duties

  useEffect(() => {
    getDuties();
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
            <h1 className="display-3">
              Hello, {localStorage.getItem("name")}!
            </h1>
            <p>Welcome to your BevStock user dashboard.</p>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-4 flexbox text-center">
              <img
                className="rounded-circle mb-4"
                src={scales}
                alt="Generic placeholder"
                width="140"
                height="140"
              ></img>
              <h2>Stocktaking</h2>
              {!_.isEmpty(stocktake) ? (
                <div>
                  <p>
                    Stocktake in progress :{" "}
                    <Moment format="LL">
                      {localStorage.getItem("stocktakedate")}
                    </Moment>
                  </p>
                  {hasDuties ? (
                    <div>
                      <p>You have been assigned stocktaking duties</p>
                      <p>
                        <Link
                          className="btn btn-success"
                          to="/userstocktaking"
                        >
                          View Duties
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
