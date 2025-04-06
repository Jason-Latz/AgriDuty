import requests
import pandas as pd
from joblib import load  # Import joblib to load the model
from dotenv import load_dotenv, find_dotenv  # Import dotenv to load environment variables
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Get the API key from the environment variables
WEATHER_API_KEY = os.getenv('API_KEY')  # Weather API key

# Load the trained model
try:
    model = load('model.pkl')  # Load your trained model
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load crop types from crops.txt
try:
    with open('crops.txt', 'r') as file:
        crops = [line.strip() for line in file.readlines()]
    print(f"Loaded {len(crops)} crops from crops.txt")
except Exception as e:
    print(f"Error loading crops: {e}")
    crops = []

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get lat/lon from request
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        
        # Validate latitude and longitude
        if lat is None or lon is None:
            return jsonify({'error': 'Latitude and longitude are required', 'lat': lat, 'lon': lon}), 400
        
        # Weather API URL
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
        weather_response = requests.get(weather_url)
        
        if weather_response.status_code != 200:
            return jsonify({'error': f"Weather API error: {weather_response.status_code} - {weather_response.text}"}), 500
        
        weather_data = weather_response.json()
        
        # Extract relevant weather data
        temperature_celsius = weather_data['main']['temp']
        humidity_percent = weather_data['main']['humidity']
        pressure_hpa = weather_data['main']['pressure']
        wind_speed_mps = weather_data['wind']['speed']
        
        # Example rainfall_mm (you may need to adjust this based on your data source)
        rainfall_mm = 0.0  # Placeholder value, adjust as necessary
        
        # Get current month for prediction
        current_month = datetime.datetime.now().month
        
        # Check if model is loaded
        if model is None or not crops:
            return jsonify({'error': 'Model or crops data not loaded correctly'}), 500
        
        # Prepare a list to store predictions
        predictions_list = []
        
        # Iterate through each crop and make predictions
        for crop_type_index, crop in enumerate(crops):
            # Create a DataFrame for the model input
            input_data = pd.DataFrame({
                'crop_type': [crop_type_index],
                'month': [current_month],
                'temperature_celsius': [temperature_celsius],
                'humidity_percent': [humidity_percent],
                'pressure_hpa': [pressure_hpa],
                'rainfall_mm': [rainfall_mm],
                'wind_speed_mps': [wind_speed_mps]
            })
            
            # Make predictions
            quantity_normalized = model.predict(input_data)[0]  # Get the predicted quantity normalized
            print(f"Prediction for {crop}: {quantity_normalized}")  # Print the prediction to the terminal
            predictions_list.append({"crop": crop, "prediction": float(quantity_normalized)})
        
        # Sort predictions in descending order
        predictions_list = sorted(predictions_list, key=lambda x: x['prediction'], reverse=True)
        
        # Prepare the response
        response = {
            'location': {
                'lat': lat,
                'lon': lon,
                'name': weather_data.get('name', 'Unknown Location')
            },
            'weather': {
                'temperature': temperature_celsius,
                'humidity': humidity_percent,
                'pressure': pressure_hpa,
                'wind_speed': wind_speed_mps
            },
            'predictions': predictions_list,
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Service is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)