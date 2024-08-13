import { UnistylesRegistry } from "react-native-unistyles";

// Dodanie tematów
UnistylesRegistry.addThemes({
  theme: {
    // 'theme' jako nadrzędny klucz dla tematów
    colors: {
      primary: "#87CEEB",
      secondary: "#FAFAFA",
      primaryText: "#2C3E50",
      primaryButton: "#3498DB",
      secondaryButton: "#F39C12",
      primaryWidget: "#FAFAFA",
    },
  },
});

// Dodanie konfiguracji
UnistylesRegistry.addConfig({
  adaptiveThemes: true,
});
