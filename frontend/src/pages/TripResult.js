import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./TripResult.css";

function TripResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const contentRef = useRef(null);
  const topRef = useRef(null);

  /* ================= BACKGROUND STYLE (JS ONLY) ================= */
  const backgroundStyle = {
    minHeight: "100vh",
    padding: "120px 80px",
    color: "white",
    backgroundImage: `
      linear-gradient(
        135deg,
        rgba(30, 60, 114, 0.9),
        rgba(42, 82, 152, 0.9)
      ),
      url("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  /* ================= HARD SAFETY ================= */
  if (!state || typeof state !== "object") {
    return (
      <div className="trip-empty-container">
        <motion.div 
          className="trip-empty-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>✨ No Trip Data Available</h1>
          <p>Looks like you haven't planned a trip yet. Let's create your perfect journey!</p>
          <motion.button 
            className="empty-primary-btn"
            onClick={() => navigate("/plan-trip")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Plan Your Adventure ✈️
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ================= NORMALIZE BACKEND DATA ================= */
  const destination = state.destination || {};
  const itinerary = typeof state.itinerary === "object" ? state.itinerary : {};
  const transport = typeof state.transport === "object" ? state.transport : {};
  const budget = typeof state.budget === "object" ? state.budget : {};
  const explanation = state.explanation || "";
  const user = state.user_profile || {};
  const hotels = state.hotels && typeof state.hotels === "object" ? state.hotels : {};

  const hasHotels = Object.keys(hotels).length > 0;
  const hasTransport = Array.isArray(transport.options) && transport.options.length > 0;
  const hasItinerary = Object.keys(itinerary).length > 0;
  const hasAttractions = Array.isArray(destination.top_attractions) && destination.top_attractions.length > 0;
  const hasBudget = budget.total_estimated_budget;
  const hasExplanation = explanation;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
    
    // Scroll to content after state update with a slight delay to allow for animation
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start'
    });
  };

  return (
    <motion.div
      style={backgroundStyle}
      className="trip-result-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ================= TOP REFERENCE ================= */}
      <div ref={topRef} />

      {/* ================= HERO HEADER ================= */}
      <motion.div 
        className="hero-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="gradient-text">{destination.destination}</h1>
        <p className="subtitle">Your Personalized Journey Awaits</p>
      </motion.div>

      {/* ================= SECTION BUTTONS GRID (3 per row) ================= */}
      <motion.div 
        className="sections-grid"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Destination Overview Button */}
        {hasAttractions && (
          <motion.button
            className={`section-button ${expandedSection === 'destination' ? 'active' : ''}`}
            onClick={() => toggleSection('destination')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Destination Highlights</span>
          </motion.button>
        )}

        {/* Accommodation Button */}
        {(hasHotels || destination.key_areas) && (
          <motion.button
            className={`section-button ${expandedSection === 'accommodation' ? 'active' : ''}`}
            onClick={() => toggleSection('accommodation')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Accommodation</span>
          </motion.button>
        )}

        {/* Transport Button */}
        {hasTransport && (
          <motion.button
            className={`section-button ${expandedSection === 'transport' ? 'active' : ''}`}
            onClick={() => toggleSection('transport')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Transport Options</span>
          </motion.button>
        )}

        {/* Itinerary Button */}
        {hasItinerary && (
          <motion.button
            className={`section-button ${expandedSection === 'itinerary' ? 'active' : ''}`}
            onClick={() => toggleSection('itinerary')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Day-wise Itinerary</span>
          </motion.button>
        )}

        {/* Budget Button */}
        {hasBudget && (
          <motion.button
            className={`section-button ${expandedSection === 'budget' ? 'active' : ''}`}
            onClick={() => toggleSection('budget')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Budget Breakdown</span>
          </motion.button>
        )}

        {/* Why This Plan Button */}
        {hasExplanation && (
          <motion.button
            className={`section-button ${expandedSection === 'explanation' ? 'active' : ''}`}
            onClick={() => toggleSection('explanation')}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">Why This Plan?</span>
          </motion.button>
        )}
      </motion.div>

      {/* ================= EXPANDED CONTENT SECTIONS ================= */}
      <div ref={contentRef}>
        <AnimatePresence mode="wait">
          {/* Destination Content - KEEPING YOUR EXACT DESIGN, FIXED OVERLAP */}
          {expandedSection === 'destination' && hasAttractions && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card trip-destination-content">
                <h2>📍 Must-Visit Places in {destination.destination}</h2>
                <div className="trip-destinations-grid">
                  {destination.top_attractions.map((place, i) => (
                    <motion.div
                      key={i}
                      className={`trip-destination-card ${
                        i % 7 === 0
                          ? "trip-card-large"
                          : i % 4 === 0
                          ? "trip-card-medium"
                          : "trip-card-small"
                      }`}
                      style={{ 
                        backgroundImage: place.image_url ? `url(${place.image_url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.04 }}
                    >
                      <div className="trip-card-overlay">
                        <h3>{place.name}</h3>
                        <span className="trip-country">📍 {destination.destination}</span>
                        
                        {place.description && (
                          <p className="trip-desc">{place.description}</p>
                        )}
                        
                        {place.tags && Array.isArray(place.tags) && (
                          <div className="trip-tags">
                            {place.tags.map((tag, idx) => (
                              <span key={idx}>{tag}</span>
                            ))}
                          </div>
                        )}
                        
                        {place.rating && (
                          <div className="trip-rating">⭐ {place.rating}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
          
          {/* Accommodation Content */}
          {expandedSection === 'accommodation' && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card">
                <h2>🏨 Where You'll Stay</h2>
                
                {!hasHotels ? (
                  <div className="fallback-hotels">
                    <p className="fallback-message">
                      ⚠️ Live hotel data could not be fetched. Recommended stay areas:
                    </p>
                    
                    {Array.isArray(destination.key_areas) && destination.key_areas.map((area, areaIdx) => (
                      <div key={areaIdx} className="area-section">
                        <h3>📍 {area}</h3>
                        <div className="hotels-grid">
                          {["Hotel Grand Palace", "City View Residency", "Comfort Inn Suites"].map((name, idx) => (
                            <motion.div 
                              key={idx} 
                              className="hotel-card"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="hotel-icon">🏨</div>
                              <h4>{name}</h4>
                              <p className="hotel-price">₹2500 – ₹4500 / night</p>
                              <p className="hotel-tag">Suitable for leisure & sightseeing</p>
                              <a
                                href={`https://www.google.com/maps/search/${name}+${area}+${destination.destination}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hotel-link"
                              >
                                View on Map →
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  Object.entries(hotels).map(([area, list]) => (
                    <div key={area} className="area-section">
                      <h3>📍 {area}</h3>
                      <div className="hotels-grid">
                        {Array.isArray(list) && list.map((h, i) => (
                          <motion.div 
                            key={i} 
                            className="hotel-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="hotel-icon">🏨</div>
                            <h4>{h.name}</h4>
                            <p className="hotel-price">{h.price_per_night}</p>
                            {/* <p className="hotel-tag">{h.suitable_for}</p> */}
                            {h.booking_link && (
                              <a href={h.booking_link} target="_blank" rel="noreferrer" className="hotel-link">
                                Book Now →
                              </a>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          )}

          {/* Transport Content */}
          {expandedSection === 'transport' && hasTransport && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card">
                <h2>🚍 Getting Around</h2>
                <div className="transport-grid">
                  {transport.options.map((opt, i) => (
                    <motion.div 
                      key={i} 
                      className="transport-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="transport-icon">🚌</div>
                      <div className="transport-details">
                        <h4>{opt.name}</h4>
                        <p className="transport-route">{opt.departure}</p>
                        <p className="transport-duration">⏱ {opt.duration}</p>
                        <p className="transport-price">{opt.price}</p>
                        {opt.booking_link && (
                          <a href={opt.booking_link} target="_blank" rel="noreferrer" className="transport-link">
                            Book Now →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Itinerary Content */}
          {expandedSection === 'itinerary' && hasItinerary && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card">
                <h2>🗓 Your Daily Adventure</h2>
                <div className="itinerary-timeline">
                  {Object.entries(itinerary).map(([day, plan], index) => (
                    <motion.div 
                      key={day} 
                      className="timeline-day"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="day-marker">{day}</div>
                      <div className="day-content">
                        <div className="activity morning">
                          <span className="activity-time">🌅 Morning</span>
                          <p>{plan.Morning}</p>
                        </div>
                        <div className="activity afternoon">
                          <span className="activity-time">☀️ Afternoon</span>
                          <p>{plan.Afternoon}</p>
                        </div>
                        <div className="activity evening">
                          <span className="activity-time">🌙 Evening</span>
                          <p>{plan.Evening}</p>
                        </div>
                        {/* {plan["Stay Area"] && (
                          <div className="stay-area">
                            <span className="stay-label">📍 Stay:</span>
                            <span>{plan["Stay Area"]}</span>
                          </div>
                        )} */}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* View Map Button */}
                <motion.div 
                  className="map-button-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    className="primary-btn map-btn"
                    onClick={() => navigate("/map", { state: state })}
                  >
                    <span className="btn-icon">🗺</span>
                    View on Map
                  </button>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Budget Content */}
          {expandedSection === 'budget' && hasBudget && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card">
                <h2>💰 Your Budget Breakdown</h2>
                <div className="budget-chart">
                  <div className="budget-item">
                    <span className="budget-label">🏨 Accommodation</span>
                    <span className="budget-value">{budget.hotel_budget}</span>
                  </div>
                  <div className="budget-item">
                    <span className="budget-label">🚍 Transport</span>
                    <span className="budget-value">{budget.transport_budget}</span>
                  </div>
                  <div className="budget-item">
                    <span className="budget-label">🍽 Daily Expenses</span>
                    <span className="budget-value">{budget.daily_expenses}</span>
                  </div>
                  <div className="budget-total">
                    <span className="total-label">Total Budget</span>
                    <span className="total-value">{budget.total_estimated_budget}</span>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Explanation Content */}
          {expandedSection === 'explanation' && hasExplanation && (
            <motion.section
              className="expanded-content"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-card explanation-card">
                <h2>🧠 Why We Chose This For You</h2>
                <div className="explanation-content">
                  <p>{explanation}</p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ================= BACK TO TOP BUTTON ================= */}
      <motion.div 
        className="back-to-top-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button 
          className="primary-btn back-to-top-btn"
          onClick={scrollToTop}
        >
          <span className="btn-icon">↑</span>
          Back to Trip Sections
        </button>
      </motion.div>
    </motion.div>
  );
}

export default TripResult;