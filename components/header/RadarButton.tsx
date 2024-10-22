import { TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

type IoniconName = "radio-outline" | "partly-sunny-outline";

interface RadarButtonProps {
  icon: IoniconName;
  style: ViewStyle;
  isOnRadar?: boolean;
}

const RadarButton: React.FC<RadarButtonProps> = ({
  icon,
  style,
  isOnRadar,
}) => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { styles } = useStyles(stylesheet);

  const navigateToRadarScreen = () => {
    if (!isOnRadar) {
      navigation.navigate("Radar");
    } else {
      navigation.navigate("Tabs");
    }
  };

  return (
    <TouchableOpacity
      style={[style, styles.button]}
      onPress={navigateToRadarScreen}
    >
      <Ionicons name={icon} size={35} color="white" />
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  button: {
    backgroundColor: theme.secondaryButton,
    borderRadius: 5,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default RadarButton;
