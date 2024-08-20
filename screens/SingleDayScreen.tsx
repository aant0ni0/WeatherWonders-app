import React, { useState } from "react";
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
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import HourlyForecast from "../components/HourlyForecast";
import Header from "../components/header/Header";
import HumidityWidget from "../components/widgets/HumidilityWidget";
import FeelsLikeWidget from "../components/widgets/FeelsLikeWidget";
import WindWidget from "../components/widgets/WindWidget";
import VisibilityWidget from "../components/widgets/VisibilityWidget";
import PressureWidget from "../components/widgets/PressureWidget";
import SunriseSunsetWidget from "../components/widgets/SunriseSunsetWidget";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  useAnimatedStyle,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
  StretchOutY,
} from "react-native-reanimated";

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TomorrowScreen">
> = ({ route }) => {
  const city = useSelector((state: RootState) => state.city);
  const today = route.params["today"];
  const { styles } = useStyles(stylesheet);

  const scrollY = useSharedValue(0);
  const borderWhereWeStartAnimation = 70;
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  const {
    weatherData,
    weatherLoading,
    weatherError,
    forecastData,
    forecastLoading,
    forecastError,
    minTemp,
    maxTemp,
    mainWeather,
    mainTemp,
    sunrise,
    sunset,
    weatherBackground,
    feelsLikeDescription,
    getHourlyForecastForNext24Hours,
    getForecast,
  } = useWeatherData(city, today);

  const setAnimationState = (isRunning: boolean) => {
    setIsAnimationRunning(isRunning);
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useDerivedValue(() => {
    if (scrollY.value > borderWhereWeStartAnimation) {
      runOnJS(setAnimationState)(true);
    } else {
      runOnJS(setAnimationState)(false);
    }
  }, [scrollY]);

  const AnimatedHeader: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
    if (!isRunning) {
      return (
        <Animated.View
          style={styles.mainInfoBox}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.mainTemp}>{mainTemp}</Text>
          <Text style={styles.weatherDescription}>{mainWeather}</Text>
          <Text style={styles.minMax}>
            from {minTemp?.toFixed() + "°"} to {maxTemp?.toFixed() + "°"}
          </Text>
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.animationBox}>
          <Animated.View
            entering={SlideInUp}
            exiting={SlideOutUp}
            style={styles.animatedMainInfoBox}
          >
            <View style={styles.animatedWeatherInfo}>
              <View style={styles.animatedCityBox}>
                <Text style={styles.animatedCity}>{city}</Text>
              </View>
              <View style={styles.animatedMainWeatherBox}>
                <Text style={styles.animatedMainTemp}>{mainTemp}</Text>
                {/* <Text style={styles.animatedWeatherDescription}>
                {mainWeather}
              </Text> */}
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${forecastData.list[0].weather[0].icon}@2x.png`,
                  }}
                  style={styles.weatherIcon}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      );
    }
  };

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

  const hourlyForecast = getHourlyForecastForNext24Hours();
  const { feelsLike, humidity, visibility, windSpeed, pressure } =
    getForecast();

  return (
    <ImageBackground source={weatherBackground} style={styles.background}>
      <View style={styles.overlay} />
      <Animated.ScrollView
        style={styles.container}
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickyHeaderIndices={isAnimationRunning ? [1] : []}
      >
        <Header />
        <AnimatedHeader isRunning={isAnimationRunning} />
        <View style={styles.widgetsContainer}>
          <HourlyForecast hourlyForecast={hourlyForecast} />
          <View style={styles.smallerWidgetsContainer}>
            <HumidityWidget humidity={humidity} />
            <FeelsLikeWidget
              feelsLikeDescription={feelsLikeDescription}
              feelsLike={feelsLike}
            />
            <WindWidget weatherData={weatherData} windSpeed={windSpeed} />
            <VisibilityWidget visibility={visibility} />
            <PressureWidget pressure={pressure} />
            <SunriseSunsetWidget
              sunrise={sunrise}
              sunset={sunset}
              today={today}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </ImageBackground>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
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
    padding: 20,
    zIndex: -1,
  },
  mainTemp: {
    fontSize: 75,
    color: theme.primaryText,
    fontWeight: "bold",
  },
  city: {
    fontSize: 30,
    color: theme.primaryText,
    fontWeight: "bold",
  },
  weatherDescription: {
    fontSize: 30,
    color: theme.primaryText,
    marginBottom: 10,
  },
  minMax: {
    fontSize: 20,
    color: theme.primaryText,
  },
  widgetsContainer: {
    width: "100%",
    padding: 25,
    paddingTop: 15,
    justifyContent: "center",
    marginBottom: 20,
    zIndex: -1,
  },
  smallerWidgetsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  animatedMainInfoBox: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
    zIndex: 1,
    backgroundColor: "white",
    opacity: 0.95,
    position: "absolute",
    top: -runtime.insets.top - 70,
    paddingTop: runtime.insets.top + 70,
  },
  animatedWeatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  animatedMainTemp: {
    fontSize: 25,
    color: theme.primaryText,
    fontWeight: "500",
  },
  animatedCity: {
    fontSize: 25,
    color: theme.primaryText,
    fontWeight: "bold",
  },
  animatedWeatherDescription: {
    fontSize: 20,
    color: theme.primaryText,
    marginBottom: 5,
  },
  animationBox: {
    width: "100%",
    height: 230,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  animatedMainWeatherBox: {
    flexDirection: "row",
    width: "30%",
    alignItems: "center",
    paddingRight: 20,
  },
  animatedCityBox: {
    width: "70%",
    paddingLeft: 20,
  },
}));

export default SingleDayScreen;
