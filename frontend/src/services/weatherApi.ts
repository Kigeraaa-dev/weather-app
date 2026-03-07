/**
 * services/weatherApi.ts
 *
 * This file handles ALL communication with the Java backend.
 * Keeping all fetch() calls in one place means:
 *   - If the backend URL changes, you change it in ONE place only
 *   - Components stay clean and focused on displaying data
 *
 * FLOW:
 *   Component calls fetchWeather("Nairobi")
 *   → This file sends: GET /api/weather?city=Nairobi
 *   → Vite proxy forwards it to: http://localhost:8080/api/weather?city=Nairobi
 *   → Java processes it and returns JSON
 *   → This file returns the JSON as a WeatherData object
 *   → Component displays the data
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
 * Given an icon code, this builds the full image URL.
 *
 * @param iconCode  e.g. "01d", "10n", "04d"
 * @returns         Full URL to the 2x resolution icon image
 *
 * Common icon codes:
 *   01d/01n = clear sky (sun/moon)
 *   02d/02n = few clouds
 *   03d/03n = scattered clouds
 *   04d/04n = broken clouds
 *   09d/09n = shower rain
 *   10d/10n = rain
 *   11d/11n = thunderstorm
 *   13d/13n = snow
 *   50d/50n = mist
 */
export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

//Main fetch function 

/**
 * fetchWeather
 *
 * Sends a GET request to the Java backend to get weather data for a city.
 *
 * Uses the JS fetch API as required by the assessment brief.
 * The URL /api/weather is proxied by Vite to http://localhost:8080/api/weather
 *
 * WHAT IS async/await?
 * fetch() doesn't return data immediately — it returns a "Promise"
 * (a placeholder for data that will arrive later).
 * "await" pauses execution until the Promise resolves.
 * "async" marks this function as one that uses await.
 *
 * @param city   City name typed by the user, e.g. "Nairobi"
 * @returns      Promise that resolves to WeatherData
 * @throws       Error with message if request fails
 */
export async function fetchWeather(city: string): Promise<WeatherData> {

  // encodeURIComponent makes city names safe to put in URLs
  // e.g. "New York" → "New%20York"
  const url = `/api/weather?city=${encodeURIComponent(city)}`;

  // Send the HTTP GET request
  const response = await fetch(url, {
    method:  "GET",
    headers: { "Content-Type": "application/json" },
  });

  // check if the request worked
if (!response.ok) {
  throw new Error("could not get weather data, status: " + response.status);
}

  // Parse the JSON response body into our WeatherData TypeScript type
  const data: WeatherData = await response.json();
  return data;
}
