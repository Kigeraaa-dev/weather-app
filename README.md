# Weather App

This is my weather app project for the assessment. It has two parts,
a React frontend and a Java Spring Boot backend.

## How to run

Make sure you have Java, Maven and Node installed.

**Start the backend first:**
cd backend
mvn spring-boot:run

**Then start the frontend:**
cd frontend
npm run dev

Open http://localhost:5173 in your browser

## Features
- Search for any city in the world
- Shows current temperature
- Can switch between celsius and fahrenheit
- Shows a 3 day forecast
- Shows wind speed and humidity

## Tech used
- React 19 with TypeScript
- Java 25 with Spring Boot 4.0.3
- OpenWeatherMap API
- Vite

## Problems I ran into
- CORS errors took me a while to understand and fix
- The API key didnt work at first, had to wait 2 hours
- Had trouble understanding how the two step geocoding worked
- pom.xml had a typo that broke maven for a while