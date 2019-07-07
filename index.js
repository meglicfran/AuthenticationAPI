const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");

dotenv.config();

//connnect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to DB.");
});
//transform a request into a  javascript object
app.use(express.json());

//localhost:3000/api/user/*
app.use("/api/user", authRoute);

// start a server at localhost:3000
app.listen(3000, () => {
  console.log("Server is up!");
});
