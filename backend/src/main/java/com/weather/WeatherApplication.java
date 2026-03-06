package com.weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WeatherApplication
 * ─────────────────
 * The STARTING POINT of the entire Java backend.
 *
 * When you run: mvn spring-boot:run
 * Java executes the main() method here first.
 *
 * @SpringBootApplication tells Spring Boot 4.0.3 to:
 *   ✅ Start an embedded Tomcat web server on port 8080
 *   ✅ Scan all files in com.weather package for components
 *   ✅ Auto-configure JSON, web, and everything else
 *
 * You do not need to change anything in this file.
 */
@SpringBootApplication
public class WeatherApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeatherApplication.class, args);
        System.out.println("✅ Weather API is running!");
        System.out.println("📡 Test it: http://localhost:8080/api/weather/health");
        System.out.println("🌍 Try weather: http://localhost:8080/api/weather?city=Nairobi");
    }
}
