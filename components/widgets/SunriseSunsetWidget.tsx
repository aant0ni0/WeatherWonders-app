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

  // Poland's timezone offset (CET/CEST)
  const POLAND_TIMEZONE_OFFSET = 3600; // CET (winter) = 1 hour (3600 seconds)
  const POLAND_SUMMER_TIME_OFFSET = 7200; // CEST (summer) = 2 hours (7200 seconds)

  // Check if `sunrise` and `sunset` are provided in Poland's summer time (CEST)
  const isSummerTime = new Date(sunrise * 1000).getTimezoneOffset() === -120;
  const polandTimezoneOffset = isSummerTime
    ? POLAND_SUMMER_TIME_OFFSET
    : POLAND_TIMEZONE_OFFSET;

  // Convert `sunrise` and `sunset` to UTC by subtracting Poland's timezone offset
  const utcSunrise = (sunrise - polandTimezoneOffset) * 1000;
  const utcSunset = (sunset - polandTimezoneOffset) * 1000;

  // Add the target timezone offset to get the local time in the target timezone
  const adjustedSunrise = new Date(utcSunrise + timezone * 1000);
  const adjustedSunset = new Date(utcSunset + timezone * 1000);

  return (
    <WeatherWidget title="Sunrise and Sunset">
      <SunriseSunsetChart
        sunrise={adjustedSunrise.getTime() / 1000}
        sunset={adjustedSunset.getTime() / 1000}
        currentTime={currentTime}
        today={today}
      />
    </WeatherWidget>
  );
};

export default SunriseSunsetWidget;
