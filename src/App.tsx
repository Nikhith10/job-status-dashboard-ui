
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobsCardView from "./pages/JobsCardView";
import { Job } from "./types/job";
import { generateMockJobs } from "./utils/job-utils";

const queryClient = new QueryClient();

const App = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Generate mock jobs data for both views
    const mockJobs = generateMockJobs(50);
    setJobs(mockJobs);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/card-view" element={<JobsCardView jobs={jobs} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
