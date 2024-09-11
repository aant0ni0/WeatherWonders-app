import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList, RootTabsParamList } from "./types/navigation";
import SingleDayScreen from "./screens/SingleDayScreen";
import LocationSelectScreen from "./screens/LocationSelectScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FiveDaysScreen from "./screens/FiveDaysScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import Loader from "./components/Loader";
import "./assets/unistyles";
import AnimatedTabBar from "./components/AnimatedTabBar";
import { useSelector } from "react-redux";
import { RootState } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabsParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <AnimatedTabBar {...props} />}>
      <Tab.Screen
        name="TodayScreen"
        component={SingleDayScreen}
        initialParams={{ today: true }}
        options={{
          title: "Today",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="TomorrowScreen"
        component={SingleDayScreen}
        initialParams={{ today: false }}
        options={{
          title: "Tomorrow",
          headerShown: false,
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

const App = () => {
  const city = useSelector((state: RootState) => state.city);
  console.log(city);

  const initialRouteName = city ? "Tabs" : "LocationSelect";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="LocationSelect"
          component={LocationSelectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function RootApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}
