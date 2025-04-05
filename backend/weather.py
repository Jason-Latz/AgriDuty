import requests
import pandas as pd
from joblib import load  # Import joblib to load the model
from dotenv import load_dotenv, find_dotenv  # Import dotenv to load environment variables
import os

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Get the API key from the environment variable
API_KEY = os.getenv('API_KEY')  # This line remains to fetch the API key

LAT, LON = 41.8781, -87.6298

# Updated URL for the specified API endpoint
url = f"https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric"
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()  # Parse the JSON response
    
    # Extract relevant weather data
    temperature_celsius = data['main']['temp']
    humidity_percent = data['main']['humidity']
    pressure_hpa = data['main']['pressure']
    wind_speed_mps = data['wind']['speed']
    
    # Example rainfall_mm (you may need to adjust this based on your data source)
    rainfall_mm = 0.0  # Placeholder value, adjust as necessary

    # Load the trained model
    model = load('model.pkl')  # Load your trained model

    # Prepare input data for the model
    # Assuming crop_type is an integer index (e.g., 0 for Corn, 1 for Soybeans, etc.)
    crop_type_index = 0  # Example: replace with the actual index you want to predict for
    month = 1  # Example: replace with the actual month (1 for January, 2 for February, etc.)

    # Create a DataFrame for the model input
    input_data = pd.DataFrame({
        'crop_type': [crop_type_index],
        'month': [month],
        'temperature_celsius': [temperature_celsius],
        'humidity_percent': [humidity_percent],
        'pressure_hpa': [pressure_hpa],
        'rainfall_mm': [rainfall_mm],
        'wind_speed_mps': [wind_speed_mps]
    })

    # Make predictions
    quantity_normalized = model.predict(input_data)  # Get the predicted quantity normalized
    print(f"Predicted Quantity Normalized: {quantity_normalized[0]}")  # Print the prediction

else:
    print(f"Error: {response.status_code} - {response.text}")  # Print error message