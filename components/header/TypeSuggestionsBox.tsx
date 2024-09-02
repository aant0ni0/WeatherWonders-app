import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GeoNamesData } from "../../types/geoNamesSchema";
import { searchBarContainerHeight } from "../../constants";

interface TypeSuggestionsBoxProps {
  data: GeoNamesData;
  onPress: (cityName: string) => void;
}

const TypeSuggestionsBox: React.FC<TypeSuggestionsBoxProps> = ({
  data,
  onPress,
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.typeSuggestionsContainer}>
      <FlatList
        data={data.geonames}
        keyExtractor={(item) => item.geonameId.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPress(item.name)}
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
  );
};

const stylesheet = createStyleSheet((theme) => ({
  typeSuggestionsContainer: {
    position: "absolute",
    top: searchBarContainerHeight - 5,
    width: "90%",
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
}));

export default TypeSuggestionsBox;
