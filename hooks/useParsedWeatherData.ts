import {
  useGetWeatherByCityQuery as useRawGetWeatherByCityQuery,
  useGetForecastByCityQuery as useRawGetForecastByCityQuery,
} from "../services/api";
import { WeatherSchema, ForecastDataSchema } from "../types/weatherSchema";
import { WeatherData, ForecastData } from "../types/weatherSchema";

export const useGetParsedWeatherByCityQuery = (city: string) => {
  const {
    data: weatherData,
    error: weatherError,
    isLoading: weatherLoading,
  } = useRawGetWeatherByCityQuery(city);

  const parsedWeatherData: WeatherData | null = weatherData
    ? WeatherSchema.parse(weatherData)
    : null;

  return {
    data: parsedWeatherData,
    error: weatherError,
    isLoading: weatherLoading,
  };
};

export const useGetParsedForecastByCityQuery = (city: string) => {
  const {
    data: forecastData,
    error: forecastError,
    isLoading: forecastLoading,
  } = useRawGetForecastByCityQuery(city);

  const parsedForecastData: ForecastData | null = forecastData
    ? ForecastDataSchema.parse(forecastData)
    : null;

  return {
    data: parsedForecastData,
    error: forecastError,
    isLoading: forecastLoading,
  };
};
