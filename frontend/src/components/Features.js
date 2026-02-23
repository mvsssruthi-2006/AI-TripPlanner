import "./Features.css";
import {
  FaRobot,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPlaneDeparture,
  FaComments,
  FaBrain,
  FaHotel,
  FaImage,
} from "react-icons/fa";

function Features() {
  return (
    <section className="features">
      <div className="gradient-overlay"></div>

      {/* Floating decorative icons */}
      <div className="floating-icon">🌍</div>
      <div className="floating-icon">🗺️</div>
      <div className="floating-icon">🧳</div>
      <div className="floating-icon">✈️</div>

      <div className="features-header">
        <h2>Autonomous AI Travel Intelligence</h2>
        <p>
          A next-generation multi-agent AI system that plans, optimizes,
          explains, and prepares your entire trip with intelligent automation.
        </p>
      </div>

      <div className="features-grid">

        <div className="feature-card">
          <FaRobot className="feature-icon" />
          <h3>Multi-Agent AI Architecture</h3>
          <p>
            Destination, itinerary, accommodation, transport, budget, and
            explainability agents collaborate autonomously to generate a
            complete, structured travel plan.
          </p>
        </div>

        <div className="feature-card">
          <FaBrain className="feature-icon" />
          <h3>LLM + Smart Fallback Engine</h3>
          <p>
            Combines large language models with deterministic fallback logic
            to prevent repetition, invalid data, and static itinerary output.
          </p>
        </div>

        <div className="feature-card">
          <FaMapMarkedAlt className="feature-icon" />
          <h3>Smart Destination Intelligence</h3>
          <p>
            Validates must-visit places, filters invalid attractions, analyzes
            interests and climate, and selects optimized stay clusters.
          </p>
        </div>

        <div className="feature-card">
          <FaCalendarAlt className="feature-icon" />
          <h3>Dynamic Pace-Based Itinerary</h3>
          <p>
            Generates day-wise Morning, Afternoon, and Evening plans
            tailored to relaxed, moderate, or fast travel pace with
            logical attraction sequencing.
          </p>
        </div>

        <div className="feature-card">
          <FaHotel className="feature-icon" />
          <h3>Location-Aware Accommodation Mapping</h3>
          <p>
            Selects hotels only from valid accommodation zones and maps
            them intelligently near attraction clusters within budget.
          </p>
        </div>

        <div className="feature-card">
          <FaMoneyBillWave className="feature-icon" />
          <h3>Intelligent Budget Distribution</h3>
          <p>
            Automatically allocates budget across flights, hotels, and
            daily expenses with affordability checks per traveler.
          </p>
        </div>

        <div className="feature-card">
          <FaPlaneDeparture className="feature-icon" />
          <h3>Transport Intelligence Layer</h3>
          <p>
            Recommends optimized flight options based on duration,
            cost efficiency, comfort, and trip purpose.
          </p>
        </div>

        <div className="feature-card">
          <FaImage className="feature-icon" />
          <h3>Smart Media Enrichment</h3>
          <p>
            Automatically enriches attractions with images and
            descriptions using multi-source API fallback
            (Wikipedia, Unsplash, OpenTripMap).
          </p>
        </div>

        <div className="feature-card">
          <FaComments className="feature-icon" />
          <h3>Conversational Travel Assistant</h3>
          <p>
            Understands flexible text prompts, preferences like
            “avoid crowded places,” and dynamically adapts the trip plan.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Features;
