import {
  ForecastItem,
  ForecastData,
  WeatherData,
} from "../types/weatherSchema";
import { weatherBackgrounds } from "../types/weatherBackdroundTypes";
import { WeatherTypes } from "../types/weatherBackdroundTypes";
import { DayWeatherSummary } from "../types/weatherTypes";

export const getHourlyForecastForNext24Hours = (
  forecastData: ForecastData | undefined,
  date: Date,
  oneHourInMilliseconds: number,
): ForecastItem[] => {
  if (!forecastData) return [];
  return forecastData.list.filter((item: ForecastItem) => {
    const itemDate = new Date(item.dt * 1000);
    return (
      itemDate > date &&
      itemDate <= new Date(date.getTime() + 27 * oneHourInMilliseconds)
    );
  });
};

export const getMinMaxTemp = (
  forecastData: ForecastData | undefined,
  today: boolean,
  todayMidnight: Date,
  tomorrowMidnight: Date,
  oneHourInMilliseconds: number,
) => {
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

export const analyzeDayWeather = (dayData: ForecastItem[]) => {
  if (!dayData || dayData.length === 0)
    return {
      mainIcon: null,
      mainDescription: null,
      minTemp: null,
      maxTemp: null,
    };

  let minTemp = Infinity;
  let maxTemp = -Infinity;

  const weatherCounts: Record<string, { count: number; description: string }> =
    {};

  dayData.forEach((item: ForecastItem) => {
    minTemp = Math.min(minTemp, item.main.temp_min);
    maxTemp = Math.max(maxTemp, item.main.temp_max);

    const weatherIcon = item.weather[0].icon;
    const weatherDescription = item.weather[0].description;

    if (!weatherIcon.endsWith("n")) {
      if (weatherCounts[weatherIcon]) {
        weatherCounts[weatherIcon].count += 1;
      } else {
        weatherCounts[weatherIcon] = {
          count: 1,
          description: weatherDescription,
        };
      }
    }
  });

  const mainWeather = Object.entries(weatherCounts).reduce(
    (maxWeather, currentWeather) => {
      return currentWeather[1].count > maxWeather[1].count
        ? currentWeather
        : maxWeather;
    },
    ["", { count: 0, description: "" }],
  )[1];

  return {
    mainIcon:
      Object.keys(weatherCounts).find(
        (key) => weatherCounts[key].description === mainWeather.description,
      ) || null,
    mainDescription: mainWeather.description || null,
    minTemp: minTemp === Infinity ? null : minTemp,
    maxTemp: maxTemp === -Infinity ? null : maxTemp,
  };
};

export const chooseMainWeatherForTomorrow = (
  weatherDataForTomorrow: ForecastItem[],
) => {
  if (!weatherDataForTomorrow || weatherDataForTomorrow.length === 0) {
    return null;
  }

  const { mainDescription } = analyzeDayWeather(weatherDataForTomorrow);

  return mainDescription || null;
};

export const getForecastForTomorrow = (
  forecastData: ForecastData | undefined,
  weatherDataForTomorrow: ForecastItem[],
): {
  [key: string]: number | null;
} => {
  if (!forecastData || !weatherDataForTomorrow)
    return {
      maxFeelsLike: null,
      avgHumidity: null,
      avgVisibility: null,
      avgWindSpeed: null,
      avgPressure: null,
    };

  const maxFeelsLike = Math.max(
    ...weatherDataForTomorrow.map((item: ForecastItem) => item.main.feels_like),
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

export const getFeelsLikeDescription = (
  feelsLike: number | null,
  mainTemp: string | null,
): string => {
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

export const changeBackgroundImageDependsOnWeather = (
  today: boolean,
  weatherData: WeatherData | undefined,
  weatherDataForTomorrow: ForecastItem[],
) => {
  if (today) {
    if (!weatherData) return;
    const weatherType = weatherData.weather[0].description.replace(
      /\s/g,
      "",
    ) as WeatherTypes;
    return weatherBackgrounds[weatherType];
  } else {
    const weatherType = chooseMainWeatherForTomorrow(
      weatherDataForTomorrow,
    )?.replace(/\s/g, "") as WeatherTypes;
    return weatherBackgrounds[weatherType];
  }
};

export const getForecast = (
  today: boolean,
  weatherData: WeatherData | undefined,
  forecastForTomorrow: { [key: string]: number | null },
) => {
  let feelsLike: number | null = null;
  let humidity: number | null = null;
  let visibility: number | null = null;
  let windSpeed: number | null = null;
  let pressure: number | null = null;

  if (!today) {
    feelsLike = forecastForTomorrow.maxFeelsLike;
    humidity = forecastForTomorrow.avgHumidity;
    visibility = forecastForTomorrow.avgVisibility;
    windSpeed = forecastForTomorrow.avgWindSpeed;
    pressure = forecastForTomorrow.avgPressure;
  } else {
    feelsLike = weatherData?.main.feels_like ?? null;
    humidity = weatherData?.main.humidity ?? null;
    visibility = weatherData?.visibility ?? null;
    windSpeed = weatherData?.wind.speed ?? null;
    pressure = weatherData?.main.pressure ?? null;
  }

  return { feelsLike, humidity, visibility, windSpeed, pressure };
};

export const filterWeatherDataForNextDays = (
  forecastData: ForecastData | undefined,
  tomorrowMidnight: Date,
  oneDayInMilliseconds: number,
) => {
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

export const getWeatherSummaryForDay = (
  daysFromTomorrow: number,
  weatherDataForNextFourDays: ForecastItem[][],
): DayWeatherSummary => {
  const dayData = weatherDataForNextFourDays[daysFromTomorrow];

  if (!dayData || dayData.length === 0)
    return { mainIcon: null, minTemp: null, maxTemp: null, date: null };

  const { mainIcon, minTemp, maxTemp } = analyzeDayWeather(dayData);

  const firstItem = dayData[0];
  const timestampInSeconds = firstItem.dt;
  const date = new Date(timestampInSeconds * 1000);

  return {
    date: date || null,
    mainIcon: mainIcon || null,
    minTemp: minTemp,
    maxTemp: maxTemp,
  };
};
