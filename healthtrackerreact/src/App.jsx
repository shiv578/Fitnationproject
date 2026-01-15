import { Routes, Route } from "react-router-dom";
import SignIn from "./SignIn.jsx";
import Createaccount from "./createaccount.jsx";
import Dashboard from "./Dashboard.jsx";
import GoogleFitCallback from "./GoogleFitCallback.jsx";
import { ThemeProvider } from "./components/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-account" element={<Createaccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/callback" element={<GoogleFitCallback />} />
      </Routes>
    </ThemeProvider>
  );
}
