require("dotenv").config();

// importing routes
const tokenRoute = require("./router/tokenRoute");
const transactionRoute = require("./router/transactionRoute");

const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// enabling cors connection
app.use(cors());
// We require this to access variables inside req.body
app.use(express.json());

// Routes for specific actions
app.use("/api/token", tokenRoute);
app.use("/api/transaction", transactionRoute);

app.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});
