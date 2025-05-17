import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);  // ✅ Use AuthContext for state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });

      if (response.data.token) {
        login(response.data.token, response.data.user_id); // ✅ Update AuthContext
        localStorage.setItem("userId", response.data.user_id);
        alert("Login successful!");
        navigate("/services"); // ✅ Redirect after login
      }
    } catch (error) {
      alert(error.response?.data?.error || "Invalid credentials, please try again.");
    }
  };

  return (
    <div className="p-10 bg-white shadow-lg rounded-lg text-gray-900 w-[400px] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 w-full">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
