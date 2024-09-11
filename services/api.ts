import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { dataSchema } from "../types/geoNamesSchema";
import { WeatherSchema, ForecastDataSchema } from "../types/weatherSchema";

const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export const weatherApi = createApi({
  reducerPath: "WeatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_WEATHER }),
  endpoints: (builder) => ({
    getWeatherByCity: builder.query({
      query: (city) => `/weather?q=${city}&appid=${API_KEY}&units=metric`,
      transformResponse: (data) => {
        const parsedData = WeatherSchema.safeParse(data);
        if (!parsedData.success) {
          console.error("Failed to parse weather data:", parsedData.error);
          throw new Error("Failed to parse weather data");
        }
        return parsedData.data;
      },
    }),
    getForecastByCity: builder.query({
      query: (city) => `/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      transformResponse: (data) => {
        const parsedData = ForecastDataSchema.safeParse(data);
        if (!parsedData.success) {
          console.error("Failed to parse forecast data:", parsedData.error);
          throw new Error("Failed to parse forecast data");
        }
        return parsedData.data;
      },
    }),
  }),
});

export const { useGetWeatherByCityQuery, useGetForecastByCityQuery } =
  weatherApi;

const BASE_URL_GEONAMES = "https://secure.geonames.org";

export const geonamesApi = createApi({
  reducerPath: "geonamesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL_GEONAMES }),
  endpoints: (builder) => ({
    searchCity: builder.query({
      query: (text) =>
        `/searchJSON?name_startsWith=${text}&featureClass=P&maxRows=5&username=${process.env.EXPO_PUBLIC_USERNAME}`,
      transformResponse: (data) => {
        const parsedData = dataSchema.safeParse(data);
        if (!parsedData.success) {
          console.error("Failed to parse geonames data:", parsedData.error);
          throw new Error("Failed to parse geonames data");
        }
        return parsedData.data;
      },
    }),
  }),
});

export const { useLazySearchCityQuery } = geonamesApi;
