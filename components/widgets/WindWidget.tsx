import { View, Text, Image } from "react-native";
import { WeatherData } from "../../types/weatherSchema";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface WindWidgetProps {
  today: boolean;
  weatherData: WeatherData | null;
  avgWindSpeed: number | null;
}

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
      <View style={styles.compassContainer}>
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
      </View>
    </WeatherWidget>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  widgetContent: {
    fontSize: 20,
    fontWeight: "500",
    position: "absolute",
    bottom: 4,
    left: 6,
  },
  compassContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
    marginLeft: 5,
  },
  compass: {
    width: runtime.screen.width / 2.5,
    height: runtime.screen.height / 5,
    resizeMode: "contain",
    right: 4,
  },
  compassNeedle: {
    position: "absolute",
    width: "65%",
    height: "65%",
    resizeMode: "contain",
  },
  speedUnit: {
    fontSize: 12,
    fontWeight: "300",
  },
}));

export default WindWidget;
