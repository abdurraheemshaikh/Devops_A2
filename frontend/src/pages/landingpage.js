import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./login";
import Signup from "./signup";
import backgroundImage from "../components/event.jpg"; // Ensure correct path

const LandingPage = () => {
  const [view, setView] = useState("welcome"); // "welcome", "login", "signup"

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Container for Animation */}
      <div className="relative flex justify-center items-center w-full max-w-4xl min-h-screen">
        <AnimatePresence mode="wait">
          {view === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              className="absolute p-10 bg-white bg-opacity-90 rounded-lg shadow-lg text-gray-900 text-center w-[400px] flex flex-col items-center"
            >
              <h1 className="text-4xl font-bold mb-4">Welcome to Eventopia</h1>
              <p className="text-lg mb-6">Your one-stop platform for booking exciting events!</p>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                onClick={() => setView("login")}
              >
                Login
              </button>
              <p className="mt-4">
                Don't have an account?
                <button
                  className="text-purple-600 hover:underline ml-1"
                  onClick={() => setView("signup")}
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          )}

          {view === "login" && (
            <motion.div
              key="login"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              className="absolute"
            >
              <Login goBack={() => setView("welcome")} />
            </motion.div>
          )}

          {view === "signup" && (
            <motion.div
              key="signup"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              className="absolute"
            >
              <Signup goBack={() => setView("welcome")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
