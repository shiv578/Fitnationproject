const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const createAccountRoute = require("./models/createaccount");
const signInRoute = require("./models/signin");
const updateProfileRoute = require("./models/updateProfile");
const googleFitRoute = require("./googleFit/googleFitRoute");
const googleFitRefreshRoute = require("./googleFit/googleFitRefresh");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/healthtracker")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// Routes
app.use("/api", createAccountRoute);
app.use("/api", signInRoute);
app.use("/api", updateProfileRoute);
app.use("/api", googleFitRoute);        // ✅ Google Fit main route
app.use("/api", googleFitRefreshRoute); // ✅ Google Fit refresh token route

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
