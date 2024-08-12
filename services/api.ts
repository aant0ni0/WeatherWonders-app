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
