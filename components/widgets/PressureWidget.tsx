import { View, Text } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface PressureWidgetProps {
  pressure: number | null;
}

const PressureWidget: React.FC<PressureWidgetProps> = ({ pressure }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <WeatherWidget title="Pressure">
      <Text style={styles.widgetContent}>{pressure?.toFixed() + " hPa"}</Text>
      <Text style={styles.widgetDescription}>
        Correct pressure is 1013,5 hPa
      </Text>
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
