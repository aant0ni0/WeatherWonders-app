import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
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
  runOnJS,
} from "react-native-reanimated";
import AnimatedHeader from "../components/header/AnimatedHeader";

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "TodayScreen" | "TomorrowScreen">
> = ({ route }) => {
  const city = useSelector((state: RootState) => state.city);
  console.log(city);

  const today = route.params["today"];
  const { styles } = useStyles(stylesheet);

  const scrollY = useSharedValue(0);
  const borderWhereWeStartAnimation = 70;
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  const {
    weatherData,
    isLoading,
    error,
    sunrise,
    sunset,
    weatherBackground,
    feelsLikeDescription,
    timezoneOffset,
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorMessage>
        Error fetching weather data:{" "}
        {typeof error === "string" ? error : JSON.stringify(error)}
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
        <AnimatedHeader
          today={today}
          city={city}
          scrollY={scrollY}
          headerHeight={200}
        />
        <View style={styles.widgetsContainer}>
          <HourlyForecast
            hourlyForecast={hourlyForecast}
            timezone={timezoneOffset}
          />
          <View style={styles.smallerWidgetsContainer}>
            <HumidityWidget humidity={humidity} />
            <FeelsLikeWidget
              feelsLikeDescription={feelsLikeDescription}
              feelsLike={feelsLike}
            />
            <WindWidget
              direction={weatherData?.wind.deg}
              windSpeed={windSpeed}
            />
            <VisibilityWidget visibility={visibility} />
            <PressureWidget pressure={pressure} />
            <SunriseSunsetWidget
              sunrise={sunrise}
              sunset={sunset}
              today={today}
              timezone={timezoneOffset}
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
}));

export default SingleDayScreen;
