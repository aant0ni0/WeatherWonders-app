import React from "react";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Loader: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { height, width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width: width, height: height }]}>
      <ActivityIndicator size="large" color={"white"} />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primary,
  },
}));

export default Loader;
