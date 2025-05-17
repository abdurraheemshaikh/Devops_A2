import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ goBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/users", { name: name, email, password });
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create account");
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      className="p-10 bg-white bg-opacity-90 shadow-lg rounded-lg text-gray-900 w-[400px] flex flex-col items-center"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4 w-full">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
          Sign Up
        </button>
      </form>
      <button className="mt-4 text-purple-600 hover:underline" onClick={goBack}>
        ← Back
      </button>
    </motion.div>
  );
};

export default Signup;
