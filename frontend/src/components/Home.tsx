import React from "react";
import GoogleMaps from "./GoogleMaps";
import CropRecommendations from "./CropRecommendations";

const Home: React.FC = () => {
  return (
    <section className="section" id="home">
      <GoogleMaps />
      <CropRecommendations recommendations={null} />
    </section>
  );
};

export default Home;
