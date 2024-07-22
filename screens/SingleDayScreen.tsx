import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  useWindowDimensions,
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
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "SingleDay">
> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Warsaw");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
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

  const getMinMaxTempForToday = () => {
    if (!forecastData) return { minTemp: null, maxTemp: null };
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const tomorrowMidnight = new Date(
      todayMidnight.getTime() + 24 * 60 * 60 * 1000
    );

    const todayTemps = forecastData.list
      .filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate >= todayMidnight && itemDate < tomorrowMidnight;
      })
      .map((item) => item.main.temp);

    if (todayTemps.length === 0) return { minTemp: null, maxTemp: null };

    const minTemp = Math.min(...todayTemps);
    const maxTemp = Math.max(...todayTemps);

    return { minTemp, maxTemp };
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>Error fetching weather data: {error}</ErrorMessage>;
  }

  const hourlyForecast = getHourlyForecastForNext48Hours();
  const { minTemp, maxTemp } = getMinMaxTempForToday();

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
      <ScrollView style={[styles.container]} bounces={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}></View>
          <View style={styles.mainInfoBox}>
            <Text style={styles.city}>{city}</Text>
            <Text style={styles.mainTemp}>
              {weatherData?.main.temp.toFixed() + "°C"}
            </Text>
            <Text style={styles.weatherDescription}>
              {weatherData?.weather[0].description}
            </Text>
            <Text style={styles.minMax}>
              from {minTemp?.toFixed() + "°"} to {maxTemp?.toFixed() + "°"}
            </Text>
          </View>
          <View style={styles.widgetsContainer}>
            <View style={styles.hourlyWeather}>
              <ScrollView>
                <View style={styles.hourlyWeatherColumns}></View>
              </ScrollView>
            </View>
            <View style={styles.smallerWidgetsContainer}>
              <View style={styles.widgets}></View>
              <View style={styles.widgets}></View>
              <View style={styles.widgets}></View>
              <View style={styles.widgets}></View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    backgroundColor: "yellow",
    width: "100%",
    height: 50,
  },
  mainInfoBox: {
    width: "100%",
    alignItems: "center",
    padding: "7%",
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
    backgroundColor: "red",
    justifyContent: "center",
  },
  hourlyWeather: {
    width: "100%",
    backgroundColor: "yellow",
    height: 190,
    marginBottom: 20,
    borderRadius: 5,
  },
  hourlyWeatherColumns: {
    height: 190,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  smallerWidgetsContainer: {
    backgroundColor: "blue",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 40,
  },
  widgets: {
    width: "43%",
    backgroundColor: "green",
    height: 140,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default SingleDayScreen;
