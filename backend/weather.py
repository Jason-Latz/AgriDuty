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

    # Load crop types from crops.txt
    with open('crops.txt', 'r') as file:
        crops = [line.strip() for line in file.readlines()]  # Read and strip whitespace

    # Prepare a list to store predictions
    predictions = []

    # Iterate through each crop and make predictions
    for crop_type_index, crop in enumerate(crops):
        # Create a DataFrame for the model input
        input_data = pd.DataFrame({
            'crop_type': [crop_type_index],
            'month': [1],  # Example: replace with the actual month (1 for January, etc.)
            'temperature_celsius': [temperature_celsius],
            'humidity_percent': [humidity_percent],
            'pressure_hpa': [pressure_hpa],
            'rainfall_mm': [rainfall_mm],
            'wind_speed_mps': [wind_speed_mps]
        })

        # Make predictions
        quantity_normalized = model.predict(input_data)  # Get the predicted quantity normalized
        predictions.append((crop, quantity_normalized[0]))  # Store crop name and prediction

    # Sort predictions in descending order
    predictions = sorted(predictions, key=lambda x: x[1], reverse=True)

    # Display the results
    print("Predicted Quantity Normalized for each crop (sorted in descending order):")
    for crop, quantity in predictions:
        print(f"{crop}: {quantity}")

else:
    print(f"Error: {response.status_code} - {response.text}")  # Print error message