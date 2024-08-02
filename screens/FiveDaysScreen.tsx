import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import {
  ForecastData,
  ForecastItem,
  WeatherData,
} from "../types/weatherSchema";

const FiveDaysScreen = () => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getDailyForecastForNext5Days = (): ForecastItem[] => {
    if (!forecastData) return [];

    const dailyForecasts: { [date: string]: ForecastItem } = {};

    forecastData.list.forEach((item: ForecastItem) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();

      if (
        !dailyForecasts[date] ||
        item.main.temp > dailyForecasts[date].main.temp
      ) {
        dailyForecasts[date] = item;
      }
    });

    const sortedForecasts = Object.values(dailyForecasts).sort(
      (a, b) => a.dt - b.dt
    );

    return sortedForecasts.slice(0, 5);
  };

  const dailyForecast = getDailyForecastForNext5Days();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error fetching weather data: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>FiveDaysScreen</Text>
    </View>
  );
};

export default FiveDaysScreen;
