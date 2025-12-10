#  Weather App — Full-Stack Project (Frontend + Backend)
Built with Node.js, Express.js, MongoDB, HTML/CSS/JavaScript
Designed for the PM Accelerator — AI Engineer Intern Technical Assessment

A full-stack weather forecasting application that lets users search weather by location, fetch a 5-day forecast, get current location weather, store results in a database, update and delete records, export weather data, and benefit from intelligent features like autocomplete suggestions, dynamic date validation, and Google Maps integration.

## Live Demo
- Frontend: https://weather-app-frontend-op5t.onrender.com

- Backend API: https://weather-app-backend-2hcd.onrender.com/api/weather


# The project demonstrates:
- Frontend engineering (Tech Assessment #1)
- Backend engineering (Tech Assessment #2)
- API integrations
- Database persistence
- CRUD operations
- Data export
- Error handling
- UX-focused weather forecasting system

# 📌  Project Overview
- Enter any location (city, ZIP code, coordinates, landmarks — via autocomplete)
- Retrieve a filtered 5-day forecast based on the selected date range
- Get weather from the user’s GPS location
- Select a date range (1–5 days) and store results
- View all historical weather records
- Update previously stored records
- Delete records
- Export data into JSON, CSV, Markdown
- View Google Maps location link
This project simulates a real-world full-stack software engineering workflow with API-driven forecasting features.
# 📌  Features

# ⭐Frontend Features

<strong>🌍 Search 5-Day Weather Forecast </strong>
- Users can enter a location (City, Country, ZIP, Landmark, Coordinates)
- Autocomplete suggestions powered by OpenWeather Geocoding API
- Validates a strict 1–5 day date range and shows:
- Temperature
- Weather description
- Humidity
- Wind Speed
- Daily forecast for selected date range
- Google Maps link for location
  
<strong>📍Current Location Weather (GPS) </strong>
- Browser Geolocation API retrieves user coordinates
- Backend calls OpenWeather “Current Weather API”

<strong>📚CRUD Operations</strong>

<b>1. GET WEATHER (Create Record)</b> 
- User enters a location + date range →
- App fetches a filtered 5-day forecast and saves it to MongoDB.

<b> 2. CURRENT LOCATION WEATHER</b>
- Uses browser GPS → Fetches real-time weather via OpenWeather API.

<b> 3. READ DATA </b>
- Users can view all stored weather records in tabular format.

<b> 4. DELETE DATA </b>
Users remove incorrect or outdated weather records.

<b> 5. EXPORT DATA </b>
User can download all data as:
- JSON
- CSV
- Markdown

<b> 6. UPDATE DATA </b>
Users update:
- Location
- Date
- Temperature
- Description
- Humidity
- Wind speed

<strong>📈Smart Date Validation</strong>
<b>Frontend calendar restricts dates to:</b>
- Tomorrow → Tomorrow + 4 days (total 5 days)
Both frontend and backend strictly enforce a 1–5 day date range: the calendars only allow selecting tomorrow through tomorrow + 4 days, and the backend rejects any request where the date range is invalid or longer than 5 days.


<strong>🗺 Google Maps Integration </strong>
- Every record includes a clickable location link.
  
  # 📌Tech Stack

<b> Frontend</b>
- HTML5
- CSS3
- Vanilla JavaScript
- Browser Geolocation API

<b> Backend</b>
- Node.js
- Express.js (REST API)
- MongoDB (Mongoose ODM)
- Axios (API calls)

<b> External APIs Used</b>
- OpenWeather 5-Day Forecast
- OpenWeather Geocoding (Autocomplete)
- OpenWeather Current Weather
- Google Maps Search URL

<b> Other Tools</b>
- JSON, CSV, Markdown exporters
- dotenv for environment variables
- Browser Geolocation API

# API Integrations
1. OpenWeatherMap API
Used for:
- Current weather
- 5-day forecast
- Autocomplete via geocoding

Weather properties fetched:
- Temperature
- Humidity
- Wind Speed
- Description

2. Google Maps URL API
- Creates a clickable link to view the searched location on maps.

3. Geolocation API
- Fetches weather of user’s current location.

  
<strong>✔ Installation & Project Structure</strong>

```bash
weather-app/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── WeatherRequest.js
│   ├── routes/
│   │   └── weatherRoutes.js
│   ├── services/
│   │   ├── weatherService.js
│   │   └── exportService.js
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
└── README.md
```
# ⭐ Backend Features

<b>✔ POST /api/weather — Create Weather Record<b>
- Receives: location, startDate, endDate
- Validates date range (1–5 days)
- Fetches forecast from OpenWeather → filters relevant dates
- The backend extracts one forecast per day at 12:00 PM from OpenWeather’s 3-hour interval 5-day API.
- Builds Google Maps URL
Stores in MongoDB:
- Temperature
- Description
- Humidity
- Wind speed
Notes: Only the forecast days within the selected date range are stored in MongoDB.

<b>✔ GET /api/weather — Read All records </b>
- Returns all records sorted by date.

<b>✔ PUT /api/weather/:id — Update</b>
Users can update:
- Location
- Temperature
- Description
- Humidity
- Wind Speed
- Date range: Start date and end date
- Only provided fields are updated
- Other fields remain unchanged
Note: Updating a record does NOT refetch weather data from OpenWeather. Only the first saved temperature entry is updated manually.

<b>✔ DELETE /api/weather/:id — Delete</b>

Removes a weather record after user confirmation.
- Receives the unique record id from the frontend when user clicks on delete button for a particular record.
- Deletes the corresponding record in the database after user confirmation.
- Returns a success message to the frontend.

<b>✔ GET /api/weather/export/:format — Export</b>
Supports:
- json
- csv
- md
Exported files include only the first day’s temperature details for each record, for simplicity.

✔ GET /api/weather/suggest?q=Lon
- Autocomplete suggestions using OpenWeather’s Geocoding API.

✔ POST /api/weather/current
- Fetches weather for user's actual location using GPS.
  
<h1>API Endpoints</h1>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/weather | Create weather record |
| GET    | /api/weather | Retrieve all records |
| PUT    | /api/weather/:id | Update record |
| DELETE | /api/weather/:id | Delete record |
| GET    | /api/weather/export/:format | Export JSON / CSV / Markdown |
| GET    | /api/weather/suggest?q= | Autocomplete city search |
| POST   | /api/weather/current | Weather using GPS coordinates |

```bash


Input:
{
  "location": "San Francisco, California",
  "startDate": "2025-12-10",
  "endDate": "2025-12-12"
}
Output: 
{
    "locationInput": "San Francisco, California",
    "normalizedLocation": "San Francisco, US",
    "lat": 37.7790262,
    "lon": -122.419906,
    "startDate": "2025-12-10T00:00:00.000Z",
    "endDate": "2025-12-12T00:00:00.000Z",
    "temperatures": [
        {
            "date": "2025-12-10T00:00:00.000Z",
            "temp": 12.72,
            "description": "clear sky",
            "humidity": 65,
            "windSpeed": 2.67,
            "_id": "69379c034d71229512334c7a"
        },
        {
            "date": "2025-12-11T00:00:00.000Z",
            "temp": 12.94,
            "description": "clear sky",
            "humidity": 65,
            "windSpeed": 3.17,
            "_id": "69379c034d71229512334c7b"
        },
        {
            "date": "2025-12-12T00:00:00.000Z",
            "temp": 12.82,
            "description": "clear sky",
            "humidity": 63,
            "windSpeed": 3.04,
            "_id": "69379c034d71229512334c7c"
        }
    ],
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=San%20Francisco%2C%20US",
    "_id": "69379c034d71229512334c79",
    "createdAt": "2025-12-09T03:48:19.889Z",
    "updatedAt": "2025-12-09T03:48:19.889Z",
    "__v": 0
}

```

# 🚀 How to Run the App

1. Clone the Repository
```bash
git clone https://github.com/Priyanka651/Weather-App_Backend.git
cd Weather-App
```

2. Install Backend Dependencies
```bash
  cd backend
  npm install
 ```

3. Create .env File
-Inside backend/.env:

```bash
MONGODB_URI=your_mongo_connection_string
OPENWEATHER_API_KEY=your_api_key
PORT=4000
```

4. Start the Backend Server
```bash
npm start
```

5. Backend runs at:
```bash
http://localhost:4000/api/weather
```

6. Run Frontend

Simply open:
```bash
frontend/index.html
```
No additional setup required.

🧪 Debugging Notes

If environment variables don’t load → ensure:
✔ MongoDB Troubleshooting
- Ensure you whitelist your IP in MongoDB Atlas
- Connection string must include correct database name
- dotenv must be installed
✔ Common Deployment Issues
- CORS errors → fix by enabling app.use(cors())
- Render must include environment variables
- Ensure "type": "module" is in package.json

<b>🧑‍💻 Developer </b>
<b>Built By: </b> Priyanka

<b> Role: </b>AI Engineer Intern Candidate — PM Accelerator

<b>Program Description:</b> Product Manager Accelerator — Building practical PM & engineering skills
<b>Website: </b>https://www.pmaccelerator.io/


