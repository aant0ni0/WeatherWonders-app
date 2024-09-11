import React from "react";
import { Text } from "react-native";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface VisibilityWidgetProps {
  visibility: number | null;
}

const VisibilityWidget: React.FC<VisibilityWidgetProps> = ({ visibility }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <WeatherWidget title="Visibility">
      <Text style={styles.widgetContent}>
        {visibility ? (visibility / 1000).toFixed(1) + " km" : ""}
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
