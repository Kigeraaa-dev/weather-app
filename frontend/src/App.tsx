/**
 * App.tsx
 *
 * The ROOT component — the top of the entire React app.
 *
 * RESPONSIBILITIES:
 *   1. Hold all shared state (weather data, loading, error, unit)
 *   2. Handle the search when user clicks GO
 *   3. Render all child components, passing them the data they need
 *
 * STATE (useState hook):
 *   State = data that can change over time.
 *   When state changes, React automatically re-renders the UI.
 *   e.g. when weather changes, all the weather display components update.
 *
 * COMPONENT TREE:
 *   App
 *   ── SearchBar        (A, B, C)
 *   ── CurrentWeather   (D, E, F, G)
 *   ── Forecast         (H)
 *   ── WeatherStats     (I, J)
 */

import { useState, useEffect } from "react";
import { WeatherData, TempUnit } from "./types/weather";
import { fetchWeather } from "./services/weatherApi";
import SearchBar       from "./components/SearchBar";
import CurrentWeather  from "./components/CurrentWeather";
import Forecast        from "./components/Forecast";
import WeatherStats    from "./components/WeatherStats";

// ── Background colour based on weather ───────────────────────────────────────

/**
 * Returns a CSS gradient colour based on weather description.
 * This makes the app background change to match the weather — visual flair!
 */
function getBackground(description: string): string {
  const d = description.toLowerCase();
  if (d.includes("rain") || d.includes("drizzle"))
    return "linear-gradient(135deg, #4a6fa5 0%, #2c3e6b 100%)";
  if (d.includes("snow"))
    return "linear-gradient(135deg, #a8c4d8 0%, #6e8fa8 100%)";
  if (d.includes("thunder"))
    return "linear-gradient(135deg, #2c2c54 0%, #474787 100%)";
  if (d.includes("mist") || d.includes("fog") || d.includes("haze"))
    return "linear-gradient(135deg, #8e9eab 0%, #a0a8b0 100%)";
  if (d.includes("cloud"))
    return "linear-gradient(135deg, #6b8cae 0%, #8e9daa 100%)";
  if (d.includes("clear") || d.includes("sunny"))
    return "linear-gradient(135deg, #f6921e 0%, #f05a28 60%, #c0392b 100%)";
  return "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)";
}

// App Component 

export default function App() {

  // State 
  /** null means no weather loaded yet */
  const [weather, setWeather] = useState<WeatherData | null>(null);

  /** true while waiting for API response */
  const [loading, setLoading] = useState(false);

  /** error message to show the user, null means no error */
  const [error, setError]     = useState<string | null>(null);

  /** Temperature unit — start with Celsius */
  const [unit, setUnit]       = useState<TempUnit>("C");

  // ── Load default city on first render ─────────────────────────────────────

  /**
   * useEffect runs AFTER the component first renders.
   * The [] means "run only once" (not on every render).
   * This loads Nairobi by default so the screen isn't blank.
   */
  useEffect(() => {
    handleSearch("Nairobi");
  }, []);

  // Search handler 
  /**
   * handleSearch
   *
   * Called when user clicks GO or presses Enter.
   * async/await lets us "pause" and wait for the API response.
   */
  async function handleSearch(city: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
  console.log("error fetching weather", err);
  setError("Could not get weather data, please try again");
}finally {
      setLoading(false);  // always stop loading whether success or error
    }
  };

  // Render 
  const background = weather
    ? getBackground(weather.description)
    : "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)";

// console.log("weather state:", weather)
  return (
    <div style={{
      minHeight:       "100vh",
      background,
      transition:      "background 1s ease",  // smooth colour change on new weather
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      padding:         "24px 16px",
      color:           "#ffffff",
    }}>

      {/* Main card */}
      <div style={{
        width:            "100%",
        maxWidth:         "860px",
        background:       "rgba(255,255,255,0.12)",
        backdropFilter:   "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius:     "28px",
        border:           "1px solid rgba(255,255,255,0.25)",
        boxShadow:        "0 32px 80px rgba(0,0,0,0.35)",
        padding:          "32px 36px",
      }}>

        {/* Search Bar — A, B, C */}
        <SearchBar
          onSearch={handleSearch}
          unit={unit}
          onUnitChange={setUnit}
          loading={loading}
        />

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.8 }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
            <div style={{ fontSize: "18px" }}>Fetching weather…</div>
            <div style={{ fontSize: "13px", opacity: 0.6, marginTop: "8px" }}>
              Calling your Java backend → OpenWeatherMap API
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            background:   "rgba(255,80,80,0.2)",
            border:       "1px solid rgba(255,80,80,0.4)",
            borderRadius: "12px",
            padding:      "16px 20px",
            marginBottom: "20px",
            display:      "flex",
            gap:          "12px",
            alignItems:   "center",
          }}>
            <span style={{ fontSize: "22px" }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>Error</div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>{error}</div>
            </div>
          </div>
        )}

        {/* Weather content — only shown when data is loaded */}
        {weather && !loading && (
          <>
            {/* Top row: current weather + 3-day forecast */}
            <div style={{
              display:    "flex",
              gap:        "24px",
              marginBottom: "4px",
              flexWrap:   "wrap",
              alignItems: "flex-start",
            }}>
              {/* D, E, F, G */}
              <CurrentWeather weather={weather} unit={unit} />

              {/* H */}
              <Forecast forecast={weather.forecast} unit={unit} />
            </div>

            {/* Bottom row: wind + humidity */}
            {/* I, J */}
            <WeatherStats weather={weather} />
          </>
        )}

      </div>
    </div>
  );
}
