import { View } from "react-native";
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import RadarButton from "./RadarButton";
import SearchBar from "./SearchBar";

const height = UnistylesRuntime.screen.height;

const Header = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.header}>
      <RadarButton icon="radio-outline" style={styles.radarButton} />
      <SearchBar />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: {
    width: "100%",
    height: height / 15,
    flexDirection: "row",
    marginTop: 10,
    paddingRight: 25,
  },
  radarButton: {
    aspectRatio: 1,
    height: "90%",
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 10,
  },
}));
export default Header;
