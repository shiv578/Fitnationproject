import css from "./Dashboard.module.css";

export default function GoogleFitLogin() {
  const connectGoogleFit = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button className={css.googleBtn} onClick={connectGoogleFit}>
      <span className={css.googleIcon}>
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.86-6.86C35.9 2.56 30.47 0 24 0 14.6 0 6.42 5.38 2.56 13.22l8.03 6.24C12.6 13.98 17.9 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9.01h12.7c-.55 2.9-2.18 5.36-4.64 7.02l7.18 5.58C43.98 36.44 46.5 30.7 46.5 24z"/>
          <path fill="#FBBC05" d="M10.59 28.46c-.48-1.44-.76-2.98-.76-4.46s.27-3.02.76-4.46l-8.03-6.24C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.7l8.03-6.24z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.91-5.81l-7.18-5.58c-2 1.34-4.56 2.13-8.73 2.13-6.1 0-11.4-4.48-13.41-10.54l-8.03 6.24C6.42 42.62 14.6 48 24 48z"/>
        </svg>
      </span>
      <span className={css.googleText}>Login with Google Fit</span>
    </button>
  );
}  