import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleFitCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch(`http://localhost:5000/api/auth/google/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          console.log("Google Fit Response:", data);

          if (data.success) {
            localStorage.setItem("googleFitAccessToken", data.access_token);
            localStorage.setItem("googleFitRefreshToken", data.refresh_token);
            localStorage.setItem("googleFitData", JSON.stringify(data.fitnessData));

            alert("Google Fit Connected Successfully!");
          } else {
            alert("Failed to connect Google Fit");
          }

          navigate("/dashboard");
        })
        .catch(err => {
          console.log("ERROR:", err);
          navigate("/dashboard");
        });
    }
  }, []);

  return (
    <h2 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
      Connecting Google Fit...
    </h2>
  );
}
