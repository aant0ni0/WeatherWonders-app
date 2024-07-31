import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
import { useWeatherData } from "../hooks/useWeatherData";
import colors from "../assets/colors";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { createStyleSheet, UnistylesRuntime } from "react-native-unistyles";
import SunriseSunsetChart from "../components/SunriseSunsetChart";
import HourlyForecast from "../components/HourlyForecast";
import Header from "../components/header/Header";

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TomorrowScreen">
> = ({ route }) => {
  const city = "Krakow";
  const today = route.params["today"];

  const {
    weatherData,
    forecastData,
    loading,
    error,
    getHourlyForecastForNext24Hours,
    getMinMaxTemp,
    chooseMainWeatherforTomorrow,
    getForecastForTomorrow,
    mainTempToday,
    mainTempTomorrow,
    sunrise,
    sunset,
    changeBackgroundImageDependsOnWeather,
    getfeelsLikeDescription,
  } = useWeatherData(city, today);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>Error fetching weather data: {error}</ErrorMessage>;
  }

  const hourlyForecast = getHourlyForecastForNext24Hours();
  const { minTemp, maxTemp } = getMinMaxTemp();
  const {
    maxFeelsLike,
    avgHumidity,
    avgVisibility,
    avgWindSpeed,
    avgPressure,
  } = getForecastForTomorrow();

  return (
    <ImageBackground
      source={changeBackgroundImageDependsOnWeather()}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <ScrollView style={[styles.container]} bounces={false}>
        <Header />
        <View style={styles.mainInfoBox}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.mainTemp}>
            {today ? mainTempToday : mainTempTomorrow}
          </Text>
          <Text style={styles.weatherDescription}>
            {today
              ? weatherData?.weather[0].description
              : chooseMainWeatherforTomorrow()}
          </Text>
          <Text style={styles.minMax}>
            from {minTemp?.toFixed() + "°"} to {maxTemp?.toFixed() + "°"}
          </Text>
        </View>
        <View style={styles.widgetsContainer}>
          <HourlyForecast hourlyForecast={hourlyForecast} />
          <View style={styles.smallerWidgetsContainer}>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Humidity:</Text>
              <Text style={styles.widgetContent}>
                {today
                  ? weatherData?.main.humidity + "%"
                  : avgHumidity?.toFixed() + "%"}
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Feels like:</Text>
              <Text style={styles.widgetContent}>
                {today
                  ? weatherData?.main.feels_like.toFixed() + "°C"
                  : maxFeelsLike?.toFixed() + "°C"}
              </Text>
              <Text style={styles.widgetDescription}>
                {getfeelsLikeDescription()}
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Wind:</Text>
              <Text
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 6,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {today
                  ? weatherData?.wind.speed?.toFixed(1)
                  : avgWindSpeed?.toFixed(1)}
                <Text style={{ fontSize: 10 }}> m/s</Text>
              </Text>
              <Image
                source={require("../assets/images/compas.png")}
                style={styles.compass}
              />
              <Image
                source={require("../assets/images/compasNeedle.png")}
                style={[
                  styles.compassNeedle,
                  { transform: [{ rotate: `${weatherData?.wind.deg}deg` }] },
                ]}
              />
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Visibility:</Text>
              <Text style={styles.widgetContent}>
                {today
                  ? weatherData?.visibility
                    ? (weatherData?.visibility / 1000).toFixed(1) + " km"
                    : ""
                  : avgVisibility
                  ? (avgVisibility / 1000).toFixed(1) + " km"
                  : ""}
              </Text>
            </View>

            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Pressure:</Text>
              <Text style={styles.widgetContent}>
                {today
                  ? weatherData?.main.pressure + " hPa"
                  : avgPressure?.toFixed() + " hPa"}
              </Text>
              <Text style={styles.widgetDescription}>
                Correct pressure is 1013,5 hPa
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Sunrise and Sunset</Text>
              <SunriseSunsetChart
                sunrise={sunrise}
                sunset={sunset}
                currentTime={new Date().getTime()}
                today={today}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    paddingTop: insetsTop,
  },
  background: {
    width: "100%",
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3 . )",
  },

  mainInfoBox: {
    width: "100%",
    alignItems: "center",
    padding: "5%",
  },
  mainTemp: {
    fontSize: 75,
    color: colors.primaryText,
    fontWeight: "bold",
  },
  city: {
    fontSize: 30,
    color: colors.primaryText,
    fontWeight: "bold",
  },
  weatherDescription: {
    fontSize: 30,
    color: colors.primaryText,
    marginBottom: 10,
  },
  minMax: {
    fontSize: 20,
    color: colors.primaryText,
  },
  widgetsContainer: {
    width: "100%",
    padding: "7%",
    paddingTop: "10%",
    justifyContent: "center",
    marginBottom: 20,
  },
  smallerWidgetsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  widgets: {
    width: "45%",
    backgroundColor: colors.primaryWidget,
    height: width / 3,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
    opacity: 0.9,
    overflow: "hidden",
  },
  widgetTitle: {
    position: "absolute",
    top: 4,
    left: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  widgetContent: {
    fontSize: 25,
    fontWeight: "500",
  },
  widgetDescription: {
    position: "absolute",
    bottom: 2,
    left: 4,
    color: "#585858",
  },
  compass: {
    width: width / 2,
    height: height / 4.5,
    position: "absolute",
  },
  compassNeedle: {
    width: "83%",
    height: "83%",
    position: "absolute",
    top: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
  },
});

export default SingleDayScreen;
