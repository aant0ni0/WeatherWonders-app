import { Text, StyleSheet } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";

interface HumidityWidgetProps {
  today: boolean;
  weatherData: WeatherData | null;
  avgHumidity: number | null;
}

const HumidityWidget: React.FC<HumidityWidgetProps> = ({
  today,
  weatherData,
  avgHumidity,
}) => {
  return (
    <WeatherWidget title="Humidity">
      <Text style={styles.widgetContent}>
        {today
          ? weatherData?.main.humidity + "%"
          : avgHumidity?.toFixed() + "%"}
      </Text>
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
