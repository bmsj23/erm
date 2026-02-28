import React, { useMemo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { createStyles } from "./SearchBar.styles";

interface SearchBarProps {
  onPress: () => void;
  onFilterPress?: () => void;
  filterLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress, onFilterPress, filterLabel = "All" }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchTouchArea}
        onPress={onPress}
        activeOpacity={0.9}>
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color={colors.primary} />
        </View>
        <Text style={styles.text}>Search jobs, companies...</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.7}>
        <Ionicons name="options" size={16} color="#FFFFFF" />
        <Text style={styles.filterButtonText}>{filterLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;