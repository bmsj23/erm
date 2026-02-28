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