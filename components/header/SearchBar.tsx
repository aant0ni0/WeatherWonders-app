import React, { useCallback, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCity } from "../../slices/citySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types/navigation";
import { useLazySearchCityQuery } from "../../services/api";
import { UnistylesRuntime, useStyles } from "react-native-unistyles";
import { debounce } from "../../utils/debounce";

interface GeoName {
  geonameId: number;
  name: string;
  countryName: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoName[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const { theme } = useStyles();

  const [triggerSearchCityQuery, { data, error, isLoading }] =
    useLazySearchCityQuery();

  const fetchCities = async (text: string) => {
    if (text.length > 2) {
      try {
        const response = await triggerSearchCityQuery(text).unwrap();
        setSuggestions(response.geonames || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchCities = useCallback(debounce(fetchCities, 400), [
    debounce,
  ]);

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedFetchCities(text);
  };

  const handleCitySelection = async (cityName: string) => {
    setQuery("");
    setSuggestions([]);
    dispatch(setCity(cityName));
    console.log(cityName);
    try {
      await AsyncStorage.setItem("selectedCity", cityName);
    } catch (error) {
      console.error("Error saving selected city:", error);
    }
    navigation.navigate("Tabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search city..."
          value={query}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Ionicons name="search" size={20} color={theme.primaryText} />
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error fetching cities. Please try again.
          </Text>
        </View>
      )}
      {suggestions.length > 0 && !isLoading && !error && (
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
  );
};

const searchBarContainerHeight = (UnistylesRuntime.screen.height / 15) * 0.9;

const styles = StyleSheet.create({
  container: {
    height: searchBarContainerHeight,
    marginRight: 65,
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
    width: "100%",
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
    top: searchBarContainerHeight - 5,
    width: "90%",
  },
  loader: {
    position: "absolute",
    top: 80,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    position: "absolute",
    top: 80,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
  },
});

export default SearchBar;
