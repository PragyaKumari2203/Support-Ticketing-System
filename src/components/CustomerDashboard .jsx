import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'react-feather';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';

// Status badge colors mapping
const statusColors = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800'
};

// Priority colors mapping
const priorityColors = {
  High: 'text-red-600',
  Medium: 'text-yellow-600',
  Low: 'text-green-600'
};

const TicketCard = ({ ticket, onStatusChange, onDelete }) => (
  <div className="bg-white hover:bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
        <div className="text-xs text-gray-500 text-right">
          <div>{ticket.displayDate}</div>
          <div>{ticket.displayTime}</div>
        </div>
      </div>

      <p className="text-gray-700">{ticket.description}</p>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="font-semibold">Status:</span>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
            className="ml-2 p-1 border rounded text-sm"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <span className="font-semibold">Priority:</span>
          <span className={`ml-2 font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-4">
        <span className="text-sm text-gray-500">
          Created: {ticket.displayDate} at {ticket.displayTime}
        </span>
        <button
          onClick={() => onDelete(ticket.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const TicketSection = ({ title, tickets, onStatusChange, onDelete }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title} ({tickets.length})</h2>
    {tickets.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    ) : (
      <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
        No {title.toLowerCase()} tickets found
      </div>
    )}
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-lg p-6 animate-pulse h-64"></div>
    ))}
  </div>
);

const CustomerDashboard = () => {
  const [user] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "tickets"),
          where("createdBy", "==", user.email),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const ticketsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            displayDate: new Date(doc.data().createdAt?.seconds * 1000).toLocaleDateString(),
            displayTime: new Date(doc.data().createdAt?.seconds * 1000).toLocaleTimeString()
          }));
          setTickets(ticketsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets");
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  // Filter tickets by status
  const openTickets = tickets.filter(t => t.status === "Open");
  const inProgressTickets = tickets.filter(t => t.status === "In Progress");
  const resolvedTickets = tickets.filter(t => t.status === "Resolved");

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error("Error updating ticket status:", err);
      setError("Failed to update ticket status");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
    } catch (err) {
      console.error("Error deleting ticket:", err);
      setError("Failed to delete ticket");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Please log in to continue</h1>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-700 text-white">
    
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold tracking-wide">Customer Portal</div>
            </div>
            
            <nav className="hidden md:flex space-x-2">
              <Link 
                to="/ticket-form" 
                className="text-white hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
                aria-label="Create new ticket"
              >
                Create Ticket
              </Link>
              <Link 
                to="/dashboard" 
                className="text-white hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
                aria-label="View my tickets"
              >
                My Tickets
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-white hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </nav>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 pb-3 px-2">
            <div className="space-y-1">
              <Link 
                to="/ticket-form" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-500"
              >
                Create Ticket
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-500"
              >
                My Tickets
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 sm:p-8 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right font-bold"
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Welcome, {user?.email}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Customer Support Dashboard
            </p>
            <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">How can we help you today?</h2>
              <p className="mb-6 text-gray-600">
                Our support team is ready to assist you with any issues or questions you may have.
              </p>
              <Link 
                to="/ticket-form" 
                className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md"
              >
                Create New Ticket
              </Link>
            </div>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'open' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('open')}
            >
              Open ({openTickets.length})
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'inProgress' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('inProgress')}
            >
              In Progress ({inProgressTickets.length})
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'resolved' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved ({resolvedTickets.length})
            </button>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {activeTab === 'open' && (
                <TicketSection
                  title="Open Tickets"
                  tickets={openTickets}
                  onStatusChange={handleUpdateStatus}
                  onDelete={handleDeleteTicket}
                />
              )}

              {activeTab === 'inProgress' && (
                <TicketSection
                  title="In Progress Tickets"
                  tickets={inProgressTickets}
                  onStatusChange={handleUpdateStatus}
                  onDelete={handleDeleteTicket}
                />
              )}

              {activeTab === 'resolved' && (
                <TicketSection
                  title="Resolved Tickets"
                  tickets={resolvedTickets}
                  onStatusChange={handleUpdateStatus}
                  onDelete={handleDeleteTicket}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;