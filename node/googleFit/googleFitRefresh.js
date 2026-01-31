const axios = require("axios");
require("dotenv").config();

async function refreshAccessToken(refresh_token) {
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GF_CLIENT_ID,
        client_secret: process.env.GF_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
      } 
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error);
    return null;
  }
}

module.exports = refreshAccessToken;        