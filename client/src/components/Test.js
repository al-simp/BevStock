import React from "react";
import { useEffect } from "react";

const Test = () => {
  const publicVapidKey =
    "BKsYaIk2PtD5vOgyAPKMdbAZjRxO_Ob6uh9pexmSN0B47Ju4R1zW1rJuWhTlTd0A6w8visaRHoznpODDxSInlw0";

  //check for service worker

  const sendPush = () => {
    if ("serviceWorker" in navigator) {
      send().catch((err) => {
        console.error(err);
      });
    }
  };

  //register sw, register push, send push
  async function send() {
    //register service worker
    console.log("registering service worker...");
    const register = await navigator.serviceWorker.register('worker.js', {
      scope: "/",
    });

    console.log("Service Worker Registered.....");

    //register push
    console.log("Registering push....");

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    console.log("push registered..");

    // Send push notification

    console.log("sending push");
    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });

  

    console.log(subscription);

    console.log("push sent...");
  }

  function urlBase64ToUint8Array(base64String) {
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
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <h1>TEST</h1>
          <button className="btn btn-success" onClick={() => setTimeout(sendPush, 3000)}>Send Notification</button>
        </main>
      </div>
    </div>
  );
};

export default Test;
