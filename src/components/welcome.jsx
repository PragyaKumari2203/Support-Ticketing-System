
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Welcome() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShowTickets = () => navigate("/dashboard");
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const handleLogin = () => navigate("/");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Top Navbar */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center">

          <div className="text-2xl font-bold">Support Desk</div>

          {/* Hamburger Icon */}
          <button
            className="md:hidden block text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-4 items-center">
            {user && (
              <>
                <button
                  onClick={() => navigate("/ticket-form")}
                  className="bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  Create Ticket
                </button>
                <button
                  onClick={handleShowTickets}
                  className="bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  View Tickets
                </button>
              </>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
              >
                Login
              </button>
            )}
            {user && (
              <div className="flex items-center gap-2 ml-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-sm leading-tight max-w-[140px]">
                  <div className="truncate">
                    {user.displayName || user.email.split("@")[0]}
                  </div>
                  <div className="text-gray-400 text-xs truncate">{user.email}</div>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
  <nav className="w-full md:hidden px-4 pb-4 flex flex-col gap-2">

            {user && (
              <>
                <button
                  onClick={() => {
                    navigate("/ticket-form");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => {
                    handleShowTickets();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
                >
                  View Tickets
                </button>
              </>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
                className="block w-full bg-gray-700 hover:bg-red-500 px-4 py-2 rounded-lg transition"
              >
                Login
              </button>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
          {user ? `Welcome, ${user.displayName || user.email.split("@")[0]}` : "Please log in"}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl animate-slide-up animate-delay-100">
          Manage your support tickets effortlessly with our intuitive platform.
        </p>

        {user && (
          <button
            onClick={() => navigate("/ticket-form")}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all duration-300 animate-slide-up animate-delay-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-700"
            aria-label="Create new ticket"
          >
            Create New Ticket
          </button>
        )}
      </main>
    </div>
  );
}

export default Welcome;
