// routes/weather.routes.js
import express from "express";
import WeatherRequest from "../models/WeatherRequest.js";
import {
  validateDates,
  buildMapsUrl,
  fetch5DayForecast,
} from "../services/weatherService.js";
import { exportData } from "../services/exportService.js";

const router = express.Router();




// =============================
// CREATE (POST)
// =============================
router.post("/", async (req, res) => {
  try {
    const { location, startDate, endDate } = req.body;

    if (!location || !startDate || !endDate) {
      return res.status(400).json({
        message: "location, startDate, and endDate are required",
      });
    }

    // Convert to Date objects
    const { startDate: sDate, endDate: eDate } = validateDates(
      startDate,
      endDate
    );

    //  Fetch 5-day forecast
    const weather = await fetch5DayForecast(location);

    

    // FILTER forecast between selected start–end
    const filteredDays = weather.days.filter((day) => {
  const dayDate = new Date(day.date);
  return dayDate >= sDate && dayDate <= eDate;
});

    //  If no forecast matches the selected dates
    if (filteredDays.length === 0) {
      return res.status(400).json({
        message: "No forecast data available for selected dates.",
      });
    }

    const mapsUrl = buildMapsUrl(weather.normalizedLocation);

    //  SAVE ONLY THE SELECTED DAYS
    const record = await WeatherRequest.create({
      locationInput: location,
      normalizedLocation: weather.normalizedLocation,
      lat: weather.lat,
      lon: weather.lon,
      startDate: sDate,
      endDate: eDate,
      mapsUrl,
      temperatures: filteredDays.map((day) => ({
        date: day.date,
        temp: day.temp,
        description: day.description,
        humidity: day.humidity,
        windSpeed: day.windSpeed,
      })),
    });

    return res.status(201).json(record);
  } catch (error) {
    console.error("POST /api/weather error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// =============================
// READ ALL
// =============================
router.get("/", async (req, res) => {
  const records = await WeatherRequest.find().sort({ createdAt: -1 });
  res.json(records);
});





// ==========================================
// 🔵 NEW ROUTE: LOCATION AUTOCOMPLETE
// Example: /api/weather/suggest?q=Lon
// ==========================================
router.get("/suggest", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Type at least 2 letters" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const axiosMod = (await import("axios")).default;

    // OpenWeather Geocoding API (limit 5 results)
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    const response = await axiosMod.get(url);

    // Return simplified list of city names
    const suggestions = response.data.map((loc) => ({
      name: `${loc.name}, ${loc.country}`,
    }));

    return res.json(suggestions);

  } catch (error) {
    console.error("Autocomplete error:", error);
    return res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});


export default router;


// =============================
// READ ONE
// =============================
router.get("/:id", async (req, res) => {
  const record = await WeatherRequest.findById(req.params.id);
  if (!record)
    return res.status(404).json({ message: "Record not found" });
  res.json(record);
});

// =============================
// UPDATE (PUT)
// =============================
router.put("/:id", async (req, res) => {
  try {
    const {
      location,
      startDate,
      endDate,
      temp,
      description,
      humidity,
      windSpeed,
    } = req.body;

    const record = await WeatherRequest.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Record not found" });

    // Update date range
    if (startDate || endDate) {
      const { startDate: sDate, endDate: eDate } = validateDates(
        startDate || record.startDate,
        endDate || record.endDate
      );
      record.startDate = sDate;
      record.endDate = eDate;
    }

    // Update location text
    if (location) {
      record.locationInput = location;
      record.normalizedLocation = location;
    }

    // Ensure at least 1 temperature record exists
    if (record.temperatures.length === 0) {
      record.temperatures.push({});
    }

    // Update weather fields
    record.temperatures[0].temp =
      temp ?? record.temperatures[0].temp;
    record.temperatures[0].description =
      description ?? record.temperatures[0].description;
    record.temperatures[0].humidity =
      humidity ?? record.temperatures[0].humidity;
    record.temperatures[0].windSpeed =
      windSpeed ?? record.temperatures[0].windSpeed;

    await record.save();

    return res.json({ message: "Record updated successfully!", record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// =============================
// DELETE
// =============================
router.delete("/:id", async (req, res) => {
  const record = await WeatherRequest.findByIdAndDelete(req.params.id);

  if (!record)
    return res.status(404).json({ message: "Record not found" });

  res.json({ message: "Record deleted successfully" });
});

// =============================
// EXPORT
// =============================
router.get("/export/:format", async (req, res) => {
  try {
    const format = req.params.format;
    const records = await WeatherRequest.find();

    const { contentType, filename, payload } = exportData(format, records);

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`
    );
    res.send(payload);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// =============================
// CURRENT LOCATION WEATHER
// =============================
router.post("/current", async (req, res) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const axios = (await import("axios")).default;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    return res.json({
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      locationName: `${response.data.name}, ${response.data.sys.country}`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

