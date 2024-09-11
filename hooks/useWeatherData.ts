import { ForecastItem } from "../types/weatherSchema";
import { weatherBackgrounds } from "../types/weatherBackdroundTypes";
import { WeatherTypes } from "../types/weatherBackdroundTypes";

import {
  useGetForecastByCityQuery,
  useGetWeatherByCityQuery,
} from "../services/api";
import { DayWeatherSummary } from "../types/weatherTypes";

export const useWeatherData = (city: string, today?: boolean) => {
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

  const getHourlyForecastForNext24Hours = (): ForecastItem[] => {
    if (!forecastData) return [];
    return forecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate > date &&
        itemDate <= new Date(date.getTime() + 27 * oneHourInMilliseconds)
      );
    });
  };

  const getMinMaxTemp = () => {
    if (!forecastData) return { minTemp: null, maxTemp: null };

    let start: Date, end: Date;

    if (today) {
      start = todayMidnight;
      end = tomorrowMidnight;
    } else {
      start = tomorrowMidnight;
      end = new Date(tomorrowMidnight.getTime() + 24 * oneHourInMilliseconds);
    }

    const temps = forecastData.list
      .filter((item: ForecastItem) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate >= start && itemDate < end;
      })
      .map((item: ForecastItem) => item.main.temp);

    if (temps.length === 0) return { minTemp: null, maxTemp: null };

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    return { minTemp, maxTemp };
  };

  const weatherDataForTomorrow = forecastData?.list.filter(
    (item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate >
          new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds) &&
        itemDate <=
          new Date(tomorrowMidnight.getTime() + 21 * oneHourInMilliseconds)
      );
    },
  );

  const chooseMainWeatherforTomorrow = (): string | null => {
    if (!weatherDataForTomorrow || weatherDataForTomorrow.length === 0) {
      return null;
    }

    const weatherCounts: Record<string, number> = {};

    weatherDataForTomorrow.forEach((item: ForecastItem) => {
      const weatherType = item.weather[0].description;
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
    });

    const weatherType = Object.entries(weatherCounts).reduce(
      (maxWeather, currentWeather) => {
        return currentWeather[1] > maxWeather[1] ? currentWeather : maxWeather;
      },
      ["", 0],
    )[0];

    return weatherType || null;
  };

  const getForecastForTomorrow = (): {
    [key: string]: number | null;
  } => {
    if (!forecastData || !weatherDataForTomorrow)
      return {
        avgFeelsLike: null,
        avgHumidity: null,
        avgVisibility: null,
        avgWindSpeed: null,
        avgPressure: null,
      };

    const maxFeelsLike = Math.max(
      ...weatherDataForTomorrow.map(
        (item: ForecastItem) => item.main.feels_like,
      ),
    );
    const avgHumidity =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.main.humidity,
        0,
      ) / weatherDataForTomorrow.length;
    const avgVisibility =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.visibility,
        0,
      ) / weatherDataForTomorrow.length;
    const avgWindSpeed =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.wind.speed,
        0,
      ) / weatherDataForTomorrow.length;
    const avgPressure =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.main.pressure,
        0,
      ) / weatherDataForTomorrow.length;
    return {
      maxFeelsLike,
      avgHumidity,
      avgVisibility,
      avgWindSpeed,
      avgPressure,
    };
  };

  const { minTemp, maxTemp } = getMinMaxTemp();

  const mainTempToday = weatherData
    ? weatherData.main.temp.toFixed() + "°C"
    : "cannot fetch weather data";

  const mainTempTomorrow = maxTemp
    ? maxTemp.toFixed() + "°C"
    : "cannot fetch weather data";

  const timezoneOffset = weatherData?.timezone ?? 0;

  const sunrise = weatherData?.sys.sunrise ?? 0;
  const sunset = weatherData?.sys.sunset ?? 0;

  const adjustedSunrise = new Date(sunrise * 1000 + timezoneOffset * 1000);
  const adjustedSunset = new Date(sunset * 1000 + timezoneOffset * 1000);

  console.log(
    new Date(sunrise * 1000).toTimeString(),
    new Date(sunrise * 1000 + timezoneOffset * 1000).toUTCString(),
  );

  const { maxFeelsLike } = getForecastForTomorrow();

  const getfeelsLikeDescription = (): string => {
    let feelsLike: number | null = null;
    let mainTemp: string | null = null;

    if (today) {
      feelsLike = weatherData?.main.feels_like ?? null;
      mainTemp = mainTempToday;
    } else {
      feelsLike = maxFeelsLike ? Math.ceil(maxFeelsLike) : null;
      mainTemp = mainTempTomorrow;
    }

    if (feelsLike !== null && mainTemp !== null) {
      const mainTempValue = parseInt(mainTemp);

      if (feelsLike > mainTempValue) {
        return "The humidity makes it seem warmer";
      } else if (feelsLike < mainTempValue) {
        return "The wind makes it seem colder";
      } else {
        return "Similar to the actual temperature";
      }
    }

    return "Data unavailable";
  };

  const changeBackgroundImageDependsOnWeather = () => {
    if (today) {
      if (!weatherData) return;
      const weatherType = weatherData.weather[0].description.replace(
        /\s/g,
        "",
      ) as WeatherTypes;
      return weatherBackgrounds[weatherType];
    } else {
      const weatherType = chooseMainWeatherforTomorrow()?.replace(
        /\s/g,
        "",
      ) as WeatherTypes;
      return weatherBackgrounds[weatherType];
    }
  };

  const mainTemp = today ? mainTempToday : mainTempTomorrow;
  const mainWeather = today
    ? weatherData?.weather[0].description
    : chooseMainWeatherforTomorrow();

  const getForecast = () => {
    let feelsLike: number | null = null;
    let humidity: number | null = null;
    let visibility: number | null = null;
    let windSpeed: number | null = null;
    let pressure: number | null = null;

    if (!today) {
      const forecast = getForecastForTomorrow();
      feelsLike = forecast.maxFeelsLike;
      humidity = forecast.avgHumidity;
      visibility = forecast.avgVisibility;
      windSpeed = forecast.avgWindSpeed;
      pressure = forecast.avgPressure;
    } else {
      feelsLike = weatherData?.main.feels_like ?? null;
      humidity = weatherData?.main.humidity ?? null;
      visibility = weatherData?.visibility ?? null;
      windSpeed = weatherData?.wind.speed ?? null;
      pressure = weatherData?.main.pressure ?? null;
    }

    return { feelsLike, humidity, visibility, windSpeed, pressure };
  };

  const filterWeatherDataForNextDays = () => {
    if (!forecastData) return [];

    const weatherDataForNextDays = [];

    for (let i = 1; i <= 4; i++) {
      const dayStart = new Date(
        tomorrowMidnight.getTime() + (i - 1) * oneDayInMilliseconds,
      );
      const dayEnd = new Date(dayStart.getTime() + oneDayInMilliseconds);

      const dayData = forecastData.list.filter((item: ForecastItem) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate >= dayStart && itemDate < dayEnd;
      });

      weatherDataForNextDays.push(dayData);
    }

    return weatherDataForNextDays;
  };

  const weatherDataForNextFourDays = filterWeatherDataForNextDays();

  const getDayWeatherSummary = (number: number): DayWeatherSummary => {
    const dayData = weatherDataForNextFourDays[number];

    if (!dayData || dayData.length === 0)
      return { mainIcon: null, minTemp: null, maxTemp: null, date: null };

    const firstItem = dayData[0];
    const timestampInSeconds = firstItem.dt;
    const date = new Date(timestampInSeconds * 1000);

    let minTemp = Infinity;
    let maxTemp = -Infinity;

    const weatherCounts: Record<string, number> = {};

    dayData.forEach((item: ForecastItem) => {
      minTemp = Math.min(minTemp, item.main.temp_min);
      maxTemp = Math.max(maxTemp, item.main.temp_max);

      const weatherIcon = item.weather[0].icon;
      weatherCounts[weatherIcon] = (weatherCounts[weatherIcon] || 0) + 1;
    });

    const mainIcon = Object.entries(weatherCounts).reduce(
      (maxWeather, currentWeather) => {
        return currentWeather[1] > maxWeather[1] ? currentWeather : maxWeather;
      },
      ["", 0],
    )[0];

    return {
      date: date || null,
      mainIcon: mainIcon || null,
      minTemp: minTemp === Infinity ? null : minTemp,
      maxTemp: maxTemp === -Infinity ? null : maxTemp,
    };
  };

  const weatherBackground = changeBackgroundImageDependsOnWeather();
  const feelsLikeDescription = getfeelsLikeDescription();

  return {
    weatherData: weatherData,
    forecastData: forecastData,
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
    tomorrowMidnight,
    getDayWeatherSummary,
    timezoneOffset,
    getForecast,
    getHourlyForecastForNext24Hours,
  };
};
