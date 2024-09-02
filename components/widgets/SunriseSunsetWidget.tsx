import { useState, useEffect } from "react";
import SunriseSunsetChart from "../SunriseSunsetChart";
import WeatherWidget from "./WeatherWidget";

interface SunriseSunsetWidgetProps {
  sunrise: number;
  sunset: number;
  today: boolean;
  timezone: number;
}

const SunriseSunsetWidget: React.FC<SunriseSunsetWidgetProps> = ({
  sunrise,
  sunset,
  today,
  timezone,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());
  const INTERVAL_TIME = 150000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, INTERVAL_TIME);

    return () => clearInterval(intervalId);
  }, []);

  const adjustedSunrise = new Date(sunrise * 1000 + timezone * 1000);
  const adjustedSunset = new Date(sunset * 1000 + timezone * 1000);

  return (
    <WeatherWidget title="Sunrise and Sunset">
      <SunriseSunsetChart
        sunrise={adjustedSunrise.getTime() / 1000}
        sunset={adjustedSunset.getTime() / 1000}
        currentTime={currentTime + timezone * 1000}
        today={today}
      />
    </WeatherWidget>
  );
};

export default SunriseSunsetWidget;
