import React, { Fragment } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Logo from "./images/Logo.png";

//nav bar component for the admin site.
const Nav = ({ setIsAuthenticated, isAuthenticated, name, userType }) => {
  // check is authenticated, otherwise nav will show when user is logged out.
  const isAuth = async () => {
    try {
      const response = await fetch("/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  //logout method
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  useEffect(() => {
    isAuth();
    // eslint-disable-next-line
  }, [isAuthenticated]);
  return isAuthenticated && userType === "Admin" ? (
    <Fragment>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        {/* eslint-disable-next-line */}
        <a href="#" className="navbar-brand col-sm-3 col-md-2 mr-0">
          <img src={Logo} alt="BevStock" width="30" height="30" />
          {"  "}<h4 className="float-right mb-0 mr-5">BevStock</h4>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            {/* eslint-disable-next-line */}
            <a className="nav-link" onClick={(e) => logout(e)} href="#">
              {name} : Sign out
            </a>
          </li>
        </ul>
      </nav>
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column ml-3">
            <li className="nav-item mt-3">
              <a className="nav-link" href={`/dashboard`}>
                Dashboard <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item mt-2">
              <a className="nav-link" href={`/stocktaking`}>
                View/Edit Stock Areas
              </a>
            </li>
            <li className="nav-item mt-2">
              <a className="nav-link" href="/stocktakelists">
                Stocktaking
              </a>
            </li>
            <li className="nav-item mt-2">
              <a className="nav-link" href={`/team`}>
                Team Management
              </a>
            </li>
            <li className="nav-item mt-2">
              <a
                className="nav-link"
                href={`/inventory/${localStorage.getItem("laststocktake")}`}
              >
                Inventory
              </a>
            </li>
            <li className="nav-item mt-2">
              <a className="nav-link" href={`/processdelivery`}>
                Process Delivery
              </a>
            </li>

            <li className="nav-item mt-2">
              <a className="nav-link" href={`/products`}>
                Products Database
              </a>
            </li>
            <li className="nav-item mt-2">
              <a className="nav-link" href={`/salesdata`}>
                Sales Data
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  ) : null;
};

export default Nav;
