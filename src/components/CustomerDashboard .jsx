import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Sidebar */}
      <div className="bg-gray-800 w-full md:w-60 space-y-6 py-7 px-6 shadow-lg">
        <div className="text-3xl font-bold text-center tracking-wide">Customer Portal</div>
        <nav className="space-y-4">
          <Link to="/ticket-form" className="block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md">
            Create Ticket
          </Link>
          <Link to="/dashboard" className="block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md">
            My Tickets
          </Link>
          <button 
            onClick={() => auth.signOut()} 
            className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
          Welcome, {user?.email}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
          Customer Support Dashboard
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;