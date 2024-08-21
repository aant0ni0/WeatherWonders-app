import { Platform, View, Text } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface WeatherWidgetProps {
  title: string;
  children: React.ReactNode;
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = (props) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>{props.title}</Text>
        {props.children}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  shadowContainer: {
    width: "47%",
    marginVertical: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  widget: {
    width: "100%",
    height: runtime.screen.width / 3,
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  widgetTitle: {
    position: "absolute",
    top: 4,
    left: 4,
    fontSize: 15,
    fontWeight: "bold",
    color: theme.primaryText,
  },
}));

export default WeatherWidget;
