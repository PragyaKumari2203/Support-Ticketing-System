import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login"
import Dashboard from "./components/dashboard"
import TicketForm from "./components/ticketForm"
import Welcome from "./components/welcome";
import ForgotPassword from "./components/forgot-password";
import Register from "./components/Registration ";
import CustomerDashboard from "./components/CustomerDashboard ";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
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