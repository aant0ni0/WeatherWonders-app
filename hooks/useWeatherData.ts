import { useState, useEffect } from "react";
import {
  WeatherData,
  ForecastData,
  ForecastItem,
} from "../types/weatherSchema";
//import { getWeatherByCity, getForecastByCity } from "../services/api";
import { weatherBackgrounds } from "../types/weatherBackdroundTypes";
import { WeatherTypes } from "../types/weatherBackdroundTypes";
import {
  useGetWeatherByCityQuery,
  useGetForecastByCityQuery,
} from "../services/api";

export const useWeatherData = (city: string, today: boolean) => {
  // const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  //const [error, setError] = useState<string | null>(null);

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

  const oneHourInMilliseconds = 60 * 60 * 1000;

  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const tomorrowMidnight = new Date(
    todayMidnight.getTime() + 24 * oneHourInMilliseconds
  );
  const date = today
    ? now
    : new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     try {
  //       const [weather, forecast] = await Promise.all([
  //         getWeatherByCity(city),
  //         getForecastByCity(city),
  //       ]);
  //       setWeatherData(weather);
  //       setForecastData(forecast);
  //     } catch (err) {
  //       console.log(err);
  //       setError("Error fetching weather data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchWeatherData();
  // }, [city]);

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

    let start, end;

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
    }
  );

  const chooseMainWeatherforTomorrow = (): string | null => {
    if (!weatherDataForTomorrow || weatherDataForTomorrow.length === 0) {
      return null;
    }

    const weatherCounts: { [key: string]: number } = {};

    weatherDataForTomorrow.forEach((item: ForecastItem) => {
      const weatherType = item.weather[0].description;
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
    });

    const sortedWeatherTypes = Object.entries(weatherCounts).sort(
      ([, a], [, b]) => b - a
    );
    const mostCommonWeather = sortedWeatherTypes[0]?.[0];

    return mostCommonWeather || null;
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
        (item: ForecastItem) => item.main.feels_like
      )
    );
    const avgHumidity =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.main.humidity,
        0
      ) / weatherDataForTomorrow.length;
    const avgVisibility =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.visibility,
        0
      ) / weatherDataForTomorrow.length;
    const avgWindSpeed =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.wind.speed,
        0
      ) / weatherDataForTomorrow.length;
    const avgPressure =
      weatherDataForTomorrow.reduce(
        (sum: number, item: ForecastItem) => sum + item.main.pressure,
        0
      ) / weatherDataForTomorrow.length;

    return {
      maxFeelsLike,
      avgHumidity,
      avgVisibility,
      avgWindSpeed,
      avgPressure,
    };
  };

  const { maxTemp } = getMinMaxTemp();
  console.log(maxTemp);

  const mainTempToday = weatherData
    ? Math.ceil(weatherData.main.temp) + "°C"
    : "cannot fetch weather data";

  const mainTempTomorrow = maxTemp
    ? Math.ceil(maxTemp) + "°C"
    : "cannot fetch weather data";

  const sunrise = weatherData?.sys.sunrise ? weatherData?.sys.sunrise : 0;
  const sunset = weatherData?.sys.sunset ? weatherData?.sys.sunset : 0;

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
        ""
      ) as WeatherTypes;
      return weatherBackgrounds[weatherType];
    } else {
      const weatherType = chooseMainWeatherforTomorrow()?.replace(
        /\s/g,
        ""
      ) as WeatherTypes;
      return weatherBackgrounds[weatherType];
    }
  };

  return {
    weatherData,
    forecastData,
    weatherLoading,
    weatherError,
    forecastLoading,
    forecastError,
    date,
    todayMidnight,
    tomorrowMidnight,
    getHourlyForecastForNext24Hours,
    getMinMaxTemp,
    weatherDataForTomorrow,
    chooseMainWeatherforTomorrow,
    getForecastForTomorrow,
    mainTempToday,
    mainTempTomorrow,
    sunrise,
    sunset,
    changeBackgroundImageDependsOnWeather,
    getfeelsLikeDescription,
  };
};
