import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import {Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'react-feather';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  // where,
  // getDocs,
  doc,
  updateDoc,
  // deleteDoc,
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

// Ticket Card Component
const TicketCard = ({ ticket, onStatusChange, onAssign }) => (
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

      <div className="grid grid-cols-2 gap-4">
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

        <div className="col-span-2">
          <span className="font-semibold">Assigned To:</span>
          <select
            value={ticket.assignedTo || "Unassigned"}
            onChange={(e) => onAssign(ticket.id, e.target.value)}
            className="ml-2 p-1 border rounded w-full text-sm"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Frontend Team">Frontend Team</option>
            <option value="Backend Team">Backend Team</option>
            <option value="DataBase Team">DataBase Team</option>
            <option value="Mobile Team">Mobile Team</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-4">
        <span className="text-sm text-gray-500">
          Created: {ticket.displayDate} at {ticket.displayTime}
        </span>
      </div>
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-200 rounded-lg p-6 animate-pulse h-64"></div>
    ))}
  </div>
);

const AgentDashboard = () => {
  const [user] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all customers who have created tickets
  useEffect(() => {
    if (!user) return;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "tickets"),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const ticketsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            displayDate: new Date(doc.data().createdAt?.seconds * 1000).toLocaleDateString(),
            displayTime: new Date(doc.data().createdAt?.seconds * 1000).toLocaleTimeString()
          }));
          
          // Get unique customers from tickets
          const customerEmails = [...new Set(ticketsData.map(ticket => ticket.createdBy))];
          const customerList = customerEmails.map(email => ({
            email,
            name: email.split('@')[0] // Simple name extraction from email
          }));
          
          setCustomers(customerList);
          setTickets(ticketsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customer data");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  // Filter tickets by selected customer
  const filteredTickets = selectedCustomer
    ? tickets.filter(ticket => ticket.createdBy === selectedCustomer.email)
    : tickets;

  // Group tickets by status
  const openTickets = filteredTickets.filter(t => t.status === "Open");
  const inProgressTickets = filteredTickets.filter(t => t.status === "In Progress");
  const resolvedTickets = filteredTickets.filter(t => t.status === "Resolved");

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

  const handleAssignTicket = async (ticketId, agentEmail) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { 
        assignedTo: agentEmail,
        updatedAt: new Date() 
      });
    } catch (err) {
      console.error("Error assigning ticket:", err);
      setError("Failed to assign ticket");
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
              <div className="text-xl font-bold tracking-wide">Agent Portal</div>
            </div>
            
            <nav className="hidden md:flex space-x-2">
               <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-500"
              >
              View Tickets
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

      <main className="flex-1 p-6 sm:p-8">
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
              Welcome, Agent {user?.email}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6">
              Customer Support Dashboard
            </p>
          </div>

          <div className="mb-8 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Customers</h2>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse h-20"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className={`p-4 rounded-lg transition-colors ${
                    !selectedCustomer 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  All Customers
                </button>
                {customers.map((customer) => (
                  <button
                    key={customer.email}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-4 rounded-lg transition-colors ${
                      selectedCustomer?.email === customer.email
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-300 truncate">{customer.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Customer Info */}
          {selectedCustomer && (
            <div className="mb-8 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">
                Viewing tickets for: {selectedCustomer.name}
              </h2>
              <p className="text-gray-300">{selectedCustomer.email}</p>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="mt-4 text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                View All Customers
              </button>
            </div>
          )}
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Tickets Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Open Tickets</h3>
                  <p className="text-3xl font-bold text-red-400">{openTickets.length}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">In Progress</h3>
                  <p className="text-3xl font-bold text-yellow-400">{inProgressTickets.length}</p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">Resolved</h3>
                  <p className="text-3xl font-bold text-green-400">{resolvedTickets.length}</p>
                </div>
              </div>

              <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedCustomer ? `${selectedCustomer.name}'s Tickets` : 'All Tickets'}
                </h2>
                
                {filteredTickets.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onStatusChange={handleUpdateStatus}
                        onAssign={handleAssignTicket}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {selectedCustomer
                        ? `${selectedCustomer.name} hasn't created any tickets yet`
                        : 'No tickets found in the system'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard; 