package com.weather.model;

import java.util.List;

/**
 * WeatherResponse
 * ───────────────
 * Defines the shape of the JSON we send back to React.
 *
 * Spring Boot + Jackson automatically converts this class to JSON:
 * {
 *   "city":          "Nairobi",
 *   "country":       "KE",
 *   "temp":          22.5,
 *   "description":   "Partly Cloudy",
 *   "iconCode":      "04d",
 *   "humidity":      68,
 *   "windSpeed":     14.4,
 *   "windDirection": "NE",
 *   "latitude":      -1.29,
 *   "longitude":     36.82,
 *   "forecast": [ ... ]
 * }
 */
public class WeatherResponse {

    private String city;
    private String country;
    private double temp;
    private String description;
    private String iconCode;
    private double windSpeed;
    private String windDirection;
    private int    humidity;
    private double latitude;
    private double longitude;
    private List<ForecastDay> forecast;

    // ── Inner class: one day of forecast ───────────────────────────────────

    public static class ForecastDay {
        private String date;
        private String iconCode;
        private String description;
        private double tempHigh;
        private double tempLow;

        public ForecastDay() {}

        public ForecastDay(String date, String iconCode, String description,
                           double tempHigh, double tempLow) {
            this.date        = date;
            this.iconCode    = iconCode;
            this.description = description;
            this.tempHigh    = tempHigh;
            this.tempLow     = tempLow;
        }

        public String getDate()              { return date; }
        public void   setDate(String d)      { this.date = d; }
        public String getIconCode()          { return iconCode; }
        public void   setIconCode(String i)  { this.iconCode = i; }
        public String getDescription()           { return description; }
        public void   setDescription(String d)   { this.description = d; }
        public double getTempHigh()          { return tempHigh; }
        public void   setTempHigh(double t)  { this.tempHigh = t; }
        public double getTempLow()           { return tempLow; }
        public void   setTempLow(double t)   { this.tempLow = t; }
    }

    // ── Constructors ────────────────────────────────────────────────────────
    public WeatherResponse() {}

    // ── Getters and Setters ─────────────────────────────────────────────────
    public String getCity()              { return city; }
    public void   setCity(String c)      { this.city = c; }
    public String getCountry()           { return country; }
    public void   setCountry(String c)   { this.country = c; }
    public double getTemp()              { return temp; }
    public void   setTemp(double t)      { this.temp = t; }
    public String getDescription()           { return description; }
    public void   setDescription(String d)   { this.description = d; }
    public String getIconCode()          { return iconCode; }
    public void   setIconCode(String i)  { this.iconCode = i; }
    public double getWindSpeed()           { return windSpeed; }
    public void   setWindSpeed(double w)   { this.windSpeed = w; }
    public String getWindDirection()           { return windDirection; }
    public void   setWindDirection(String w)   { this.windDirection = w; }
    public int    getHumidity()        { return humidity; }
    public void   setHumidity(int h)   { this.humidity = h; }
    public double getLatitude()            { return latitude; }
    public void   setLatitude(double l)    { this.latitude = l; }
    public double getLongitude()           { return longitude; }
    public void   setLongitude(double l)   { this.longitude = l; }
    public List<ForecastDay> getForecast()                    { return forecast; }
    public void              setForecast(List<ForecastDay> f) { this.forecast = f; }
}
