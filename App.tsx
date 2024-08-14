import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList, RootTabsParamList } from "./types/navigation";
import SingleDayScreen from "./screens/SingleDayScreen";
import LocationSelectScreen from "./screens/LocationSelectScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FiveDaysScreen from "./screens/FiveDaysScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { setCity } from "./slices/citySlice";
import * as SplashScreen from "expo-splash-screen";
import Loader from "./components/Loader";
import { createStyleSheet } from "react-native-unistyles";
import "./assets/unistyles";

SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(console.warn);

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabsParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIcon: () => null,
        tabBarLabelStyle: {
          fontSize: 18,
          position: "absolute",
        },
        tabBarActiveBackgroundColor: "#3498DB",
        tabBarInactiveBackgroundColor: "#2C3E50",
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarLabelPosition: "beside-icon",
      }}
    >
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

const App = () => {
  const [isSelectedCity, setIsSelectedCity] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSelectedCity = async () => {
      try {
        const selectedCity = await AsyncStorage.getItem("selectedCity");
        if (selectedCity) {
          dispatch(setCity(selectedCity));
          setIsSelectedCity(true);
        } else {
          setIsSelectedCity(false);
        }
      } catch (error) {
        console.error(error);
        setIsSelectedCity(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    fetchSelectedCity();
  }, [dispatch]);

  if (isSelectedCity === null) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isSelectedCity && (
          <Stack.Screen
            name="LocationSelect"
            component={LocationSelectScreen}
            options={{ headerShown: false }}
          />
        )}
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
      <App />
    </Provider>
  );
}
