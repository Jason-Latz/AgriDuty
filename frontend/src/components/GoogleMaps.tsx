import { APIProvider, Map } from "@vis.gl/react-google-maps";

const GoogleMaps = () => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <Map
        style={{ width: "45vw", height: "45vh" }}
        defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
        defaultZoom={3.5}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
    </APIProvider>
  );
};

export default GoogleMaps;
