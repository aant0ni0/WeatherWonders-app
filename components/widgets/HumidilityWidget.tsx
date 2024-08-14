import { Text, StyleSheet } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";

interface HumidityWidgetProps {
  humidity: number | null;
}

const HumidityWidget: React.FC<HumidityWidgetProps> = ({ humidity }) => {
  return (
    <WeatherWidget title="Humidity">
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
