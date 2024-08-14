import React from "react";
import { View, Text } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import colors from "../../assets/colors";

interface FeelsLikeWidgetProps {
  feelsLike: number | null;
  feelsLikeDescription: string;
}

const FeelsLikeWidget: React.FC<FeelsLikeWidgetProps> = ({
  feelsLike,
  feelsLikeDescription,
}) => {
  const { styles } = useStyles(stylesheet);
  return (
    <WeatherWidget title="Feels like">
      <Text style={styles.widgetContent}>{feelsLike?.toFixed() + "°C"}</Text>
      <Text style={styles.widgetDescription}>{feelsLikeDescription}</Text>
    </WeatherWidget>
  );
};

const stylesheet = createStyleSheet({
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
});

export default FeelsLikeWidget;
