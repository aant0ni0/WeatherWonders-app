import React, { useCallback, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setCity } from "../../slices/citySlice";
import { RootStackParamList } from "../../types/navigation";
import { useLazySearchCityQuery } from "../../services/api";
import { debounce } from "../../utils/debounce";
import TypeSuggestionsBox from "./TypeSuggestionsBox";
import ErrorMessage from "../ErrorMessage";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import SearchBar from "./SearchBar";
import { getSearchBarContainerHeight } from "../../utils/searchBarHeightCalculator";
import { dataSchema } from "../../types/geoNamesSchema";

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
        const result = await triggerSearchCityQuery(text).unwrap();

        const parsedData = dataSchema.safeParse(result);

        if (parsedData.success) {
          return parsedData.data;
        } else {
          console.error("Invalid data format:", parsedData.error);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
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
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={"white"} />
        </View>
      )}
      {error && (
        <ErrorMessage>Error fetching cities. Please try again.</ErrorMessage>
      )}
      {query.length > 2 &&
        data?.geonames?.length > 0 &&
        !isLoading &&
        !error && (
          <TypeSuggestionsBox
            data={data.geonames}
            onPress={handleCitySelection}
          />
        )}
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    height: getSearchBarContainerHeight(runtime.screen.height),
    marginRight: 65,
  },
  loader: {
    position: "absolute",
    top: 80,
    width: "90%",
  },
}));

export default LocationSearch;
