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