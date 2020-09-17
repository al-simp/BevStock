const express = require("express");
const app = express();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

//middleware
app.use(cors());
app.use(express.json()); // => this will allow access to the req.body from client side

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
  console.log(message);
  //get push subscription object
  const subscription = req.body;

  console.log("User role", role.user);
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
app.use("/dashboard", require("./routes/dashboard"));

app.use("/stocklists", require("./routes/stocklists"));

app.use("/teammanagement", require("./routes/teamManagement"));

app.use("/products", require("./routes/products"));

app.use("/inventory", require("./routes/inventory"));

app.use("/stocktake", require("./routes/stocktake"));

app.listen(5000, () => {
  console.log("Server is starting on port 5000");
});
