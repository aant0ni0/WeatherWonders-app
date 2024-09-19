import React from "react";
import MapView, { UrlTile } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../types/navigation";
import { useGetWeatherByCityQuery } from "../services/api";
import RadarButton from "../components/header/RadarButton";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useTranslation } from "react-i18next";

const RadarScreen = () => {
  const cloudLayerUrl = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${process.env.EXPO_PUBLIC_API_KEY}`;
  const rainLayerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.EXPO_PUBLIC_API_KEY}`;

  const { styles } = useStyles(stylesheet);
  const city = useSelector((state: RootState) => state.city);
  const { data, error, isLoading } = useGetWeatherByCityQuery(city);
  const { t } = useTranslation();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>{t("Error Loading Data")}</ErrorMessage>;
  }

  const coord = data?.coord;

  if (!coord) {
    return <ErrorMessage>Error Loading Coordinates</ErrorMessage>;
  }

  return (
    <View style={styles.container}>
      <RadarButton
        icon="partly-sunny-outline"
        style={styles.radarButton}
        isOnRadar
      />
      <MapView
        style={styles.map}
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

const stylesheet = createStyleSheet((theme, runtime) => ({
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
  radarButton: {
    position: "absolute",
    top: runtime.insets.top + 10,
    left: 20,
    backgroundColor: theme.secondaryButton,
    padding: 10,
    borderRadius: 10,
    width: 55,
    height: 55,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,

    elevation: 5,
  },
}));

export default RadarScreen;
