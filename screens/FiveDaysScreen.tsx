import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { ForecastItem } from "../types/weatherSchema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Header from "../components/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import { useWeatherData } from "../hooks/useWeatherData";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import DayWeatherWidget from "../components/DayWeatherWidget";

const FiveDaysScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "FiveDays">
> = () => {
  const { styles } = useStyles(stylesheet);
  const city = useSelector((state: RootState) => state.city);

  const oneHourInMilliseconds = 60 * 60 * 1000;
  const oneDayInMilliseconds = 24 * oneHourInMilliseconds;

  const {
    weatherData,
    weatherLoading,
    weatherError,
    forecastLoading,
    forecastError,
    forecastData,
    tomorrowMidnight,
    minTemp,
    maxTemp,
  } = useWeatherData(city, true);

  if (weatherLoading || forecastLoading) {
    return <Loader />;
  }

  if (weatherError) {
    return (
      <ErrorMessage>
        Error fetching weather data: {weatherError as string}
      </ErrorMessage>
    );
  }

  if (forecastError) {
    return (
      <ErrorMessage>
        Error fetching weather data: {forecastError as string}
      </ErrorMessage>
    );
  }

  const filterWeatherDataForNextDays = () => {
    if (!forecastData) return [];

    const weatherDataForNextDays = [];

    for (let i = 1; i <= 4; i++) {
      const dayStart = new Date(
        tomorrowMidnight.getTime() + (i - 1) * oneDayInMilliseconds
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

  type DayWeatherSummary = {
    mainIcon: string | null;
    minTemp: number | null;
    maxTemp: number | null;
    date: Date | null;
  };

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
      ["", 0]
    )[0];

    return {
      date: date || null,
      mainIcon: mainIcon || null,
      minTemp: minTemp === Infinity ? null : minTemp,
      maxTemp: maxTemp === -Infinity ? null : maxTemp,
    };
  };

  const today = {
    date: new Date(),
    mainIcon: forecastData.list[0].weather[0].icon,
    minTemp: minTemp,
    maxTemp: maxTemp,
  };
  const tommorow = getDayWeatherSummary(0);
  const day3 = getDayWeatherSummary(1);
  const day4 = getDayWeatherSummary(2);
  const day5 = getDayWeatherSummary(3);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.cityTitle}>{city}</Text>
      <ScrollView
        style={styles.fiveDaysWeatherContainer}
        alwaysBounceVertical={false}
      >
        <DayWeatherWidget {...today} today />
        <DayWeatherWidget {...tommorow} />
        <DayWeatherWidget {...day3} />
        <DayWeatherWidget {...day4} />
        <DayWeatherWidget {...day5} />
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
    backgroundColor: theme.primaryBackgroud,
  },
  cityTitle: {
    fontSize: 35,
    color: theme.primaryText,
    padding: 15,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: -1,
  },
  fiveDaysWeatherContainer: {
    width: "100%",
    padding: 25,
    paddingRight: 35,
    flexWrap: "wrap",
    zIndex: -1,
  },
}));

export default FiveDaysScreen;
