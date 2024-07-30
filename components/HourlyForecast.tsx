import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { ForecastItem } from "../types/weatherSchema";
import colors from "../assets/colors";

interface HourlyForecastProps {
  hourlyForecast: ForecastItem[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyForecast }) => {
  return (
    <View style={styles.hourlyWeather}>
      <Text style={styles.hourlyWeatherTitle}>Hourly Weather</Text>
      <FlatList
        data={hourlyForecast}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.hourlyWeatherColumns}>
            <View style={{ marginHorizontal: 15 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {new Date(item.dt_txt).getHours()}:00
              </Text>
            </View>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              }}
              style={styles.weatherIcon}
            />

            <Text style={{ fontSize: 16 }}>
              {item.main.temp.toFixed() + "°"}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.dt.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HourlyForecast;
