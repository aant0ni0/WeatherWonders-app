import { View, Text, Image } from "react-native";
import WeatherWidget from "./WeatherWidget";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

interface WindWidgetProps {
  direction: number | undefined;
  windSpeed: number | null;
}

const WindWidget: React.FC<WindWidgetProps> = ({ direction, windSpeed }) => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  return (
    <WeatherWidget title={t("Wind")}>
      <Text style={styles.widgetContent}>
        {windSpeed?.toFixed(1)}
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
            { transform: [{ rotate: `${direction}deg` }] },
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
