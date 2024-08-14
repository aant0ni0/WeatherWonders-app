import React from "react";
import { View, Text } from "react-native";
import Svg, { Line, Circle, Path } from "react-native-svg";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface SunriseSunsetChartProps {
  sunrise: number;
  sunset: number;
  currentTime: number;
  today: boolean;
}

const TOTAL_MINUTES_IN_DAY = 24 * 60;
const SVG_WIDTH = 200;
const BASELINE_Y = 30;
const CONTROL_Y = 5;
const CIRCLE_RADIUS = 4;

const SunriseSunsetChart: React.FC<SunriseSunsetChartProps> = ({
  sunrise,
  sunset,
  currentTime,
  today,
}) => {
  const { styles } = useStyles(stylesheet);

  let sunriseMinutes =
    new Date(sunrise * 1000).getHours() * 60 +
    new Date(sunrise * 1000).getMinutes();

  let sunsetMinutes =
    new Date(sunset * 1000).getHours() * 60 +
    new Date(sunset * 1000).getMinutes();

  let currentMinutes =
    new Date(currentTime).getHours() * 60 + new Date(currentTime).getMinutes();

  if (sunsetMinutes < sunriseMinutes) {
    sunsetMinutes += 24 * 60;
    currentMinutes += currentMinutes < sunriseMinutes ? 24 * 60 : 0;
  }

  const sunriseX = (sunriseMinutes / TOTAL_MINUTES_IN_DAY) * SVG_WIDTH;

  const sunsetX = (sunsetMinutes / TOTAL_MINUTES_IN_DAY) * SVG_WIDTH;

  const currentX = (currentMinutes / TOTAL_MINUTES_IN_DAY) * SVG_WIDTH;

  /**
   * Calculates the Y value for a given X on the curve representing the sun's path.
   * @param {number} x - The X position on the graph.
   * @returns {number} - The corresponding Y value on the curve.
   */
  const calculateY = (x: number): number => {
    /**
     * `t` is a proportional value (from 0 to 1) representing the position of x
     * between sunriseX and sunsetX. It is used in the quadratic Bézier curve equation.
     */
    const t = (x - sunriseX) / (sunsetX - sunriseX);

    //This equation smoothly interpolates the Y value between the start, control, and end points.
    return (
      (1 - t) * (1 - t) * BASELINE_Y +
      2 * (1 - t) * t * CONTROL_Y +
      t * t * BASELINE_Y
    );
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
      <Svg height="50" width={SVG_WIDTH + 20}>
        <Line
          x1="0"
          y1={BASELINE_Y}
          x2={SVG_WIDTH}
          y2={BASELINE_Y}
          stroke="black"
          strokeWidth="1"
        />

        <Path
          d={`M${sunriseX - 15},${BASELINE_Y + 5} Q${SVG_WIDTH / 2},1 ${
            sunsetX + 22
          },${BASELINE_Y + 5}`}
          stroke="orange"
          strokeWidth="2"
          fill="none"
        />

        {today && (
          <Circle cx={currentX} cy={currentY} r={CIRCLE_RADIUS} fill="red" />
        )}
      </Svg>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: SVG_WIDTH - 35,
        }}
      >
        <Text style={styles.sunriseHour}>
          {new Date(sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
        <Text style={styles.sunsetHour}>
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

const stylesheet = createStyleSheet({
  sunriseHour: {
    fontSize: 12,
    fontWeight: "500",
    left: 10,
  },
  sunsetHour: {
    fontSize: 12,
    fontWeight: "500",
    right: 10,
  },
});
