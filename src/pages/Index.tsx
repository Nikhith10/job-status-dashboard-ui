
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, AlertCircle, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "@/components/JobsTable";
import StatCard from "@/components/StatCard";
import JobsChart from "@/components/JobsChart";
import { generateMockJobs, getJobStatusCounts } from "@/utils/job-utils";
import { Job } from "@/types/job";

const JobDashboard: React.FC = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading jobs from an API
  React.useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);

      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockJobs = generateMockJobs(50);
          setJobs(mockJobs);
          setIsLoading(false);
          toast({
            title: "Jobs loaded",
            description: `Successfully loaded ${mockJobs.length} jobs`,
          });
        }, 800);
      } catch (error) {
        console.error("Error loading jobs:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load jobs",
        });
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  const jobCounts = getJobStatusCounts(jobs);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Job Status Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Jobs"
          value={jobCounts.total}
          description="All jobs in the system"
          className="bg-card"
        />
        <StatCard
          title="Completed Jobs"
          value={jobCounts.completed}
          description="Successfully completed jobs"
          icon={<Check />}
          className="bg-card"
          iconClassName="text-job-completed"
        />
        <StatCard
          title="Failed Jobs"
          value={jobCounts.failed}
          description="Jobs that failed to complete"
          icon={<AlertCircle />}
          className="bg-card"
          iconClassName="text-job-failed"
        />
        <StatCard
          title="Running Jobs"
          value={jobCounts.running}
          description="Jobs currently in progress"
          icon={<Play />}
          className="bg-card"
          iconClassName="text-job-running"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <JobsChart jobs={jobs} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Job Status</CardTitle>
          <CardDescription>
            Manage and monitor the status of all jobs in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-jobs">
            <TabsList>
              <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
              <TabsTrigger value="failed-jobs">Failed Jobs</TabsTrigger>
              <TabsTrigger value="running-jobs">Running Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="all-jobs" className="pt-4">
              <JobsTable jobs={jobs} />
            </TabsContent>
            <TabsContent value="failed-jobs" className="pt-4">
              <JobsTable jobs={jobs.filter(job => job.jobStatus === "Failed")} />
            </TabsContent>
            <TabsContent value="running-jobs" className="pt-4">
              <JobsTable jobs={jobs.filter(job => job.jobStatus === "Running" || job.jobStatus === "Pending")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDashboard;
