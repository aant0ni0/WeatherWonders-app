import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import colors from "../../assets/colors";
import axios from "axios";
import { useState } from "react";

const GEO_NAMES_USERNAME = "antonimichalczak16";
const BASE_URL_GEONAMES = "http://api.geonames.org/searchJSON";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [sugestions, setSuggestions] = useState([]);
  const { styles } = useStyles(stylesheet);

  const fetchCities = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://secure.geonames.org/searchJSON?name_startsWith=${text}&maxRows=10&username=${GEO_NAMES_USERNAME}`
        );
        setSuggestions(response.data.geonames);
        console.log(response.data.geonames[0].name);
      } catch (error) {
        console.error("Error fetching cities:", JSON.stringify(error, null, 2));
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search city..."
        value={query}
        onChangeText={(text) => fetchCities(text)}
      />
      <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
        <Ionicons name="search" size={20} color={colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const stylesheet = createStyleSheet({
  searchBar: {
    paddingLeft: 10,
    fontSize: 16,
    width: "88%",
  },
  searchBarContainer: {
    height: "80%",
    flex: 1,
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
