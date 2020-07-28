import React, { Fragment, useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

//components
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Stocktaking from "./components/stocktaking/Stocktaking";
import TeamManagement from "./components/team_management/TeamManagement";
import Count from "./components/stocktaking/Count";
import Inventory from "./components/inventory/Inventory";
import UserDashboard from "./user/UserDashboard";
import UserStocktake from "./user/UserStocktake";
import QrScan from "./components/stocktaking/QrScan";
import QRGen from "./helpers/qrCodeGen";
import ViewEdit from "./components/stocktaking/ViewEdit";
import StockTakeLists from "./components/stocktaking/StocktakeLists";

toast.configure();

const App = () => {
  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  const role = (userRole) => {
    userRole === localStorage.getItem("role")
      ? setIsAuthroised(true)
      : setIsAuthroised(false);
    return isAuthorised;
  };

  useEffect(() => {
    isAuth();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorised, setIsAuthroised] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Fragment>
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) =>
                !isAuthenticated ? (
                  <Landing {...props} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/login"
              render={(props) =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/dashboard"
              render={(props) =>
                isAuthenticated ? (
                  role("Admin") ? (
                    <Dashboard {...props} setAuth={setAuth} />
                  ) : (
                    <UserDashboard {...props} setAuth={setAuth} />
                  )
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/stocktaking"
              render={(props) =>
                isAuthenticated ? (
                  role("Admin") ? (
                    <Stocktaking {...props} setAuth={setAuth} />
                  ) : (
                    <UserStocktake {...props} setAuth={setAuth} />
                  )
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/team"
              render={(props) =>
                isAuthenticated ? (
                  role("Admin") ? (
                    <TeamManagement {...props} setAuth={setAuth} />
                  ) : (
                    <Dashboard {...props} setAuth={setAuth} />
                  )
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/count/:id/:stocktakeid"
              render={(props) =>
                isAuthenticated ? (
                  <Count {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/viewedit/:id"
              render={(props) =>
                isAuthenticated ? (
                  <ViewEdit {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/inventory"
              render={(props) =>
                isAuthenticated ? (
                  <Inventory {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />
             <Route
              exact
              path="/stocktakelists"
              render={(props) =>
                isAuthenticated ? (
                  <StockTakeLists {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/dashboard" />
                )
              }
            />

            <Route
              exact
              path="/qrscan"
              render={() =>
                  <QrScan/>
              }
            />
            <Route
              exact
              path="/qrgen"
              render={() =>
                  <QRGen/>
              }
            />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
};

export default App;
