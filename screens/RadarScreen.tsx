import React from "react";
import MapView, { UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import { useGetWeatherByCityQuery } from "../services/api";

const RadarScreen = () => {
  const cloudLayerUrl = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=3f6de936886f0b0bd368ed34bbd07eee`;
  const rainLayerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=3f6de936886f0b0bd368ed34bbd07eee`;

  const city = useSelector((state: RootState) => state.city);
  const { data, error, isLoading } = useGetWeatherByCityQuery(city);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  console.log(data);
  const coord = data?.coord;

  if (!coord) {
    return (
      <View style={styles.errorContainer}>
        <Text>Coordinates not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: coord.lat,
          longitude: coord.lon,
          latitudeDelta: 10.0,
          longitudeDelta: 10.0,
        }}
      >
        <UrlTile
          urlTemplate={rainLayerUrl}
          zIndex={2}
          maximumZ={19}
          minimumZ={3}
          tileSize={100}
        />
        <UrlTile
          urlTemplate={cloudLayerUrl}
          zIndex={1}
          maximumZ={19}
          minimumZ={3}
          tileSize={256}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RadarScreen;
