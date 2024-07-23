import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList, RootTabsParamList } from "./types/navigation";
import SingleDayScreen from "./screens/SingleDayScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FiveDaysScreen from "./screens/FiveDaysScreen";
import colors from "./assets/colors";
import { createStyleSheet, UnistylesRuntime } from "react-native-unistyles";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabsParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIcon: () => null,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveBackgroundColor: colors.primaryButton,
        tabBarInactiveBackgroundColor: colors.primaryText,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarLabelPosition: "beside-icon",
      }}
    >
      <Tab.Screen
        name="TodayScreen"
        component={SingleDayScreen}
        options={{
          title: "Today",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="TommorowScreen"
        component={SingleDayScreen}
        options={{
          title: "Tommorow",
          headerShown: false,
          tabBarItemStyle: {
            borderRightWidth: 0.2,
            borderLeftWidth: 0.2,
            borderColor: "black",
          },
        }}
      />
      <Tab.Screen
        name="FiveDays"
        component={FiveDaysScreen}
        options={{
          title: "In five days",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = createStyleSheet({
  tabBarLabelStyle: {
    fontSize: 18,
    position: "absolute",
  },
});
