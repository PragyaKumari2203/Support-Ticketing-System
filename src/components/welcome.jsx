import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Welcome() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleShowTickets = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Sidebar */}
      <div className="bg-gray-800 w-full flex md:w-60 space-y-6 py-7 px-6 flex md:flex-col justify-between md:justify-start items-center md:items-start shadow-lg">
        <div className="text-3xl font-bold text-center tracking-wide">Support Desk</div>
        <nav className="space-y-4 w-full flex flex-col justify-between items-center mb-8">
          <button
            onClick={handleShowTickets}
            className="w-30 text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md"
          >
            View Tickets
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-30 text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
          {user ? `Welcome, ${user?.email}` : 'Please log in to see your tickets'}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
          Manage your support tickets effortlessly with our intuitive platform.
        </p>
      </div>
    </div>
  );
}

export default Welcome;