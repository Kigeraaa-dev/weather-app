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
 * React calls:  GET http://localhost:8080/api/weather?city=Nairobi
 * Java returns: { "city": "Nairobi", "temp": 22.5, ... }
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
     * GET /api/weather?city=Nairobi
     *
     * Main endpoint — React calls this to get weather data.
     *
     * @param city  The city name from the URL query parameter
     * @return      200 OK with weather JSON, or 404/500 with error message
     */
    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String city) {

        if (city == null || city.isBlank()) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "City name cannot be empty."));
        }

        try {
            WeatherResponse weather = weatherService.getWeatherForCity(city.trim());
            return ResponseEntity.ok(weather);  // HTTP 200

        } catch (Exception e) {
            System.err.println("❌ Error for city: " + city + " — " + e.getMessage());

            if (e.getMessage() != null && e.getMessage().contains("City not found")) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)           // HTTP 404
                    .body(Map.of("error", e.getMessage()));
            }

        return ResponseEntity
         .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("error", "something went wrong please try again"));
        }
    }
}
