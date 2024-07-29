import React from "react";
import { View, Text } from "react-native";
import Svg, { Line, Circle, Path } from "react-native-svg";

interface SunriseSunsetChartProps {
  sunrise: number;
  sunset: number;
  currentTime: number;
  today: boolean;
}

const SunriseSunsetChart: React.FC<SunriseSunsetChartProps> = ({
  sunrise,
  sunset,
  currentTime,
  today,
}) => {
  const totalMinutesInDay = 24 * 60;

  const sunriseMinutes =
    new Date(sunrise * 1000).getHours() * 60 +
    new Date(sunrise * 1000).getMinutes();

  const sunsetMinutes =
    new Date(sunset * 1000).getHours() * 60 +
    new Date(sunset * 1000).getMinutes();

  const currentMinutes =
    new Date(currentTime).getHours() * 60 + new Date(currentTime).getMinutes();

  const svgWidth = 180;

  const sunriseX = (sunriseMinutes / totalMinutesInDay) * svgWidth;

  const sunsetX = (sunsetMinutes / totalMinutesInDay) * svgWidth;

  const currentX = (currentMinutes / totalMinutesInDay) * svgWidth;

  const calculateY = (x: number): number => {
    const controlX = svgWidth / 2;
    const controlY = 10;
    const t = (x - sunriseX) / (sunsetX - sunriseX);
    return (1 - t) * (1 - t) * 25 + 2 * (1 - t) * t * controlY + t * t * 25;
  };

  const currentY = calculateY(currentX);

  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 10,
        paddingTop: 30,
      }}
    >
      <Svg height="50" width={svgWidth + 20}>
        <Line
          x1="0"
          y1="25"
          x2={svgWidth + 10}
          y2="25"
          stroke="black"
          strokeWidth="1"
        />

        <Path
          d={`M${sunriseX + 5},25 Q${svgWidth / 2},5 ${sunsetX + 5},25`}
          stroke="orange"
          strokeWidth="2"
          fill="none"
        />

        {today && <Circle cx={currentX + 5} cy={currentY} r="3" fill="red" />}
      </Svg>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: svgWidth - 35,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
          }}
        >
          {new Date(sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
          }}
        >
          {new Date(sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
      </View>
    </View>
  );
};

export default SunriseSunsetChart;
