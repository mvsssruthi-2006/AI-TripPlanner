import { useState } from "react";
import { motion } from "framer-motion";
import "./PlanTrip.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlanTrip() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    budget: "",
    days: 3,
    adults: 1,
    children: 0,

    purpose: "Vacation",
    pace: "Relaxed",
    climate: "Warm",

    accommodation: "Hotel",
    hotel: "3-star",
    food: "Veg",
    transport: "Flight",
    interests: [],
    
    mustVisit: "",
    customNotes: "",
  });

  const navigate = useNavigate();

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!form.origin.trim()) newErrors.origin = "Source city is required";
      if (!form.destination.trim()) newErrors.destination = "Destination is required";
      if (!form.budget || form.budget <= 0) newErrors.budget = "Valid budget is required";
      if (form.days < 1) newErrors.days = "At least 1 day is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleGenerateTrip = async () => {
    if (loading) return;

    if (!validateStep(1)) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        origin: form.origin,
        destination: form.destination,
        days: Number(form.days),
        travelers: Number(form.adults) + Number(form.children),
        budget: Number(form.budget),

        purpose: form.purpose.toLowerCase(),
        interests: form.interests.map(i => i.toLowerCase()),
        pace: form.pace.toLowerCase(),
        climate: form.climate.toLowerCase(),
        hotel_category: form.hotel.toLowerCase(),
        accommodation_type: form.accommodation.toLowerCase(),
        transport_mode: form.transport.toLowerCase(),
        food_preference: form.food.toLowerCase(),

        must_visit: form.mustVisit
          .split(",")
          .map(item => item.trim())
          .filter(item => item),

        custom_prompt: form.customNotes
      };

     const token = localStorage.getItem("token");

const res = await axios.post(
  "http://localhost:8000/api/plan-trip",
  payload,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

      // const existingTrips =
      //   JSON.parse(localStorage.getItem("myTrips")) || [];

      // existingTrips.unshift(res.data);
      // localStorage.setItem("myTrips", JSON.stringify(existingTrips));

      navigate("/trip-result", { state: res.data });

    } catch (err) {
      console.error("Trip generation failed:", err);
      alert("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (item) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((i) => i !== item)
        : [...prev.interests, item],
    }));
  };

  const getInterestIcon = (interest) => {
    const icons = {
      "Beach": "🏖️",
      "Mountains": "🏔️",
      "Culture": "🏛️",
      "Nightlife": "🌃",
      "Shopping": "🛍️",
      "Nature": "🌿",
      "Photography": "📸",
      "Wellness": "🧘",
      "Food": "🍜",
      "Adventure": "🧗"
    };
    return icons[interest] || "📍";
  };

  return (
    <motion.div
      className="plan-page"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/img5.jpg)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="plan-wrapper">
        <div className="steps">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`step ${step >= s ? "active" : ""}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="plan-card">
          {/* STEP 1 - Trip Basics */}
          {step === 1 && (
            <>
              <h2>🧭 Trip Basics</h2>

              <div className="grid">
                <Input 
                  label="Source City" 
                  value={form.origin} 
                  onChange={(v) => setForm({ ...form, origin: v })}
                  error={errors.origin}
                />
                <Input 
                  label="Destination" 
                  value={form.destination} 
                  onChange={(v) => setForm({ ...form, destination: v })}
                  error={errors.destination}
                />
                <Input 
                  label="Total Budget (₹)" 
                  value={form.budget} 
                  onChange={(v) => setForm({ ...form, budget: v })}
                  error={errors.budget}
                />
                <Counter 
                  label="Travel Days" 
                  value={form.days} 
                  onChange={(v) => setForm({ ...form, days: v })}
                  error={errors.days}
                />
                <Counter 
                  label="Adults" 
                  value={form.adults} 
                  onChange={(v) => setForm({ ...form, adults: v })}
                />
                <Counter 
                  label="Children" 
                  value={form.children} 
                  onChange={(v) => setForm({ ...form, children: v })}
                />
              </div>

              <div className="actions right">
                <button className="btn-primary" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* STEP 2 - Travel Style */}
          {step === 2 && (
            <>
              <h2>🎯 Travel Style</h2>

              <label className="section-label">Trip Purpose</label>
              <div className="chip-grid purpose-grid">
                {[
                  { label: "Vacation", icon: "🏖️" },
                  { label: "Honeymoon", icon: "💖" },
                  { label: "Work", icon: "💼" },
                  { label: "Solo", icon: "🧭" },
                  { label: "Family", icon: "👨‍👩‍👧‍👦" },
                  { label: "Friends", icon: "🧑‍🤝‍🧑" },
                  { label: "Adventure", icon: "⛰️" },
                  { label: "Business", icon: "💼" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`chip purpose-chip ${form.purpose === item.label ? "active" : ""}`}
                    onClick={() => setForm({ ...form, purpose: item.label })}
                  >
                    <span className="chip-icon">{item.icon}</span>
                    <span className="chip-label">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid">
                <Select 
                  label="Travel Pace" 
                  value={form.pace} 
                  options={["Relaxed", "Moderate", "Fast"]} 
                  onChange={(v) => setForm({ ...form, pace: v })} 
                />
                <Select 
                  label="Preferred Climate" 
                  value={form.climate} 
                  options={["Warm", "Cold", "Mild", "Moderate"]} 
                  onChange={(v) => setForm({ ...form, climate: v })} 
                />
              </div>

              <div className="actions between">
                <button className="btn-outline" onClick={handleBack}>← Back</button>
                <button className="btn-primary" onClick={handleNext}>Next →</button>
              </div>
            </>
          )}

          {/* STEP 3 - Stay & Interests */}
          {step === 3 && (
            <>
              <h2>🏨 Stay & Interests</h2>

              <div className="form-section">
                <Select
                  label="Accommodation Type"
                  value={form.accommodation}
                  options={["Hotel", "Resort", "Homestay"]}
                  onChange={(v) => setForm({ ...form, accommodation: v })}
                />
              </div>

              <div className="form-section">
                <label className="section-label">Hotel Category</label>
                <div className="rating-cards">
                  {["Budget", "3-star", "4-star", "5-star"].map((h) => (
                    <div
                      key={h}
                      className={`rating-card ${form.hotel === h ? "active" : ""}`}
                      onClick={() => setForm({ ...form, hotel: h })}
                    >
                      <div className="stars">
                        {"★".repeat(h === "Budget" ? 2 : Number(h[0]))}
                      </div>
                      <span className="rating-label">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="section-label">Food Preference</label>
                <div className="food-pills">
                  {["Veg", "Non-Veg", "Vegan", "Both"].map((f) => (
                    <div
                      key={f}
                      className={`food-pill ${form.food === f ? "active" : ""}`}
                      onClick={() => setForm({ ...form, food: f })}
                    >
                      <span className="pill-icon">
                        {f === "Veg" && "🥦"}
                        {f === "Non-Veg" && "🍗"}
                        {f === "Vegan" && "🌱"}
                        {f === "Both" && "🍽️"}
                      </span>
                      <span className="pill-label">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <Select
                  label="Transport Mode"
                  value={form.transport}
                  options={["Flight", "Train", "Bus", "Car"]}
                  onChange={(v) => setForm({ ...form, transport: v })}
                />
              </div>

              <div className="form-section">
                <label className="section-label">Main Interests</label>
                <div className="chip-grid interests-grid">
                  {[
                    "Beach", "Mountains", "Culture", "Nightlife", 
                    "Shopping", "Nature", "Photography", "Wellness",
                    "Food", "Adventure"
                  ].map((i) => (
                    <div
                      key={i}
                      className={`chip interest-chip ${form.interests.includes(i) ? "active" : ""}`}
                      onClick={() => toggleInterest(i)}
                    >
                      <span className="chip-icon">{getInterestIcon(i)}</span>
                      <span className="chip-label">{i}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="actions between">
                <button className="btn-outline" onClick={handleBack}>← Back</button>
                <button className="btn-primary" onClick={handleNext}>Next →</button>
              </div>
            </>
          )}

          {/* STEP 4 - Additional Requests */}
          {step === 4 && (
            <>
              <h2>📝 Additional Requests</h2>
              
              <p className="step-description">
                Help us personalize your trip further with these optional details
              </p>

              <div className="form-section">
                <label className="section-label">📍 Must-Visit Places</label>
                <div className="field">
                  <input
                    type="text"
                    value={form.mustVisit}
                    onChange={(e) => setForm({ ...form, mustVisit: e.target.value })}
                    placeholder="Palolem Beach, Fort Aguada (comma separated)"
                    className="text-input"
                  />
                  <small className="hint">Enter places separated by commas</small>
                </div>
              </div>

              <div className="form-section">
                <label className="section-label">💭 Custom Requirements</label>
                <div className="field">
                  <textarea
                    value={form.customNotes}
                    onChange={(e) => setForm({ ...form, customNotes: e.target.value })}
                    placeholder="Example: I want a peaceful trip, avoid crowded places, prefer scenic views, and good food in the evenings."
                    rows="5"
                    className="text-input"
                  />
                  <small className="hint">
                    Tell us about your preferences, restrictions, or special requests
                  </small>
                </div>
              </div>

              <div className="actions between">
                <button className="btn-outline" onClick={handleBack}>← Back</button>
                <button 
                  className="btn-primary" 
                  onClick={handleGenerateTrip} 
                  disabled={loading}
                >
                  {loading ? "Generating your trip..." : "Generate Trip 🚀"}
                </button>
              </div>

              {loading && (
                <div className="loading-box">
                  <div className="spinner"></div>
                  <p>Planning your perfect trip… ✨</p>
                  <p className="subtitle">AI agents are curating your personalized itinerary</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- REUSABLES ---------- */

const Input = ({ label, value, onChange, error }) => {
  const isNumber = label.toLowerCase().includes("budget") || label.toLowerCase().includes("days");
  return (
    <div className="field">
      <label>{label}</label>
      <input 
        type={isNumber ? "number" : "text"} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        min={isNumber ? 0 : undefined}
        className={error ? "error" : ""}
      />
      {error && <small className="error-text">{error}</small>}
    </div>
  );
};

const Select = ({ label, value, options, onChange }) => (
  <div className="field">
    <label>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const Counter = ({ label, value, onChange, error }) => (
  <div className="field">
    <label>{label}</label>
    <div className="counter">
      <button onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)}>+</button>
    </div>
    {error && <small className="error-text">{error}</small>}
  </div>
);

export default PlanTrip;