import { Image } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface WeatherIconProps {
  weatherIcon: string | null | undefined;
  shadow: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherIcon, shadow }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <Image
      source={{
        uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
      }}
      style={[styles.weatherIcon, shadow && styles.shadow]}
    />
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  weatherIcon: {
    width: 60,
    height: 60,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 8,
  },
}));

export default WeatherIcon;
