import React from "react";
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
  return (
    <WeatherWidget title="Sunrise and Sunset">
      <SunriseSunsetChart
        sunrise={sunrise}
        sunset={sunset}
        currentTime={new Date().getTime()}
        today={today}
      />
    </WeatherWidget>
  );
};

export default SunriseSunsetWidget;
