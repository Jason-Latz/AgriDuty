import React, { useState } from "react";
import GoogleMaps from "./GoogleMaps";

interface Recommendation {
  topRecommendations: string[];
  justification1: string;
  justification2: string;
  justification3: string;
}

const Home: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);

  return (
    <section className="section" id="home">
      <GoogleMaps onRecommendationsChange={setRecommendations} />
      <div className="recommendations-section">
        <h2>Recommended Crops</h2>
        <div className="recommendations-container">
          <div className="recommendations-list">
            <h3>Top Recommendations</h3>
            <ul>
              {recommendations?.topRecommendations ? (
                recommendations.topRecommendations.map((crop, index) => (
                  <li key={index}>{crop}</li>
                ))
              ) : (
                <li className="placeholder">Click on the map and analyze to see recommendations</li>
              )}
            </ul>
          </div>
          <div className="justifications">
            <h3>Analysis</h3>
            {recommendations?.topRecommendations && recommendations.topRecommendations.length >= 3 ? (
              <>
                <div className="justification-card">
                  <h4>{recommendations.topRecommendations[0]}</h4>
                  <p>{recommendations.justification1}</p>
                </div>
                <div className="justification-card">
                  <h4>{recommendations.topRecommendations[1]}</h4>
                  <p>{recommendations.justification2}</p>
                </div>
                <div className="justification-card">
                  <h4>{recommendations.topRecommendations[2]}</h4>
                  <p>{recommendations.justification3}</p>
                </div>
              </>
            ) : (
              <div className="justification-card">
                <p>Click on the map and analyze to see detailed analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
