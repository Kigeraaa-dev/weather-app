package com.weather.controller;

import com.weather.model.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * WeatherController
 * ─────────────────
 * The FRONT DOOR of your API.
 * Listens for HTTP requests from React and returns JSON responses.
 *
 * Two endpoints:
 *   GET /api/weather/health      → used by Railway to check if backend is alive
 *   GET /api/weather?city=Nairobi → used by React to get weather data
 *
 * @RestController — this class handles HTTP and returns JSON (not HTML pages)
 * @RequestMapping — all routes in this class start with /api/weather
 */
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    /**
     * @Autowired — Spring automatically creates a WeatherService
     * and injects it here. You do not need to write new WeatherService().
     * This is called "Dependency Injection".
     */
    @Autowired
    private WeatherService weatherService;

    /**
     * GET /api/weather/health
     * ───────────────────────
     * A simple health check endpoint.
     * Railway pings this URL every few seconds to make sure your backend
     * is still running. If it doesn't respond, Railway will restart the service.
     *
     * Returns: { "status": "ok" }
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    /**
     * GET /api/weather?city=Nairobi
     * ─────────────────────────────
     * Main endpoint — React calls this to get weather data.
     *
     * @param city  The city name from the URL query parameter
     * @return      200 OK with weather JSON
     *              400 Bad Request if city is empty
     *              404 Not Found if city doesn't exist
     *              500 Internal Server Error for anything else
     */
    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String city) {

        // Reject empty city names before even calling the API
        if (city == null || city.isBlank()) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "City name cannot be empty."));
        }

        try {
            // Call WeatherService which handles the OpenWeatherMap API calls
            WeatherResponse weather = weatherService.getWeatherForCity(city.trim());
            return ResponseEntity.ok(weather);  // HTTP 200

        } catch (Exception e) {
            // Log the error on the server side for debugging
            System.err.println("❌ Error for city: " + city + " — " + e.getMessage());

            // If the city wasn't found, return 404 with a helpful message
            if (e.getMessage() != null && e.getMessage().contains("City not found")) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)           // HTTP 404
                    .body(Map.of("error", e.getMessage()));
            }

            // For any other error (e.g. bad API key, network issue), return 500
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)   // HTTP 500
                .body(Map.of("error", "Something went wrong, please try again"));
        }
    }
}