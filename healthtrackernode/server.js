require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const createAccountRoute = require("./models/createaccount");
const signInRoute = require("./models/signin");
const updateProfileRoute = require("./models/updateProfile");
const googleFitRoute = require("./googleFit/googleFitRoute");
const fitChatRoute = require("./routes/fitChat");
const bmiRoutes = require("./routes/bmiRoutes");
const todoRoutes = require("./routes/todoRoutes");
const waterRoutes = require("./routes/waterRoutes");
const challengeRoutes = require("./routes/challengeRoutes");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json()); // ✅ use built-in JSON parser (remove body-parser)

/* ---------- DATABASE ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.error("DB Error:", err));


/* ---------- ROUTES ---------- */
app.use("/api", createAccountRoute);
app.use("/api", signInRoute);
app.use("/api", updateProfileRoute);

app.use("/api", googleFitRoute);
app.use("/api/fitchat", fitChatRoute);
app.use("/api", bmiRoutes);
app.use("/api", todoRoutes);
app.use("/api", waterRoutes);

// 🔥 DAILY CHALLENGE + STREAK
app.use("/api/challenge", challengeRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
