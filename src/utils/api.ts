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