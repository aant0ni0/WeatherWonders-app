import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import colors from "../../assets/colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCity } from "../../slices/citySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEO_NAMES_USERNAME = "antonimichalczak16";
const BASE_URL_GEONAMES = "https://secure.geonames.org/searchJSON";

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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const debounce = (func: (text: string) => Promise<void>, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: [string]) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchCities = async (text: string) => {
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `${BASE_URL_GEONAMES}?name_startsWith=${text}&maxRows=5&username=${GEO_NAMES_USERNAME}`
        );
        setSuggestions(response.data.geonames);
      } catch (error) {
        console.error("Error fetching cities:", JSON.stringify(error, null, 2));
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  };

  const debouncedFetchCities = debounce(fetchCities, 500);

  const handleSearch = (text: string) => {
    setLoading(true);
    setQuery(text);
    debouncedFetchCities(text);
  };

  const handleCitySelection = async (cityName: string) => {
    setQuery(cityName);
    setSuggestions([]);
    dispatch(setCity(cityName));
    try {
      await AsyncStorage.setItem("selectedCity", cityName);
    } catch (error) {
      console.error(error);
    }
    navigation.navigate("Tabs");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search city..."
            value={query}
            onChangeText={(text) => handleSearch(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
            <Ionicons name="search" size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <View style={styles.typeSuggestionsContainer}>
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={"white"} />
              </View>
            ) : (
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
            )}
          </View>
        )}
      </View>
    </>
  );
};

const stylesheet = createStyleSheet({
  container: {
    height: "90%",
  },
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
  loader: {
    position: "absolute",
    top: 80,
    width: "90%",
  },
});

export default SearchBar;
