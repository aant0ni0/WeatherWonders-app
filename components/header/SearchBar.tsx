import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet } from "react-native-unistyles";
import colors from "../../assets/colors";

const SearchBar = () => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput style={styles.searchBar} placeholder="Search city..." />
      <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
        <Ionicons name="search" size={20} color={colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  searchBar: {
    paddingLeft: 10,
    fontSize: 16,
    width: "88%",
  },
  searchBarContainer: {
    height: "80%",
    width: "73%",
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "white",
  },
  searchButton: {
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchBar;
