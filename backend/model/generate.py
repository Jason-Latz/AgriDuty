"""Utility to generate a synthetic crop dataset for the demo model."""

import pandas as pd
import numpy as np
import random

# Define the top 10 US crops
top_10_crops = [
    "Corn", "Soybean", "Hay", "Wheat", "Cotton",
    "Rice", "Sugar", "Tree Nuts", "Sorghum", "Barley"
]

# Define number of data points per crop per month
data_points_per_month = 100
num_months = 12
num_crops = len(top_10_crops)  # Use the correct variable name
total_rows = num_crops * num_months * data_points_per_month

# Basic seasonal patterns (simplified) - centered around July (month 7)
# Using sine waves for temperature and humidity variation + noise
def get_seasonal_value(month, base, amplitude, phase_shift=0):
    # Map month 1-12 to radians 0-2pi
    angle = ((month - 1 - phase_shift) / 12.0) * 2 * np.pi
    # Use -cos for temperature (peak in summer), sin for rainfall (can vary)
    if base > 0: # Assume temp/humidity peak summer
      seasonal_factor = -np.cos(angle)
    else: # Assume rainfall might peak spring/fall (slight shift)
      seasonal_factor = np.sin(angle + np.pi/4) # Example shift

    return base + amplitude * seasonal_factor

# Assign simplified 'optimal' conditions and growing seasons per crop
# In a real scenario, these would be carefully researched. Here, we assign somewhat plausible values.
crop_details = {}
random.seed(42) # for reproducibility
for crop in top_10_crops:
    # Assign somewhat plausible random optimal conditions and season
    opt_temp = random.uniform(18, 30) # Optimal Celsius
    temp_tolerance = random.uniform(5, 10) # Range around optimum
    opt_rain = random.uniform(50, 150) # Optimal monthly mm
    rain_tolerance = random.uniform(20, 50)
    # Simplified growing season (peak month) - e.g., 6=June, 7=July, 8=August
    peak_month = random.choice([6, 7, 8, 9])
    season_length = random.uniform(2, 3) # Months effective range around peak

    crop_details[crop] = {
        'opt_temp': opt_temp,
        'temp_tolerance': temp_tolerance,
        'opt_rain': opt_rain,
        'rain_tolerance': rain_tolerance,
        'peak_month': peak_month,
        'season_length': season_length
    }

# Generate a large set of randomized weather records for each crop. The
# resulting CSV is used to train a simple model included with the
# repository.
data = []
for crop in top_10_crops:
    details = crop_details[crop]
    for month in range(1, 13):
        for _ in range(data_points_per_month):
            # 1. Simulate Weather
            # Temperature: Base 15C, Amplitude 15C (Range ~0C to 30C average) + noise
            temp_base = 15
            temp_amp = 15
            temperature = get_seasonal_value(month, temp_base, temp_amp) + random.gauss(0, 3)
            temperature = max(-10, min(45, temperature)) # Clamp to plausible extremes

            # Humidity: Base 65%, Amplitude 15% (Range ~50% to 80% average) + noise
            humidity_base = 65
            humidity_amp = 10
            humidity = get_seasonal_value(month, humidity_base, humidity_amp) + random.gauss(0, 10)
            humidity = max(10, min(100, humidity)) # Clamp

            # Pressure: Relatively stable base + noise
            pressure = random.gauss(1013, 5) # hPa
            pressure = max(980, min(1050, pressure))

            # Rainfall: More complex - base amount + seasonal peak + noise. Higher variance.
            rain_base = 40 # Base monthly mm
            rain_amp = 30 # Seasonal variation amplitude
            # Add significant positive-skewed noise (more chance of dry or average than extreme wet)
            monthly_rain_base = get_seasonal_value(month, rain_base, rain_amp, phase_shift=2) # Shift rain peak slightly
            rainfall = max(0, monthly_rain_base + random.uniform(-20, 80) * np.exp(random.gauss(0, 0.5))) # Skewed noise
            rainfall = max(0, min(500, rainfall)) # Clamp

            # Wind Speed: Base + noise
            wind_speed = max(0, random.gauss(3, 2)) # m/s
            wind_speed = min(25, wind_speed) # Clamp high winds


            # 2. Calculate Normalized Quantity based on Crop and Weather
            quantity = 1.0 # Start with optimal

            # Monthly Growth Cycle effect (Gaussian curve around peak month)
            month_diff = min(abs(month - details['peak_month']),
                             12 - abs(month - details['peak_month'])) # circular distance
            season_effect = np.exp(- (month_diff**2) / (2 * details['season_length']**2))
            quantity *= season_effect

            # Temperature effect (Gaussian curve around optimal temp)
            temp_effect = np.exp(- ((temperature - details['opt_temp'])**2) / (2 * details['temp_tolerance']**2))
            quantity *= temp_effect

            # Rainfall effect (Increases up to optimum, penalizes very low/high)
            if rainfall < details['opt_rain'] / 3: # Drought penalty
                rain_effect = rainfall / (details['opt_rain'] / 3) * 0.5 # Max 0.5 yield if drought
            elif rainfall < details['opt_rain'] + details['rain_tolerance']: # Good range
                 # Scale up to 1 near optimum
                 rain_effect = 0.5 + 0.5 * (rainfall - details['opt_rain'] / 3) / (details['opt_rain'] + details['rain_tolerance'] - details['opt_rain'] / 3)
            else: # Too much rain penalty (slight reduction)
                 rain_effect = max(0.8, 1.0 - 0.2 * (rainfall - (details['opt_rain'] + details['rain_tolerance'])) / (details['opt_rain'])) # Reduce yield slightly

            quantity *= max(0, min(1, rain_effect)) # Ensure effect is between 0 and 1


            # Wind effect (simple penalty for high wind)
            wind_penalty = max(0, 1 - (wind_speed / 15)**2) # Penalize more strongly > 10 m/s
            quantity *= wind_penalty

            # Humidity effect (slight penalty for extremes)
            if humidity < 30 or humidity > 95:
                quantity *= 0.95

            # Add final noise
            quantity += random.gauss(0, 0.05) # Add some random variation
            quantity = max(0, min(1, quantity)) # Clamp final quantity between 0 and 1


            data.append([
                crop, month, round(temperature, 1), round(humidity, 1), round(pressure, 1),
                round(rainfall, 1), round(wind_speed, 1), round(quantity, 4)
            ])

# Create DataFrame
df = pd.DataFrame(data, columns=[
    'crop_type', 'month', 'temperature_celsius', 'humidity_percent',
    'pressure_hpa', 'rainfall_mm', 'wind_speed_mps', 'quantity_normalized'
])

# Shuffle the dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# --- This is the line that saves the CSV file ---
csv_filename = "dataset.csv"
df.to_csv(csv_filename, index=False)
# ------------------------------------------------

print(f"Generated dataset with {len(df)} rows.")
print("Dataset sample:")
print(df.head())
print(f"\nDataset saved to {csv_filename}")

