/**
 * components/WeatherStats.tsx
 *
 * Covers wireframe items I and J:
 *   I — Wind speed and compass direction
 *   J — Humidity percentage with visual progress bar
 */

import { WeatherData } from "../types/weather";

interface Props {
  weather: WeatherData;
}

export default function WeatherStats({ weather }: Props) {
  return (
    <div style={{ display: "flex", gap: "16px", marginTop: "20px", flexWrap: "wrap" }}>
      <WindCard speed={weather.windSpeed} direction={weather.windDirection} />
      <HumidityCard humidity={weather.humidity} />
    </div>
  );
}

// Wind Card (I) 

function WindCard({ speed, direction }: { speed: number; direction: string }) {

  return (
    <div style={{
      flex:         "1 1 200px",
      background:   "rgba(255,255,255,0.1)",
      borderRadius: "16px",
      border:       "1px solid rgba(255,255,255,0.2)",
      padding:      "20px 24px",
    }}>
      <div style={{ fontSize: "11px", opacity: 0.65, letterSpacing: "1px",
                    textTransform: "uppercase", marginBottom: "12px" }}>
        Wind Status
      </div>

      <div style={{ fontSize: "42px", fontWeight: "800", lineHeight: 1 }}>
        {speed}
        <span style={{ fontSize: "20px", fontWeight: "400", marginLeft: "4px" }}>km/h</span>
      </div>
      <div style={{
  marginTop: "12px",
  opacity: 0.8,
  fontSize: "14px"
}}>
  {/* just showing direction as text, rotation was too complicated */}
  Direction: {direction}
        <span style={{ fontSize: "14px", fontWeight: "600" }}>{direction}</span>
      </div>
    </div>
  );
}

// Humidity Card (J) 
function HumidityCard({ humidity }: { humidity: number }) {

  // Give a descriptive label based on humidity level
  const label =
    humidity < 30 ? "Dry" :
    humidity < 50 ? "Comfortable" :
    humidity < 70 ? "Moderate" :
    humidity < 85 ? "Humid" : "Very Humid";

  return (
    <div style={{
      flex:         "1 1 200px",
      background:   "rgba(255,255,255,0.1)",
      borderRadius: "16px",
      border:       "1px solid rgba(255,255,255,0.2)",
      padding:      "20px 24px",
    }}>
      <div style={{ fontSize: "11px", opacity: 0.65, letterSpacing: "1px",
                    textTransform: "uppercase", marginBottom: "12px" }}>
        Humidity
      </div>

      <div style={{ fontSize: "42px", fontWeight: "800", lineHeight: 1 }}>
        {humidity}
        <span style={{ fontSize: "20px", fontWeight: "400" }}>%</span>
      </div>

      <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "6px" }}>{label}</div>

      {/* Progress bar */}
      <div style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
                      fontSize: "10px", opacity: 0.55, marginBottom: "5px" }}>
          <span>0</span><span>50</span><span>100</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "999px", height: "8px" }}>
          <div style={{
            width:      `${humidity}%`,
            height:     "100%",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "999px",
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
