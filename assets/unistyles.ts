import { UnistylesRegistry } from "react-native-unistyles";

type AppThemes = {
  colors: {
    primary: string;
    secondary: string;
    primaryText: string;
    primaryButton: string;
    secondaryButton: string;
    primaryWidget: string;
    primaryBackgroud: string;
  };
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  colors: {
    primary: "#a5d2f0",
    secondary: "#86bee3",
    primaryText: "#2C3E50",
    primaryButton: "#3498DB",
    secondaryButton: "#F39C12",
    primaryWidget: "#FAFAFA",
    primaryBackgroud: "#BDE3FF",
  },
});
