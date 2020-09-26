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
import "./dashboard.css";

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
import ViewEdit from "./components/stocktaking/ViewEdit";
import StockTakeLists from "./components/stocktaking/StocktakeLists";
import Nav from "./components/Nav";
import ProductsDb from "./components/inventory/ProductsDB";
import ProcessDelivery from "./components/inventory/ProcessDelivery";
import PreviousStocktakeRecords from "./components/inventory/PreviousStocktakeRecords";

toast.configure();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  const name = localStorage.getItem("name");
  const userType = localStorage.getItem("role");

  //check if user is authorised
  async function isAuth() {
    try {
      const response = await fetch("https://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      console.log("isAuth", parseRes);

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Fragment>
      <Nav
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
        name={name}
        userType={userType}
      />
      <Router>
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
              isAuthenticated ? (
                <Redirect to="/dashboard" />
              ) : (
                <Login {...props} setAuth={setAuth} />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            render={(props) =>
              isAuthenticated ? (
                <Dashboard {...props} setAuth={setAuth} name={name} />
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
                <Stocktaking {...props} setAuth={setAuth} />
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
                <TeamManagement {...props} setAuth={setAuth} />
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
            path="/inventory/:id"
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
            path="/userdashboard"
            render={(props) =>
              isAuthenticated ? (
                <UserDashboard {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/userstocktaking"
            render={(props) =>
              isAuthenticated ? (
                <UserStocktake {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/products"
            render={(props) =>
              isAuthenticated ? (
                <ProductsDb {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/stocktakerecord/:id"
            render={(props) =>
              isAuthenticated ? (
                <PreviousStocktakeRecords {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            exact
            path="/qrscan"
            render={isAuthenticated ? () => <QrScan /> : () => <Login />}
          />
          <Route
            exact
            path="/processdelivery"
            render={(props) =>
              isAuthenticated ? (
                <ProcessDelivery {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </Router>
    </Fragment>
  );
};

export default App;
