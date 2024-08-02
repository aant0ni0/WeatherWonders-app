import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import colors from "../assets/colors";
import {
  createStyleSheet,
  useStyles,
  UnistylesRuntime,
} from "react-native-unistyles";

const Loader: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { height, width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width: width, height: height }]}>
      <ActivityIndicator size="large" color={"white"} />
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BDE3FF",
  },
});

export default Loader;
