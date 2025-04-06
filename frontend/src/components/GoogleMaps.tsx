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
  // const [modelResponse, setModelResponse] = useState("");

  const handleMapClick = (e: MapMouseEvent) => {
    console.log("firedd")
    if (e.detail.latLng) {
      setCoordinates({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };
  
  const sendLocation = () => {
    const staticData = {
      topRecommendations: ["Corn", "Rice", "Barley", "Sugar", "Hay", "Tree Nuts", "Wheat", "Sorghum", "Cotton", "Soybean"],
      justification1: "Corn faces tariffs from Mexico, Japan, South Korea and Canada all at 25% or lower, with overall positive relations. Given the crop's regional climate compatibility, Corn will likely remain profitable despite the tariffs.",
      justification2: "Like Corn, Rice faces tariffs of 25% or lower from Mexico, Japan, South Korea and Canada, with overall positive relations. The comparatively minor tariffs will not affect the bottom line, especially given its regional climate compatibility.",
      justification3: "Barley's top importers are Canada, Mexico, South Korea, Japan, and United Kingdom which all maintain positive relations and have tariffs of 25% or lower. Given the crop's regional climate compatibility, profitability will likely remain stable."
    };
    setRecommendations(staticData);
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
      <CropRecommendations recommendations={recommendations} />
    </APIProvider>
  );
};

export default GoogleMaps;
