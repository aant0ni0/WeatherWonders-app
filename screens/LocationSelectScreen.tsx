import { View, Text, TouchableOpacity } from "react-native";
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import SearchBar from "../components/header/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";

const width = UnistylesRuntime.screen.width;
const height = UnistylesRuntime.screen.height;
const insetsTop = UnistylesRuntime.insets.top;

const LocationSelectScreen = () => {
  const { styles } = useStyles(stylesheet);
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
