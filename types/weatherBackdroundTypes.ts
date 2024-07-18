import { ImageSourcePropType } from "react-native";

export type WeatherTypes = "clearsky" | "clouds" | "fewclouds" | "rain";
//   | "Drizzle"
//   | "Thunderstorm"
//   | "Snow"
//   | "Mist"
//   | "Smoke"
//   | "Haze"
//   | "Dust"
//   | "Fog"
//   | "Sand"
//   | "Ash"
//   | "Squall"
//   | "Tornado";

export const weatherBackgrounds: {
  [key in WeatherTypes]: ImageSourcePropType;
} = {
  clearsky: require("../assets/images/sunny.jpg"),
  clouds: require("../assets/images/cloudy.jpg"),
  fewclouds: require("../assets/images/cloudy.jpg"),
  rain: require("../assets/images/rainy.png"),
  //   Drizzle: require("../assets/images/drizzle.jpg"),
  //   Thunderstorm: require("../assets/images/storm.jpg"),
  //   Snow: require("../assets/images/snowy.jpg"),
  //   Mist: require("../assets/images/mist.jpg"),
  //   Smoke: require("../assets/images/smoke.jpg"),
  //   Haze: require("../assets/images/haze.jpg"),
  //   Dust: require("../assets/images/dust.jpg"),
  //   Fog: require("../assets/images/fog.jpg"),
  //   Sand: require("../assets/images/sand.jpg"),
  //   Ash: require("../assets/images/ash.jpg"),
  //   Squall: require("../assets/images/squall.jpg"),
  //   Tornado: require("../assets/images/tornado.jpg"),
};
