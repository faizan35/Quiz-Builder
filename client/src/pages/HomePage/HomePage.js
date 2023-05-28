import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Catchy Headline Here</h1>
        <p>Brief description or tagline.</p>
        <button>Create Quiz</button>
        <Link to="/quiz">
          {" "}
          {/* Wrap the button with the Link component */}
          <button>Take a Demo</button>
        </Link>
      </div>

      <div className="features-overview">
        {/* Add features overview content here */}
      </div>
    </div>
  );
}

export default HomePage;
