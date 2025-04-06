import requests
import pandas as pd
from joblib import load  # Import joblib to load the model
from dotenv import load_dotenv, find_dotenv  # Import dotenv to load environment variables
import os
import json

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Get the API keys from the environment variables
WEATHER_API_KEY = os.getenv('API_KEY')  # Weather API key
STATS_API_KEY = os.getenv('STATS_API_KEY')  # USDA ARMS API key

# Weather data fetch
LAT, LON = 41.8781, -87.6298  # Chicago coordinates

# Weather API URL
weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={WEATHER_API_KEY}&units=metric"
weather_response = requests.get(weather_url)

# USDA ARMS API example - getting available years
usda_years_url = f"https://api.ers.usda.gov/data/arms/year?api_key={STATS_API_KEY}"
usda_response = requests.get(usda_years_url)

# Print USDA API response
print("USDA ARMS API Response (Available Years):")
if usda_response.status_code == 200:
    usda_data = usda_response.json()
    print(json.dumps(usda_data, indent=2))
else:
    print(f"Error: {usda_response.status_code} - {usda_response.text}")

# Get specific data for Soybeans
# Using production specialty category to filter for soybean data
soybean_url = f"https://api.ers.usda.gov/data/arms/surveydata?api_key={STATS_API_KEY}&year=2016&state=all&category=Production+Specialty&category_value=Soybean"
soybean_response = requests.get(soybean_url)

print("\nUSDA ARMS API Response (Soybean Data):")
if soybean_response.status_code == 200:
    soybean_data = soybean_response.json()
    print(json.dumps(soybean_data, indent=2))
else:
    print(f"Error: {soybean_response.status_code} - {soybean_response.text}")

# Alternative approach: fetch specific variables related to soybeans
# This could be income, production, expenses, etc.
soybean_variables_url = f"https://api.ers.usda.gov/data/arms/variable?api_key={STATS_API_KEY}&keyword=soybean"
soybean_var_response = requests.get(soybean_variables_url)

print("\nUSDA ARMS API Response (Soybean Variables):")
if soybean_var_response.status_code == 200:
    soybean_var_data = soybean_var_response.json()
    print(json.dumps(soybean_var_data, indent=2))
else:
    print(f"Error: {soybean_var_response.status_code} - {soybean_var_response.text}")

# Continue with the weather-based crop prediction
if weather_response.status_code == 200:
    data = weather_response.json()  # Parse the JSON response
    
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
    print("\nPredicted Quantity Normalized for each crop (sorted in descending order):")
    for crop, quantity in predictions:
        print(f"{crop}: {quantity}")

    # Get the prediction specifically for Soybeans
    for crop, quantity in predictions:
        if crop == "Soybeans":
            print(f"\nSoybeans specific prediction: {quantity}")
            break

else:
    print(f"Error with weather API: {weather_response.status_code} - {weather_response.text}")