import axios from 'axios';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';

// Create a separate axios instance for Weather API (no auth required)
const weatherAxios = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Weather API Service
 * Handles all weather data fetching operations
 */

/**
 * Fetch current weather for a location
 * @param {Object} params - Weather query parameters
 * @param {number} params.latitude - Latitude coordinate
 * @param {number} params.longitude - Longitude coordinate
 * @param {boolean} params.current_weather - Include current weather
 */
export const getCurrentWeather = async ({ latitude, longitude }) => {
  const response = await weatherAxios.get('/forecast', {
    params: {
      latitude,
      longitude,
      current_weather: true,
      timezone: 'auto'
    }
  });
  return response.data;
};

/**
 * Fetch detailed weather forecast
 * @param {Object} params - Weather query parameters
 * @param {number} params.latitude - Latitude coordinate
 * @param {number} params.longitude - Longitude coordinate
 */
export const getWeatherForecast = async ({ latitude, longitude }) => {
  const response = await weatherAxios.get('/forecast', {
    params: {
      latitude,
      longitude,
      current_weather: true,
      hourly: 'temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
      timezone: 'auto',
      forecast_days: 7
    }
  });
  return response.data;
};
