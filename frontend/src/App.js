import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Vision from "./components/Vision";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlanTrip from "./pages/PlanTrip";
import MyTrips from "./pages/MyTrips";
import Contact from "./pages/Contact";
import Destinations from "./pages/Destinations";
import TripResult from "./pages/TripResult";
import MapPage from "./pages/MapPage";




function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <Vision />
              
            </>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plan-trip" element={<PlanTrip />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trip-result" element={<TripResult />} />
        <Route path="/map" element={<MapPage />} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
