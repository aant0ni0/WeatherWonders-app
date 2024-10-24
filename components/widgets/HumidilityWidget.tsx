import { Text, StyleSheet } from "react-native";
import WeatherWidget from "./WeatherWidget";
import { useTranslation } from "react-i18next";
interface HumidityWidgetProps {
  humidity: number | null;
}

const HumidityWidget: React.FC<HumidityWidgetProps> = ({ humidity }) => {
  const { t } = useTranslation();
  return (
    <WeatherWidget title={t("Humidility")}>
      <Text style={styles.widgetContent}>{humidity?.toFixed() + "%"}</Text>
    </WeatherWidget>
  );
};

const styles = StyleSheet.create({
  widgetContent: {
    fontSize: 25,
    fontWeight: "500",
  },
});

export default HumidityWidget;
