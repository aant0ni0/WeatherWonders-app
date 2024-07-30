import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet } from "react-native-unistyles";

const RadarButton = () => {
  return (
    <TouchableOpacity style={styles.radarButton}>
      <Ionicons name="radio-outline" size={35} color="white" />
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  radarButton: {
    width: "12%",
    height: "80%",
    backgroundColor: "#F39C12",
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RadarButton;
