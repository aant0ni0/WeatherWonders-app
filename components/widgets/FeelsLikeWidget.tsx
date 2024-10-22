import React from "react";
import { Text } from "react-native";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

interface FeelsLikeWidgetProps {
  feelsLike: number | null;
  feelsLikeDescription: string;
}

const FeelsLikeWidget: React.FC<FeelsLikeWidgetProps> = ({
  feelsLike,
  feelsLikeDescription,
}) => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  return (
    <WeatherWidget title={t("Feels Like")}>
      <Text style={styles.widgetContent}>{feelsLike?.toFixed() + "°C"}</Text>
      <Text style={styles.widgetDescription}>{t(feelsLikeDescription)}</Text>
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
    start: 4,
    color: "#585858",
    marginRight: 5,
  },
});

export default FeelsLikeWidget;
