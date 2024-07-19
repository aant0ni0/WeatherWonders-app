import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabsParamList } from "../types/navigation";
import { getWeatherByCity, getForecastByCity } from "../services/api";
import {
  ForecastData,
  ForecastItem,
  WeatherData,
} from "../types/weatherSchema";
import {
  weatherBackgrounds,
  WeatherTypes,
} from "../types/weatherBackdroundTypes";
import colors from "../assets/colors";

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "SingleDay">
> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const city = "Warsaw";
        const [weather, forecast] = await Promise.all([
          getWeatherByCity(city),
          getForecastByCity(city),
        ]);
        setWeatherData(weather);
        setForecastData(forecast);
      } catch (err) {
        console.log(err);
        setError("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getHourlyForecastForNext48Hours = (): ForecastItem[] => {
    if (!forecastData) return [];
    const now = new Date();
    return forecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate > now &&
        itemDate <= new Date(now.getTime() + 48 * 60 * 60 * 1000)
      );
    });
  };

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

  const hourlyForecast = getHourlyForecastForNext48Hours();

  const changeBackgroundImageDependsOnWeather = () => {
    if (!weatherData) return;
    const weatherType = weatherData.weather[0].description.replace(
      /\s/g,
      ""
    ) as WeatherTypes;
    console.log(weatherType);
    return weatherBackgrounds[weatherType];
  };

  return (
    <ImageBackground
      source={changeBackgroundImageDependsOnWeather()}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View></View>
          <View></View>
          <View>
            <ScrollView></ScrollView>
            <View></View>
            <View></View>
            <View></View>
            <View></View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
  },
  background: {
    width: "100%",
    flex: 1,
    resizeMode: "cover",
  },
});

export default SingleDayScreen;
