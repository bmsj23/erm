import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useColorScheme } from "react-native";
import { ThemeColors, lightColors, darkColors } from "../constants/theme";
import { StorageService } from "../utils/storage";

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await StorageService.getThemePreference();
      if (typeof saved === "boolean") {
        setIsDarkMode(saved);
      }
      setIsLoaded(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      StorageService.saveThemePreference(next);
      return next;
    });
  }, []);

  const colors = isDarkMode ? darkColors : lightColors;

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};