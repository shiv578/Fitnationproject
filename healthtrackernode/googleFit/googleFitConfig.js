module.exports = {
  client_id: "269984522890-uvhcb0nr954av1ettntf3e13enbgl24g.apps.googleusercontent.com",
  client_secret: "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",
  redirect_uri: "http://localhost:5173/auth/callback",
  scopes: [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.body.read",
    "https://www.googleapis.com/auth/fitness.location.read",   // REQUIRED for distance
    "https://www.googleapis.com/auth/fitness.heart_rate.read"
  ]
};   