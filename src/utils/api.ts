import uuid from "react-native-uuid";
import { Job } from "../types/job";

const API_URL = "https://empllo.com/api/v1";

interface ApiResponse {
  jobs?: unknown;
}

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
  pubDate?: string | number;
  expiryDate?: string | number;
  applicationLink?: string;
  guid?: string;
}

const normalizeText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const normalizeNumber = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const normalizeDateValue = (value: unknown): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";

const getJobIdentity = (job: ApiJob): string => {
  const guid = normalizeText(job.guid);

  if (guid) {
    return guid;
  }

  return uuid.v4() as string;
};

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`);
  }

  const data = (await response.json()) as ApiResponse;

  if (!Array.isArray(data.jobs)) {
    throw new Error("Invalid jobs response");
  }

  const jobs = data.jobs as ApiJob[];

  return jobs.map((job) => {
    const identity = getJobIdentity(job);

    return {
      id: identity,
      title: normalizeText(job.title),
      mainCategory: normalizeText(job.mainCategory),
      companyName: normalizeText(job.companyName),
      companyLogo: normalizeText(job.companyLogo),
      jobType: normalizeText(job.jobType),
      workModel: normalizeText(job.workModel),
      seniorityLevel: normalizeText(job.seniorityLevel),
      minSalary: normalizeNumber(job.minSalary),
      maxSalary: normalizeNumber(job.maxSalary),
      currency: normalizeText(job.currency) || "USD",
      locations: normalizeStringArray(job.locations),
      tags: normalizeStringArray(job.tags),
      description: normalizeText(job.description),
      pubDate: normalizeDateValue(job.pubDate),
      expiryDate: normalizeDateValue(job.expiryDate),
      applicationLink: normalizeText(job.applicationLink),
      guid: identity,
    };
  });
}