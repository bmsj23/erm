import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const SkeletonItem = () => {
  const { colors, isDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const bg = colors.border;
  const topBg = isDarkMode ? colors.surfaceElevated : "#F4F6F9";

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.topSection, { backgroundColor: topBg }]}>
        <View style={styles.topLeft}>
          <Animated.View style={[styles.logo, { backgroundColor: bg, opacity }]} />
          <Animated.View style={[styles.companyLine, { backgroundColor: bg, opacity }]} />
        </View>
        <Animated.View style={[styles.bookmark, { backgroundColor: bg, opacity }]} />
      </View>
      <View style={styles.bottomSection}>
        <Animated.View style={[styles.chipLine, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.titleLine, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.metaLine, { backgroundColor: bg, opacity }]} />
        <View style={styles.footerRow}>
          <View style={styles.tagsRow}>
            <Animated.View style={[styles.tag, { backgroundColor: bg, opacity, width: 56 }]} />
            <Animated.View style={[styles.tag, { backgroundColor: bg, opacity, width: 64 }]} />
            <Animated.View style={[styles.tag, { backgroundColor: bg, opacity, width: 48 }]} />
          </View>
          <Animated.View style={[styles.salaryBlock, { backgroundColor: bg, opacity }]} />
        </View>
      </View>
    </View>
  );
};

const SkeletonLoading = () => {
  return (
    <View style={styles.container}>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  topSection: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  companyLine: {
    height: 14,
    width: 90,
    borderRadius: 4,
  },
  bookmark: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bottomSection: {
    padding: 16,
  },
  chipLine: {
    height: 20,
    width: 60,
    borderRadius: 999,
    marginBottom: 8,
  },
  titleLine: {
    height: 18,
    width: "70%",
    borderRadius: 6,
  },
  metaLine: {
    height: 12,
    width: "50%",
    borderRadius: 4,
    marginTop: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    height: 24,
    borderRadius: 6,
  },
  salaryBlock: {
    height: 20,
    width: 72,
    borderRadius: 4,
  },
});

export default SkeletonLoading;