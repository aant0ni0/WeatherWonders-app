import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getAddress } from "../services/location";
import { useState } from "react";
import { setCity } from "../slices/citySlice";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { useTranslation } from "react-i18next";
import LocationSearch from "../components/header/LocationSearch";

const LocationSelectScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    if (lat && lng) {
      const fetchedAddress = await getAddress(lat, lng);

      dispatch(setCity(fetchedAddress));
      navigation.navigate("Tabs");
    }
  };

  const verifyPermissions = async () => {
    console.log(locationPermissionInformation?.status);
    if (
      locationPermissionInformation?.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    return locationPermissionInformation?.status !== PermissionStatus.DENIED;
  };

  const locationHandler = async () => {
    const hasPermission = await verifyPermissions();
    console.log(hasPermission);
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to get your current position. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    const location = await getCurrentPositionAsync();
    console.log("Location:", location);
    fetchAddress(location.coords.latitude, location.coords.longitude);
  };

  const onPressLocationButton = async () => {
    setIsLoading(true);
    await locationHandler();
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locateButton}
          onPress={onPressLocationButton}
        >
          <Ionicons name="locate-outline" size={35} color="white" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <LocationSearch />
        </View>
      </View>
      {isLoading && <ActivityIndicator size={"large"} />}
      <Text style={styles.infoText}>{t("Enter City Name")}</Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: runtime.insets.top,
    backgroundColor: theme.primaryBackgroud,
  },
  searchContainer: {
    flex: 1,
  },
  infoText: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: theme.primaryText,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    height: runtime.screen.height / 16,
    marginTop: 30,
    marginLeft: 5,
  },
  locateButton: {
    width: "10%",
    height: "100%",
    marginLeft: 25,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default LocationSelectScreen;
