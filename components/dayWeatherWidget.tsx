import { View, Text } from "react-native";

interface dayWeatherWidgetProps {
  date: Date;
  weatherIcon: string;
  from: number;
  to: number;
}

const dayWeatherWidget: React.FC<dayWeatherWidgetProps> = ({
  date,
  weatherIcon,
  from,
  to,
}) => {
  return (
    <View>
      <Text>dayWeatherWidget</Text>
    </View>
  );
};

export default dayWeatherWidget;
