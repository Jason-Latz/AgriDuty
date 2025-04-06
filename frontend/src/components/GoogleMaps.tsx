import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";
import AcresInput from "./AcresInput";

interface Recommendation {
  topRecommendations: string[];
  justification1: string;
  justification2: string;
  justification3: string;
}

interface GoogleMapsProps {
  onRecommendationsChange: (recommendations: Recommendation | null) => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ onRecommendationsChange }) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setCoordinates({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };
  
  const sendLocation = async () => {
    if (!coordinates) {
        console.error("Coordinates are not set. Please click on the map to set them.");
        return;
    }

    try {
      const response = await fetch("http://localhost:5001/predict", {
          mode: "cors",
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              lat: coordinates.lat,
              lon: coordinates.lng
          })
      });

      if (response.ok) {
          const responseText = await response.text();
          try {
              const parsedData = JSON.parse(responseText);
              console.log(parsedData);
              onRecommendationsChange(parsedData);
          } catch (error) {
              console.error("Error parsing JSON response:", error);
              onRecommendationsChange(null);
          }
      } else {
          console.error("Error fetching predictions:", response.statusText);
          onRecommendationsChange(null);
      }
    } catch (error) {
      console.error("Error making request:", error);
      onRecommendationsChange(null);
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
                north: 52.0,
                south: 18.0,
                west: -140.0,
                east: -60.0,
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
                style={{
                  backgroundColor: '#2c5530',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 40px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '240px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginTop: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4a7856';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#2c5530';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default GoogleMaps;
