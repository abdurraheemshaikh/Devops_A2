import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Navbar from "./components/navbar";
import Services from "./pages/services";
import Payment from "./pages/payment";
import Confirmation from "./pages/confirmation";
import { AuthProvider } from "./context/AuthContext";

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarOnPages = ["/", "/login", "/signup"]; // No navbar on these pages

  return (
    <div>
      {!hideNavbarOnPages.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/payment/:eventId" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
