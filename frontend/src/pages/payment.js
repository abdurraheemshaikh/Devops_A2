import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../components/bg.jpg";

function Payment() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [phone, setPhone] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [error, setError] = useState("");
  const [animatedPrice, setAnimatedPrice] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      setError("User not found! Please log in.");
      return;
    }

    // Fetch user details
    axios.get(`http://127.0.0.1:3001/users/${storedUserId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("User data could not be retrieved.");
      });

    // Fetch event details
    axios.get(`http://127.0.0.1:3002/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
      })
      .catch(() => {
        setError("Event not found.");
      });
  }, [eventId]);

  // Calculate total price
  const totalPrice = event?.price ? event.price * ticketCount : 0;

  // Animate total price change
  useEffect(() => {
    let start = animatedPrice;
    let end = totalPrice;
    let duration = 500;
    let step = (end - start) / (duration / 16);

    const animate = () => {
      if (Math.abs(end - start) > Math.abs(step)) {
        start += step;
        setAnimatedPrice(Math.round(start));
        requestAnimationFrame(animate);
      } else {
        setAnimatedPrice(end);
      }
    };

    animate();
  }, [totalPrice]);

  // Handle booking submission
  const handlePayment = () => {
    if (!user) {
      setError("User information is missing. Please log in.");
      return;
    }
  
    const bookingData = {
      user_id: Number(user.user_id),  // Rename userId -> user_id
      event_id: Number(eventId),  // Rename eventId -> event_id
      tickets: Number(ticketCount),  // Rename ticketCount -> tickets
    };
    
    
    console.log("Booking Data:", bookingData); // Debugging Line
  
    axios.post("http://127.0.0.1:3003/bookings", bookingData)
      .then((res) => {
        console.log("Booking Response:", res.data); // Debugging Line
        alert("Booking Confirmed!");
        navigate("/confirmation");
      })
      .catch((err) => {
        console.error("Booking Error:", err.response?.data || err.message); // Debugging Line
        setError("Booking failed. Try again.");
      });
  };
  
  return (
    <div
      className="relative min-h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Payment for <span className="text-purple-600">{event?.name || "Loading..."}</span>
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="border border-gray-300 p-2 w-full rounded-md bg-gray-100"
            />

            <label className="block text-gray-700 font-semibold mt-3">Email:</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="border border-gray-300 p-2 w-full rounded-md bg-gray-100"
            />

            <label className="block text-gray-700 font-semibold mt-3">Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Number of Tickets:</label>
            <input
              type="number"
              value={ticketCount}
              min="1"
              onChange={(e) => setTicketCount(Number(e.target.value))}
              className="border border-gray-300 p-2 w-full rounded-md"
            />

            <p className="text-lg font-semibold text-gray-700 mt-3">
              Total Price: <span className="text-green-600 text-2xl font-bold animate-pulse">
                ${animatedPrice}
              </span>
            </p>

            <label className="block text-gray-700 font-semibold mt-3">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
            >
              <option>Credit Card</option>
              <option>PayPal</option>
              <option>Cash</option>
            </select>
          </div>
        </div>

        <button
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 w-full rounded-lg"
          onClick={handlePayment}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default Payment;
