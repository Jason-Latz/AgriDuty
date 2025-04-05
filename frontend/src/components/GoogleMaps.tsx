import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState } from "react";
import AcresInput from "./AcresInput";

const GoogleMaps = () => {
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

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <div className="map-container">
        <div className="map-wrapper">
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
            defaultZoom={3.5}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            onClick={handleMapClick}
            restriction={{
              latLngBounds: {
                north: 52.0, // Northernmost point (Alaska)
                south: 18.0, // Southernmost point (Hawaii)
                west: -140.0, // Westernmost point (Alaska)
                east: -60.0, // Easternmost point (Maine)
              },
              strictBounds: true,
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
            </div>
          </div>
          <AcresInput />
        </div>
      </div>
    </APIProvider>
  );
};

export default GoogleMaps;
