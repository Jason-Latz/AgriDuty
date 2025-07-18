import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";
import CropRecommendations from "./CropRecommendations";

const GoogleMaps = () => {
  // Holds the last clicked coordinates on the map. A null value means
  // no location has been selected yet.
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // Stores recommendations returned by the backend. When null no
  // analysis has been requested yet.
  const [recommendations, setRecommendations] = useState<{
    topRecommendations: string[];
    justification1: string;
    justification2: string;
    justification3: string;
  } | null>(null);
  // const [modelResponse, setModelResponse] = useState("");

  // Record the point the user clicked on the map so we can send the
  // location to the server for analysis.
  const handleMapClick = (e: MapMouseEvent) => {
    console.log("firedd")
    if (e.detail.latLng) {
      setCoordinates({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };

  // Send the selected location to the backend and display a sample
  // response while waiting.
  const sendLocation = async () => {

    // Set static data for display
    const staticData = {
      topRecommendations: ["Corn", "Rice", "Barley", "Sugar", "Hay", "Tree Nuts", "Wheat", "Sorghum", "Cotton", "Soybean"],
      justification1: "Corn faces tariffs from Mexico, Japan, South Korea and Canada all at 25% or lower, with overall positive relations. Given the crop's regional climate compatibility, Corn will likely remain profitable despite the tariffs.",
      justification2: "Like Corn, Rice faces tariffs of 25% or lower from Mexico, Japan, South Korea and Canada, with overall positive relations. The comparatively minor tariffs will not affect the bottom line, especially given its regional climate compatibility.",
      justification3: "Barley's top importers are Canada, Mexico, South Korea, Japan, and United Kingdom which all maintain positive relations and have tariffs of 25% or lower. Given the crop's regional climate compatibility, profitability will likely remain stable."
    };
    setRecommendations(staticData);

    // Send the location to our Flask backend. The response contains a
    // JSON string from the Gemini model which we log for now.
    if (coordinates) {
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
        const parsed = await response.json();
        try {
          const data = JSON.parse(parsed);
          setRecommendations(data);
        } catch {
          console.error("Invalid response format", parsed);
        }
      } else {
        console.error("Error fetching predictions:", response.statusText);
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      {/* The APIProvider supplies a Google Maps API key to child components */}
      <div className="map-container">
        <div className="map-wrapper">
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
            defaultZoom={4}
            gestureHandling={"greedy"}
            onClick={handleMapClick}
            /* Restrict panning so the map stays roughly over North America */
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
                className="analyze-button"
                style={{ marginTop: "12px" }}
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
