import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCity } from "../../slices/citySlice";
import { RootStackParamList } from "../../types/navigation";
import { useLazySearchCityQuery } from "../../services/api";
import { debounce } from "../../utils/debounce";
import TypeSuggestionsBox from "./TypeSuggestionsBox";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import SearchBar from "./SearchBar";
import { searchBarContainerHeight } from "../../constants";

const LocationSearch = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const { styles } = useStyles(stylesheet);

  const [triggerSearchCityQuery, { data, error, isLoading }] =
    useLazySearchCityQuery();

  const fetchCities = async (text: string) => {
    if (text.length > 2) {
      try {
        await triggerSearchCityQuery(text);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    } else {
      return;
    }
  };

  const debouncedFetchCities = useCallback(debounce(fetchCities, 400), []);

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedFetchCities(text);
  };

  const handleCitySelection = async (cityName: string) => {
    setQuery("");
    dispatch(setCity(cityName));
    console.log(cityName);
    navigation.navigate("Tabs");
  };
  return (
    <View style={styles.container}>
      <SearchBar onChangeText={handleSearch} query={query} />
      {isLoading && <Loader />}
      {error && (
        <ErrorMessage>Error fetching cities. Please try again.</ErrorMessage>
      )}
      {query.length > 2 &&
        data?.geonames?.length > 0 &&
        !isLoading &&
        !error && (
          <TypeSuggestionsBox data={data} onPress={handleCitySelection} />
        )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    height: searchBarContainerHeight,
    marginRight: 65,
  },
}));

export default LocationSearch;
