import {
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { createStyleSheet, useStyles } from "react-native-unistyles";

const AnimatedTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { styles } = useStyles(stylesheet);
  const windowWidth = useWindowDimensions().width;
  const tabBarItemWidth = windowWidth / 3;

  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(translateX.value, { duration: 300 }),
        },
      ],
    };
  });
  return (
    <View style={styles.tabBar}>
      <Animated.View style={[styles.slider, animatedStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel.toString()
            : options.title !== undefined
              ? options.title
              : route.name.toString();

        const onPress = () => {
          const isFocused = state.index === index;
          if (!isFocused) {
            navigation.navigate(route.name);
            translateX.value = index * tabBarItemWidth;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Text style={styles.tabLabel}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  tabBar: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "white",
    marginBottom: runtime.insets.bottom,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 16,
    color: "black",
  },
  slider: {
    position: "absolute",
    height: 35,
    width: 100,
    backgroundColor: theme.secondary,
    borderRadius: 20,
    left: 15,
    top: 7.5,
  },
}));

export default AnimatedTabBar;
