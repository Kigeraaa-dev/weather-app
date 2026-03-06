/**
 * types/weather.ts
 *
 * TypeScript interfaces define the SHAPE of your data.
 *
 * WHY USE INTERFACES?
 * Without them, if you mistype weather.temprature (typo!)
 * the bug only shows up when the app runs in the browser.
 *
 * With interfaces, TypeScript underlines the error in VS Code
 * BEFORE you even run the code. This saves a lot of debugging time.
 *
 * These interfaces match exactly what the Java backend returns.
 */

// ── One day of forecast data ──────────────────────────────────────────────────

export interface ForecastDay {
  date:        string;   // e.g. "6 Mar"
  iconCode:    string;   // e.g. "01d"  used to build image URL
  description: string;   // e.g. "Sunny"
  tempHigh:    number;   // Max temperature for the day in °C
  tempLow:     number;   // Min temperature for the day in °C
}

// ── Full weather response from the Java backend ───────────────────────────────

export interface WeatherData {
  city:          string;        // e.g. "Nairobi"
  country:       string;        // e.g. "KE"
  temp:          number;        // Current temperature in °C
  description:   string;        // e.g. "Partly Cloudy"
  iconCode:      string;        // e.g. "04d"
  windSpeed:     number;        // km/h
  windDirection: string;        // e.g. "NE"
  humidity:      number;        // 0 to 100
  latitude:      number;        // e.g. -1.2921
  longitude:     number;        // e.g. 36.8219
  forecast:      ForecastDay[]; // Array of 3 days
}

// ── Temperature unit ──────────────────────────────────────────────────────────

/** Either Celsius or Fahrenheit */
export type TempUnit = "C" | "F";
