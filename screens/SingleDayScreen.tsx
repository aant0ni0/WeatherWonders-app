import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Krakow");

  const oneHourInMilliseconds = 60 * 60 * 1000;

  const today = route.params["today"];
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const tomorrowMidnight = new Date(
    todayMidnight.getTime() + 24 * oneHourInMilliseconds
  );
  const date = today
    ? now
    : new Date(tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds);

  //we assume the start of the day as 6:00
  const startOfTomorrowDay = new Date(
    tomorrowMidnight.getTime() + 6 * oneHourInMilliseconds
  );
  //we assume the end of the day as 21:00
  const endOfTomorrow = new Date(
    tomorrowMidnight.getTime() + 21 * oneHourInMilliseconds
  );

  const weatherDataForTomorrow = forecastData?.list.filter(
    (item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate > startOfTomorrowDay && itemDate <= endOfTomorrow;
    }
  );

  //Data fetch and error handling will be changed in new branch
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>Error fetching weather data: {error}</ErrorMessage>;
  }

  const getHourlyForecastForNext24Hours = (): ForecastItem[] => {
    if (!forecastData) return [];
    return forecastData.list.filter((item: ForecastItem) => {
      const itemDate = new Date(item.dt * 1000);
      return (
        itemDate > date &&
        //we provide enough space to display the next hour
        itemDate <= new Date(date.getTime() + 27 * oneHourInMilliseconds)
      );
    });
  };

  const hourlyForecast = getHourlyForecastForNext24Hours();

  const getMinMaxTemp = () => {
    if (!forecastData) return { minTemp: null, maxTemp: null };

    let start, end;

    if (today) {
      start = todayMidnight;
      end = tomorrowMidnight;
    } else {
      start = tomorrowMidnight;
      end = new Date(tomorrowMidnight.getTime() + 24 * oneHourInMilliseconds);
    }

    const temps = forecastData.list
      .filter((item) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate >= start && itemDate < end;
      })
      .map((item) => item.main.temp);

    if (temps.length === 0) return { minTemp: null, maxTemp: null };

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    return { minTemp, maxTemp };
  };

  const { minTemp, maxTemp } = getMinMaxTemp();

  const chooseMainWeatherforTomorrow = (): string | null => {
    if (!weatherDataForTomorrow || weatherDataForTomorrow.length === 0) {
      return null;
    }

    const weatherCounts: { [key: string]: number } = {};

    weatherDataForTomorrow.forEach((item: ForecastItem) => {
      const weatherType = item.weather[0].description;
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1;
    });

    const sortedWeatherTypes = Object.entries(weatherCounts).sort(
      ([, a], [, b]) => b - a
    );
    const mostCommonWeather = sortedWeatherTypes[0]?.[0];

    return mostCommonWeather || null;
  };

  const changeBackgroundImageDependsOnWeather = () => {
    if (today) {
      if (!weatherData) return;
      const weatherType = weatherData.weather[0].description.replace(
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

  const getForecastForTomorrow = (): {
    [key: string]: number | null;
  } => {
    if (!forecastData || !weatherDataForTomorrow)
      return {
        avgFeelsLike: null,
        avgHumidity: null,
        avgVisibility: null,
        avgWindSpeed: null,
        avgPressure: null,
      };

    const maxFeelsLike = Math.max(
      ...weatherDataForTomorrow.map((item) => item.main.feels_like)
    );
    const avgHumidity =
      weatherDataForTomorrow.reduce(
        (sum, item) => sum + item.main.humidity,
        0
      ) / weatherDataForTomorrow.length;
    const avgVisibility =
      weatherDataForTomorrow.reduce((sum, item) => sum + item.visibility, 0) /
      weatherDataForTomorrow.length;
    const avgWindSpeed =
      weatherDataForTomorrow.reduce((sum, item) => sum + item.wind.speed, 0) /
      weatherDataForTomorrow.length;
    const avgPressure =
      weatherDataForTomorrow.reduce(
        (sum, item) => sum + item.main.pressure,
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

  const getfeelsLikeDescription = (): string => {
    let feelsLike: number | null = null;
    let mainTemp: string | null = null;

    if (today) {
      feelsLike = weatherData?.main.feels_like ?? null;
      mainTemp = mainTempToday;
    } else {
      feelsLike = maxFeelsLike;
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

  const {
    maxFeelsLike,
    avgHumidity,
    avgVisibility,
    avgWindSpeed,
    avgPressure,
  } = getForecastForTomorrow();

  const mainTempToday = weatherData
    ? Math.ceil(weatherData.main.temp) + "°C"
    : "cannot fetch weather data";

  const mainTempTomorrow = maxTemp
    ? Math.ceil(maxTemp) + "°C"
    : "cannot fetch weather data";

  const sunrise = weatherData?.sys.sunrise ? weatherData?.sys.sunrise : 0;
  const sunset = weatherData?.sys.sunset ? weatherData?.sys.sunset : 0;

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
