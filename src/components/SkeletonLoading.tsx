import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, borderRadius } from "../constants/theme";

const SkeletonItem = () => {
  const { colors } = useTheme();
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

  const backgroundColor = colors.border;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
      <View style={styles.header}>
        <Animated.View style={[styles.logo, { backgroundColor, opacity }]} />
        <View style={styles.headerText}>
          <Animated.View style={[styles.title, { backgroundColor, opacity }]} />
          <Animated.View style={[styles.company, { backgroundColor, opacity }]} />
        </View>
        <Animated.View style={[styles.bookmark, { backgroundColor, opacity }]} />
      </View>

      <View style={styles.tags}>
        <Animated.View style={[styles.tag, { backgroundColor, opacity, width: 80 }]} />
        <Animated.View style={[styles.tag, { backgroundColor, opacity, width: 100 }]} />
        <Animated.View style={[styles.tag, { backgroundColor, opacity, width: 60 }]} />
      </View>

      <View style={styles.footer}>
        <Animated.View style={[styles.salary, { backgroundColor, opacity }]} />
        <Animated.View style={[styles.button, { backgroundColor, opacity }]} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    height: 20,
    width: "80%",
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  company: {
    height: 16,
    width: "50%",
    borderRadius: borderRadius.sm,
  },
  bookmark: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  tags: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tag: {
    height: 28,
    borderRadius: borderRadius.full,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  salary: {
    height: 20,
    width: 100,
    borderRadius: borderRadius.sm,
  },
  button: {
    height: 36,
    width: 100,
    borderRadius: borderRadius.full,
  },
});

export default SkeletonLoading;