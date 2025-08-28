import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!description.trim() || description.length < 10) {
      setError("Description must be at least 10 characters");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!/^[\d\s\-()+]{8,}$/.test(phone)) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Low");
    setContactEmail("");
    setPhone("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      await addDoc(collection(db, "tickets"), {
        title,
        description,
        priority,
        contactEmail,
        phone,
        status: "Open",
        createdBy: user?.email,
        assignedTo: "",
        createdAt: serverTimestamp(),
        date: formattedDate,       // Added date field
        time: formattedTime,        // Added time field
        timestamp: currentDate.getTime() // Added timestamp for sorting
      });
      resetForm();

      // Redirect based on user role
      if (user?.email === "agent@support.com") {
        navigate("/dashboard", {
          state: { message: "Ticket created successfully!" },
        });
      } else {
        navigate("/customer-dashboard", {
          state: { message: "Ticket created successfully!" },
        });
      }
    } catch (err) {
      setError("Failed to submit ticket. Please try again.");
      console.error("Ticket submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  const goToDashboard = () => {
    if (user?.email === "agent@support.com") {
      navigate("/dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8">
        <p className="text-center text-3xl text-red-500">
          Please log in to create tickets
        </p>
        <button
          onClick={handleLogin}
          className="text-red-600 text-2xl text-center block mt-5 py-2 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white p-4 sm:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500">
            Submit a Ticket
          </h1>
          <button
            onClick={goToDashboard}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          {/* Form fields */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter ticket description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows="4"
              required
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              placeholder="Enter your email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out`}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;