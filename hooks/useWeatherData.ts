import { ForecastItem } from "../types/weatherSchema";
import {
  useGetForecastByCityQuery,
  useGetWeatherByCityQuery,
} from "../services/api";
import {
  getHourlyForecastForNext24Hours,
  getMinMaxTemp,
  chooseMainWeatherForTomorrow,
  getForecastForTomorrow,
  getFeelsLikeDescription,
  changeBackgroundImageDependsOnWeather,
  getForecast,
  filterWeatherDataForNextDays,
  getWeatherSummaryForDay,
} from "../utils/weatherUtils";

export const useWeatherData = (city: string, today: boolean = true) => {
  const {
    data: weatherData,
    error: weatherError,
    isLoading: weatherLoading,
  } = useGetWeatherByCityQuery(city);

  const {
    data: forecastData,
    error: forecastError,
    isLoading: forecastLoading,
  } = useGetForecastByCityQuery(city);

  const isLoading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;

  const oneHourInMilliseconds = 60 * 60 * 1000;
  const oneDayInMilliseconds = 24 * oneHourInMilliseconds;

  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const tomorrowMidnight = new Date(
    new Date(todayMidnight).setHours(24, 0, 0, 0),
  );

  const date = today
    ? now
    : new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds);

  const hourlyForecast = getHourlyForecastForNext24Hours(
    forecastData,
    date,
    oneHourInMilliseconds,
  );

  const { minTemp, maxTemp } = getMinMaxTemp(
    forecastData,
    today,
    todayMidnight,
    tomorrowMidnight,
    oneHourInMilliseconds,
  );

  const weatherDataForTomorrow =
    forecastData?.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate >
          new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds) &&
        itemDate <=
          new Date(tomorrowMidnight.getTime() + 21 * oneHourInMilliseconds)
      );
    }) ?? [];

  const mainTempToday = weatherData
    ? weatherData.main.temp.toFixed() + "°C"
    : "Cannot fetch weather data";

  const mainTempTomorrow = maxTemp
    ? maxTemp.toFixed() + "°C"
    : "Cannot fetch weather data";

  const mainTemp = today ? mainTempToday : mainTempTomorrow;

  const mainWeather = today
    ? weatherData?.weather[0].description
    : chooseMainWeatherForTomorrow(weatherDataForTomorrow);

  const timezoneOffset = weatherData?.timezone ?? 0;

  const sunrise = weatherData?.sys.sunrise ?? 0;
  const sunset = weatherData?.sys.sunset ?? 0;
  const adjustedSunrise = new Date((sunrise + timezoneOffset) * 1000);
  const adjustedSunset = new Date((sunset + timezoneOffset) * 1000);

  const forecastForTomorrow = getForecastForTomorrow(
    forecastData,
    weatherDataForTomorrow,
  );

  const forecast = getForecast(today, weatherData, forecastForTomorrow);

  const feelsLikeDescription = getFeelsLikeDescription(
    forecast.feelsLike,
    mainTemp,
  );

  const weatherBackground = changeBackgroundImageDependsOnWeather(
    today,
    weatherData,
    weatherDataForTomorrow,
  );
  const weatherDataForNextFourDays = filterWeatherDataForNextDays(
    forecastData,
    tomorrowMidnight,
    oneDayInMilliseconds,
  );

  const getDayWeatherSummary = (daysFromTomorrow: number) =>
    getWeatherSummaryForDay(daysFromTomorrow, weatherDataForNextFourDays);

  return {
    weatherData,
    forecastData,
    isLoading,
    error,
    minTemp,
    maxTemp,
    mainWeather,
    mainTemp,
    sunrise: adjustedSunrise,
    sunset: adjustedSunset,
    weatherBackground,
    feelsLikeDescription,
    getWeatherSummaryForDay: getDayWeatherSummary,
    timezoneOffset,
    getForecast: () => forecast,
    getHourlyForecastForNext24Hours: () => hourlyForecast,
  };
};
