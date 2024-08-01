import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../assets/colors";
import {
  createStyleSheet,
  useStyles,
  UnistylesRuntime,
} from "react-native-unistyles";

const Loader: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
});

export default Loader;
