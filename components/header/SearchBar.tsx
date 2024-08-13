import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const SearchBar = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.searchBarContainer}>
      <TextInput style={styles.searchBar} placeholder="Search city..." />
      <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
        <Ionicons name="search" size={20} color={styles.searchButton.color} />
      </TouchableOpacity>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  searchBar: {
    paddingLeft: 10,
    fontSize: 16,
    width: "90%",
  },
  searchBarContainer: {
    height: "80%",
    width: "73%",
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: theme.primaryWidget,
  },
  searchButton: {
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    color: theme.primaryText,
  },
}));

export default SearchBar;
