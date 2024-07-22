import { View, Text, StyleSheet } from "react-native";
import React, { Children } from "react";

interface ErrorMessageProps {
  children: string | string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <View>
      <Text>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
