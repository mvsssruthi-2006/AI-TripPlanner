import "./Vision.css";

function Vision() {
  return (
    <section className="vision">
      <div className="gradient-overlay"></div>
      <div className="vision-content">
        <h2>Our Vision</h2>
        <p>
          We believe that travel should be accessible, enjoyable, and
          stress-free for everyone. Trip Navigator was created to simplify
          trip planning and make every journey memorable. Whether you are a
          solo traveler or exploring with family, we are here to guide you.
        </p>
      </div>
      
      {/* Floating decorative icons */}
      <div className="floating-icon">🌍</div>
      <div className="floating-icon">🗺️</div>
      <div className="floating-icon">🧳</div>
    </section>
  );
}

export default Vision;