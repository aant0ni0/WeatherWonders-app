import { View, Text, Image } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface DayWeatherWidgetProps {
  date: Date | null;
  mainIcon: string | undefined | null;
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
          style={[styles.weatherIcon, styles.shadow]}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 0.2,
  },
  weatherIcon: {
    width: 65,
    height: 65,
  },
  dateBox: {
    width: "33%",
    marginRight: 10,
  },
  date: {
    fontSize: 11,
    margin: 5,
    marginLeft: 0,
  },
  weekDay: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 5,
    marginBottom: 15,
  },
  imageBox: {
    width: "7%",
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
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 8,
  },
}));
export default DayWeatherWidget;
