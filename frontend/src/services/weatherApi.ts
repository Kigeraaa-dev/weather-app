import { WeatherData, TempUnit } from "../types/weather";

// Tell TypeScript that import.meta.env exists (Vite injects this at build time)
declare const import_meta_env: { VITE_BACKEND_URL?: string };

// ── Temperature helpers ───────────────────────────────────────────────────────

export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === "F") {
    return Math.round(celsius * 9 / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  return `${convertTemp(celsius, unit)}°${unit}`;
}

export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ── Main fetch function ───────────────────────────────────────────────────────

export async function fetchWeather(city: string): Promise<WeatherData> {
  // In production (Vercel), VITE_BACKEND_URL is set to the Railway backend URL.
  // In development, it's empty and Vite proxy handles routing to localhost:8080.
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || "";

  const url = `${backendUrl}/api/weather?city=${encodeURIComponent(city)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Could not get weather data, status: " + response.status);
  }

  const data: WeatherData = await response.json();
  return data;
}