require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//initializing the express app
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json()); //allows for json requests to be read
app.use(cors()); //allows interaction between front and backend

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Sever is Running on port ${PORT}`);
});
