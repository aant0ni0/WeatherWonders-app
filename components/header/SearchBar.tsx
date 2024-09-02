import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
interface SearchBarProps {
  onChangeText: (value: string) => void;
  query: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChangeText, query }) => {
  const { styles } = useStyles(stylesheet);

  const { theme } = useStyles();

  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search city..."
        value={query}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
        <Ionicons name="search" size={20} color={theme.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
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
}));

export default SearchBar;
