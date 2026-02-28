# Job Finder App v2 - From-Scratch Build Guide

## Overview

This guide walks you through rebuilding the Job Finder App from scratch as **version 2**. The app has the same features and midterm requirements as v1, but with a **green and white** color scheme instead of blue and white.

---

## Midterm Instructions (Same as v1)

Create a Job Finder App using React Native (Typescript). This app should allow users to search for jobs, save jobs, and apply for jobs. You'll work with React Native's core components, stylings, forms, API integration, state management, and navigation.

Your project must be put in GitHub. Submit here the repository link. The repository name is: midterm-project-react-native.

Make sure to follow proper folder structure and include ALL types of validations.

There will be an individual presentation of your project after midterm week.

Requirements:

Job Finder Screen
Fetch jobs from an API (https://empllo.com/api/v1).
The jobs that will be fetched from this API will have no unique IDs. Make sure to assign unique IDs to each job. Use uuid from react-native.
Display job details (title, company, salary, etc.).
Implement a search bar to filter jobs.
Add a Save Job button. If this is clicked, change the text to "Saved". Only one of each job can be added to the saved jobs. There must not be a duplicate.
Add an Apply button to open the application form.
Saved Jobs Screen
Display saved jobs.
Allow users to apply for a saved job.
Implement a Remove Job button.
Application Form
When clicking "Apply," show a form to enter name, email, contact number, and a "Why should we hire you?" field.
Show a user feedback upon confirming the application.
Clear the form after submission.
If the application form is opened on the saved jobs, the user feedback containing an "Okay" button will redirect the user back to the Job Finder Screen.
Add a dark mode / light mode toggle button.

Make sure to follow proper folder structure and include ALL types of validations.

**Requirements:**

1. **Job Finder Screen** - Fetch jobs from API (`https://empllo.com/api/v1`), assign unique IDs via `react-native-uuid`, display job details, search bar to filter, Save/Saved toggle, Apply button.
2. **Saved Jobs Screen** - Display saved jobs, allow applying, Remove button with confirmation.
3. **Application Form** - Name, email, contact number, "Why should we hire you?" fields with validation. Success feedback, form clear, redirect to Job Finder if opened from Saved Jobs.
4. **Dark/Light mode toggle** with persistence.

---

## Technology Stack

| Layer            | Technology                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Framework        | React Native + Expo SDK 54 (managed workflow)                                             |
| Language         | TypeScript (strict mode)                                                                  |
| Navigation       | @react-navigation/native + @react-navigation/native-stack + @react-navigation/bottom-tabs |
| State Management | React Context API                                                                         |
| Persistence      | @react-native-async-storage/async-storage                                                 |
| Unique IDs       | react-native-uuid                                                                         |
| Icons            | @expo/vector-icons (Ionicons)                                                             |
| Images           | React Native Image (NOT expo-image, for Fabric compatibility)                             |
| Safe Areas       | react-native-safe-area-context                                                            |
| UI               | Custom components only (no external UI library)                                           |

---

## v2 Design Changes

- **Primary color:** Green (`#16A34A`) instead of blue (`#2563EB`)
- **Primary light:** `#DCFCE7` instead of `#DBEAFE`
- **Primary dark:** `#15803D` instead of `#1E40AF`
- **Dark mode primary:** `#22C55E` instead of `#3B82F6`
- **Dark mode primary light:** `#14532D` instead of `#1E3A8A`
- **Dark mode primary dark:** `#4ADE80` instead of `#60A5FA`
- All headers, buttons, accents, and active states use green instead of blue
- Everything else (layout, features, navigation, validation) remains identical

---

## Phase 1: Project Initialization

### 1.1 Create the Expo Project

```bash
npx create-expo-app@latest sanjuan-benedict-midterm-react-native-v2 --template expo-template-blank-typescript
cd sanjuan-benedict-midterm-react-native-v2
```

### 1.2 Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-uuid
```

> **Note:** Do NOT install `expo-image`. Use React Native's built-in `Image` component with `resizeMode` prop instead. This avoids Fabric bridge compatibility issues.

If `react-native-screens` has version issues with Expo SDK 54, pin it:

```bash
npm install react-native-screens@~4.16.0
```

### 1.3 tsconfig.json

```jsonc
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### 1.4 index.ts

```typescript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### 1.5 Folder Structure

Create this folder structure inside the project root:

```
src/
  components/
    JobCard/
    SearchBar/
  constants/
  contexts/
  navigation/
  screens/
    ApplicationForm/
    JobDetails/
    JobFinder/
    SavedJobs/
    Search/
  types/
  utils/
```

---

## Phase 2: Theme System & Types

### 2.1 `src/types/job.ts`

```typescript
export interface Job {
  id: string;
  title: string;
  mainCategory: string;
  companyName: string;
  companyLogo: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  locations: string[];
  tags: string[];
  description: string;
  pubDate: string;
  expiryDate: string;
  applicationLink: string;
  guid: string;
}
```

### 2.2 `src/constants/theme.ts`

This is where the green color scheme lives. Every component references these tokens.

```typescript
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  primary: "#16A34A",
  primaryLight: "#DCFCE7",
  primaryDark: "#15803D",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  accent: "#FBBF24",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  shadow: "rgba(15, 23, 42, 0.06)",
};

export const darkColors: ThemeColors = {
  primary: "#22C55E",
  primaryLight: "#14532D",
  primaryDark: "#4ADE80",
  background: "#0F172A",
  surface: "#1E293B",
  surfaceElevated: "#334155",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  border: "#334155",
  borderLight: "#1E293B",
  accent: "#FBBF24",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
  shadow: "rgba(0, 0, 0, 0.35)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  xxxl: 48,
} as const;

export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 26,
  xxxl: 32,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
```

---

## Phase 3: Utilities

### 3.1 `src/utils/api.ts`

```typescript
import uuid from "react-native-uuid";
import { Job } from "../types/job";

const API_URL = "https://empllo.com/api/v1";

interface ApiJob {
  title?: string;
  mainCategory?: string;
  companyName?: string;
  companyLogo?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  locations?: string[];
  tags?: string[];
  description?: string;
  pubDate?: string;
  expiryDate?: string;
  applicationLink?: string;
  guid?: string;
}

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`);
  }

  const data = await response.json();
  const jobs: ApiJob[] = data.jobs || [];

  return jobs.map((job) => ({
    id: uuid.v4() as string,
    title: job.title || "",
    mainCategory: job.mainCategory || "",
    companyName: job.companyName || "",
    companyLogo: job.companyLogo || "",
    jobType: job.jobType || "",
    workModel: job.workModel || "",
    seniorityLevel: job.seniorityLevel || "",
    minSalary: job.minSalary || 0,
    maxSalary: job.maxSalary || 0,
    currency: job.currency || "USD",
    locations: job.locations || [],
    tags: job.tags || [],
    description: job.description || "",
    pubDate: job.pubDate || "",
    expiryDate: job.expiryDate || "",
    applicationLink: job.applicationLink || "",
    guid: job.guid || (uuid.v4() as string),
  }));
}
```

### 3.2 `src/utils/storage.ts`

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Job } from "../types/job";

const SAVED_JOBS_KEY = "@saved_jobs";
const THEME_KEY = "@theme_preference";

export const StorageService = {
  async getSavedJobs(): Promise<Job[]> {
    try {
      const data = await AsyncStorage.getItem(SAVED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveSavedJobs(jobs: Job[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(jobs));
    } catch {
      // silently fail
    }
  },

  async getThemePreference(): Promise<boolean | null> {
    try {
      const value = await AsyncStorage.getItem(THEME_KEY);
      if (value === null) return null;

      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === "boolean") {
        return parsed;
      }

      await AsyncStorage.removeItem(THEME_KEY);
      return null;
    } catch {
      return null;
    }
  },

  async saveThemePreference(isDarkMode: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    } catch {
      // silently fail
    }
  },
};
```

---

## Phase 4: Contexts

### 4.1 `src/contexts/ThemeContext.tsx`

```tsx
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
```

### 4.2 `src/contexts/JobsContext.tsx`

```tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Job } from "../types/job";
import { fetchJobs } from "../utils/api";
import { StorageService } from "../utils/storage";

interface JobsContextType {
  jobs: Job[];
  savedJobs: Job[];
  isLoading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
  saveJob: (job: Job) => void;
  removeJob: (guid: string) => void;
  removeAllJobs: () => void;
  isJobSaved: (guid: string) => boolean;
  loadSavedJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType>({
  jobs: [],
  savedJobs: [],
  isLoading: true,
  error: null,
  refreshJobs: async () => {},
  saveJob: () => {},
  removeJob: () => {},
  removeAllJobs: () => {},
  isJobSaved: () => false,
  loadSavedJobs: async () => {},
});

export const useJobs = () => useContext(JobsContext);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSavedJobs = useCallback(async () => {
    const saved = await StorageService.getSavedJobs();
    setSavedJobs(saved);
  }, []);

  const refreshJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await fetchJobs();
      setJobs(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshJobs();
    loadSavedJobs();
  }, [refreshJobs, loadSavedJobs]);

  const saveJob = useCallback((job: Job) => {
    setSavedJobs((prev) => {
      const alreadySaved = prev.some((saved) => saved.guid === job.guid);
      if (alreadySaved) return prev;
      const updated = [...prev, job];
      StorageService.saveSavedJobs(updated);
      return updated;
    });
  }, []);

  const removeJob = useCallback((guid: string) => {
    setSavedJobs((prev) => {
      const updated = prev.filter((job) => job.guid !== guid);
      StorageService.saveSavedJobs(updated);
      return updated;
    });
  }, []);

  const removeAllJobs = useCallback(() => {
    setSavedJobs([]);
    StorageService.saveSavedJobs([]);
  }, []);

  const isJobSaved = useCallback(
    (guid: string) => savedJobs.some((job) => job.guid === guid),
    [savedJobs],
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        savedJobs,
        isLoading,
        error,
        refreshJobs,
        saveJob,
        removeJob,
        removeAllJobs,
        isJobSaved,
        loadSavedJobs,
      }}>
      {children}
    </JobsContext.Provider>
  );
};
```

### 4.3 `src/contexts/ToastContext.tsx`

```tsx
import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';
import { Animated, StyleSheet, Text, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';
import { spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type, duration });

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: insets.top + spacing.md,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [insets.top, translateY, opacity]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  }, [translateY, opacity]);

  const insetsRef = useRef(insets);
  insetsRef.current = insets;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -5,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy < 0) {
            translateY.setValue(insetsRef.current.top + spacing.md + gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy < -30) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            hideToast();
          } else {
            Animated.spring(translateY, {
              toValue: insetsRef.current.top + spacing.md,
              useNativeDriver: true,
              friction: 8,
            }).start();
          }
        },
      }),
    [translateY, hideToast],
  );

  const getIconName = (type: ToastType) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getIconColor = (type: ToastType) => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      default: return colors.primary;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.toastContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.borderLight,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Ionicons name={getIconName(toast.type || 'info')} size={24} color={getIconColor(toast.type || 'info')} />
          <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
    gap: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
```

---

## Phase 5: Components

### 5.1 `src/components/ThemeToggle.tsx`

```tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { spacing } from "../constants/theme";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, colors, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}>
      <Ionicons
        name={isDarkMode ? "sunny-outline" : "moon-outline"}
        size={20}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
});

export default ThemeToggle;
```

### 5.2 `src/components/EmptyState.tsx`

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { fontSize, fontWeight, spacing, borderRadius } from "../constants/theme";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrapper}>
        <View style={[styles.outerRing, { borderColor: colors.borderLight }]}>
          <View style={[styles.middleRing, { backgroundColor: colors.primaryLight }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name={icon} size={36} color={colors.primary} />
            </View>
          </View>
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },
  illustrationWrapper: {
    marginBottom: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  middleRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  message: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
});

export default EmptyState;
```

### 5.3 `src/components/SkeletonLoading.tsx`

```tsx
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
```

### 5.4 `src/components/SearchBar/SearchBar.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: borderRadius.full,
      paddingLeft: spacing.sm,
      paddingRight: spacing.md,
      paddingVertical: spacing.xs,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    searchTouchArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    searchIconContainer: {
      padding: spacing.sm,
    },
    text: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
      marginLeft: spacing.xs,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      gap: spacing.xs,
    },
    filterButtonText: {
      color: "#FFFFFF",
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
    },
  });
```

### 5.5 `src/components/SearchBar/SearchBar.tsx`

```tsx
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
```

### 5.6 `src/components/JobCard/JobCard.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.xl,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
      overflow: "hidden",
    },
    cardContent: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: spacing.md,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      marginRight: spacing.md,
    },
    logoFallback: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    logoFallbackText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    headerInfo: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    company: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    bookmarkButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      gap: 6,
    },
    locationText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
      flex: 1,
    },
    descriptionPreview: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    chip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    chipText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      fontWeight: fontWeight.semibold,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingTop: spacing.md,
    },
    footerLeft: {
      flex: 1,
    },
    applyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      alignSelf: "flex-start",
    },
    applyText: {
      color: "#FFFFFF",
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    salaryContainer: {
      alignItems: "flex-end",
    },
    salary: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.5,
    },
    salaryPeriod: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
    },
  });
```

### 5.7 `src/components/JobCard/JobCard.tsx`

```tsx
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { Job } from "../../types/job";
import { createStyles } from "./JobCard.styles";

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onApply }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const saved = isJobSaved(job.guid);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return "Salary not disclosed";
    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n.toString();
    };
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const hasSalaryRange = Boolean(job.minSalary || job.maxSalary);
  const location = job.locations?.length > 0 ? job.locations.join(", ") : null;

  const getDescriptionPreview = (html: string) => {
    if (!html) return null;
    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/^\s*description\s*[:\-]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) return null;

    const sentenceParts = plainText
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentenceParts.length === 0) return null;

    return sentenceParts.slice(0, 2).join(" ");
  };

  const descriptionPreview = getDescriptionPreview(job.description);

  const handleSave = () => {
    if (saved) {
      removeJob(job.guid);
      showToast({ message: "Job removed from saved", type: "info" });
    } else {
      saveJob(job);
      showToast({ message: "Job saved successfully", type: "success" });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          {job.companyLogo ? (
            <Image
              source={{ uri: job.companyLogo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>
                {job.companyName?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.company} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleSave}
            activeOpacity={0.6}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={saved ? colors.primary : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        ) : null}

        {descriptionPreview ? (
          <Text style={styles.descriptionPreview} numberOfLines={4}>
            {descriptionPreview}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {job.jobType ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.jobType}</Text>
            </View>
          ) : null}
          {job.workModel ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.workModel}</Text>
            </View>
          ) : null}
          {job.seniorityLevel ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.seniorityLevel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
              activeOpacity={0.6}>
              <Text style={styles.applyText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
          {salary ? (
            <View style={styles.salaryContainer}>
              <Text style={styles.salary}>{salary}</Text>
              {hasSalaryRange ? <Text style={styles.salaryPeriod}>/month</Text> : null}
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;
```

---

## Phase 6: Navigation

### 6.1 `src/navigation/props.ts`

```typescript
import { NavigationProp } from "@react-navigation/native";
import { Job } from "../types/job";

export type RootStackParamList = {
  Home: undefined;
  Find: undefined;
  JobDetails: {
    job: Job;
    fromSavedJobs?: boolean;
  };
};

export interface Props {
  navigation: NavigationProp<any>;
}
```

### 6.2 `src/navigation/AppNavigator.tsx`

```tsx
import React, { useMemo } from "react";
import { Platform, TouchableOpacity } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useJobs } from "../contexts/JobsContext";
import { fontSize } from "../constants/theme";
import JobFinderScreen from "../screens/JobFinder/JobFinderScreen";
import SavedJobsScreen from "../screens/SavedJobs/SavedJobsScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import JobDetailsScreen from "../screens/JobDetails/JobDetailsScreen";
import ApplicationFormScreen from "../screens/ApplicationForm/ApplicationFormScreen";
import { Job } from "../types/job";

export type JobsStackParamList = {
  Find: undefined;
  Search: undefined;
  JobDetails: { job: Job; fromSavedJobs?: boolean };
  ApplicationForm: { job: Job; fromSavedJobs?: boolean };
};

export type SavedStackParamList = {
  SavedJobs: undefined;
  JobDetails: { job: Job; fromSavedJobs?: boolean };
  ApplicationForm: { job: Job; fromSavedJobs?: boolean };
};

const JobsStack = createNativeStackNavigator<JobsStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
const Tab = createBottomTabNavigator();

const CloseButton = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8 }}>
      <Ionicons name="close" size={24} color={colors.text} />
    </TouchableOpacity>
  );
};

function JobsStackNavigator() {
  const { colors } = useTheme();

  return (
    <JobsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: fontSize.lg,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <JobsStack.Screen
        name="Find"
        component={JobFinderScreen}
        options={{ headerShown: false }}
      />
      <JobsStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search", animation: "none" }}
      />
      <JobsStack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ title: "Job Details" }}
      />
      <JobsStack.Screen
        name="ApplicationForm"
        component={ApplicationFormScreen}
        options={{
          presentation: "modal",
          title: "Apply",
          headerLeft: () => <CloseButton />,
        }}
      />
    </JobsStack.Navigator>
  );
}

function SavedStackNavigator() {
  const { colors } = useTheme();

  return (
    <SavedStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: fontSize.lg,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <SavedStack.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{ headerShown: false }}
      />
      <SavedStack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ title: "Job Details" }}
      />
      <SavedStack.Screen
        name="ApplicationForm"
        component={ApplicationFormScreen}
        options={{
          presentation: "modal",
          title: "Apply",
          headerLeft: () => <CloseButton />,
        }}
      />
    </SavedStack.Navigator>
  );
}

const AppNavigator = () => {
  const { isDarkMode, colors } = useTheme();
  const { savedJobs } = useJobs();

  const navigationTheme = useMemo(
    () => ({
      ...(isDarkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
        notification: colors.primary,
      },
    }),
    [isDarkMode, colors],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: Platform.OS === "ios" ? 88 : 70,
            paddingBottom: Platform.OS === "ios" ? 28 : 12,
            paddingTop: 8,
            elevation: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
          },
        }}>
        <Tab.Screen
          name="JobsTab"
          component={JobsStackNavigator}
          options={{
            tabBarLabel: "Jobs",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SavedTab"
          component={SavedStackNavigator}
          options={{
            tabBarLabel: "Saved",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark-outline" size={size} color={color} />
            ),
            tabBarBadge: savedJobs.length > 0 ? savedJobs.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.primary,
              color: "#FFFFFF",
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

## Phase 7: Screens

### 7.1 Job Finder Screen

#### `src/screens/JobFinder/JobFinderScreen.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors, topInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    stickySearchContainer: {
      backgroundColor: colors.primary,
      paddingTop: topInset + spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    headerTopSpacer: {
      width: 36,
      height: 36,
    },
    themeToggleContainer: {
      alignItems: "flex-end",
    },
    headerGreeting: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      alignItems: "center",
    },
    greeting: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
      letterSpacing: -0.5,
      marginBottom: 4,
      textAlign: "center",
    },
    subtitle: {
      fontSize: fontSize.md,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: fontWeight.medium,
      textAlign: "center",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.3,
    },
    jobCount: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    listContent: {
      paddingBottom: spacing.xxxl,
    },
    errorContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.lg,
    },
    retryText: {
      color: "#FFFFFF",
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
  });
```

#### `src/screens/JobFinder/JobFinderScreen.tsx`

```tsx
import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useScrollToTop } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import JobCard from "../../components/JobCard/JobCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import SkeletonLoading from "../../components/SkeletonLoading";
import EmptyState from "../../components/EmptyState";
import ThemeToggle from "../../components/ThemeToggle";
import { Job } from "../../types/job";
import { createStyles } from "./JobFinderScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "Find">;

type JobFilter = "all" | "remote" | "onsite" | "hybrid";

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { jobs, isLoading, error, refreshJobs } = useJobs();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.top), [colors, insets.top]);
  const listRef = useRef<FlatList<Job>>(null);
  const [activeFilter, setActiveFilter] = useState<JobFilter>("all");

  useScrollToTop(listRef);

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    const unsubscribe = (parent as any).addListener("tabPress", (event: any) => {
      const targetKey = event.target;
      const targetRoute = parent.getState().routes.find((route) => route.key === targetKey);

      if (targetRoute?.name === "JobsTab") {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: false });
    },
    [navigation],
  );

  const handleApply = useCallback(
    (job: Job) => {
      navigation.navigate("ApplicationForm", { job, fromSavedJobs: false });
    },
    [navigation],
  );

  const handleSearch = useCallback(() => {
    navigation.navigate("Search");
  }, [navigation]);

  const filterLabelMap: Record<JobFilter, string> = {
    all: "All",
    remote: "Remote",
    onsite: "Onsite",
    hybrid: "Hybrid",
  };

  const normalizeWorkModel = (value: string) => value.toLowerCase().replace(/\s|-/g, "");

  const filteredJobs = useMemo(() => {
    if (activeFilter === "all") return jobs;

    return jobs.filter((job) => {
      const wm = normalizeWorkModel(job.workModel || "");
      if (activeFilter === "remote") return wm.includes("remote");
      if (activeFilter === "onsite") return wm.includes("onsite") || wm.includes("office");
      if (activeFilter === "hybrid") return wm.includes("hybrid");
      return true;
    });
  }, [jobs, activeFilter]);

  const handleFilterPress = useCallback(() => {
    setActiveFilter((prev) => {
      if (prev === "all") return "remote";
      if (prev === "remote") return "onsite";
      if (prev === "onsite") return "hybrid";
      return "all";
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard
        job={item}
        onPress={() => handleJobPress(item)}
        onApply={() => handleApply(item)}
      />
    ),
    [handleJobPress, handleApply],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderHeader = () => (
    <>
      <View style={{ position: 'absolute', top: -1000, left: 0, right: 0, height: 1000, backgroundColor: colors.primary }} />
      <View style={styles.headerGreeting}>
        <Text style={styles.greeting}>Find Your Dream Job Today.</Text>
        <Text style={styles.subtitle}>Explore thousands of opportunities tailored for you.</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended Jobs</Text>
        <Text style={styles.jobCount}>
          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
        </Text>
      </View>
    </>
  );

  if (isLoading && jobs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.stickySearchContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTopSpacer} />
            <View style={styles.themeToggleContainer}>
              <ThemeToggle />
            </View>
          </View>
          <SearchBar
            onPress={handleSearch}
            onFilterPress={handleFilterPress}
            filterLabel={filterLabelMap[activeFilter]}
          />
        </View>
        {renderHeader()}
        <SkeletonLoading />
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.stickySearchContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTopSpacer} />
            <View style={styles.themeToggleContainer}>
              <ThemeToggle />
            </View>
          </View>
          <SearchBar
            onPress={handleSearch}
            onFilterPress={handleFilterPress}
            filterLabel={filterLabelMap[activeFilter]}
          />
        </View>
        <View style={styles.errorContent}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Something Went Wrong"
            message={error || "Failed to load jobs. Please check your connection and try again."}
          />
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshJobs}
            activeOpacity={0.7}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.stickySearchContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTopSpacer} />
          <View style={styles.themeToggleContainer}>
            <ThemeToggle />
          </View>
        </View>
        <SearchBar
          onPress={handleSearch}
          onFilterPress={handleFilterPress}
          filterLabel={filterLabelMap[activeFilter]}
        />
      </View>

      <FlatList
        ref={listRef}
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title="No Jobs Found"
            message="Pull down to refresh and check for new listings."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshJobs}
            tintColor="#FFFFFF"
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default JobFinderScreen;
```

### 7.2 Saved Jobs Screen

#### `src/screens/SavedJobs/SavedJobsScreen.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors, topInset: number = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingTop: topInset + spacing.xl,
      paddingBottom: spacing.xl,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      marginBottom: spacing.md,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    deleteAllButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: fontSize.md,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: fontWeight.medium,
    },
    listContent: {
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxxl,
    },
    savedCard: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.xl,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
      overflow: "hidden",
    },
    cardContent: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: spacing.md,
    },
    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      marginRight: spacing.md,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
    },
    logoFallback: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    logoFallbackText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    headerInfo: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    company: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    removeButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    chip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    chipText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      fontWeight: fontWeight.semibold,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      paddingTop: spacing.md,
    },
    footerLeft: {
      flex: 1,
    },
    applyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      alignSelf: "flex-start",
    },
    applyText: {
      color: "#FFFFFF",
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
    },
    salaryContainer: {
      alignItems: "flex-end",
    },
    salary: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.5,
    },
    salaryPeriod: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
    },
  });
```

#### `src/screens/SavedJobs/SavedJobsScreen.tsx`

```tsx
import React, { useMemo, useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { SavedStackParamList } from "../../navigation/AppNavigator";
import EmptyState from "../../components/EmptyState";
import { Job } from "../../types/job";
import { createStyles } from "./SavedJobsScreen.styles";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<SavedStackParamList, "SavedJobs">;

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { savedJobs, removeJob, removeAllJobs, loadSavedJobs } = useJobs();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.top), [colors, insets.top]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: true });
    },
    [navigation],
  );

  const handleApply = useCallback(
    (job: Job) => {
      navigation.navigate("ApplicationForm", { job, fromSavedJobs: true });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (guid: string) => {
      Alert.alert(
        "Remove Job",
        "Are you sure you want to remove this saved job?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              removeJob(guid);
              showToast({ message: "Job removed from saved", type: "info" });
            },
          },
        ],
      );
    },
    [removeJob, showToast],
  );

  const handleDeleteAll = useCallback(() => {
    Alert.alert(
      "Delete All Saved Jobs",
      "Are you sure you want to remove all saved jobs? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            removeAllJobs();
            showToast({ message: "All saved jobs removed", type: "info" });
          },
        },
      ],
    );
  }, [removeAllJobs, showToast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadSavedJobs();
    setIsRefreshing(false);
  }, [loadSavedJobs]);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n.toString();
    };
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const renderItem = useCallback(
    ({ item }: { item: Job }) => {
      const salary = formatSalary(item.minSalary, item.maxSalary, item.currency);
      return (
        <TouchableOpacity
          style={styles.savedCard}
          onPress={() => handleJobPress(item)}
          activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              {item.companyLogo ? (
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: item.companyLogo }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.logoFallback}>
                  <Text style={styles.logoFallbackText}>
                    {item.companyName?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}
              <View style={styles.headerInfo}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.company} numberOfLines={1}>
                  {item.companyName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.guid)}
                activeOpacity={0.6}>
                <Ionicons name="trash" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              {item.jobType ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item.jobType}</Text>
                </View>
              ) : null}
              {item.workModel ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item.workModel}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApply(item)}
                  activeOpacity={0.6}>
                  <Text style={styles.applyText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
              {salary ? (
                <View style={styles.salaryContainer}>
                  <Text style={styles.salary}>{salary}</Text>
                  <Text style={styles.salaryPeriod}>/month</Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, colors, handleJobPress, handleApply, handleRemove],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderHeader = () => (
    <>
      <View style={{ position: 'absolute', top: -1000, left: 0, right: 0, height: 1000, backgroundColor: colors.primary }} />
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Saved Jobs</Text>
            <Text style={styles.headerSubtitle}>
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </Text>
          </View>
          {savedJobs.length > 0 ? (
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={handleDeleteAll}
              activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          savedJobs.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No Saved Jobs"
            message="Jobs you save will appear here. Start browsing and save jobs you're interested in."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SavedJobsScreen;
```

### 7.3 Job Details Screen

#### `src/screens/JobDetails/JobDetailsScreen.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 130,
    },
    heroSection: {
      alignItems: "center",
      paddingVertical: spacing.xxxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.surfaceElevated,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
      marginBottom: spacing.md,
    },
    logoWrapper: {
      width: 96,
      height: 96,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      marginBottom: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    logoLarge: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.lg,
    },
    logoFallbackLarge: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    logoFallbackText: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    jobTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.sm,
      letterSpacing: -0.5,
    },
    companyName: {
      fontSize: fontSize.lg,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
      textAlign: "center",
      marginBottom: spacing.lg,
    },
    heroMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
    },
    heroMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    heroMetaText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    section: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.lg,
      letterSpacing: -0.3,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    detailCard: {
      width: "47%",
      backgroundColor: colors.surfaceElevated,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    detailIconContainer: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    detailLabel: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: fontSize.md,
      color: colors.text,
      fontWeight: fontWeight.bold,
    },
    salaryValue: {
      fontSize: fontSize.md,
      color: colors.primary,
      fontWeight: fontWeight.bold,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    tagText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.semibold,
    },
    descriptionContainer: {
      backgroundColor: colors.surfaceElevated,
      padding: spacing.xl,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    descriptionContainerSecondary: {
      backgroundColor: colors.surfaceElevated,
      padding: spacing.xl,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.borderLight,
      marginTop: spacing.md,
    },
    descriptionText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: 26,
    },
    requirementsTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.md,
    },
    requirementRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    requirementText: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xl,
      backgroundColor: colors.surfaceElevated,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      gap: spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 10,
    },
    saveButton: {
      width: 90,
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      gap: spacing.xs,
    },
    saveButtonSaved: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    saveButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
    },
    saveButtonTextSaved: {
      color: colors.primary,
    },
    applyButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 56,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary,
      gap: spacing.sm,
    },
    applyButtonText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
    },
  });
```

#### `src/screens/JobDetails/JobDetailsScreen.tsx`

```tsx
import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import { createStyles } from "./JobDetailsScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "JobDetails">;

const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params;
  const fromSavedJobs = route.params.fromSavedJobs === true;
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const saved = isJobSaved(job.guid);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n.toLocaleString();
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const location = job.locations?.length > 0 ? job.locations.join(", ") : null;

  const handleSave = () => {
    if (saved) {
      removeJob(job.guid);
      showToast({ message: "Job removed from saved", type: "info" });
    } else {
      saveJob(job);
      showToast({ message: "Job saved successfully", type: "success" });
    }
  };

  const handleApply = () => {
    navigation.navigate("ApplicationForm", { job, fromSavedJobs });
  };

  const stripHtml = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li>/gi, "  \u2022 ")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const parsedDescription = job.description ? stripHtml(job.description) : "";

  const splitDescriptionAndRequirements = (content: string) => {
    if (!content) {
      return {
        description: "No detailed description provided.",
        requirements: [] as string[],
      };
    }

    const marker = content.match(/(?:^|\n)(requirements?|qualifications?)[:\n]/i);

    let descriptionSection = content;
    let requirementsSection = "";

    if (marker && marker.index !== undefined) {
      descriptionSection = content.slice(0, marker.index).trim();
      requirementsSection = content
        .slice(marker.index)
        .replace(/^(\s)*(requirements?|qualifications?)[:\s]*/i, "")
        .trim();
    }

    descriptionSection = descriptionSection.replace(/^\s*description\s*[:\-]?\s*/i, "").trim();

    const parsedRequirements = requirementsSection
      .split(/\n|\u2022|-\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 2);

    return {
      description: descriptionSection || "No detailed description provided.",
      requirements: parsedRequirements,
    };
  };

  const { description, requirements } = splitDescriptionAndRequirements(parsedDescription);
  const requirementItems = requirements.length > 0 ? requirements : job.tags;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.logoLarge}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoFallbackLarge}>
                <Text style={styles.logoFallbackText}>
                  {job.companyName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.companyName}</Text>

          <View style={styles.heroMeta}>
            {location ? (
              <View style={styles.heroMetaItem}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={styles.heroMetaText}>{location}</Text>
              </View>
            ) : null}
            {job.mainCategory ? (
              <View style={styles.heroMetaItem}>
                <Ionicons name="briefcase" size={16} color={colors.primary} />
                <Text style={styles.heroMetaText}>{job.mainCategory}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Overview</Text>
          <View style={styles.detailsGrid}>
            {salary ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="cash" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Salary</Text>
                <Text style={styles.salaryValue}>{salary}</Text>
              </View>
            ) : null}
            {job.jobType ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="time" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Job Type</Text>
                <Text style={styles.detailValue}>{job.jobType}</Text>
              </View>
            ) : null}
            {job.workModel ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="laptop" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Work Model</Text>
                <Text style={styles.detailValue}>{job.workModel}</Text>
              </View>
            ) : null}
            {job.seniorityLevel ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="trophy" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Seniority</Text>
                <Text style={styles.detailValue}>{job.seniorityLevel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {job.tags?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Requirements</Text>
            <View style={styles.tagsContainer}>
              {job.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Role</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.requirementsTitle}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.descriptionContainerSecondary}>
            <Text style={styles.requirementsTitle}>Requirements</Text>
            {requirementItems.length > 0 ? (
              requirementItems.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.requirementRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.requirementText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.descriptionText}>No explicit requirements listed.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonSaved]}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={20}
            color={saved ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.saveButtonText, saved && styles.saveButtonTextSaved]}>
            {saved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>Apply for this job</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobDetailsScreen;
```

### 7.4 Search Screen

#### `src/screens/Search/SearchScreen.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.md,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text,
      paddingVertical: spacing.md,
      fontWeight: fontWeight.regular,
    },
    clearButton: {
      padding: spacing.sm,
    },
    resultInfo: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    resultText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    listContent: {
      paddingBottom: spacing.xxxl,
    },
  });
```

#### `src/screens/Search/SearchScreen.tsx`

```tsx
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import JobCard from "../../components/JobCard/JobCard";
import EmptyState from "../../components/EmptyState";
import { Job } from "../../types/job";
import { createStyles } from "./SearchScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "Search">;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { jobs } = useJobs();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredJobs = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.mainCategory.toLowerCase().includes(q) ||
        job.locations.some((loc) => loc.toLowerCase().includes(q)) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [jobs, debouncedQuery]);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: false });
    },
    [navigation],
  );

  const handleApply = useCallback(
    (job: Job) => {
      navigation.navigate("ApplicationForm", { job, fromSavedJobs: false });
    },
    [navigation],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard
        job={item}
        onPress={() => handleJobPress(item)}
        onApply={() => handleApply(item)}
      />
    ),
    [handleJobPress, handleApply],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textTertiary} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search jobs, companies, locations..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.6}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {debouncedQuery.trim().length > 0 && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "result" : "results"} found
          </Text>
        </View>
      )}

      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          filteredJobs.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          debouncedQuery.trim().length > 0 ? (
            <EmptyState
              icon="search-outline"
              title="No Results"
              message={`No jobs matching "${debouncedQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="Search Jobs"
              message="Type to search across job titles, companies, locations, and tags."
            />
          )
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchScreen;
```

### 7.5 Application Form Screen

#### `src/screens/ApplicationForm/ApplicationFormScreen.styles.ts`

```typescript
import { StyleSheet } from "react-native";
import {
  ThemeColors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "../../constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: spacing.xxxl * 2,
    },
    headerSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      backgroundColor: colors.surfaceElevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    headerTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    jobInfo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surfaceElevated,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
      gap: spacing.md,
    },
    jobLogoContainer: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    jobLogo: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
    },
    jobLogoFallback: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    jobLogoText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
    },
    jobInfoContent: {
      flex: 1,
      justifyContent: "center",
    },
    jobTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.text,
      letterSpacing: -0.3,
      marginBottom: 4,
    },
    jobCompany: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    formSection: {
      padding: spacing.lg,
      marginTop: spacing.md,
    },
    fieldContainer: {
      marginBottom: spacing.xl,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.sm,
      letterSpacing: 0.2,
    },
    required: {
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 4,
      fontSize: fontSize.md,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.borderLight,
    },
    inputFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    inputError: {
      borderColor: colors.error,
      backgroundColor: colors.surface,
    },
    textArea: {
      minHeight: 140,
      textAlignVertical: "top",
      paddingTop: spacing.lg,
    },
    errorText: {
      fontSize: fontSize.xs,
      color: colors.error,
      marginTop: spacing.xs,
      fontWeight: fontWeight.medium,
    },
    charCountContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: spacing.xs,
    },
    charCount: {
      fontSize: fontSize.xs,
      color: colors.textTertiary,
      fontWeight: fontWeight.medium,
    },
    charCountError: {
      color: colors.error,
    },
    submitButton: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingVertical: 18,
      marginHorizontal: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.lg,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
      gap: spacing.sm,
    },
    submitButtonDisabled: {
      opacity: 0.6,
      shadowOpacity: 0,
      elevation: 0,
    },
    submitButtonText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.7)",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: borderRadius.xl,
      padding: spacing.xxxl,
      alignItems: "center",
      width: "100%",
      maxWidth: 340,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    successIconContainer: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xl,
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    modalTitle: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.text,
      marginBottom: spacing.md,
      textAlign: "center",
      letterSpacing: -0.5,
    },
    modalMessage: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.xxxl,
      lineHeight: 24,
    },
    boldText: {
      fontWeight: fontWeight.bold,
      color: colors.text,
    },
    modalButton: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.xxxl,
      alignItems: "center",
      width: "100%",
    },
    modalButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: "#FFFFFF",
    },
  });
```

#### `src/screens/ApplicationForm/ApplicationFormScreen.tsx`

```tsx
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import { createStyles } from "./ApplicationFormScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "ApplicationForm">;

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  whyHireYou?: string;
}

interface FieldTouched {
  name: boolean;
  email: boolean;
  contactNumber: boolean;
  whyHireYou: boolean;
}

const ApplicationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params;
  const fromSavedJobs = route.params.fromSavedJobs === true;
  const { colors } = useTheme();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    contactNumber: "",
    whyHireYou: "",
  });

  const [touched, setTouched] = useState<FieldTouched>({
    name: false,
    email: false,
    contactNumber: false,
    whyHireYou: false,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) {
      errors.name = "Name must contain only letters and spaces";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!data.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^09\d{9}$/.test(data.contactNumber.trim())) {
      errors.contactNumber = "Must start with 09 and be exactly 11 digits";
    }

    if (!data.whyHireYou.trim()) {
      errors.whyHireYou = "This field is required";
    } else if (data.whyHireYou.trim().length < 50) {
      errors.whyHireYou = `Minimum 50 characters (${data.whyHireYou.trim().length}/50)`;
    }

    return errors;
  }, []);

  const errors = useMemo(() => validate(formData), [formData, validate]);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocusedField(null);
  }, []);

  const handleFocus = useCallback((field: string) => {
    setFocusedField(field);
  }, []);

  const handleSubmit = useCallback(async () => {
    setTouched({
      name: true,
      email: true,
      contactNumber: true,
      whyHireYou: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowSuccess(true);
    showToast({
      message: "Application submitted successfully",
      type: "success",
    });
  }, [isValid, showToast]);

  const handleSuccessDismiss = useCallback(() => {
    setShowSuccess(false);
    setFormData({ name: "", email: "", contactNumber: "", whyHireYou: "" });
    setTouched({
      name: false,
      email: false,
      contactNumber: false,
      whyHireYou: false,
    });

    if (fromSavedJobs) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Find" }],
        }),
      );
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate("JobsTab");
      }
    } else {
      navigation.goBack();
    }
  }, [fromSavedJobs, navigation]);

  const getInputStyle = (field: keyof FormData) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    touched[field] && errors[field] && styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Apply for this role</Text>
          <Text style={styles.headerSubtitle}>Please fill out the form below to submit your application.</Text>
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.jobLogoContainer}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.jobLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.jobLogoFallback}>
                <Text style={styles.jobLogoText}>
                  {job.companyName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.jobInfoContent}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.jobCompany} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("name")}
              placeholder="e.g. Jane Doe"
              placeholderTextColor={colors.textTertiary}
              value={formData.name}
              onChangeText={(v) => handleChange("name", v)}
              onBlur={() => handleBlur("name")}
              onFocus={() => handleFocus("name")}
              autoCapitalize="words"
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("email")}
              placeholder="e.g. jane@example.com"
              placeholderTextColor={colors.textTertiary}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              onBlur={() => handleBlur("email")}
              onFocus={() => handleFocus("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.email && errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Contact Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("contactNumber")}
              placeholder="09XXXXXXXXX"
              placeholderTextColor={colors.textTertiary}
              value={formData.contactNumber}
              onChangeText={(v) => handleChange("contactNumber", v)}
              onBlur={() => handleBlur("contactNumber")}
              onFocus={() => handleFocus("contactNumber")}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {touched.contactNumber && errors.contactNumber ? (
              <Text style={styles.errorText}>{errors.contactNumber}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Why should we hire you? <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[...getInputStyle("whyHireYou"), styles.textArea]}
              placeholder="Tell us about your relevant experience and why you're a great fit for this role..."
              placeholderTextColor={colors.textTertiary}
              value={formData.whyHireYou}
              onChangeText={(v) => handleChange("whyHireYou", v)}
              onBlur={() => handleBlur("whyHireYou")}
              onFocus={() => handleFocus("whyHireYou")}
              multiline
              numberOfLines={6}
            />
            <View style={styles.charCountContainer}>
              <Text
                style={[
                  styles.charCount,
                  formData.whyHireYou.trim().length < 50 &&
                    touched.whyHireYou &&
                    styles.charCountError,
                ]}>
                {formData.whyHireYou.trim().length}/50 characters minimum
              </Text>
            </View>
            {touched.whyHireYou && errors.whyHireYou ? (
              <Text style={styles.errorText}>{errors.whyHireYou}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isValid || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Text>
          {!isSubmitting && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>Application Sent!</Text>
            <Text style={styles.modalMessage}>
              Your application for <Text style={styles.boldText}>{job.title}</Text> at <Text style={styles.boldText}>{job.companyName}</Text> has been submitted successfully.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessDismiss}
              activeOpacity={0.8}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ApplicationFormScreen;
```

---

## Phase 8: App Entry Point

### 8.1 `App.tsx`

```tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { JobsProvider } from "./src/contexts/JobsContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import AppNavigator from "./src/navigation/AppNavigator";

function AppContent() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <AppNavigator />
    </>
  );
}

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
```

---

## Phase 9: Verification Checklist

After building, run these checks:

### TypeScript

```bash
npx tsc --noEmit
```

Should output zero errors.

### Run the App

```bash
npx expo start --clear
```

### Feature Testing

- [ ] Jobs load from API on launch
- [ ] Each job has a unique UUID assigned
- [ ] Search bar navigates to search screen
- [ ] Search filters across title, company, category, locations, tags
- [ ] Search debounces at 300ms
- [ ] Filter button cycles All/Remote/Onsite/Hybrid
- [ ] Job cards display title, company, logo, location, salary, chips
- [ ] Tapping a job card opens Job Details
- [ ] Save button toggles to Saved state (no duplicates)
- [ ] Saved tab shows badge count
- [ ] Saved Jobs screen lists all saved jobs
- [ ] Remove button shows confirmation dialog
- [ ] Delete All button shows confirmation dialog
- [ ] Apply button opens Application Form as modal
- [ ] Form validates name (alpha + spaces only)
- [ ] Form validates email (proper format)
- [ ] Form validates contact (09XXXXXXXXX, 11 digits)
- [ ] Form validates why hire you (min 50 chars)
- [ ] Real-time validation on blur
- [ ] Submit button disables during submission
- [ ] Success modal shows job title and company
- [ ] Success modal "Okay" button text (not "Back to Jobs")
- [ ] From Saved Jobs: "Okay" redirects to Job Finder tab
- [ ] From Jobs tab: "Okay" dismisses modal
- [ ] Form clears after submission
- [ ] Dark/Light mode toggle works
- [ ] Theme persists across app restarts
- [ ] Saved jobs persist across app restarts
- [ ] Pull-to-refresh on Job Finder screen
- [ ] Pull-to-refresh on Saved Jobs screen
- [ ] Toast notifications appear and are swipe-dismissible
- [ ] Empty states display correctly
- [ ] Error state displays with retry button
- [ ] Skeleton loading appears during initial load
- [ ] All interactive elements have visual feedback
- [ ] All colors are green/white (no blue remnants)
- [ ] No gradients anywhere
- [ ] No emojis anywhere

---

## Quick Reference: Color Mapping (v1 to v2)

| Token       | v1 (Blue)  | v2 (Green) |
| ----------- | ---------- | ---------- |
| primary     | `#2563EB`  | `#16A34A`  |
| primaryLight| `#DBEAFE`  | `#DCFCE7`  |
| primaryDark | `#1E40AF`  | `#15803D`  |
| dark primary| `#3B82F6`  | `#22C55E`  |
| dark pLight | `#1E3A8A`  | `#14532D`  |
| dark pDark  | `#60A5FA`  | `#4ADE80`  |

All other tokens (background, surface, text, border, accent, success, error, warning) remain identical between v1 and v2.