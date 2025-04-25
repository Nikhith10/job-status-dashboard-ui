
import { Job, JobStatusCounts } from "@/types/job";

// Function to generate a random timestamp within the last 7 days
export const generateRandomDate = (daysAgo = 7): string => {
  const date = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  date.setDate(date.getDate() - randomDays);
  
  // Random hours and minutes
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  
  return date.toISOString();
};

// Function to generate mock job data
export const generateMockJobs = (count = 50): Job[] => {
  const jobTypes = ["Export", "Processing", "Calculation", "Report", "Analysis"];
  const jobStatuses = ["Pending", "Running", "Completed", "Failed"];
  const products = ["DataSync", "CloudManager", "AnalyticsEngine", "SecurityTool"];
  const categories = ["Batch", "Realtime", "Scheduled"];
  const subCategories = ["High Priority", "Low Priority", "Standard"];
  const environments = ["Production", "Development", "Testing", "Staging"];
  
  return Array.from({ length: count }, (_, i) => {
    const jobStatus = jobStatuses[Math.floor(Math.random() * jobStatuses.length)] as Job["jobStatus"];
    const registrationTime = generateRandomDate();
    const pickUpTime = jobStatus !== "Pending" ? generateRandomDate(6) : null;
    const endTime = jobStatus === "Completed" || jobStatus === "Failed" ? generateRandomDate(5) : null;
    
    return {
      lastUpdatedTime: generateRandomDate(1),
      jobId: `JOB-${1000 + i}`,
      userId: `user-${100 + Math.floor(Math.random() * 10)}`,
      exportSetName: Math.random() > 0.3 ? `Export-${200 + Math.floor(Math.random() * 50)}` : null,
      product: products[Math.floor(Math.random() * products.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      subCategory: subCategories[Math.floor(Math.random() * subCategories.length)],
      clientId: `client-${50 + Math.floor(Math.random() * 20)}`,
      jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      jobStatus,
      jobRegistrationTime: registrationTime,
      jobPickUpTime: pickUpTime,
      jobEndTime: endTime,
      totalTimeInMinutes: Math.floor(Math.random() * 120),
      hostnames: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, 
        (_, i) => `host-${Math.floor(Math.random() * 100)}`),
      applications: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, 
        (_, i) => `app-${Math.floor(Math.random() * 50)}`),
      services: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, 
        (_, i) => `service-${Math.floor(Math.random() * 30)}`),
      podNames: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
        (_, i) => `pod-${Math.floor(Math.random() * 40)}`),
      isStartMessageLoaded: Math.random() > 0.2,
      isProgressMessageLoaded: Math.random() > 0.3,
      isSummaryMessageLoaded: Math.random() > 0.4,
      environment: environments[Math.floor(Math.random() * environments.length)],
    };
  });
};

// Function to get job status counts
export const getJobStatusCounts = (jobs: Job[]): JobStatusCounts => {
  const counts: JobStatusCounts = {
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    total: jobs.length,
  };

  jobs.forEach((job) => {
    switch (job.jobStatus) {
      case "Pending":
        counts.pending++;
        break;
      case "Running":
        counts.running++;
        break;
      case "Completed":
        counts.completed++;
        break;
      case "Failed":
        counts.failed++;
        break;
    }
  });

  return counts;
};

// Function to format date/time for display
export const formatDateTime = (dateStr: string | null): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Function to calculate job duration
export const calculateDuration = (start: string, end: string | null): string => {
  if (!end) return "In progress";
  
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const durationMs = endTime - startTime;
  
  const minutes = Math.floor(durationMs / (1000 * 60));
  if (minutes < 60) return `${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Get status badge color
export const getStatusColor = (status: Job['jobStatus']): string => {
  switch (status) {
    case "Completed": return "bg-job-completed";
    case "Failed": return "bg-job-failed";
    case "Running": return "bg-job-running";
    case "Pending": return "bg-job-pending";
    default: return "bg-gray-400";
  }
};

// Generate chart data for jobs over time
export const generateJobChartData = (jobs: Job[]) => {
  // Get the last 7 days
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Initialize data structure
  const data = dates.map(date => ({
    date,
    Completed: 0,
    Failed: 0,
    Running: 0,
    Pending: 0
  }));
  
  // Count jobs by status for each date
  jobs.forEach(job => {
    const jobDate = job.jobRegistrationTime.split('T')[0];
    const dateIndex = dates.indexOf(jobDate);
    
    if (dateIndex !== -1) {
      // @ts-ignore - we know the job status is a valid key
      data[dateIndex][job.jobStatus] += 1;
    }
  });
  
  return data;
};
