import axios from "axios";
import { WeatherData } from "../types/weatherSchema";
import { ForecastData } from "../types/weatherSchema";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const weatherResponse = await axios.get(
      `${BASE_URL_WEATHER}?q=${city}&appid=${API_KEY}&units=metric`
    );
    return weatherResponse.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const getForecastByCity = async (
  city: string
): Promise<ForecastData> => {
  try {
    const forecastResponse = await axios.get(
      `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`
    );

    return forecastResponse.data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};
