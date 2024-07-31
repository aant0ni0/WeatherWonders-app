import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import colors from "../../assets/colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const GEO_NAMES_USERNAME = "antonimichalczak16";
const BASE_URL_GEONAMES = "http://api.geonames.org/searchJSON";

interface GeoName {
  geonameId: number;
  name: string;
  countryName: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoName[]>([]);
  const { styles } = useStyles(stylesheet);
  const navigation: any = useNavigation();

  const fetchCities = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://secure.geonames.org/searchJSON?name_startsWith=${text}&maxRows=5&username=${GEO_NAMES_USERNAME}`
        );
        setSuggestions(response.data.geonames);
      } catch (error) {
        console.error("Error fetching cities:", JSON.stringify(error, null, 2));
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCitySelection = (cityName: string) => {
    setQuery(cityName);
    setSuggestions([]);
    navigation.navigate("Tabs");
  };
  return (
    <>
      <View style={{ height: "90%" }}>
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
        {suggestions.length > 0 && (
          <View style={styles.typeSuggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.geonameId.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCitySelection(item.name)}
                  style={styles.suggestionItem}
                >
                  <Text>
                    {item.name}, {item.countryName}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.suggestionsList}
            />
          </View>
        )}
      </View>
    </>
  );
};

const stylesheet = createStyleSheet({
  searchBar: {
    paddingLeft: 10,
    fontSize: 16,
    width: "88%",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "white",
    width: "90%",
  },
  searchButton: {
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsList: {
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  typeSuggestionsContainer: {
    position: "absolute",
    top: 40,
    width: "90%",
  },
});

export default SearchBar;
