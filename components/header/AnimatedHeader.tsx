import React from "react";
import { View, Text, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";
import { useWeatherData } from "../../hooks/useWeatherData";
import { SharedValue } from "react-native-reanimated";

const AnimatedHeader: React.FC<{
  city: string;
  today: boolean;
  scrollY: SharedValue<number>;
  headerHeight: number;
}> = ({ city, today, scrollY, headerHeight }) => {
  const { styles } = useStyles(stylesheet);
  const {
    minTemp,
    maxTemp,
    mainWeather,
    mainTemp,
    forecastData,
    getDayWeatherSummary,
  } = useWeatherData(city, today);
  const insets = UnistylesRuntime.insets;

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [-headerHeight, -insets.top],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });

  const mainInfoBoxAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight / 2],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const { mainIcon } = getDayWeatherSummary(0);
  const weatherIcon =
    today && forecastData ? forecastData.list[0].weather[0].icon : mainIcon;

  return (
    <>
      <Animated.View style={[styles.mainInfoBox, mainInfoBoxAnimatedStyle]}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.mainTemp}>{mainTemp}</Text>
        <Text style={styles.weatherDescription}>{mainWeather}</Text>
        <Text style={styles.minMax}>
          from {minTemp?.toFixed() + "°"} to {maxTemp?.toFixed() + "°"}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.animationBox, animatedStyle]}>
        <View style={styles.animatedMainInfoBox}>
          <View style={styles.animatedWeatherInfo}>
            <View style={styles.animatedCityBox}>
              <Text style={styles.animatedCity}>{city}</Text>
            </View>
            <View style={styles.animatedMainWeatherBox}>
              <Text style={styles.animatedMainTemp}>{mainTemp}</Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
                }}
                style={[styles.weatherIcon, styles.shadow]}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  mainInfoBox: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    zIndex: -1,
    top: 0,
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
  animatedMainInfoBox: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
    zIndex: 1,
    backgroundColor: "white",
    opacity: 0.95,
    paddingTop: runtime.insets.top + 5,
    paddingBottom: 10,
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
  animationBox: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
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
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
}));

export default AnimatedHeader;
