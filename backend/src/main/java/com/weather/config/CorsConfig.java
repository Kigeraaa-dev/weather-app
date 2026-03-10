package com.weather.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CorsConfig — Cross-Origin Resource Sharing
 * ───────────────────────────────────────────
 * WHY THIS FILE EXISTS:
 *
 * Your React app runs on:  http://localhost:5173
 * Your Java app runs on:   http://localhost:8080
 *
 * Browsers block JavaScript from calling a different port/domain
 * unless that server explicitly allows it. This is the CORS rule.
 *
 * Without this file you will see this error in the browser console:
 *   "Access to fetch at 'localhost:8080' from origin 'localhost:5173'
 *    has been blocked by CORS policy"
 *
 * This file tells the browser: requests from localhost:5173 are allowed.
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                    .addMapping("/api/**")          // apply to all /api/ routes
                    .allowedOrigins(
                        "http://localhost:5173",    // Vite dev server (React)
                        "http://localhost:3000",    // fallback
                        "https://weather-app-frontend.up.railway.app", // railway frontend
                        "https://weather-app-ufn4.vercel.app"          // Vercel frontend
                    )
                    .allowedMethods("GET")
                    .allowedHeaders("*");
            }
        };
    }
}