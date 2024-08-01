import { View, Text, Image } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";
import {
  createStyleSheet,
  useStyles,
  UnistylesRuntime,
} from "react-native-unistyles";

interface WindWidgetProps {
  today: boolean;
  weatherData: WeatherData | null;
  avgWindSpeed: number | null;
}

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;

const WindWidget: React.FC<WindWidgetProps> = ({
  today,
  weatherData,
  avgWindSpeed,
}) => {
  const { styles } = useStyles(stylesheet);
  return (
    <WeatherWidget title="Wind">
      <Text style={styles.widgetContent}>
        {today ? weatherData?.wind.speed?.toFixed(1) : avgWindSpeed?.toFixed(1)}
        <Text style={styles.speedUnit}> m/s</Text>
      </Text>
      <Image
        source={require("../../assets/images/compas.png")}
        style={styles.compass}
      />
      <Image
        source={require("../../assets/images/compasNeedle.png")}
        style={[
          styles.compassNeedle,
          { transform: [{ rotate: `${weatherData?.wind.deg}deg` }] },
        ]}
      />
    </WeatherWidget>
  );
};

const stylesheet = createStyleSheet({
  widgetContent: {
    fontSize: 18,
    fontWeight: "500",
    position: "absolute",
    bottom: 4,
    left: 6,
  },
  compass: {
    width: width / 2,
    height: height / 4.5,
    position: "absolute",
  },
  compassNeedle: {
    width: "83%",
    height: "83%",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
    left: 15,
  },
  speedUnit: {},
});

export default WindWidget;
