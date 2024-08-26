import {
  WeatherData,
  ForecastData,
  ForecastItem,
  ForecastDataSchema,
  WeatherSchema,
} from "../types/weatherSchema";
import { weatherBackgrounds } from "../types/weatherBackdroundTypes";
import { WeatherTypes } from "../types/weatherBackdroundTypes";
import {
  useGetWeatherByCityQuery,
  useGetForecastByCityQuery,
} from "../services/api";

export const useWeatherData = (city: string, today: boolean) => {
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

  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const tomorrowMidnight = new Date(
    new Date(todayMidnight).setHours(24, 0, 0, 0)
  );
  const date = today
    ? now
    : new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds);

  const parsedForecastData = forecastData
    ? ForecastDataSchema.parse(forecastData)
    : null;
  const parsedWeatherData = weatherData
    ? WeatherSchema.parse(weatherData)
    : null;

  const getHourlyForecastForNext24Hours = (): ForecastItem[] => {
    if (!parsedForecastData) return [];
    return parsedForecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate > date &&
        itemDate <= new Date(date.getTime() + 27 * oneHourInMilliseconds)
      );
    });
  };

  const getMinMaxTemp = () => {
    if (!parsedForecastData) return { minTemp: null, maxTemp: null };

    let start: Date, end: Date;

    if (today) {
      start = todayMidnight;
      end = tomorrowMidnight;
    } else {
      start = tomorrowMidnight;
      end = new Date(tomorrowMidnight.getTime() + 24 * oneHourInMilliseconds);
    }

    const temps = parsedForecastData.list
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

  const weatherDataForTomorrow = parsedForecastData?.list.filter(
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

    const weatherCounts: Record<string, number> = {};

    weatherDataForTomorrow.forEach((item: ForecastItem) => {
      const weatherType = item.weather[0].description;
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
    });

    const weatherType = Object.entries(weatherCounts).reduce(
      (maxWeather, currentWeather) => {
        return currentWeather[1] > maxWeather[1] ? currentWeather : maxWeather;
      },
      ["", 0]
    )[0];

    return weatherType || null;
  };

  const getForecastForTomorrow = (): {
    [key: string]: number | null;
  } => {
    if (!parsedForecastData || !weatherDataForTomorrow)
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

  const { minTemp, maxTemp } = getMinMaxTemp();

  const mainTempToday = parsedWeatherData
    ? parsedWeatherData.main.temp.toFixed() + "°C"
    : "cannot fetch weather data";

  const mainTempTomorrow = maxTemp
    ? maxTemp.toFixed() + "°C"
    : "cannot fetch weather data";

  const sunrise = parsedWeatherData?.sys.sunrise ?? 0;
  const sunset = parsedWeatherData?.sys.sunset ?? 0;

  const { maxFeelsLike } = getForecastForTomorrow();

  const getfeelsLikeDescription = (): string => {
    let feelsLike: number | null = null;
    let mainTemp: string | null = null;

    if (today) {
      feelsLike = parsedWeatherData?.main.feels_like ?? null;
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
      if (!parsedWeatherData) return;
      const weatherType = parsedWeatherData.weather[0].description.replace(
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

  const mainTemp = today ? mainTempToday : mainTempTomorrow;
  const mainWeather = today
    ? parsedWeatherData?.weather[0].description
    : chooseMainWeatherforTomorrow();

  const getForecast = () => {
    let feelsLike: number | null = null;
    let humidity: number | null = null;
    let visibility: number | null = null;
    let windSpeed: number | null = null;
    let pressure: number | null = null;

    if (today) {
      const forecast = getForecastForTomorrow();
      feelsLike = forecast.maxFeelsLike;
      humidity = forecast.avgHumidity;
      visibility = forecast.avgVisibility;
      windSpeed = forecast.avgWindSpeed;
      pressure = forecast.avgPressure;
    } else {
      feelsLike = parsedWeatherData?.main.feels_like ?? null;
      humidity = parsedWeatherData?.main.humidity ?? null;
      visibility = parsedWeatherData?.visibility ?? null;
      windSpeed = parsedWeatherData?.wind.speed ?? null;
      pressure = parsedWeatherData?.main.pressure ?? null;
    }

    return { feelsLike, humidity, visibility, windSpeed, pressure };
  };

  const weatherBackground = changeBackgroundImageDependsOnWeather();
  const feelsLikeDescription = getfeelsLikeDescription();

  const timezoneOffset = parsedWeatherData?.timezone ?? 0;
  console.log(parsedWeatherData);

  return {
    weatherData: parsedWeatherData,
    forecastData: parsedForecastData,
    isLoading,
    error,
    minTemp,
    maxTemp,
    mainWeather,
    mainTemp,
    sunrise,
    sunset,
    weatherBackground,
    feelsLikeDescription,
    timezoneOffset,
    getForecast,
    getHourlyForecastForNext24Hours,
  };
};
