import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth); // Hook for Firebase authentication state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !contactEmail || !phone) {
      setError("All fields are required.");
      return;
    }
    try {
      await addDoc(collection(db, "tickets"), {
        title,
        description,
        priority,
        contactEmail,
        phone,
        status: "Open",
        createdBy: user?.email,
        assignedTo: "",
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to submit ticket.");
      console.log(err);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8">
        <p className="text-center text-3xl text-red-500">
          Please log in to see tickets
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500 mb-3">
          Submit a Ticket
        </h1>
        <form onSubmit={handleSubmit} className="space-y-2 text-black">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
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

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;