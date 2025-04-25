
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Pending" | "Running" | "Completed" | "Failed";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "Completed": return "bg-job-completed";
      case "Failed": return "bg-job-failed";
      case "Running": return "bg-job-running";
      case "Pending": return "bg-job-pending";
      default: return "bg-gray-400";
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium text-white",
      getStatusColor(),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
