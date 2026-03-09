/**
 * types/weather.ts
 *
 * TypeScript interfaces define the SHAPE of your data.
 *
 */

// One day of forecast data 

export interface ForecastDay {
  date:        string;   // e.g. "6 Mar"
  iconCode:    string;   // e.g. "01d"  used to build image URL
  description: string;   // e.g. "Sunny"
  tempHigh:    number;   // Max temperature for the day in °C
  tempLow:     number;   // Min temperature for the day in °C
}

// Full weather response from the Java backend 
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

//Temperature unit 
/** Either Celsius or Fahrenheit */
export type TempUnit = "C" | "F";
