import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";
import AcresInput from "./AcresInput";
import CropRecommendations from "./CropRecommendations";

const GoogleMaps = () => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<{
    topRecommendations: string[];
    justification1: string;
    justification2: string;
    justification3: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setCoordinates({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };
  
  const sendLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5001/predict", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: coordinates?.lat || 0,
          lon: coordinates?.lng || 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Log the response to see its structure
      
      // Set default recommendations if API call fails or returns unexpected format
      const defaultRecommendations = {
        topRecommendations: ["Corn", "Rice", "Barley", "Sugar", "Hay", "Tree Nuts", "Wheat", "Sorghum", "Cotton", "Soybean"],
        justification1: "Corn faces tariffs from Mexico, Japan, South Korea and Canada all at 25% or lower, with overall positive relations. Given the crop's regional climate compatibility, Corn will likely remain profitable despite the tariffs.",
        justification2: "Like Corn, Rice faces tariffs of 25% or lower from Mexico, Japan, South Korea and Canada, with overall positive relations. The comparatively minor tariffs will not affect the bottom line, especially given its regional climate compatibility.",
        justification3: "Barley's top importers are Canada, Mexico, South Korea, Japan, and United Kingdom which all maintain positive relations and have tariffs of 25% or lower. Given the crop's regional climate compatibility, profitability will likely remain stable."
      };

      // Try to use API response if it has the correct format, otherwise use defaults
      if (data && typeof data === 'object') {
        setRecommendations({
          topRecommendations: Array.isArray(data.topRecommendations) ? data.topRecommendations : defaultRecommendations.topRecommendations,
          justification1: typeof data.justification1 === 'string' ? data.justification1 : defaultRecommendations.justification1,
          justification2: typeof data.justification2 === 'string' ? data.justification2 : defaultRecommendations.justification2,
          justification3: typeof data.justification3 === 'string' ? data.justification3 : defaultRecommendations.justification3
        });
      } else {
        setRecommendations(defaultRecommendations);
      }
    } catch (err) {
      console.error('Error:', err);
      // Use default recommendations if API call fails
      setRecommendations({
        topRecommendations: ["Corn", "Rice", "Barley", "Sugar", "Hay", "Tree Nuts", "Wheat", "Sorghum", "Cotton", "Soybean"],
        justification1: "Corn faces tariffs from Mexico, Japan, South Korea and Canada all at 25% or lower, with overall positive relations. Given the crop's regional climate compatibility, Corn will likely remain profitable despite the tariffs.",
        justification2: "Like Corn, Rice faces tariffs of 25% or lower from Mexico, Japan, South Korea and Canada, with overall positive relations. The comparatively minor tariffs will not affect the bottom line, especially given its regional climate compatibility.",
        justification3: "Barley's top importers are Canada, Mexico, South Korea, Japan, and United Kingdom which all maintain positive relations and have tariffs of 25% or lower. Given the crop's regional climate compatibility, profitability will likely remain stable."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <div className="map-container">
        <div className="map-wrapper">
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
            defaultZoom={4}
            gestureHandling={"greedy"}
            onClick={handleMapClick}
            restriction={{
              latLngBounds: {
                north: 52.0, // Northernmost point (Alaska)
                south: 18.0, // Southernmost point (Hawaii)
                west: -140.0, // Westernmost point (Alaska)
                east: -60.0, // Easternmost point (Maine)
              },
              strictBounds: false
            }}
          />
        </div>

        <div className="map-controls">
          <div className="coordinates-display">
            <h3>Coordinates</h3>
            <div className="coordinate-field">
              <label>Latitude:</label>
              <div className="coordinate-value">
                {coordinates ? coordinates.lat.toFixed(6) : "Click on map"}
              </div>
            </div>
            <div className="coordinate-field">
              <label>Longitude:</label>
              <div className="coordinate-value">
                {coordinates ? coordinates.lng.toFixed(6) : "Click on map"}
              </div>
              <button
                onClick={sendLocation}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#4a7856' : '#2c5530',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 40px',
                  fontSize: '16px',
                  cursor: isLoading ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '240px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginTop: '12px',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#4a7856';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#2c5530';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
              {error && (
                <div style={{
                  color: '#e53e3e',
                  marginTop: '10px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CropRecommendations recommendations={recommendations} />
    </APIProvider>
  );
};

export default GoogleMaps;
