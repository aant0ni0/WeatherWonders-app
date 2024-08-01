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
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import HourlyForecast from "../components/HourlyForecast";
import Header from "../components/header/Header";
import HumidityWidget from "../components/widgets/HumidilityWidget";
import FeelsLikeWidget from "../components/widgets/FeelsLikeWidget";
import WindWidget from "../components/widgets/WindWidget";
import VisibilityWidget from "../components/widgets/VisibilityWidget";
import PressureWidget from "../components/widgets/PressureWidget";
import SunriseSunsetWidget from "../components/widgets/SunriseSunsetWidget";

const insetsTop = UnistylesRuntime.insets.top;

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TomorrowScreen">
> = ({ route }) => {
  const city = "Krakow";
  const today = route.params["today"];
  const { styles } = useStyles(stylesheet);

  const {
    weatherData,
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
            <HumidityWidget
              today={today}
              avgHumidity={avgHumidity}
              weatherData={weatherData}
            />
            <FeelsLikeWidget
              today={today}
              weatherData={weatherData}
              getfeelsLikeDescription={getfeelsLikeDescription}
              maxFeelsLike={maxFeelsLike}
            />
            <WindWidget
              today={today}
              weatherData={weatherData}
              avgWindSpeed={avgWindSpeed}
            />
            <VisibilityWidget
              today={today}
              weatherData={weatherData}
              avgVisibility={avgVisibility}
            />

            <PressureWidget
              today={today}
              weatherData={weatherData}
              avgPressure={avgPressure}
            />

            <SunriseSunsetWidget
              sunrise={sunrise}
              sunset={sunset}
              today={today}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const stylesheet = createStyleSheet({
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
});

export default SingleDayScreen;
