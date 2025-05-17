import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "../components/bg.jpg";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const { token } = useContext(AuthContext); // ✅ Check if user is logged in
  const navigate = useNavigate();

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return; // Prevent API call if no token

    axios.get("http://127.0.0.1:3002/events", {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Secure API request
    })
      .then((res) => {
        console.log("Fetched Events:", res.data);
        if (Array.isArray(res.data)) {
          setServices(res.data);
        } else {
          setError("Unexpected response format.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch events. Please try again later.");
        console.error("Error fetching events:", err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Section */}
      <div className="relative px-8 sm:px-16 lg:px-24 py-10 min-h-screen flex flex-col items-center text-white">
        <motion.h2 
          className="text-4xl font-extrabold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Available Events
        </motion.h2>

        {/* Error Message */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-300">Loading events...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-300">No events available.</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {services.map((service) => (
              <motion.div
                key={service.event_id}
                className={`p-4 bg-[#fdf9f3] rounded-lg shadow-lg max-w-xs text-black cursor-pointer transform transition-transform ${
                  selectedService ? "opacity-50" : "hover:scale-105 hover:shadow-xl"
                }`}
                onClick={() => setSelectedService(service)}
                whileHover={{ scale: selectedService ? 1 : 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>

                {/* 📍 Location */}
                <div className="flex items-center text-gray-700 text-sm mb-1">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span>{service.location || "N/A"}</span>
                </div>

                {/* 📅 Date */}
                <div className="flex items-center text-gray-600 text-sm">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span>{service.date || "TBA"}</span>
                </div>

                {/* Details Button */}
                <button
                  className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-md transition-all w-full shadow-md"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* EXPANDED CARD - Shows when a card is clicked */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              className="bg-white text-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-lg text-center relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedService(null)}
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-4">{selectedService.name}</h2>
              <p className="text-gray-700"><span className="font-semibold">Price:</span> ${selectedService.price || "N/A"} USD</p>
              <p className="text-gray-700"><span className="font-semibold">Location:</span> {selectedService.location || "TBA"}</p>
              <p className="text-gray-700"><span className="font-semibold">Available Tickets:</span> {selectedService.available_tickets ?? "N/A"}</p>
              <p className="text-gray-700"><span className="font-semibold">Date:</span> {selectedService.date || "TBA"}</p>
              <p className="text-gray-700"><span className="font-semibold">Time:</span> {selectedService.time || "TBA"}</p>
              <p className="text-gray-600 mt-2 text-sm">{selectedService.description || "No description available."}</p>

              {/* Book Now Button */}
              <motion.button
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2 rounded-md transition-all w-full shadow-lg"
                onClick={() => navigate(`/payment/${selectedService.event_id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Services;
