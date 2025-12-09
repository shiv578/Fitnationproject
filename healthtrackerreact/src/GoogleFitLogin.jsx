export default function GoogleFitLogin() {
  const connectGoogleFit = () => {
window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button
      onClick={connectGoogleFit}
      style={{
        padding: "10px 16px",
        background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        marginRight: "20px"
      }}
    >
      Google Fit
    </button>
  );
}
