import { View, Text, Image } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useWeatherData } from "../../hooks/useWeatherData";
import { BlurView } from "@react-native-community/blur";

const AnimatedHeader: React.FC<{
  isRunning: boolean;
  city: string;
  today: boolean;
}> = ({ isRunning, city, today }) => {
  const { styles } = useStyles(stylesheet);
  const { minTemp, maxTemp, mainWeather, mainTemp, forecastData } =
    useWeatherData(city, today);

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
      <BlurView style={styles.animationBox}>
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

              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${forecastData.list[0].weather[0].icon}@2x.png`,
                }}
                style={styles.weatherIcon}
              />
            </View>
          </View>
        </Animated.View>
      </BlurView>
    );
  }
};

const stylesheet = createStyleSheet((theme, runtime) => ({
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

export default AnimatedHeader;
