import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login"
import Dashboard from "./components/dashboard"
import TicketForm from "./components/ticketForm"
import Welcome from "./components/welcome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket-form" element={<TicketForm />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;