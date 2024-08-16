import { View, Text } from "react-native";
import { useState } from "react";
import {
  ForecastData,
  ForecastItem,
  WeatherData,
} from "../types/weatherSchema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Header from "../components/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import { useWeatherData } from "../hooks/useWeatherData";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

const FiveDaysScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "FiveDays">
> = () => {
  const { styles } = useStyles(stylesheet);
  const city = useSelector((state: RootState) => state.city);

  const {
    weatherData,
    weatherLoading,
    weatherError,
    forecastLoading,
    forecastError,
    forecastData,
  } = useWeatherData(city);

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

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.cityTitle}>{city}</Text>
      <View style={styles.fiveDaysWeatherContainer}></View>
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
    fontSize: 30,
    color: theme.primaryText,
    padding: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  fiveDaysWeatherContainer: {
    width: "100%",
  },
}));

export default FiveDaysScreen;
