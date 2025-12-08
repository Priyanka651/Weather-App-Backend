// services/weatherService.js
import axios from "axios";

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";


// 1) ✅ VALIDATE START & END DATES (UPDATED NOW)
export const validateDates = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);

  if (isNaN(s) || isNaN(e)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  if (s > e) {
    throw new Error("Start date must be before end date.");
  }

  const diffMs = e - s;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // ⭐ UPDATED: allow 0–4 days difference → 1–5 calendar days
  if (diffDays < 0 || diffDays > 4) {
    throw new Error("Date range must be between 1 and 5 days (e.g., 7–11).");
  }

  return { startDate: s, endDate: e };
};


//
// 2) Build a Google Maps URL
//
export const buildMapsUrl = (locationName) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationName
  )}`;
};


//
// 3) Fetch 5-day forecast from OpenWeather
//
export const fetch5DayForecast = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const axiosMod = (await import("axios")).default;

  // Geocoding
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const geoRes = await axiosMod.get(geoUrl);

  if (!geoRes.data.length) {
    throw new Error("Invalid location");
  }

  const { lat, lon, name, country } = geoRes.data[0];

  // Forecast
  const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastRes = await axiosMod.get(forecastUrl);

  // Extract 5 days (one reading each day at 12:00)
  const list = forecastRes.data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  return {
    normalizedLocation: `${name}, ${country}`,
    lat,
    lon,
    days: list.map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temp: item.main.temp,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    })),
  };
};
