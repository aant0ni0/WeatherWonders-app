import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

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
