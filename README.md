#  Weather App — Full-Stack Project (Frontend + Backend)
Built with Node.js, Express.js, MongoDB, HTML/CSS/JavaScript
Designed for the PM Accelerator — AI Engineer Intern Technical Assessment

A full-stack weather forecasting application that lets users search weather by location, fetch a 5-day forecast, get current location weather, store results in a database, update and delete records, export weather data, and benefit from intelligent features like autocomplete suggestions, dynamic date validation, and Google Maps integration.

# The project demonstrates:
-Frontend engineering (Tech Assessment #1)
-Backend engineering (Tech Assessment #2)
-API integrations
-Database persistence
-CRUD operations
-Data export
-Error handling
-UX-focused weather forecasting system

# 📌 1. Project Overview
-Enter any location (city, ZIP code, coordinates, landmarks — via autocomplete)
-Retrieve real real-time weather and 5-day forecast
-Get weather from the user’s GPS location
-Select a date range (1–5 days) and store results
-View all historical weather records
-Update previously stored records
-Delete records
-Export data into JSON, CSV, Markdown
-View Google Maps location link
This project is designed to simulate real AI/ML product development, showcasing backend logic, frontend interaction, and smart API-driven features.

# 📌 2. Tech Stack

# Frontend
-HTML5
-CSS3
-Vanilla JavaScript
-Browser Geolocation API

# Backend
-Node.js
-Express.js (REST API)
-MongoDB (Mongoose ODM)
-Axios (API calls)

# External APIs Used
-Geocoding (location search)
-5-day forecast
-Current weather

# Other Tools
-JSON, CSV, Markdown exporters
-dotenv for environment variables
-Browser Geolocation API


# 📌 3. Features
⭐ Frontend Features

🌍 Search 5-Day Weather Forecast
-Users can enter a location (City, Country, ZIP, Landmark, Coordinates) and view:
-Temperature
-Weather description
-Humidity
-Wind Speed
-Daily forecast for selected date range
-Google Maps link for location


# 📘 Use Cases
# 1. GET WEATHER (Create Record)
-User enters a location + date range →
-App fetches a filtered 5-day forecast and saves it to MongoDB.

# 2. CURRENT LOCATION WEATHER
-Uses browser GPS → Fetches real-time weather via OpenWeather API.

# 3. READ DATA
-Users can view all stored weather records in tabular format.

# 4. DELETE DATA
Users remove incorrect or outdated weather records.

# 5. EXPORT DATA
User can download all data as:
-JSON
-CSV
-Markdown

# 6. UPDATE DATA
Users update:
-Location
-Date
-Temperature
-Description
-Humidity
-Wind speed

# API Integrations
1. OpenWeatherMap API
Used for:
-Current weather
-5-day forecast
-Autocomplete via geocoding

Weather properties fetched:
-Temperature
-Humidity
-Wind Speed
-Description

2. Google Maps URL API
-Creates a clickable link to view the searched location on maps.

3. Geolocation API
-Fetches weather of user’s current location.


# ⭐ Backend Features
✔ POST /api/weather — Create Weather Record
-Receives: location, startDate, endDate
-Validates date range (1–5 days)
-Fetches forecast from OpenWeather → filters relevant dates
-Builds Google Maps URL
-Stores in MongoDB:
-Temperature
-Description
-Humidity
-Wind speed
-Saves cleaned data to MongoDB

✔ GET /api/weather — Read All 
-Returns all records sorted by date.

✔ GET /api/weather/:id — Read One
Fetches a single specific weather entry.

✔ DELETE /api/weather/:id — Delete
Removes a weather record after user confirmation.
-Receives the unique record id from the frontend when user clicks on delete button for a particular record.
-Deletes the corresponding record in the database after user confirmation.
-Returns a success message to the frontend.

✔ PUT /api/weather/:id — Update
-Users can update:
-Location
-Temperature
-Description
-Humidity
-Wind Speed
-Date range
-Only provided fields are updated
-Other fields remain unchanged

✔ GET /api/weather/export/:format — Export
Supports:
-json
-csv
-md

✔ GET /api/weather/suggest?q=Lon
-Autocomplete suggestions using OpenWeather’s Geocoding API.

✔ POST /api/weather/current
-Fetches weather for user's actual location using GPS.

# 🗄️ Database Structure (MongoDB Document)





# 🖥️ Frontend UI Snapshot (Text Overview)
Weather Search Form
-Location input + autocomplete
-Start Date
-End Date
Get Weather button
-Weather Result Panel
-Multi-day forecast
-Google Maps link
Current Location Weather
GPS weather button
All Weather Records Table
-Location
-Start Date
-End Date
-Temperature
-Description
-Humidity
-Wind Speed
Delete & Update buttons
Export Panel
-Select format (JSON/CSV/Markdown)
Download button
Update Record Form
-Edit temperature, description, humidity, wind speed

# 🚀 How to Run the App

1. Clone the Repository
` git clone https://github.com/Priyanka651/Weather-App_Backend.git
  cd Weather-App`

2. Install Backend Dependencies
   ```cd backend
 npm install```
 
3. Create .env File
-Inside backend/.env:
```MONGODB_URI=your_mongo_connection_string
OPENWEATHER_API_KEY=your_api_key
PORT=4002```

4. Start the Backend Server
```npm start
```

5. Backend runs at:
```http://...```

6. Run Frontend

Simply open:
```frontend/index.html
No additional setup required.

🧪 Debugging Notes

If environment variables don’t load → ensure:
```npm install dotenv

If MongoDB fails → confirm:
-Correct connection string
-IP whitelist in MongoDB Atlas




🧑‍💻 Developer Info

Built By: Priyanka
AI Engineer Intern Candidate — PM Accelerator

Program Description:
The Product Manager Accelerator Program guides professionals through every stage of their PM career.
From entry roles to leadership, PMA has helped hundreds of students learn practical and impactful PM skills.

Website: https://www.pmaccelerator.io/
