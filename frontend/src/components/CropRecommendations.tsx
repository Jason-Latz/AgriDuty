import React from 'react';

interface CropRecommendationsProps {
  recommendations: {
    topRecommendations: string[];
    justification1: string;
    justification2: string;
    justification3: string;
  } | null;
}

const CropRecommendations: React.FC<CropRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations) {
    return (
      <div className="recommendations-container">
        <h2>Crop Recommendations</h2>
        <p>Click on the map and press "Analyze" to see recommendations</p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h2>Crop Recommendations</h2>
      
      <div className="recommendations-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Crop</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.topRecommendations.map((crop, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{crop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="justifications">
        <h3>Justifications</h3>
        <div className="justification-card">
          <h4>Top Recommendation</h4>
          <p>{recommendations.justification1}</p>
        </div>
        <div className="justification-card">
          <h4>Second Recommendation</h4>
          <p>{recommendations.justification2}</p>
        </div>
        <div className="justification-card">
          <h4>Third Recommendation</h4>
          <p>{recommendations.justification3}</p>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendations; 