import { View, Text } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ErrorMessageProps {
  children: string | string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    color: "red",
    fontSize: 16,
  },
});

export default ErrorMessage;
