
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import { Job } from "@/types/job";
import { formatDateTime } from "@/utils/job-utils";
import JobDetailsDialog from "./JobDetailsDialog";

interface JobsTableProps {
  jobs: Job[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || job.jobStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate jobs
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Handle row click
  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Running">Running</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Product</TableHead>
              <TableHead className="hidden md:table-cell">Environment</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow
                key={job.jobId}
                onClick={() => handleRowClick(job)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{job.jobId}</TableCell>
                <TableCell>
                  <StatusBadge status={job.jobStatus} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.jobType}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {job.product}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.environment}
                </TableCell>
                <TableCell>{formatDateTime(job.jobRegistrationTime)}</TableCell>
                <TableCell className="text-right">
                  {job.totalTimeInMinutes > 0
                    ? `${job.totalTimeInMinutes} min`
                    : "-"}
                </TableCell>
              </TableRow>
            ))}

            {paginatedJobs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
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
  );
};

export default JobsTable;
