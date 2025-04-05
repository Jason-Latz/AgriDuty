import React from 'react';
import GoogleMaps from './GoogleMaps';
const Home: React.FC = () => {
  return (
    <section className="section" id="home">
      <h2>Welcome to AgriDuty</h2>
      <p>Your Agricultural Management Solution</p>
      <GoogleMaps />
    </section>
  );
};

export default Home; 