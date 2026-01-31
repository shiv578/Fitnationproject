const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./users");

// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone regex (10-digit India number)
const phoneRegex = /^[0-9]{10}$/;
// Allowed genders
const validGenders = ["male", "female", "other"];
router.put("/update-profile/:id", async (req, res) => {
  const { firstName, lastName, email, phone, gender, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Basic validation
    if (!firstName || !email)
      return res.status(400).json({ success: false, message: "Name and email are required" });

    // Build update object
    const updates = { firstName, lastName, email, phone, gender };

    // ✔ Only if user wants to change password
    if (newPassword && newPassword.trim() !== "") {

      // Must enter old password too
      if (!oldPassword)
        return res.status(400).json({
          success: false,
          message: "Old password is required to set a new password"
        });

      // Compare old password
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match)
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect"
        });

      // Hash new password
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
