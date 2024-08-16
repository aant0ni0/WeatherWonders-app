import { weekdays } from "moment-timezone";
import { View, Text, Image } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface DayWeatherWidgetProps {
  date: Date | null;
  mainIcon: string | null;
  minTemp: number | null;
  maxTemp: number | null;
  today?: boolean;
}

const DayWeatherWidget: React.FC<DayWeatherWidgetProps> = ({
  date,
  mainIcon,
  minTemp,
  maxTemp,
  today,
}) => {
  const { styles } = useStyles(stylesheet);
  const options: {} = { weekday: "long" };
  const dayName = today ? "Today" : date?.toLocaleDateString("en-US", options);

  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  return (
    <View style={styles.widgetContainer}>
      <View style={styles.dateBox}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.weekDay}>{dayName}</Text>
      </View>
      <View style={styles.imageBox}>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${mainIcon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
      </View>
      <View style={styles.tempBox}>
        <Text style={styles.temp}>
          from {minTemp?.toFixed() + "°"} to {maxTemp?.toFixed() + "°"}
        </Text>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  widgetContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    marginBottom: 25,
    paddingVertical: 2,
    paddingLeft: 5,
  },
  weatherIcon: {
    width: 65,
    height: 65,
  },
  dateBox: {
    width: "27%",
    marginRight: 10,
  },
  date: {
    fontSize: 11,
    margin: 5,
    marginLeft: 0,
  },
  weekDay: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 5,
    marginBottom: 15,
  },
  imageBox: {
    width: "13%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  tempBox: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
    paddingTop: 5,
  },
  temp: {
    fontSize: 16,
  },
}));
export default DayWeatherWidget;
