import { useState, useEffect } from "react";
import SunriseSunsetChart from "../SunriseSunsetChart";
import WeatherWidget from "./WeatherWidget";
import { useTranslation } from "react-i18next";

interface SunriseSunsetWidgetProps {
  sunrise: Date;
  sunset: Date;
  today: boolean;
  timezone: number;
}

const SunriseSunsetWidget: React.FC<SunriseSunsetWidgetProps> = ({
  sunrise,
  sunset,
  today,
  timezone,
}) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState<number>(new Date().getTime());
  const INTERVAL_TIME = 150000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, INTERVAL_TIME);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <WeatherWidget title={t("Sunrise and Sunset")}>
      <SunriseSunsetChart
        sunrise={sunrise.getTime() / 1000}
        sunset={sunset.getTime() / 1000}
        currentTime={currentTime + timezone * 1000}
        today={today}
      />
    </WeatherWidget>
  );
};

export default SunriseSunsetWidget;
