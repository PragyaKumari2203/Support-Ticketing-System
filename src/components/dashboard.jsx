

// import React, { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, db } from "../firebase";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   deleteDoc,
//   getDoc
// } from "firebase/firestore";

// const Dashboard = () => {
//   const [tickets, setTickets] = useState([]);
//   const [user, loading] = useAuthState(auth);
//   const [userRole, setUserRole] = useState("");
//   const [ticketsLoading, setTicketsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch user role
//   useEffect(() => {
//     const fetchUserRole = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
//           if (userDoc.exists()) {
//             setUserRole(userDoc.data().role);
//           } else if (user.email === "agent@support.com") {
//             setUserRole('agent');
//           } else {
//             setUserRole('customer');
//           }
//         } catch (error) {
//           console.error("Error fetching user role:", error);
//         }
//       }
//     };
//     fetchUserRole();
//   }, [user]);

//   // Fetch tickets based on role
//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user || !userRole) return;
      
//       try {
//         setTicketsLoading(true);
//         let q;
//         if (userRole === 'customer') {
//           q = query(collection(db, "tickets"), where("createdBy", "==", user.email));
//         } else if (userRole === 'agent') {
//           q = query(collection(db, "tickets"));
//         }
        
//         const querySnapshot = await getDocs(q);
//         setTickets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } catch (error) {
//         console.error("Error fetching tickets:", error);
//       } finally {
//         setTicketsLoading(false);
//       }
//     };
    
//     fetchTickets();
//   }, [user, userRole]);

//   const handleAssignTicket = async (ticketId, agentEmail) => {
//     try {
//       await updateDoc(doc(db, "tickets", ticketId), { assignedTo: agentEmail });
//       setTickets(tickets.map(ticket => 
//         ticket.id === ticketId ? { ...ticket, assignedTo: agentEmail } : ticket
//       ));
//     } catch (error) {
//       console.error("Error assigning ticket:", error);
//     }
//   };

//   const handleEditStatus = async (ticketId, newStatus) => {
//     try {
//       await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
//       setTickets(tickets.map(ticket =>
//         ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
//       ));
//     } catch (error) {
//       console.error("Error updating ticket status:", error);
//     }
//   };

//   const handleDelete = async (ticketId) => {
//     try {
//       await deleteDoc(doc(db, "tickets", ticketId));
//       setTickets(tickets.filter(ticket => ticket.id !== ticketId));
//     } catch (error) {
//       console.error("Error deleting ticket:", error);
//     }
//   };

//   const handleLogout = () => {
//     auth.signOut();
//     navigate("/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-row">
//       {/* Sidebar */}
//       <div className="bg-gray-800 text-white w-20 md:w-44 space-y-6 py-7 px-2">
//         <div className="text-white text-2xl font-bold text-center">
//           Support Desk
//         </div>
//         <nav>
//           {user ? (
//             <>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
//               >
//                 Logout
//               </button>
//               {userRole === 'customer' && (
//                 <Link
//                   to="/ticket-form"
//                   className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
//                 >
//                   New Ticket
//                 </Link>
//               )}
//             </>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
//             >
//               Login
//             </button>
//           )}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-4">
//         <div className="max-w-5xl mx-auto">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-2xl font-bold text-gray-800">
//               {user ? `Welcome, ${user.email}` : "Please log in"}
//             </h1>
//             {userRole === 'customer' && (
//               <Link
//                 to="/ticket-form"
//                 className="text-white hover:text-black bg-red-500 px-3 py-2 rounded"
//               >
//                 Raise Ticket
//               </Link>
//             )}
//           </div>

//           {user && (
//             <>
//               {ticketsLoading ? (
//                 <div className="flex justify-center items-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//                 </div>
//               ) : tickets.length > 0 ? (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {tickets.map((ticket) => (
//                     <div
//                       key={ticket.id}
//                       className="bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//                     >
//                       <div className="space-y-4">
//                         <h3 className="font-bold text-lg">{ticket.title}</h3>
//                         <p className="text-gray-700">{ticket.description}</p>
                        
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <span className="font-semibold">Status:</span>
//                             {userRole === 'agent' ? (
//                               <select
//                                 value={ticket.status}
//                                 onChange={(e) => handleEditStatus(ticket.id, e.target.value)}
//                                 className="ml-2 p-1 border rounded"
//                               >
//                                 <option value="Open">Open</option>
//                                 <option value="In Progress">In Progress</option>
//                                 <option value="Resolved">Resolved</option>
//                               </select>
//                             ) : (
//                               <span className="ml-2">{ticket.status}</span>
//                             )}
//                           </div>
//                           <br />
//                           <div>
//                             <span className="font-semibold">Priority:</span>
//                             <span className="ml-2">{ticket.priority}</span>
//                           </div>
                          
//                           {userRole === 'agent' && (
//                             <div className="col-span-2">
//                               <span className="font-semibold">Assigned To:</span>
//                               <select
//                                 value={ticket.assignedTo || "Unassigned"}
//                                 onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
//                                 className="ml-2 p-1 border rounded w-full"
//                               >
//                                 <option value="Unassigned">Unassigned</option>
//                                 <option value="Frontend Team">Frontend Team</option>
//                                 <option value="Backend Team">Backend Team</option>
//                                 <option value="Mobile Team">Mobile Team</option>
//                               </select>
//                             </div>
//                           )}
//                         </div>
                        
//                         <div className="flex justify-between items-center pt-2">
//                           <span className="text-sm text-gray-500">
//                             Created by: {ticket.createdBy}
//                           </span>
//                           <button
//                             onClick={() => handleDelete(ticket.id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="col-span-3 text-center py-20">
//                   <div className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                       {userRole === 'agent' 
//                         ? "No tickets found in the system" 
//                         : "You haven't created any tickets yet"}
//                     </h3>
//                     {userRole === 'customer' && (
//                       <Link
//                         to="/ticket-form"
//                         className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                       >
//                         Create Your First Ticket
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;














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
  getDoc
} from "firebase/firestore";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState("");
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else if (user.email === "agent@support.com") {
            setUserRole('agent');
          } else {
            setUserRole('customer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  // Fetch tickets based on role
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !userRole) return;
      
      try {
        setTicketsLoading(true);
        let q;
        if (userRole === 'customer') {
          q = query(collection(db, "tickets"), where("createdBy", "==", user.email));
        } else if (userRole === 'agent') {
          q = query(collection(db, "tickets"));
        }
        
        const querySnapshot = await getDocs(q);
        const ticketsData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Format the date and time for display
          displayDate: doc.data().date || new Date(doc.data().createdAt?.seconds * 1000).toLocaleDateString(),
          displayTime: doc.data().time || new Date(doc.data().createdAt?.seconds * 1000).toLocaleTimeString()
        }));
        
        // Sort tickets by timestamp (newest first)
        ticketsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setTickets(ticketsData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setTicketsLoading(false);
      }
    };
    
    fetchTickets();
  }, [user, userRole]);

   const handleAssignTicket = async (ticketId, agentEmail) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { assignedTo: agentEmail });
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assignedTo: agentEmail } : ticket
      ));
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const handleEditStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status: newStatus });
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-row">
     
      <div className="bg-gray-800 text-white w-20 md:w-44 space-y-6 py-7 px-2">
         <div className="bg-gray-800 text-white w-20 md:w-44 space-y-6 py-7 px-2">
        <div className="text-white text-2xl font-bold text-center">
          Support Desk
        </div>
        <nav>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              >
                Logout
              </button>
              {userRole === 'customer' && (
                <Link
                  to="/ticket-form"
                  className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  New Ticket
                </Link>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Login
            </button>
          )}
        </nav>
      </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {user ? `Welcome, ${user.email}` : "Please log in"}
            </h1>
            {userRole === 'customer' && (
              <Link
                to="/ticket-form"
                className="text-white hover:text-black bg-red-500 px-3 py-2 rounded"
              >
                Raise Ticket
              </Link>
            )}
          </div>

          {user && (
            <>
              {ticketsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : tickets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{ticket.title}</h3>
                          <div className="text-xs text-gray-500 text-right">
                            <div>{ticket.displayDate}</div>
                            <div>{ticket.displayTime}</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700">{ticket.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-semibold">Status:</span>
                            {userRole === 'agent' ? (
                              <select
                                value={ticket.status}
                                onChange={(e) => handleEditStatus(ticket.id, e.target.value)}
                                className="ml-2 p-1 border rounded"
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            ) : (
                              <span className="ml-2">{ticket.status}</span>
                            )}
                          </div>
                          <br />
                          <div>
                            <span className="font-semibold">Priority:</span>
                            <span className={`ml-2 ${
                              ticket.priority === 'High' ? 'text-red-600' : 
                              ticket.priority === 'Medium' ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          
                          {userRole === 'agent' && (
                            <div className="col-span-2">
                              <span className="font-semibold">Assigned To:</span>
                              <select
                                value={ticket.assignedTo || "Unassigned"}
                                onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                                className="ml-2 p-1 border rounded w-full"
                              >
                                <option value="Unassigned">Unassigned</option>
                                <option value="Frontend Team">Frontend Team</option>
                                <option value="Backend Team">Backend Team</option>
                                <option value="Mobile Team">Mobile Team</option>
                              </select>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-gray-500">
                            Created by: {ticket.createdBy}
                          </span>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-span-3 text-center py-20">
                  <div className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {userRole === 'agent' 
                        ? "No tickets found in the system" 
                        : "You haven't created any tickets yet"}
                    </h3>
                    {userRole === 'customer' && (
                      <Link
                        to="/ticket-form"
                        className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Create Your First Ticket
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;