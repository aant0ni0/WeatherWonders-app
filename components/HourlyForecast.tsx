import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { ForecastItem } from "../types/weatherSchema";
import colors from "../assets/colors";
import {
  createStyleSheet,
  useStyles,
  UnistylesRuntime,
} from "react-native-unistyles";

interface HourlyForecastProps {
  hourlyForecast: ForecastItem[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyForecast }) => {
  const { styles } = useStyles(stylesheet);

  const renderHourlyForecast = (item: ForecastItem) => {
    return (
      <View style={styles.hourlyWeatherColumns}>
        <View style={styles.weatherInfoContainer}>
          <Text style={styles.hourText}>
            {new Date(item.dt_txt).getHours()}:00
          </Text>
        </View>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />

        <Text style={styles.hourTemp}>{item.main.temp.toFixed() + "°"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.hourlyWeather}>
      <Text style={styles.hourlyWeatherTitle}>Hourly Weather</Text>
      <FlatList
        data={hourlyForecast}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => renderHourlyForecast(item)}
        keyExtractor={(item) => item.dt.toString()}
      />
    </View>
  );
};

const stylesheet = createStyleSheet({
  hourlyWeather: {
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  hourlyWeatherTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 10,
  },
  hourlyWeatherColumns: {
    height: "100%",
    width: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0.2,
    borderRadius: 5,
    backgroundColor: "#a5d2f0",
  },
  weatherIcon: {
    width: "50%",
    height: "37%",
  },
  weatherInfoContainer: {
    marginHorizontal: 15,
  },
  hourText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  hourTemp: {
    fontSize: 16,
  },
});

export default HourlyForecast;
