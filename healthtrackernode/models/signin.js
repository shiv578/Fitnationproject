const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./users");

router.post("/sign-in", async (req, res) => {
  console.log("SIGN-IN API HIT:", req.body);  // <-- CHECK THIS LOG

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email & password required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ success: false, message: "Incorrect password" });
  }

 return res.status(200).json({
  success: true,
  message: "Login successful",
  user: {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    gender: user.gender
  }
});

});

module.exports = router;
