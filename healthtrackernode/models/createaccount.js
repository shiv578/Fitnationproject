const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");  
const User = require("./users");
 
// Create Account API
router.post("/create-account", async (req, res) => {
  const { firstName, lastName, email, phone, gender, password, confirmPassword } = req.body;

  // 1. Check required fields
  if (!firstName || !lastName || !email || !phone || !gender || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // 2. Validate first name
  if (/^\d+$/.test(firstName)) {
    return res.status(400).json({ success: false, message: "First name cannot be only numbers" });
  }

  // 3. Validate last name
  if (/^\d+$/.test(lastName)) {
    return res.status(400).json({ success: false, message: "Last name cannot be only numbers" });
  }

  // 4. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // 5. Phone validation
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
  }

  // 6. Password check
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  // 7. Email already exists?
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  // 8. HASH THE PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // 9. Save user
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    gender,
    password: hashedPassword
  });

  await newUser.save();

  return res.status(200).json({
    success: true,
    message: "Account created successfully!"
  });
});
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;  