import React, { useState } from 'react';
import axios from 'axios';
import './CropPredictor.css';

const API_URL = 'http://localhost:5000';

const CropPredictor = () => {
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };

  // Get current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setError('Error getting location: ' + err.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Submit the prediction request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.lat || !location.lon) {
      setError('Please enter both latitude and longitude');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/predict`, {
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon)
      });
      
      setPredictions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching predictions: ' + 
        (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="crop-predictor">
      <h2>Crop Yield Predictor</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="number"
            name="lat"
            step="any"
            value={location.lat}
            onChange={handleInputChange}
            placeholder="Enter latitude"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="number"
            name="lon"
            step="any"
            value={location.lon}
            onChange={handleInputChange}
            placeholder="Enter longitude"
            required
          />
        </div>
        
        <div className="button-group">
          <button type="button" onClick={getCurrentLocation} disabled={loading}>
            Use My Location
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Predict Crops'}
          </button>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {predictions && (
        <div className="results">
          <h3>Results for {predictions.location.name}</h3>
          
          <div className="weather-info">
            <h4>Current Weather:</h4>
            <p>Temperature: {predictions.weather.temperature}°C</p>
            <p>Humidity: {predictions.weather.humidity}%</p>
            <p>Wind Speed: {predictions.weather.wind_speed} m/s</p>
          </div>
          
          <div className="predictions-list">
            <h4>Recommended Crops:</h4>
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Suitability Score</th>
                </tr>
              </thead>
              <tbody>
                {predictions.predictions.map((item, index) => (
                  <tr key={index} className={index < 3 ? 'highlight' : ''}>
                    <td>{item.crop}</td>
                    <td>{(item.prediction * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPredictor; 