import React, { Fragment } from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { MdLocalBar } from "react-icons/md";
import { RiScales2Fill } from "react-icons/ri";
import { BsCardChecklist } from "react-icons/bs";
import LogoNav from "./images/LogoNav.png";
//nav bar component for the admin site.

const Nav = ({ setIsAuthenticated, isAuthenticated, name, userType }) => {
  const [stocktake, setStocktake] = useState(false);
  const [latestInventoryId, setLatestInventoryId] = useState("");

  // check is authenticated, otherwise nav will show when user is logged out.
  async function isAuth() {
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
  }

  //logout method
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  async function findLastStocktake() {
    try {
      const response = await fetch("/routes/inventory/latest", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setLatestInventoryId(parseRes[0].stocktake_id);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function checkStocktake() {
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
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    checkStocktake();
    findLastStocktake();
    isAuth();
  }, [isAuthenticated]);
  return isAuthenticated && userType === "Admin" ? (
    <Fragment>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <a href="#" className="navbar-brand col-sm-3 col-md-2 mr-0">
          <img src={LogoNav} alt="BevStock" width="87" height="25"/>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" onClick={(e) => logout(e)} href="#">
              {name} : Sign out
            </a>
          </li>
        </ul>
      </nav>
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href={`/dashboard`}>
                <AiOutlineHome /> Dashboard{" "}
                <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/stocktaking`}>
                <MdLocalBar /> View/Edit Stock Areas
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/stocktakelists">
                <RiScales2Fill /> Stocktaking
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/inventory/${latestInventoryId}`}>
                <BsCardChecklist /> Inventory
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/processdelivery`}>
                <BsCardChecklist /> Process Delivery
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/team`}>
                <BsCardChecklist /> Team Management
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/products`}>
                <BsCardChecklist /> Products Database
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  ) : null;
};

export default Nav;
