# AgriDuty

AgriDuty predicts crop performance using current weather data. The repository contains a Python backend and a React frontend.

## Repository structure
- **backend/** – Flask API for predictions
- **frontend/** – React + Vite user interface

## Prerequisites
- Python 3.10+
- Node.js 18+

## Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # on Windows use venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # add your API_KEY and GEMINI_API_KEY
python model/weather.py
```
The server runs on <http://localhost:5000> by default.

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```
This starts the React development server on <http://localhost:5173> and proxies API requests to the backend.

## API Endpoints

### `POST /predict`
Request body:
```json
{
  "lat": 41.8781,
  "lon": -87.6298
}
```
Returns predicted crop performance based on the provided coordinates.

### `GET /health`
Simple health check that returns `{ "status": "ok" }` when the service is running.
