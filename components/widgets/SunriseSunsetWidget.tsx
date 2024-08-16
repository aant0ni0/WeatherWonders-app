import { useState, useEffect } from "react";
import { View } from "react-native";
import SunriseSunsetChart from "../SunriseSunsetChart";
import WeatherWidget from "./WeatherWidget";

interface SunriseSunsetWidgetProps {
  sunrise: number;
  sunset: number;
  today: boolean;
}

const SunriseSunsetWidget: React.FC<SunriseSunsetWidgetProps> = ({
  sunrise,
  sunset,
  today,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());
  const INTERVAL_TIME = 150000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, INTERVAL_TIME);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <WeatherWidget title="Sunrise and Sunset">
      <SunriseSunsetChart
        sunrise={sunrise}
        sunset={sunset}
        currentTime={currentTime}
        today={today}
      />
    </WeatherWidget>
  );
};

export default SunriseSunsetWidget;
