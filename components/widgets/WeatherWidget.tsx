import { View, Text } from "react-native";
import React, { Children } from "react";
import {
  createStyleSheet,
  useStyles,
  UnistylesRuntime,
} from "react-native-unistyles";
import colors from "../../assets/colors";

const width = UnistylesRuntime.screen.width;

interface WeatherWidgetProps {
  title: string;
  children: React.ReactNode;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = (props) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.widget}>
      <Text style={styles.widgetTitle}>{props.title}</Text>
      {props.children}
    </View>
  );
};

const stylesheet = createStyleSheet({
  widget: {
    width: "45%",
    backgroundColor: colors.primaryWidget,
    height: width / 3,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
    opacity: 0.9,
    overflow: "hidden",
  },
  widgetTitle: {
    position: "absolute",
    top: 4,
    left: 4,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
  },
});

export default WeatherWidget;