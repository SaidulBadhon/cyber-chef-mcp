import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description: "Get the current weather for a location",
  parameters: z.object({
    location: z
      .string()
      .describe("The city and country, e.g. 'London, UK' or 'New York, US'"),
    unit: z
      .enum(["celsius", "fahrenheit"])
      .optional()
      .default("celsius")
      .describe("Temperature unit"),
  }),
  execute: async ({ location, unit }) => {
    try {
      // Using Open-Meteo API (free, no API key required)
      // First, get coordinates for the location using geocoding
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        return { error: `Location "${location}" not found` };
      }

      const { latitude, longitude, name, country } = geocodeData.results[0];

      // Get weather data
      const tempUnit = unit === "fahrenheit" ? "fahrenheit" : "celsius";
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=${tempUnit}`
      );
      const weatherData = await weatherResponse.json();

      const current = weatherData.current;

      // Weather code descriptions
      const weatherCodes: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      return {
        location: `${name}, ${country}`,
        temperature: current.temperature_2m,
        unit: unit === "fahrenheit" ? "°F" : "°C",
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        condition: weatherCodes[current.weather_code] || "Unknown",
      };
    } catch (error) {
      return { error: "Failed to fetch weather data" };
    }
  },
});

