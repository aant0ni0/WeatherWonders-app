import { View } from "react-native";
import { createStyleSheet, UnistylesRuntime } from "react-native-unistyles";
import RadarButton from "./RadarButton";
import SearchBar from "./SearchBar";

const height = UnistylesRuntime.screen.height;

const Header = () => {
  return (
    <View style={styles.header}>
      <RadarButton />
      <SearchBar />
    </View>
  );
};

const styles = createStyleSheet({
  header: {
    width: "100%",
    height: height / 15,
    flexDirection: "row",
    marginTop: 10,
  },
});
export default Header;
