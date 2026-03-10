/**
 * services/weatherApi.ts
 * ──────────────────────
 * This file handles ALL communication with the Java backend.
 * Keeping all fetch() calls here means:
 *   - If the backend URL changes, you change it in ONE place only
 *   - Components stay clean and focused on displaying data
 *
 * HOW THE URL WORKS IN DIFFERENT ENVIRONMENTS:
 *
 *   LOCAL DEVELOPMENT (npm run dev):
 *     VITE_BACKEND_URL is not set, so backendUrl = ""
 *     fetch("/api/weather?city=Nairobi")
 *     → Vite proxy intercepts this and forwards to http://localhost:8080/api/weather?city=Nairobi
 *
 *   PRODUCTION (deployed on Vercel):
 *     VITE_BACKEND_URL = "https://your-backend.up.railway.app" (set in Vercel dashboard)
 *     fetch("https://your-backend.up.railway.app/api/weather?city=Nairobi")
 *     → Goes directly to your Railway backend
 */

import { WeatherData, TempUnit } from "../types/weather";

// ── Temperature helpers ───────────────────────────────────────────────────────

/**
 * convertTemp
 *
 * The Java backend always sends temperatures in Celsius.
 * This function converts to Fahrenheit if the user selected °F.
 *
 * Formula: °F = (°C × 9/5) + 32
 *
 * @param celsius  Temperature in Celsius from the API
 * @param unit     The unit the user selected ("C" or "F")
 * @returns        The converted temperature as a whole number
 */
export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === "F") {
    return Math.round(celsius * 9 / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * formatTemp
 *
 * Converts and formats a temperature for display.
 *
 * Examples:
 *   formatTemp(22, "C") → "22°C"
 *   formatTemp(22, "F") → "72°F"
 *
 * @param celsius  Temperature in Celsius
 * @param unit     Display unit
 * @returns        Formatted string with degree symbol and unit
 */
export function formatTemp(celsius: number, unit: TempUnit): string {
  return `${convertTemp(celsius, unit)}°${unit}`;
}

// ── Icon URL helper ───────────────────────────────────────────────────────────

/**
 * getIconUrl
 *
 * OpenWeatherMap provides weather icons.
 * Given an icon code from the API, this builds the full image URL.
 *
 * @param iconCode  e.g. "01d", "10n", "04d"
 * @returns         Full URL to the 2x resolution icon image
 *
 * Common icon codes:
 *   01d/01n = clear sky       04d/04n = broken clouds
 *   02d/02n = few clouds      09d/09n = shower rain
 *   03d/03n = scattered clouds 10d/10n = rain
 *   11d/11n = thunderstorm    13d/13n = snow   50d/50n = mist
 */
export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ── Main fetch function ───────────────────────────────────────────────────────

/**
 * fetchWeather
 *
 * Sends a GET request to the Java backend to get weather data for a city.
 *
 * WHAT IS async/await?
 * fetch() doesn't return data immediately — it returns a "Promise"
 * (a placeholder for data that will arrive later).
 * "await" pauses execution until the Promise resolves.
 * "async" marks this function as one that uses await.
 *
 * @param city   City name typed by the user, e.g. "Nairobi"
 * @returns      Promise that resolves to WeatherData
 * @throws       Error with message if the request fails
 */
export async function fetchWeather(city: string): Promise<WeatherData> {

  // import.meta.env.VITE_BACKEND_URL reads the environment variable set in Vercel.
  // In local development this is undefined, so we fall back to "" (empty string)
  // which makes the URL relative (e.g. /api/weather) — picked up by Vite's proxy.
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  // encodeURIComponent makes city names safe to put in URLs
  // e.g. "New York" → "New%20York"
  const url = `${backendUrl}/api/weather?city=${encodeURIComponent(city)}`;

  // Send the HTTP GET request to the backend
  const response = await fetch(url, {
    method:  "GET",
    headers: { "Content-Type": "application/json" },
  });

  // If the backend returned an error status (4xx or 5xx), throw an error
  // so the catch block in App.tsx can show the user a message
  if (!response.ok) {
    throw new Error("Could not get weather data, status: " + response.status);
  }

  // Parse the JSON response body into our WeatherData TypeScript type
  const data: WeatherData = await response.json();
  return data;
}