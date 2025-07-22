
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Welcome() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const handleShowTickets = () => navigate('/dashboard');
  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };
  const handleLogin = () => navigate('/login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Sidebar */}
      <div className="bg-gray-800 w-full flex md:w-60 space-y-6 py-4 md:py-7 px-4 md:px-6 flex md:flex-col justify-between md:justify-start items-center md:items-start shadow-lg">
        <div className="text-2xl md:text-3xl font-bold text-center tracking-wide">Support Desk</div>
        
        <nav className="space-y-4 w-full flex flex-col justify-between items-center mb-8">
          {user && (
            <>
              <button
                onClick={() => navigate('/ticket-form')}
                className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="Create new ticket"
              >
                Create Ticket
              </button>
              <button
                onClick={handleShowTickets}
                className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="View support tickets"
              >
                View Tickets
              </button>
            </>
          )}
          
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-left block py-3 px-4 rounded-lg transition duration-200 bg-gray-700 hover:bg-red-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Login"
            >
              Login
            </button>
          )}
        </nav>

        {user && (
          <div className="hidden md:flex items-center mt-auto mb-4 space-x-2 w-full">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="User avatar" 
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span className="text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-sm overflow-hidden">
              <div className="truncate">{user.displayName || user.email.split('@')[0]}</div>
              <div className="text-gray-400 text-xs truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
          {user ? `Welcome, ${user.displayName || user.email.split('@')[0]}` : 'Please log in'}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl animate-slide-up animate-delay-100">
          Manage your support tickets effortlessly with our intuitive platform.
        </p>
        
        {user && (
          <button 
            onClick={() => navigate('/ticket-form')}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all duration-300 animate-slide-up animate-delay-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-700"
            aria-label="Create new ticket"
          >
            Create New Ticket
          </button>
        )}
      </div>
    </div>
  );
}

export default Welcome;




