
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Job } from "@/types/job";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "@/utils/job-utils";
import { Separator } from "@/components/ui/separator";

interface JobDetailsDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  job,
  open,
  onOpenChange,
}) => {
  const renderDetailItem = (label: string, value: React.ReactNode) => (
    <div className="grid grid-cols-5 gap-2 py-2">
      <div className="col-span-2 text-sm font-medium text-muted-foreground">
        {label}
      </div>
      <div className="col-span-3 text-sm">{value || "-"}</div>
    </div>
  );

  const renderDetailSection = (title: string, items: Array<[string, React.ReactNode]>) => (
    <div className="space-y-2">
      <h4 className="font-medium">{title}</h4>
      {items.map(([label, value], idx) => (
        <div key={idx}>{renderDetailItem(label, value)}</div>
      ))}
    </div>
  );

  const renderArrayAsBadges = (items: string[] | undefined) => {
    if (!items || items.length === 0) return "-";
    
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((item, idx) => (
          <span 
            key={idx} 
            className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Job Details: {job.jobId}</span>
            <StatusBadge status={job.jobStatus} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderDetailSection("Basic Information", [
            ["Job ID", job.jobId],
            ["User ID", job.userId],
            ["Client ID", job.clientId],
            ["Status", <StatusBadge key="status" status={job.jobStatus} />],
          ])}

          <Separator />

          {renderDetailSection("Job Classification", [
            ["Product", job.product],
            ["Category", job.category],
            ["Sub Category", job.subCategory],
            ["Job Type", job.jobType],
            ["Environment", job.environment],
          ])}

          <Separator />

          {renderDetailSection("Timing Information", [
            ["Registration Time", formatDateTime(job.jobRegistrationTime)],
            ["Pick Up Time", formatDateTime(job.jobPickUpTime)],
            ["End Time", formatDateTime(job.jobEndTime)],
            ["Total Duration", `${job.totalTimeInMinutes} minutes`],
            ["Last Updated", formatDateTime(job.lastUpdatedTime)],
          ])}

          <Separator />

          {renderDetailSection("Resources", [
            ["Hostnames", renderArrayAsBadges(job.hostnames)],
            ["Applications", renderArrayAsBadges(job.applications)],
            ["Services", renderArrayAsBadges(job.services)],
            ["Pod Names", renderArrayAsBadges(job.podNames)],
          ])}

          <Separator />

          {renderDetailSection("Message Status", [
            ["Start Message", job.isStartMessageLoaded ? "Loaded" : "Not Loaded"],
            ["Progress Message", job.isProgressMessageLoaded ? "Loaded" : "Not Loaded"],
            ["Summary Message", job.isSummaryMessageLoaded ? "Loaded" : "Not Loaded"],
          ])}

          {job.exportSetName && (
            <>
              <Separator />
              {renderDetailSection("Export Details", [
                ["Export Set Name", job.exportSetName],
              ])}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
