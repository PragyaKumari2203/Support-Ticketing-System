import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const Dashboard = () => {
  const [user] = useAuthState(auth); // Hook for Firebase authentication state
  const [tickets, setTickets] = useState([]); // State for tickets
  const navigate = useNavigate(); // Hook for navigation

  // Fetch tickets when the user changes
  useEffect(() => {
    const fetchTickets = async () => {
      if (user?.email === "customer@support.com") {
        // Fetch only customer's tickets
        const q = query(
          collection(db, "tickets"),
          where("createdBy", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        setTickets(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } else if (user?.email === "agent@support.com") {
        // Fetch all tickets for agent
        const q = query(collection(db, "tickets"));
        const querySnapshot = await getDocs(q);
        setTickets(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    };

    fetchTickets();
  }, [user]); // Dependency array ensures this runs when `user` changes

  // Handle assigning a ticket to an agent
  const handleAssignTicket = async (ticketId, agentEmail) => {
    await updateDoc(doc(db, "tickets", ticketId), {
      assignedTo: agentEmail,
    });
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, assignedTo: agentEmail } : ticket
      )
    );
  };

  // Handle updating the status of a ticket
  const handleEditStatus = async (ticketId, newStatus) => {
    await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  // Handle deleting a ticket
  const handleDelete = async (ticketId) => {
    try {
      await deleteDoc(doc(db, "tickets", ticketId)); // Delete the ticket from Firestore
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId)); // Remove the ticket from the local state
    } catch (error) {
      console.error("Error deleting ticket: ", error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  // Handle user login navigation
  const handleLogin = () => {
    navigate("/login");
  };
  

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-20 md:w-44 space-y-6 py-7 px-2">
        <div className="text-white text-2xl font-bold text-center">
          Support Desk
        </div>
        <nav>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {user ? `Welcome, ${user?.email}` : "Please log in to see tickets"}
            </h1>

            {user && (
              <Link
                to="/ticket-form"
                className="text-white hover:text-black bg-red-500 px-3 py-2 rounded"
              >
                Raise Ticket
              </Link>
            )}
          </div>

          {/* Tickets Cards */}
          {user ? (
            tickets.length !== 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-base">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className=" bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="space-y-4">
                      <div>
                        <span className="font-semibold">Ticket ID:</span>{" "}
                        {ticket.id}
                      </div>
                      <div>
                        <span className="font-semibold">Title:</span>{" "}
                        {ticket.title}
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>{" "}
                        {ticket.description}
                      </div>
                      <div>
                        <span className="font-semibold">Priority:</span>{" "}
                        {ticket.priority}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        {user?.email === "agent@support.com" ? (
                          <select
                            value={ticket.status}
                            onChange={(e) =>
                              handleEditStatus(ticket.id, e.target.value)
                            }
                            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          ticket.status
                        )}
                      </div>
                      <div>
                        <span className="font-semibold">Created By:</span>{" "}
                        {ticket.createdBy}
                      </div>
                      <div>
                        <span className="font-semibold">Assigned To:</span>{" "}
                        {user?.email === "agent@support.com" ? (
                          <select
                            value={ticket.assignedTo}
                            onChange={(e) =>
                              handleAssignTicket(ticket.id, e.target.value)
                            }
                            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="Unassigned">Unassigned</option>
                            <option value="Authentication">Authentication</option>
                            <option value="Billing">Billing</option>
                            <option value="Developer Team">Developer Team</option>
                          </select>
                        ) : (
                          ticket.assignedTo || "Unassigned"
                        )}
                      </div>
                      {user?.email === "customer@support.com" && (
                        <div>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {user?.email === "agent@support.com" && ticket.createdBy===user?.email &&(
                        <div>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
          ""
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;