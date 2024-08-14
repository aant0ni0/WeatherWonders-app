import { View, Text } from "react-native";
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
    <View style={styles.widget}>
      <Text style={styles.widgetTitle}>{props.title}</Text>
      {props.children}
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  widget: {
    width: "47%",
    backgroundColor: theme.primaryWidget,
    height: runtime.screen.width / 3,
    marginVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 0.8,
    overflow: "hidden",
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
