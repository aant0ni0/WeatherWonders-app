import { Text } from "react-native";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

interface PressureWidgetProps {
  pressure: number | null;
}

const PressureWidget: React.FC<PressureWidgetProps> = ({ pressure }) => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  return (
    <WeatherWidget title={t("Pressure")}>
      <Text style={styles.widgetContent}>{pressure?.toFixed() + " hPa"}</Text>
      <Text style={styles.widgetDescription}>{t("Pressure Description")}</Text>
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

export default PressureWidget;
