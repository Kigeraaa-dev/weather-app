/**
 * components/Forecast.tsx
 *
 * Covers wireframe item H:
 *   H — 3-day forecast cards showing icon, date, high/low temps
 */

import { ForecastDay, TempUnit } from "../types/weather";
import { getIconUrl, formatTemp } from "../services/weatherApi";

interface Props {
  forecast: ForecastDay[];
  unit:     TempUnit;
}

export default function Forecast({ forecast, unit }: Props) {
  return (
    <div style={{ flex: "2 1 300px", display: "flex", gap: "12px" }}>
      {forecast.map((day, i) => (
        <div
          key={i}
          style={{
            flex:         1,
            background:   "rgba(255,255,255,0.12)",
            borderRadius: "16px",
            border:       "1px solid rgba(255,255,255,0.2)",
            padding:      "16px 12px",
            textAlign:    "center",
          }}
        >
          {/* Date e.g. "6 Mar" */}
          <div style={{ fontSize: "16px", opacity: 0.7, marginBottom: "8px" }}>
            {day.date}
          </div>

          {/* Weather icon */}
          <img
            src={getIconUrl(day.iconCode)}
            alt={day.description}
            style={{ width: "55px", height: "55px" }}
          />

          {/* Description */}
          <div style={{
            fontSize:  "14px",
            opacity:   0.75,
            margin:    "6px 0 10px",
            minHeight: "28px",
          }}>
            {day.description}
          </div>

          {/* High / Low temperature */}
          <div style={{ fontSize: "17px", fontWeight: "600" }}>
            {formatTemp(day.tempHigh, unit)}
            {" / "}
            <span style={{ opacity: 0.6 }}>
              {formatTemp(day.tempLow, unit)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
