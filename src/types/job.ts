
export interface Job {
  lastUpdatedTime: string;
  jobId: string;
  userId: string;
  exportSetName: string | null;
  product: string;
  category: string;
  subCategory: string;
  clientId: string;
  jobType: string;
  jobStatus: "Pending" | "Running" | "Completed" | "Failed";
  jobRegistrationTime: string;
  jobPickUpTime: string | null;
  jobEndTime: string | null;
  totalTimeInMinutes: number;
  hostnames: string[];
  applications: string[];
  services: string[];
  podNames: string[];
  isStartMessageLoaded: boolean;
  isProgressMessageLoaded: boolean;
  isSummaryMessageLoaded: boolean;
  environment: string;
}

export interface JobStatusCounts {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  total: number;
}
