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