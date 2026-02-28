import React from "react";
import { StatusBar, View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { JobsProvider } from "./src/contexts/JobsContext";
import AppNavigator from "./src/navigation/AppNavigator";

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <JobsProvider>
            <AppContent />
          </JobsProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
