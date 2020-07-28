const express = require('express');
const app = express();
const cors = require('cors');


//middleware 
app.use(cors());
app.use(express.json()) // => this will allow access to the req.body from client side

//Routes

//register and login routes
app.use("/auth", require("./routes/jwtAuth"))


//dashboard route
app.use("/dashboard", require("./routes/dashboard"))

app.use("/stocklists", require("./routes/stocklists"))

app.use("/teammanagement", require("./routes/teamManagement"))

app.use("/products", require("./routes/products"))

app.use("/inventory", require("./routes/inventory"))

app.use("/stocktake", require("./routes/stocktake"));



app.listen(5000, () => {
    console.log("Server is starting on port 5000")
});