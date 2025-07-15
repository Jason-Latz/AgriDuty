"""Flask service for generating crop predictions and market analysis.

This module exposes a REST API that uses a trained scikit-learn model
to rank common U.S. crops for a given location. It fetches real-time
weather data from OpenWeatherMap and optionally leverages the Gemini
API to generate a short business analysis.
"""

import requests
import pandas as pd
from joblib import load  # Import joblib to load the model
from dotenv import load_dotenv, find_dotenv  # Import dotenv to load environment variables
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from google import genai


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Get the API keys from the environment variables
WEATHER_API_KEY = os.getenv('API_KEY')  # Weather API key

# gemini_model = genai.GenerativeModel('gemini-pro', generation_config={
#     'temperature': 0.2
# })

# Load the trained model
try:
    ml_model = load('model.pkl')  # Load your trained model
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    ml_model = None

# Load crop types from crops.txt
try:
    with open('crops.txt', 'r') as file:
        crops = [line.strip() for line in file.readlines()]
    print(f"Loaded {len(crops)} crops from crops.txt")
except Exception as e:
    print(f"Error loading crops: {e}")
    crops = []

# Load crop countries from countries.txt
crop_countries = {}
try:
    with open('countries.txt', 'r') as file:
        for line in file:
            crop, countries = line.split(':')
            crop_countries[crop.strip()] = [country.strip() for country in countries.split(',')]
    print(f"Loaded countries for {len(crop_countries)} crops from countries.txt")
except Exception as e:
    print(f"Error loading countries: {e}")

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
        if ml_model is None or not crops:
            return jsonify({'error': 'Model or crops data not loaded correctly'}), 500
        
        # Prepare a list to store predictions
        # Collect prediction results for each crop in this list
        predictions_list = []
        
        # Iterate through each crop and make predictions
        for crop_type_index, crop in enumerate(crops):
            # Create a single-row DataFrame representing the current weather
            # conditions for the crop being evaluated
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
            quantity_normalized = ml_model.predict(input_data)[0]  # Get the predicted quantity normalized
            print(f"Prediction for {crop}: {quantity_normalized}")  # Print the prediction to the terminal
            
            # Add countries to the prediction
            countries = crop_countries.get(crop, [])
            predictions_list.append({
                "crop": crop,
                "prediction": float(quantity_normalized),
                "top_countries": countries
            })
        
        # Sort predictions in descending order
        predictions_list = sorted(predictions_list, key=lambda x: x['prediction'], reverse=True)
        
        # Print the entire predictions list
        print("Predictions List:", predictions_list)  # Print the predictions list
        
        # Generate Gemini analysis


        GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')  # Gemini API key

        # Configure Gemini API
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        prompt = f"""
        I would like you to predict how well various common United States agricultural exports will fare under recent federal tariff policies. Your response MUST be in a .json format with the following structure:
        {{
            "topRecommendations": ["crop1", "crop2", "crop3", ...],
            "justification1": "50 word or less justification for the first recommendation",
            "justification2": "50 word or less justification for the second recommendation",
            "justification3": "50 word or less justification for the third recommendation"
        }}

        To generate this response, utilize the following approach:

        Observe the rankings and normalized value (A measure of how well the crop does in its specified environment, with 1 being the crop does perfectly and 0 being the crop cannot grow) given to you at the *MLoutput* heading in the prompt.
        Predict the retaliatory tariffs from the top 5 importers of each crop given at *MLoutput* under "top_countries" by:
        - Using the tariff rates given to you at the *TariffRates* heading in the prompt
        - Analyzing the geopolitical relations between each country and the United States
        - Conducting a brief sentiment analysis of government statements or reputable news outlets originating in the country in question to obtain general attitudes that may predict retaliatory tariff rates
        Predict the price effects on each crop of the retaliatory tariffs calculated in step 2
        Given the effects of the calculated price effects on the crops and the normalized values, rank all of the crops from best to worst on their upcoming profitability, returning them from most profitable to least profitable in the array of strings "topRecommendations" of the json output.
        For the top 3 ranked crops, provide a brief 50 word or less bullet point justification for why you chose that ranking (justification in the .json). For the justification, replace mentions of the normalized value with regional climate compatibility.

        Take your time to reason through each step, and ensure that each justification is clear and concise.

        *TariffRates*:
        Vietnam: 46%
        Thailand: 36%
        China: 34%
        Pakistan: 29%
        India: 27%
        South Korea: 25%
        Japan: 24%
        European Union: 20%
        Philippines: 17%
        Indonesia: 32%
        Taiwan: 32%
        Bangladesh: 37%
        Colombia: 10%
        Egypt: 10%
        Saudi Arabia: 10%
        Turkey: 10%
        Haiti: 10%
        Guatemala: 10%
        United Arab Emirates: 10%
        Eritrea: 10%
        Djibouti: 10%
        Japan: 10%
        United Kingdom: 10%
        Mexico: 25%
        Canada: 25%

        *MLoutput*:
        {predictions_list}
        """
        

        gemini_response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )

        print(gemini_response.text)

        # try:
        #     gemini_response = gemini_model.generate_content(prompt)
        #     gemini_analysis = gemini_response.text
        # except Exception as e:
        #     print(f"Error getting Gemini analysis: {e}")
        #     gemini_analysis = "Unable to generate analysis at this time."

        # Prepare the response
        # response = {
        #     'location': {
        #         'lat': lat,
        #         'lon': lon,
        #         'name': weather_data.get('name', 'Unknown Location')
        #     },
        #     'weather': {
        #         'temperature': temperature_celsius,
        #         'humidity': humidity_percent,
        #         'pressure': pressure_hpa,
        #         'wind_speed': wind_speed_mps
        #     },
        #     'predictions': predictions_list,
        #     'gemini_analysis': gemini_analysis,
        #     'timestamp': datetime.datetime.now().isoformat()
        # }

        # response = gemini_analysis
        print(gemini_response.text)
        result = gemini_response.text
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Service is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
