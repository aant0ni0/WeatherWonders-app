import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

const RadarButton = () => {
  const { styles } = useStyles(stylesheet);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const navigateToRadarScreen = () => {
    navigation.navigate("Radar");
  };

  return (
    <TouchableOpacity
      style={styles.radarButton}
      onPress={navigateToRadarScreen}
    >
      <Ionicons name="radio-outline" size={35} color="white" />
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  radarButton: {
    aspectRatio: 1,
    height: "90%",
    backgroundColor: theme.secondaryButton,
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default RadarButton;
