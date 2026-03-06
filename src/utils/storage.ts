import AsyncStorage from "@react-native-async-storage/async-storage";
import { Job } from "../types/job";

const SAVED_JOBS_KEY = "@saved_jobs";
const THEME_KEY = "@theme_preference";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isStoredJob = (value: unknown): value is Job => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const job = value as Partial<Job>;

  return (
    typeof job.id === "string" &&
    typeof job.guid === "string" &&
    typeof job.title === "string" &&
    typeof job.mainCategory === "string" &&
    typeof job.companyName === "string" &&
    typeof job.companyLogo === "string" &&
    typeof job.jobType === "string" &&
    typeof job.workModel === "string" &&
    typeof job.seniorityLevel === "string" &&
    typeof job.minSalary === "number" &&
    typeof job.maxSalary === "number" &&
    typeof job.currency === "string" &&
    isStringArray(job.locations) &&
    isStringArray(job.tags) &&
    typeof job.description === "string" &&
    typeof job.pubDate === "string" &&
    typeof job.expiryDate === "string" &&
    typeof job.applicationLink === "string"
  );
};

const dedupeSavedJobs = (jobs: Job[]): Job[] => {
  const seen = new Set<string>();

  return jobs.filter((job) => {
    const identity = job.guid || job.id;

    if (!identity || seen.has(identity)) {
      return false;
    }

    seen.add(identity);
    return true;
  });
};

export const StorageService = {
  async getSavedJobs(): Promise<Job[]> {
    try {
      const data = await AsyncStorage.getItem(SAVED_JOBS_KEY);

      if (!data) {
        return [];
      }

      const parsed: unknown = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        await AsyncStorage.removeItem(SAVED_JOBS_KEY);
        return [];
      }

      return dedupeSavedJobs(parsed.filter(isStoredJob));
    } catch {
      return [];
    }
  },

  async saveSavedJobs(jobs: Job[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        SAVED_JOBS_KEY,
        JSON.stringify(dedupeSavedJobs(jobs)),
      );
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