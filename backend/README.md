# AgriDuty Backend

This is the Flask backend for the AgriDuty application, which predicts crop yields based on weather data for a given location.

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Create a `.env` file based on `.env.example` and add your OpenWeatherMap API key:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file to add your actual API key.

## Running the Backend

Start the server:
```
python model/weather.py
```

The server will start on port 5000 by default.

## API Endpoints

### Predict Crops

**Endpoint:** `/predict`
**Method:** POST
**Body:**
```json
{
  "lat": 41.8781,
  "lon": -87.6298
}
```

**Response:**
```json
{
  "location": {
    "lat": 41.8781,
    "lon": -87.6298,
    "name": "Chicago"
  },
  "weather": {
    "temperature": 25.4,
    "humidity": 65,
    "pressure": 1012,
    "wind_speed": 3.6
  },
  "predictions": [
    {
      "crop": "Corn",
      "prediction": 0.85
    },
    {
      "crop": "Soybeans",
      "prediction": 0.75
    },
    ...
  ],
  "timestamp": "2023-07-20T15:30:45.123456"
}
```

### Health Check

**Endpoint:** `/health`
**Method:** GET
**Response:**
```json
{
  "status": "ok",
  "message": "Service is running"
}
``` 