
import { FaSeedling, FaTools, FaSatellite } from "react-icons/fa";

const Features = () => {
  return (
    <section className="about-app grid grid-cols-1 gap-10 md:grid-cols-3 p-8  mx-auto">
      {/* What the app is */}
      <div className="container bg-white  rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-[20rem]">
        <div className="flex flex-col items-center">
          <FaSeedling className="text-green-500 text-6xl mr-3" />
          <h3 className="text-2xl font-bold">What the App Is</h3>
        </div>
        <p className="text-gray-600 ">
          This app is a platform designed to help farmers and agricultural
          professionals manage their tasks efficiently and effectively.
        </p>
        <ul className="mt-4 text-gray-500 list-disc list-inside">
          <li>Task management</li>
          <li>Resource optimization</li>
          <li>Real-time insights</li>
        </ul>
      </div>

      {/* What the app does */}
      <div className="container bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
        <div className="flex flex-col items-center">
          <FaTools className="text-blue-500 text-6xl mr-3" />
          <h3 className="text-2xl font-bold">What the App Does</h3>
        </div>
        <p className="text-gray-600">
          It provides tools for tracking crops, monitoring weather conditions,
          managing resources, and optimizing agricultural workflows.
        </p>
        <ul className="mt-4 text-gray-500 list-disc list-inside">
          <li>Crop tracking</li>
          <li>Weather monitoring</li>
          <li>Workflow optimization</li>
        </ul>
      </div>

      {/* How the app works */}
      <div className="container bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center">
          <FaSatellite className="text-purple-500 text-6xl mr-3" />
          <h3 className="text-2xl font-bold">How the App Works</h3>
        </div>
        <p className="text-gray-600">
          The app integrates with modern technologies like GPS and weather APIs
          to deliver real-time insights, while offering an intuitive interface
          for seamless task management.
        </p>
        <ul className="mt-4 text-gray-500 list-disc list-inside">
          <li>GPS integration</li>
          <li>Weather API support</li>
          <li>Intuitive interface</li>
        </ul>
      </div>
    </section>
  );
};

export default Features;
