import { View, Text } from "react-native";
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const SingleDayScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "SingleDay">
> = ({ navigation }) => {
  return (
    <View>
      <Text>SingleDayScreen</Text>
    </View>
  );
};

export default SingleDayScreen;
