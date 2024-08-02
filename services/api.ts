import axios from "axios";
import { WeatherData } from "../types/weatherSchema";
import { ForecastData } from "../types/weatherSchema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = "3f6de936886f0b0bd368ed34bbd07eee";
const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5";

export const weatherApi = createApi({
  reducerPath: "WeatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_WEATHER }),
  endpoints: (builder) => ({
    getWeatherByCity: builder.query({
      query: (city) => `/weather?q=${city}&appid=${API_KEY}&units=metric`,
    }),
    getForecastByCity: builder.query({
      query: (city) => `/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    }),
  }),
});

export const { useGetWeatherByCityQuery, useGetForecastByCityQuery } =
  weatherApi;

// export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
//   try {
//     const weatherResponse = await axios.get(
//       `${BASE_URL_WEATHER}?q=${city}&appid=${API_KEY}&units=metric`
//     );
//     return weatherResponse.data;
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     throw error;
//   }
// };

// export const getForecastByCity = async (
//   city: string
// ): Promise<ForecastData> => {
//   try {
//     const forecastResponse = await axios.get(
//       `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     return forecastResponse.data;
//   } catch (error) {
//     console.error("Error fetching forecast data:", error);
//     throw error;
//   }
// };
