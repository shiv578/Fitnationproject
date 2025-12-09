const express = require("express");
const router = express.Router();
const axios = require("axios");

// REFRESH TOKEN → GET NEW ACCESS TOKEN
router.post("/googlefit/refresh", async (req, res) => {
  const refresh_token = req.body.refresh_token;

  try {
    const refreshResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: "269984522890-uvhcb0nr954av1ettntf3e13enbgl24g.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token,
        grant_type: "refresh_token",
      }
    );

    const newAccessToken = refreshResponse.data.access_token;

    return res.json({
      success: true,
      access_token: newAccessToken
    });

  } catch (error) {
    console.log("TOKEN REFRESH ERROR:", error.response?.data);
    return res.json({
      success: false,
      message: "Failed to refresh token",
      error: error.response?.data
    });
  }
});

module.exports = router;
