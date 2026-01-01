import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SignIn.module.css";

// ✅ BACKEND BASE URL (Render)
const API_BASE = import.meta.env.VITE_API_URL;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // ✅ FIXED LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      setToast({ show: true, message: data.message });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);

      if (data.success) {
        // ✅ SAVE USER FROM BACKEND
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ REDIRECT
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>

      {/* Floating Particles */}
      <div className={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      {toast.show && (
  <div className={styles.toast}>
    <span>{toast.message}</span>
    {showSuccess && (
  <div className={styles.successOverlay}>
    <div className={styles.successPopup}>
      <div className={styles.checkCircle}>
        <div className={styles.checkmark}>✓</div>
      </div>
      <h2 className={styles.successText}>Login Successful</h2>
    </div>
  </div>
)}

  </div>
)}

      

      <div className={styles.card}>
        
        {/* Premium Header with Glow */}
        <div className={styles.header}>
          <div className={styles.healthIconContainer}>
            <div className={styles.healthIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-6-4.35-9-8.28C-1.2 9.5.79 4 5.4 3.14A6 6 0 0 1 12 6a6 6 0 0 1 6.6-2.86C23.21 4 25.2 9.5 21 12.72C18 16.65 12 21 12 21z" />
              </svg>
            </div>
            <div className={styles.iconGlow}></div>
          </div>

          <h1 className={styles.title}>
            Welcome Back
            <span className={styles.titleSparkle}>✨</span>
          </h1>
          <p className={styles.subtitle}>
            Sign in to continue your <span className={styles.highlight}>health journey</span>
          </p>
        </div>

        {/* Premium Social Buttons */}
        <div className={styles.socialButtons}>
          <button className={`${styles.socialBtn} ${styles.googleBtn}`}>
            <div className={styles.socialIcon}>
              <svg viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.69 0 6.83 1.32 9.18 3.6l6.85-6.85C35.64 2.85 30.17 0 24 0 14.67 0 6.85 5.83 2.91 14.28l7.75 6.01C12.79 12.33 17.9 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24c0-1.67-.15-3.33-.45-4.96H24v9.42h12.74c-.55 2.96-2.21 5.47-4.71 7.17l7.58 5.91C43.64 37.36 46.5 31.17 46.5 24z" />
                <path fill="#4A90E2" d="M10.53 28.59c-.55-1.66-.87-3.43-.87-5.29s.32-3.63.87-5.29l-7.75-6.01C1.06 16.33 0 20.05 0 24c0 3.95 1.06 7.67 2.78 10.98l7.75-6.01z" />
                <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.58-5.91c-2.15 1.45-4.92 2.3-8.31 2.3-6.17 0-11.41-4.17-13.3-9.77l-7.75 6.01C6.85 42.17 14.67 48 24 48z" />
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialLabel}>Continue with</span>
              <span className={styles.socialProvider}>Google</span>
            </div>
            <div className={styles.arrowIcon}>→</div>
          </button>
        
          <button className={`${styles.socialBtn} ${styles.appleBtn}`}>
            <div className={styles.socialIcon}>
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.31-2.33 1.05-3.11z" />
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialLabel}>Continue with</span>
              <span className={styles.socialProvider}>Apple</span>
            </div>
            <div className={styles.arrowIcon}>→</div>
          </button>
        </div>

        {/* Premium Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>or continue with email</span>
          <span className={styles.dividerLine}></span>
        </div>

        {/* Enhanced Input Fields */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email Address</label>
          <div className={styles.inputContainer}>
            <input 
              className={styles.input} 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.passwordHeader}>
            <label className={styles.inputLabel}>Password</label>
            <button className={styles.showPasswordBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className={styles.inputContainer}>
            <input 
              className={styles.input} 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className={styles.optionsRow}>
          <label className={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className={styles.checkboxLabel}>Remember me</span>
            <span className={styles.checkmark}></span>
          </label>
          
          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        {/* Premium Sign In Button */}
<button className={styles.loginBtn} onClick={handleLogin}>
          <span className={styles.btnText}>Sign In</span>
          <span className={styles.btnIcon}>→</span>
          <div className={styles.btnGlow}></div>
        </button>

        {/* Enhanced Links */}
        <div className={styles.linksContainer}>
          <p className={styles.linkText}>
            Don't have an account?{" "}
            <Link to="/create-account" className={styles.primaryLink}>
              Create one
              <span className={styles.linkArrow}>→</span>
            </Link>
          </p>
          
          <p className={styles.linkText}>
            Need help?{" "}
            <a href="/support" className={styles.secondaryLink}>
              Contact Support
            </a>
          </p>
        </div>

        {/* Security Badge */}
        <div className={styles.securityBadge}>
          <div className={styles.lockIcon}>🔒</div>
          <span className={styles.securityText}>Your data is securely encrypted</span>
        </div>

      </div>
    </div>
  );
}
