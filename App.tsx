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
import { useEffect, useState } from "react";
import { setCity } from "./slices/citySlice";
import * as SplashScreen from "expo-splash-screen";
import Loader from "./components/Loader";
import "./assets/unistyles";
import AnimatedTabBar from "./components/AnimatedTabBar";
import RadarScreen from "./screens/RadarScreen";

SplashScreen.preventAutoHideAsync()
  .then((result) =>
    console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
  )
  .catch(console.warn);

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
        <Stack.Screen
          name="Radar"
          component={RadarScreen}
          options={{ headerBackTitle: "Weather" }}
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
