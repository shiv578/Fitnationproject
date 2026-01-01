import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CreateAccount.module.css";

// ✅ BACKEND BASE URL (Render)
const API_BASE = import.meta.env.VITE_API_URL;

export default function Createaccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ FIXED SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("CREATE ACCOUNT ERROR:", error);
      alert("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <h1 className={styles.title}>Create Account</h1>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="phone"
            type="text"
            placeholder="Phone Number"
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <select
            className={styles.input}
            name="gender"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
        </div>

        <button className={styles.loginBtn} onClick={handleSubmit}>
          Create Account
        </button>

        <p className={styles.linkText}>
          Already have an account? <Link to="/">Sign In</Link>
        </p>

      </div>
    </div>
  );
}
