import { View, Text } from "react-native";
import { useState } from "react";
import {
  ForecastData,
  ForecastItem,
  WeatherData,
} from "../types/weatherSchema";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Header from "../components/header/Header";

const FiveDaysScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "FiveDays">
> = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
    backgroundColor: theme.primaryBackgroud,
  },
}));

export default FiveDaysScreen;
