import React from 'react';

const LandingPage: React.FC = () => {
  const scrollToHome = () => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to AgriDuty</h1>
        <p className="landing-subtitle">Your Agricultural Management Solution</p>
        <button 
          className="landing-button"
          onClick={scrollToHome}
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default LandingPage; 