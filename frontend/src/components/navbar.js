import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Remove token (or adjust as needed)
    navigate("/"); // Redirect to landing page
  };

  // Add Event Function
  const handleAddEvent = async () => {
    const event_id = Math.floor(Math.random() * 1000); // Generate a random event ID
    const name = prompt("Enter Event Name:");
    const price = parseFloat(prompt("Enter Event Price:"));
    const location = prompt("Enter Event Location:");
    const available_tickets = parseInt(prompt("Enter Available Tickets:"));
    const description = prompt("Enter Event Description:");
    const date = prompt("Enter Event Date (YYYY-MM-DD):");
    const time = prompt("Enter Event Time (e.g., 4:00 PM):");

    if (!name || isNaN(price) || !location || isNaN(available_tickets) || !description || !date || !time) {
      alert("All fields are required and must be valid!");
      return;
    }

    const eventData = {
      event_id,
      name,
      price,
      location,
      available_tickets,
      description,
      date,
      time,
    };

    try {
      const response = await fetch("http://localhost:3002/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add event");

      alert("Event added successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete Event Function
  const handleDeleteEvent = async () => {
    const name = prompt("Enter Event Name:");
    const location = prompt("Enter Event Location:");

    if (!name || !location) {
      alert("Both name and location are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }), // Only sending name & location
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete event");

      alert("Event deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav className="bg-transparent py-6 px-4 mb-6 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Eventopia</h1>
        <div>
          <Link to="/services" className="text-white mx-4 hover:underline">
            Services
          </Link>
          <button onClick={handleAddEvent} className="text-white mx-4 hover:underline">
            Add Event
          </button>
          <button onClick={handleDeleteEvent} className="text-white mx-4 hover:underline">
            Delete Event
          </button>
          <button onClick={handleLogout} className="text-white mx-4 hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
