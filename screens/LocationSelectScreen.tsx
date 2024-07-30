import { View, Text, TouchableOpacity } from "react-native";
import { createStyleSheet, UnistylesRuntime } from "react-native-unistyles";
import SearchBar from "../components/header/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;

const LocationSelectScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.locateButton}>
          <Ionicons name="locate-outline" size={35} color="white" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
      </View>
      <Text style={styles.infoText}>Enter City Name</Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: insetsTop,
    backgroundColor: "#BDE3FF",
  },
  searchContainer: {
    height: "100%",
    width: "100%",
  },
  infoText: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  header: {
    flexDirection: "row",
    width: width * 0.99,
    height: height / 14,
    marginTop: 30,
  },
  locateButton: {
    width: "10%",
    height: "80%",
    marginLeft: 10,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LocationSelectScreen;
