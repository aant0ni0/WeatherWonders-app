import React from "react";
import { Text } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface VisibilityWidgetProps {
  today: boolean;
  weatherData: WeatherData | null;
  avgVisibility: number | null;
}

const VisibilityWidget: React.FC<VisibilityWidgetProps> = ({
  today,
  weatherData,
  avgVisibility,
}) => {
  const { styles } = useStyles(stylesheet);
  return (
    <WeatherWidget title="Visibility">
      <Text style={styles.widgetContent}>
        {today
          ? weatherData?.visibility
            ? (weatherData?.visibility / 1000).toFixed(1) + " km"
            : ""
          : avgVisibility
          ? (avgVisibility / 1000).toFixed(1) + " km"
          : ""}
      </Text>
    </WeatherWidget>
  );
};

const stylesheet = createStyleSheet({
  widgetContent: {
    fontSize: 25,
    fontWeight: "500",
  },
});

export default VisibilityWidget;
