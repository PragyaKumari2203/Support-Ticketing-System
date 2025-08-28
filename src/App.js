// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import TicketForm from "./components/TicketForm"
import ForgotPassword from "./components/Forgot-password";
import Register from "./components/Registration ";
import CustomerDashboard from "./components/CustomerDashboard ";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentDashboard from "./components/AgentDashboard"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['agent','customer']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/customer-dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/agent-dashboard" element={
          <ProtectedRoute allowedRoles={['agent']}>
            <AgentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/ticket-form" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <TicketForm />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;