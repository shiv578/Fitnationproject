import { Routes, Route } from "react-router-dom";
import SignIn from "./SignIn.jsx";
import Createaccount from "./createaccount.jsx";
import Dashboard from "./Dashboard.jsx";
import GoogleFitCallback from "./GoogleFitCallback.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />

      {/* 👇 ADD THIS ROUTE shivam*/}
      <Route path="/signin" element={<SignIn />} />   

      <Route path="/create-account" element={<Createaccount />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/callback" element={<GoogleFitCallback />} />

    </Routes>
  );
}
