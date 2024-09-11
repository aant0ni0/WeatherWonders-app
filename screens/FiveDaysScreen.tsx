import { View, Text, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabsParamList } from "../types/navigation";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Header from "../components/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import { useWeatherData } from "../hooks/useWeatherData";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import DayWeatherWidget from "../components/DayWeatherWidget";
import { useTranslation } from "react-i18next";

const FiveDaysScreen: React.FC<
  NativeStackScreenProps<RootTabsParamList, "FiveDays">
> = () => {
  const { styles } = useStyles(stylesheet);
  const city = useSelector((state: RootState) => state.city);
  const { t } = useTranslation();

  const {
    weatherLoading,
    weatherError,
    forecastData,
    minTemp,
    maxTemp,
    getDayWeatherSummary,
  } = useWeatherData(city, true);

  if (weatherLoading) {
    return <Loader />;
  }

  if (weatherError) {
    return (
      <ErrorMessage>
        {t("Weather Error")} {weatherError as string}
      </ErrorMessage>
    );
  }

  const today = {
    date: new Date(),
    mainIcon: forecastData?.list[0]?.weather[0].icon,
    minTemp: minTemp,
    maxTemp: maxTemp,
  };
  const tommorow = getDayWeatherSummary(0);
  const day3 = getDayWeatherSummary(1);
  const day4 = getDayWeatherSummary(2);
  const day5 = getDayWeatherSummary(3);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.cityTitle}>{city}</Text>
      <ScrollView
        style={styles.fiveDaysWeatherContainer}
        alwaysBounceVertical={false}
      >
        <DayWeatherWidget {...today} today />
        <DayWeatherWidget {...tommorow} />
        <DayWeatherWidget {...day3} />
        <DayWeatherWidget {...day4} />
        <DayWeatherWidget {...day5} />
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top,
    backgroundColor: theme.primaryBackgroud,
  },
  cityTitle: {
    fontSize: 35,
    color: theme.primaryText,
    padding: 15,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: -1,
  },
  fiveDaysWeatherContainer: {
    width: "100%",
    padding: 25,
    paddingRight: 35,
    flexWrap: "wrap",
    zIndex: -1,
  },
}));

export default FiveDaysScreen;
