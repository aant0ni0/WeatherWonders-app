import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  useWindowDimensions,
  Image,
  TextInput,
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
import { Ionicons } from "@expo/vector-icons";
import {
  weatherBackgrounds,
  WeatherTypes,
} from "../types/weatherBackdroundTypes";
import colors from "../assets/colors";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { FlatList } from "react-native-gesture-handler";
import { createStyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { unistyles } from "react-native-unistyles/lib/typescript/src/core";

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;
const insetsBottom = UnistylesRuntime.insets.bottom;
const insetsLeft = UnistylesRuntime.insets.left;
const insetsRight = UnistylesRuntime.insets.right;

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TommorowScreen">
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

  const formatTimestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <ImageBackground
      source={changeBackgroundImageDependsOnWeather()}
      style={styles.background}
    >
      <ScrollView style={[styles.container]} bounces={false}>
        <View style={styles.header}>
          <View style={styles.radarButton}>
            <Ionicons name="radio-outline" size={35} color="white" />
          </View>
          <TextInput style={styles.searchBar} placeholder="Search city..." />
        </View>
        <View style={styles.mainInfoBox}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.mainTemp}>
            {weatherData
              ? Math.ceil(weatherData.main.temp) + "°C"
              : "cannot fetch weather data"}
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
            <Text style={styles.hourlyWeatherTitle}>Hourly Weather</Text>
            <FlatList
              data={hourlyForecast}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.hourlyWeatherColumns}>
                  <View style={{ marginHorizontal: 15 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                      {new Date(item.dt_txt).getHours()}:00
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    }}
                    style={styles.weatherIcon}
                  />

                  <Text style={{ fontSize: 16 }}>
                    {item.main.temp.toFixed() + "°"}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.dt.toString()}
            />
          </View>
          <View style={styles.smallerWidgetsContainer}>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Feels like:</Text>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                {weatherData?.main.feels_like.toFixed() + "°C"}
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Humidity:</Text>
              <Text>{weatherData?.main.humidity}%</Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Visibility:</Text>
              <Text>
                {weatherData?.visibility ? weatherData?.visibility / 1000 : ""}{" "}
                km
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Wind Speed:</Text>
              <Text>{weatherData?.wind.speed}</Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Pressure:</Text>
              <Text>{weatherData?.main.pressure} hPa</Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Sunrise and Sunset</Text>
              <Text>
                Sunrise:
                {weatherData?.sys.sunrise
                  ? formatTimestampToTime(weatherData.sys.sunrise)
                  : "Loading..."}
                , Sunset:{" "}
                {weatherData?.sys.sunset
                  ? formatTimestampToTime(weatherData.sys.sunset)
                  : "Loading..."}
              </Text>
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
  header: {
    width: "100%",
    height: height / 15,
    flexDirection: "row",
    marginTop: 10,
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
  hourlyWeather: {
    height: height / 4,
    marginBottom: 20,
    borderRadius: 5,
  },
  hourlyWeatherTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  hourlyWeatherColumns: {
    height: "100%",
    width: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0.2,
    borderRadius: 5,
    backgroundColor: "#a5d2f0",
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
  },
  widgetTitle: {
    position: "absolute",
    top: 4,
    left: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  weatherIcon: {
    width: 60,
    height: 60,
  },
  searchBar: {
    height: "80%",
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  radarButton: {
    width: "12%",
    height: "80%",
    backgroundColor: "#F39C12",
    borderRadius: 5,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SingleDayScreen;
