package com.weather.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.weather.model.WeatherResponse;
import com.weather.model.WeatherResponse.ForecastDay;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * WeatherService
 * ──────────────
 * The BRAIN of the backend. Does all the actual work.
 *
 * TWO-STEP PROCESS:
 *
 *   STEP 1 — Geocoding API
 *     Input:  city name  →  "Nairobi"
 *     Output: coordinates →  { lat: -1.29, lon: 36.82, country: "KE" }
 *     Why:    The Forecast API requires coordinates, not a city name.
 *             This also makes searches more accurate (avoids ambiguity).
 *
 *   STEP 2 — Forecast API
 *     Input:  lat + lon coordinates
 *     Output: temperature, humidity, wind speed, 3-day forecast
 *
 * @Service — Spring creates one instance of this class and injects it
 *            wherever it is needed (e.g. into WeatherController).
 */
@Service
public class WeatherService {

    /**
     * Reads the API key from application.properties.
     * ${weather.api.key} links to the line: weather.api.key=YOUR_KEY
     *
     * Using @Value keeps secrets OUT of your Java code — good practice.
     */
    @Value("${weather.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.openweathermap.org";

    /** Java 11+ built-in HTTP client — reused for all requests */
    private final HttpClient httpClient = HttpClient.newHttpClient();

    /** Jackson — parses JSON strings into Java objects */
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── Public method ───────────────────────────────────────────────────────

    /**
     * getWeatherForCity
     *
     * Called by WeatherController. Runs the two-step process.
     *
     * @param cityName  e.g. "Nairobi"
     * @return          WeatherResponse (Spring converts this to JSON)
     * @throws Exception if city not found or API call fails
     */
    public WeatherResponse getWeatherForCity(String cityName) throws Exception {
        GeoResult geo = geocodeCity(cityName);
        return fetchWeather(geo);
    }

    // ── Private helpers ─────────────────────────────────────────────────────

    /**
     * Record to hold geocoding result.
     * Records are a Java 16+ feature — a compact immutable data holder.
     */
    private record GeoResult(String city, String country, double lat, double lon) {}

    /**
     * geocodeCity — STEP 1
     *
     * Calls the OpenWeatherMap Geocoding API.
     *
     * URL: https://api.openweathermap.org/geo/1.0/direct?q=Nairobi&limit=1&appid=KEY
     *
     * Response JSON (array):
     * [{ "name": "Nairobi", "lat": -1.2921, "lon": 36.8219, "country": "KE" }]
     */
    private GeoResult geocodeCity(String cityName) throws Exception {
        String encoded = URLEncoder.encode(cityName, StandardCharsets.UTF_8);
        String url = BASE_URL + "/geo/1.0/direct?q=" + encoded + "&limit=1&appid=" + apiKey;

        String json  = sendGet(url);
        JsonNode arr = objectMapper.readTree(json);

        if (arr.isEmpty()) {
            throw new Exception(
                "City not found: \"" + cityName + "\". " +
                "Please check the spelling and try again."
            );
        }

        JsonNode r = arr.get(0);
        return new GeoResult(
            r.get("name").asText(),
            r.get("country").asText(),
            r.get("lat").asDouble(),
            r.get("lon").asDouble()
        );
    }

    /**
     * fetchWeather — STEP 2
     *
     * Calls the OpenWeatherMap 5-Day/3-Hour Forecast API.
     * Returns 40 weather entries (one every 3 hours for 5 days).
     *
     * URL: https://api.openweathermap.org/data/2.5/forecast?lat=-1.29&lon=36.82&units=metric&appid=KEY
     *
     * units=metric → all temperatures in Celsius
     *
     * We use:
     *   list[0]   → current weather
     *   list[8]   → tomorrow        (8 × 3hr = 24hr ahead)
     *   list[16]  → day after        (16 × 3hr = 48hr ahead)
     *   list[24]  → 3 days ahead     (24 × 3hr = 72hr ahead)
     */
    private WeatherResponse fetchWeather(GeoResult geo) throws Exception {
        String url = BASE_URL + "/data/2.5/forecast?"
                   + "lat=" + geo.lat()
                   + "&lon=" + geo.lon()
                   + "&units=metric"
                   + "&appid=" + apiKey;

        String   json = sendGet(url);
        JsonNode root = objectMapper.readTree(json);
        JsonNode list = root.get("list");   // array of 40 forecast entries
        JsonNode now  = list.get(0);        // first entry = current weather

        WeatherResponse res = new WeatherResponse();
        res.setCity(geo.city());
        res.setCountry(geo.country());
        res.setLatitude(geo.lat());
        res.setLongitude(geo.lon());

        // Temperature — Celsius because we set units=metric
        res.setTemp(roundOne(now.get("main").get("temp").asDouble()));

        // Description e.g. "light rain" → capitalize → "Light Rain"
        res.setDescription(capitalize(
            now.get("weather").get(0).get("description").asText()
        ));

        // Icon code e.g. "10d"
        // React builds the image URL: https://openweathermap.org/img/wn/10d@2x.png
        res.setIconCode(now.get("weather").get(0).get("icon").asText());

        // Humidity as a percentage
        res.setHumidity(now.get("main").get("humidity").asInt());

        // Wind speed: API returns m/s → multiply by 3.6 to get km/h
        double windMs = now.get("wind").get("speed").asDouble();
        res.setWindSpeed(roundOne(windMs * 3.6));

        // Wind direction: degrees (0-360) → compass label e.g. "NE"
        res.setWindDirection(degreesToCompass(now.get("wind").get("deg").asInt()));

        // ── 3-day forecast ──────────────────────────────────────────────────
        List<ForecastDay> forecast = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("d MMM");  // e.g. "6 Mar"
        int[] indices = {8, 16, 24};

        for (int idx : indices) {
            if (idx >= list.size()) break;
            JsonNode day = list.get(idx);

            // Convert Unix timestamp → readable date
            long unixSec = day.get("dt").asLong();
            LocalDate date = LocalDate.ofEpochDay(unixSec / 86400);

            // Scan nearby entries to find the day's high and low temperature
            double high = Double.MIN_VALUE, low = Double.MAX_VALUE;
            for (int i = Math.max(0, idx - 4); i < Math.min(list.size(), idx + 4); i++) {
                double t = list.get(i).get("main").get("temp").asDouble();
                if (t > high) high = t;
                if (t < low)  low  = t;
            }

            forecast.add(new ForecastDay(
                date.format(fmt),
                day.get("weather").get(0).get("icon").asText(),
                capitalize(day.get("weather").get(0).get("description").asText()),
                roundOne(high),
                roundOne(low)
            ));
        }

        res.setForecast(forecast);
        return res;
    }

    /**
     * sendGet — sends an HTTP GET request and returns the response body as text.
     * Uses Java's built-in HttpClient (no extra libraries needed).
     */
    private String sendGet(String url) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();

        HttpResponse<String> res = httpClient.send(
            req, HttpResponse.BodyHandlers.ofString()
        );

        if (res.statusCode() != 200) {
            throw new Exception(
                "OpenWeatherMap returned HTTP " + res.statusCode() +
                ". Check your API key in application.properties."
            );
        }
        return res.body();
    }

    /** Converts wind degrees (0-360) to a compass label e.g. 45 → "NE" */
    private String degreesToCompass(int deg) {
        String[] pts = { "N","NNE","NE","ENE","E","ESE","SE","SSE",
                         "S","SSW","SW","WSW","W","WNW","NW","NNW" };
        return pts[(int) Math.round(deg / 22.5) % 16];
    }

    /** Capitalizes first letter of each word e.g. "light rain" → "Light Rain" */
    private String capitalize(String text) {
        if (text == null || text.isBlank()) return text;
        StringBuilder sb = new StringBuilder();
        for (String word : text.split(" ")) {
            if (!word.isEmpty())
                sb.append(Character.toUpperCase(word.charAt(0)))
                  .append(word.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }

    /** Rounds to 1 decimal place e.g. 22.456 → 22.5 */
    private double roundOne(double v) { return Math.round(v * 10.0) / 10.0; }
}
