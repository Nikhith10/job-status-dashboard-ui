
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { Job } from "@/types/job";
import { formatDateTime } from "@/utils/job-utils";
import JobDetailsDialog from "@/components/JobDetailsDialog";
import { Button } from "@/components/ui/button";
import { Grid, Clock, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobsCardViewProps {
  jobs: Job[];
}

const JobsCardView: React.FC<JobsCardViewProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 8;

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.jobStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Jobs Dashboard</h1>
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            <Grid className="mr-2 h-4 w-4" />
            Table View
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="w-full sm:w-1/3">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedJobs.map((job) => (
            <Card
              key={job.jobId}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedJob(job)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium">{job.jobId}</CardTitle>
                  <StatusBadge status={job.jobStatus} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Type:</span> {job.jobType}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Product:</span> {job.product}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDateTime(job.jobRegistrationTime)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paginatedJobs.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No jobs found.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {selectedJob && (
          <JobDetailsDialog
            job={selectedJob}
            open={Boolean(selectedJob)}
            onOpenChange={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
};

export default JobsCardView;
