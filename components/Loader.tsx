import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Loader: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={styles.container.backgroundColor}
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primary,
  },
}));

export default Loader;
