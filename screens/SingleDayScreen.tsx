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
  TouchableOpacity,
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
import SunriseSunsetChart from "../components/SunriseSunsetChart";

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;
const insetsBottom = UnistylesRuntime.insets.bottom;
const insetsLeft = UnistylesRuntime.insets.left;
const insetsRight = UnistylesRuntime.insets.right;

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TommorowScreen">
> = ({ navigation, route }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Krakow");

  const today = route.params["today"];
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const tomorrowMidnight = new Date(
    todayMidnight.getTime() + 24 * 60 * 60 * 1000
  );
  const date = today
    ? now
    : new Date(tomorrowMidnight.getTime() + 7 * 60 * 60 * 1000);

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
  }, [city]);

  const getHourlyForecastForNext24Hours = (): ForecastItem[] => {
    if (!forecastData) return [];
    return forecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate > date &&
        itemDate <= new Date(date.getTime() + 27 * 60 * 60 * 1000)
      );
    });
  };

  const getMinMaxTempForToday = () => {
    if (!forecastData) return { minTemp: null, maxTemp: null };
    const todayMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
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

  const hourlyForecast = getHourlyForecastForNext24Hours();
  const { minTemp, maxTemp } = getMinMaxTempForToday();

  const chooseMainWeatherforTommorow = (): string | null => {
    const startOfDay = new Date(
      tomorrowMidnight.getTime() + 6 * 60 * 60 * 1000
    );
    const endOfDay = new Date(tomorrowMidnight.getTime() + 21 * 60 * 60 * 1000);

    const weatherDataForTommorow = forecastData?.list.filter(
      (item: ForecastItem) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate > startOfDay && itemDate <= endOfDay;
      }
    );

    if (!weatherDataForTommorow || weatherDataForTommorow.length === 0) {
      return null;
    }

    const weatherCounts: { [key: string]: number } = {};

    weatherDataForTommorow.forEach((item: ForecastItem) => {
      const weatherType = item.weather[0].description;
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
    });

    const sortedWeatherTypes = Object.entries(weatherCounts).sort(
      ([, a], [, b]) => b - a
    );
    const mostCommonWeather = sortedWeatherTypes[0]?.[0];

    return mostCommonWeather || null;
  };
  console.log(weatherData?.sys.sunrise);

  const changeBackgroundImageDependsOnWeather = () => {
    if (today) {
      if (!weatherData) return;
      const weatherType = weatherData.weather[0].description.replace(
        /\s/g,
        ""
      ) as WeatherTypes;
      console.log(weatherType);
      return weatherBackgrounds[weatherType];
    } else {
      const weatherType = chooseMainWeatherforTommorow()?.replace(
        /\s/g,
        ""
      ) as WeatherTypes;
      return weatherBackgrounds[weatherType];
    }
  };

  const formatTimestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const mainTempToday = weatherData
    ? Math.ceil(weatherData.main.temp) + "°C"
    : "cannot fetch weather data";

  const mainTempTommorow = maxTemp
    ? Math.ceil(maxTemp) + "°C"
    : "cannot fetch weather data";

  const getForecastForTomorrow = (): {
    [key: string]: number | null;
  } => {
    if (!forecastData)
      return {
        avgFeelsLike: null,
        avgHumidity: null,
        avgVisibility: null,
        avgWindSpeed: null,
        avgPressure: null,
      };

    const startOfDay = new Date(
      tomorrowMidnight.getTime() + 6 * 60 * 60 * 1000
    );
    const endOfDay = new Date(tomorrowMidnight.getTime() + 21 * 60 * 60 * 1000);

    const weatherDataForTommorow = forecastData.list.filter(
      (item: ForecastItem) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate > startOfDay && itemDate <= endOfDay;
      }
    );

    if (weatherDataForTommorow.length === 0)
      return {
        maxFeelsLike: null,
        avgHumidity: null,
        avgVisibility: null,
        avgWindSpeed: null,
        avgPressure: null,
      };

    const maxFeelsLike = Math.max(
      ...weatherDataForTommorow.map((item) => item.main.feels_like)
    );
    const avgHumidity =
      weatherDataForTommorow.reduce(
        (sum, item) => sum + item.main.humidity,
        0
      ) / weatherDataForTommorow.length;
    const avgVisibility =
      weatherDataForTommorow.reduce((sum, item) => sum + item.visibility, 0) /
      weatherDataForTommorow.length;
    const avgWindSpeed =
      weatherDataForTommorow.reduce((sum, item) => sum + item.wind.speed, 0) /
      weatherDataForTommorow.length;
    const avgPressure =
      weatherDataForTommorow.reduce(
        (sum, item) => sum + item.main.pressure,
        0
      ) / weatherDataForTommorow.length;

    return {
      maxFeelsLike,
      avgHumidity,
      avgVisibility,
      avgWindSpeed,
      avgPressure,
    };
  };

  const {
    maxFeelsLike,
    avgHumidity,
    avgVisibility,
    avgWindSpeed,
    avgPressure,
  } = getForecastForTomorrow();

  const getfeelsLikeDescription = (): string => {
    let feelsLike: number | null = null;
    let mainTemp: string | null = null;

    if (today) {
      feelsLike = weatherData?.main.feels_like ?? null;
      mainTemp = mainTempToday;
    } else {
      feelsLike = maxFeelsLike;
      mainTemp = mainTempTommorow;
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

  const sunrise = weatherData?.sys.sunrise ? weatherData?.sys.sunrise : 0;
  const sunset = weatherData?.sys.sunset ? weatherData?.sys.sunset : 0;

  return (
    <ImageBackground
      source={changeBackgroundImageDependsOnWeather()}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <ScrollView style={[styles.container]} bounces={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.radarButton}>
            <Ionicons name="radio-outline" size={35} color="white" />
          </TouchableOpacity>
          <View style={styles.searchBarContainer}>
            <TextInput style={styles.searchBar} placeholder="Search city..." />
            <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
              <Ionicons name="search" size={20} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainInfoBox}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.mainTemp}>
            {today ? mainTempToday : mainTempTommorow}
          </Text>
          <Text style={styles.weatherDescription}>
            {today
              ? weatherData?.weather[0].description
              : chooseMainWeatherforTommorow()}
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
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                      }}
                    >
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
                  ? weatherData?.wind.speed?.toFixed(1) + " m/s"
                  : avgWindSpeed?.toFixed(1) + " m/s"}
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
                correct pressure is 1013,5 hPa
              </Text>
            </View>
            <View style={styles.widgets}>
              <Text style={styles.widgetTitle}>Sunrise and Sunset</Text>
              {/* <Text>
                Sunrise:
                {weatherData?.sys.sunrise
                  ? formatTimestampToTime(weatherData.sys.sunrise)
                  : "Loading..."}
                , Sunset:{" "}
                {weatherData?.sys.sunset
                  ? formatTimestampToTime(weatherData.sys.sunset)
                  : "Loading..."}
              </Text> */}
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
    marginBottom: 10,
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
  weatherIcon: {
    width: 60,
    height: 60,
  },
  widgetDescription: {
    position: "absolute",
    bottom: 2,
    left: 4,
    color: "#585858",
  },
  searchBar: {
    paddingLeft: 10,
    fontSize: 16,
    width: "88%",
  },
  searchBarContainer: {
    height: "80%",
    width: "73%",
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "white",
  },
  searchButton: {
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  radarButton: {
    width: "12%",
    height: "80%",
    backgroundColor: "#F39C12",
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  compass: {
    width: 200,
    height: 200,
    position: "absolute",
    right: -22,
  },
  compassNeedle: {
    width: 107,
    height: 107,
    position: "absolute",
    top: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
  },
});

export default SingleDayScreen;
