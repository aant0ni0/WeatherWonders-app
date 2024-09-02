import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import RadarButton from "./RadarButton";
import LocationSearch from "./LocationSearch";

const Header = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.header}>
      <RadarButton />
      <LocationSearch />
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: {
    width: "100%",
    height: runtime.screen.height / 15,
    flexDirection: "row",
    marginTop: 10,
    paddingRight: 25,
  },
}));
export default Header;
