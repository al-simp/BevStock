import React, { Fragment, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import Logo from "../public/SignInLogo.png";
import "../signin.css";
import moment from "moment";

// login component, assigns a JWT token and stores a load of info in local storage on login. Also sends a push notification if stocktake is in progress, or user has assigned stocktaking duties.
const Login = ({ setAuth }) => {
  //key for pust notifications API
  const publicVapidKey =
    "BKsYaIk2PtD5vOgyAPKMdbAZjRxO_Ob6uh9pexmSN0B47Ju4R1zW1rJuWhTlTd0A6w8visaRHoznpODDxSInlw0";
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // when login form is submitted.
  const onSubmitform = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };

      const response = await fetch(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        localStorage.setItem("role", parseRes.role);
        localStorage.setItem("name", parseRes.name);
        localStorage.setItem("id", parseRes.id);
        await checkStocktake();
        await findLastStocktake();
        if (
          !_.isEmpty(localStorage.getItem("stocktake")) &&
          localStorage.getItem("role") === "Admin"
        ) {
          sendPush();
        } else {
          getDuties();
        }

        setAuth(true);

        toast.success("Login successful!");
      } else {
        setAuth(false);

        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // get stocktaking duties.
  const getDuties = async () => {
    try {
      const response = await fetch(`routes/dashboard/duties/${localStorage.getItem("id")}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      if (parseRes.length > 0) {
        sendPush();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //method to check if there are any active stocktakes within the database.
  const checkStocktake = async () => {
    try {
      const response = await fetch("/stocktake/activestocktake", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      // if a record exists, set the data in local storage.
      if (parseRes.length > 0) {
        localStorage.setItem("stocktake", parseRes[0].stocktake_id);
        localStorage.setItem("stocktakedate", parseRes[0].stocktake_date);
      } else {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //method to find last stocktake for inventory records
  const findLastStocktake = async () => {
    try {
      const response = await fetch("/routes/inventory/latest", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      localStorage.setItem("laststocktake", parseRes[0].stocktake_id);
      var next = moment(parseRes[0].stocktake_date).add(7, "days");
      localStorage.setItem(
        "nextstocktakedate",
        moment(next).format("YYYY-MM-DDThh:mm:ss")
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  // method to send push notification
  const sendPush = () => {
    if ("serviceWorker" in navigator) {
      send().catch((err) => {
        console.error(err);
      });
    }
  };

  //register sw, register push, send push
  const send = async () => {
    //register service worker
    //registering service worker...
    const register = await navigator.serviceWorker.register("worker.js", {
      scope: "/",
    });

    //register push

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    // Send push notification

    await fetch(`/subscribe/${localStorage.getItem("role")}`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
  };

  // method to convert public vapid key to a different format.
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <Fragment>
      <body className="text-center mt-5">
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <link rel="icon" href="../../../../favicon.ico" />

        <form className="form-signin mt-4" onSubmit={onSubmitform}>
          <img class="mb-4" src={Logo} alt="" width="100" height="100"></img>
          <h1 className="h3 mb-3 font-weight-normal">
            BevStock <br />
            <small>Inventory Management</small>
          </h1>
          <label for="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control mt-4"
            placeholder="Email address"
            value={email}
            onChange={(e) => onChange(e)}
            required
            autofocus
          />
          <label for="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => onChange(e)}
            required
          />
          <div className="checkbox mb-3"></div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
          <p className="mt-5 mb-3 text-muted">Alan Simpson : QUB 2020</p>
        </form>
      </body>
    </Fragment>
  );
};

export default Login;
