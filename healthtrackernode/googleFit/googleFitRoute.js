const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("qs");
const { client_id, client_secret, redirect_uri, scopes } = require("./googleFitConfig");

// ------------------------------
// STEP 1 → GOOGLE LOGIN
// ------------------------------
router.get("/auth/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    qs.stringify({
      client_id,
      redirect_uri,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: scopes.join(" ")
    });

  res.redirect(url);
});

// ------------------------------
// STEP 2 → CALLBACK + FETCH DATA
// ------------------------------
router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token: at, refresh_token: rt } = tokenResponse.data;

    const steps = await fetchSteps(at);
    const distance = await fetchDistance(at);
    const calories = await fetchCalories(at);

    return res.json({
      success: true,
      access_token: at,
      refresh_token: rt,
      fitnessData: { steps, distance, calories, heartRate: "Heart Rate requires watch" }
    });

  } catch (err) {
    console.log("GOOGLE FIT ERROR:", err.response?.data);
    res.status(500).json({
      success: false,
      message: "Google Fit connection failed",
      error: err.response?.data
    });
  }
});

// ------------------------------
// FETCH STEPS
// ------------------------------
async function fetchSteps(token) {
  const end = Date.now();
  const start = end - 86400000;

  const response = await axios.post(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: start,
      endTimeMillis: end
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  let total = 0;
  response.data.bucket.forEach(bucket => {
    bucket.dataset[0].point.forEach(p => (total += p.value[0].intVal || 0));
  });

  return total;
}

// ------------------------------
// FETCH DISTANCE
// ------------------------------
async function fetchDistance(token) {
  const end = Date.now();
  const start = end - 86400000;

  const response = await axios.post(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      aggregateBy: [{ dataTypeName: "com.google.distance.delta" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: start,
      endTimeMillis: end
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  let meters = 0;
  response.data.bucket.forEach(bucket => {
    bucket.dataset[0].point.forEach(p => (meters += p.value[0].fpVal || 0));
  });

  return (meters / 1000).toFixed(2);
}

// ------------------------------
// FETCH CALORIES
// ------------------------------
async function fetchCalories(token) {
  const end = Date.now();
  const start = end - 86400000;

  const response = await axios.post(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    {
      aggregateBy: [{ dataTypeName: "com.google.calories.expended" }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: start,
      endTimeMillis: end
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  let kcal = 0;
  response.data.bucket.forEach(bucket => {
    bucket.dataset[0].point.forEach(p => (kcal += p.value[0].fpVal || 0));
  });

  return Math.round(kcal);
}

module.exports = router;
