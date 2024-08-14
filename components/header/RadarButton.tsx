import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const RadarButton = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity style={styles.radarButton}>
      <Ionicons name="radio-outline" size={35} color="white" />
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  radarButton: {
    width: "12%",
    height: "80%",
    backgroundColor: theme.secondaryButton,
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default RadarButton;
