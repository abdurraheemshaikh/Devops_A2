import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../components/bg.jpg"; // ✅ Ensure the correct path

const Confirmation = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4); // Countdown timer

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      navigate("/services"); // Redirect after 4 seconds
    }, 4000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className="relative h-screen flex flex-col justify-center items-center text-white text-center font-poppins overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🎊 Confetti Effect */}
      <div className="absolute w-2 h-2 bg-yellow-400 opacity-80 animate-confetti left-1/4"></div>
      <div className="absolute w-2 h-2 bg-pink-500 opacity-80 animate-confetti left-1/2 delay-300"></div>
      <div className="absolute w-2 h-2 bg-green-400 opacity-80 animate-confetti left-3/4 delay-600"></div>

      {/* 🎉 Animated Heading */}
      <h2 className="text-4xl font-bold drop-shadow-lg animate-pop-in">🎉 Booking Confirmed! 🎉</h2>

      {/* 📩 Fade-in text */}
      <p className="text-lg mt-3 opacity-0 animate-fade-in">
        Thank you for your booking. You will receive a confirmation email shortly.
      </p>

      {/* ⏳ Countdown Timer */}
      <p className="text-xl mt-4">
        Redirecting to homepage in{" "}
        <span className="text-yellow-300 font-bold text-2xl animate-pulse">{countdown}</span> seconds...
      </p>

      {/* ✨ Tailwind Animations */}
      <style>
        {`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in { animation: pop-in 0.6s ease-out; }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 1.5s forwards 0.5s; }

          @keyframes confetti {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
          .animate-confetti { animation: confetti 2s infinite ease-in-out; }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.2); opacity: 0.8; }
          }
          .animate-pulse { animation: pulse 1s infinite alternate; }
        `}
      </style>
    </div>
  );
};

export default Confirmation;
