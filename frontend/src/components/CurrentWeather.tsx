/**
 * components/CurrentWeather.tsx
 *
 * Covers wireframe items D, E, F, G:
 *   D — Weather icon for today
 *   E — Current temperature (in selected unit)
 *   F — Weather description e.g. "Sunny"
 *   G — Date and city/country name
 */

import { WeatherData, TempUnit } from "../types/weather";
import { getIconUrl, formatTemp } from "../services/weatherApi";

interface Props {
  weather: WeatherData;
  unit:    TempUnit;
}

export default function CurrentWeather({ weather, unit }: Props) {

  // Format today's date e.g. "Thursday, 6 March 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });

  return (
    <div style={{ flex: "1 1 200px" }}>

      {/* D — Weather icon from OpenWeatherMap */}
      <img
        src={getIconUrl(weather.iconCode)}
        alt={weather.description}
        style={{
          width:  "100px",
          height: "100px",
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
        }}
      />

      {/* E — Current temperature */}
      <div style={{
        fontSize:      "60px",
        fontWeight:    "800",
        letterSpacing: "-2px",
        lineHeight:    1,
        marginTop:     "4px",
      }}>
        {formatTemp(weather.temp, unit)}
      </div>

      {/* F — Weather description */}
      <div style={{
        fontSize:   "22px",
        fontWeight: "400",
        opacity:    0.85,
        marginTop:  "8px",
      }}>
        {weather.description}
      </div>

      {/* G — Date and location */}
      <div style={{ marginTop: "16px" }}>
        <div style={{ fontSize: "13px", opacity: 0.65 }}>
          {today}
        </div>
        <div style={{ fontSize: "17px", fontWeight: "700", marginTop: "6px" }}>
          📍 {weather.city}, {weather.country}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.55, marginTop: "2px" }}>
          {weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°
        </div>
      </div>
    </div>
  );
}
