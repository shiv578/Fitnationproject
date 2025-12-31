const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.json({
        success: false,
        answer: "Question is required"
      });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: question }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    const answer =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't answer that.";

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("GEMINI ERROR:", error.response?.data || error.message);
    res.json({
      success: false,
      answer: "FitChat is temporarily unavailable."
    });
  }
});

module.exports = router;
