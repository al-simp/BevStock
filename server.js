const express = require("express");
const app = express();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 5000;

//process.env.PORT
//process.env.NODE_ENV => production or undefined

//middleware
app.use(cors());
app.use(express.json()); // => this will allow access to the req.body from client side

//app.use(express.static(path.join(__dirname, "client/build")));

if (process.env.NODE_ENV === "production") {
  //serve static content
  app.use(express.static(path.join(__dirname, "client/build")));
}
//Routes

//push notification route

//set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BKsYaIk2PtD5vOgyAPKMdbAZjRxO_Ob6uh9pexmSN0B47Ju4R1zW1rJuWhTlTd0A6w8visaRHoznpODDxSInlw0";
const privateVapidKey = "G0_5FJobUZkIFL4URoLM60Z1Ws_5DvCwxDJgcUXTKF4";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

//subscribe route
app.post("/subscribe/:user", (req, res) => {
  const role = req.params;

  const message =
    role.user === "Admin"
      ? "Stocktake in progress"
      : "You have assigned stocktaking duties";
  
  //get push subscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  //create payload
  let payload = JSON.stringify({ title: `${message}` });

  //pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
});

//register and login routes
app.use("/auth", require("./routes/jwtAuth"));

//dashboard route

app.use("/routes/stocklists", require("./routes/stocklists"));

app.use("/routes/teammanagement", require("./routes/teamManagement"));

app.use("/routes/products", require("./routes/products"));

app.use("/routes/inventory", require("./routes/inventory"));

app.use("/routes/dashboard", require("./routes/dashboard"));

app.use("/stocktake", require("./routes/stocktake"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, function () {
  (`Server running on port ${PORT}`);
});
