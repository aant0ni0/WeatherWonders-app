import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import SearchBar from "../components/header/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";
import { useDispatch } from "react-redux";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getAddress } from "../services/location";
import { useState, useEffect } from "react";
import { setCity } from "../slices/citySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;

const LocationSelectScreen = () => {
  const { styles } = useStyles(stylesheet);
  const dispatch = useDispatch();
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [pickedLocation, setPickedLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (pickedLocation.lat && pickedLocation.lng) {
        const fetchedAddress = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        setAddress(fetchedAddress);

        dispatch(setCity(fetchedAddress));
        try {
          await AsyncStorage.setItem("selectedCity", fetchedAddress);
        } catch (error) {
          console.error(error);
        }
        navigation.navigate("Tabs");
      }
    };

    fetchAddress();
  }, [pickedLocation]);

  const verifyPermissions = async () => {
    console.log(locationPermissionInformation?.status);
    if (
      locationPermissionInformation?.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (locationPermissionInformation?.status === PermissionStatus.DENIED) {
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    console.log(hasPermission);
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to get your current position. Please enable it in your device settings.",
        [{ text: "OK" }]
      );
      return;
    }
    const location = await getCurrentPositionAsync();
    console.log("Location:", location);
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const onPressLocationButton = async () => {
    setIsLoading(true);
    await getLocationHandler();
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
          <SearchBar />
        </View>
      </View>
      {isLoading && <ActivityIndicator size={"large"} />}
      <Text style={styles.infoText}>Enter City Name</Text>
    </View>
  );
};

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: insetsTop,
    backgroundColor: "#BDE3FF",
  },
  searchContainer: {
    flex: 1,
  },
  infoText: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primaryText,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    height: height / 16,
    marginTop: 30,
  },
  locateButton: {
    width: "10%",
    height: "100%",
    marginLeft: 10,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LocationSelectScreen;
