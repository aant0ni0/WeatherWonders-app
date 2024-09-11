import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { ForecastItem } from "../types/weatherSchema";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface HourlyForecastProps {
  hourlyForecast: ForecastItem[];
  timezone: number;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyForecast,
  timezone,
}) => {
  const { styles } = useStyles(stylesheet);

  const renderHourlyForecast = (item: ForecastItem) => {
    const localTime = new Date(item.dt * 1000 + timezone * 1000);
    const hours = localTime.getUTCHours();

    return (
      <View style={styles.hourlyWeatherColumns}>
        <View style={styles.weatherInfoContainer}>
          <Text style={styles.hourText}>{hours}:00</Text>
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

const borderRadius = 5;

const stylesheet = createStyleSheet((theme) => ({
  hourlyWeather: {
    height: 200,
    marginBottom: 20,
    borderRadius: borderRadius,
  },
  hourlyWeatherTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "bold",
    color: theme.primaryText,
    marginBottom: 10,
  },
  hourlyWeatherColumns: {
    height: "100%",
    width: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0.2,
    borderRadius: borderRadius,
    backgroundColor: "#a5d2f0",
  },
  weatherIcon: {
    aspectRatio: 1,
    width: "70%",
    resizeMode: "contain",
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
}));

export default HourlyForecast;
