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