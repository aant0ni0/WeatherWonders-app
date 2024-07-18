import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList, RootTabsParamList } from "./types/navigation";
import SingleDayScreen from "./screens/SingleDayScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FiveDaysScreen from "./screens/FiveDaysScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabsParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="SingleDay"
        component={SingleDayScreen}
        options={{
          title: "Today",
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="SingleDay"
        component={SingleDayScreen}
        options={{
          title: "Tommorow",
        }}
      /> */}
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
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
