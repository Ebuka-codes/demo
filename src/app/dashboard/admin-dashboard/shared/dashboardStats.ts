export interface DashboardStats {
  totalJobs: number;
  avgTimeToHire: number;
  applicationStatus: number;
  candidateInfo: {
    total: number;
    hired: number;
    pending: number;
    rejected: number;
    interview: number;
  };
  activeJobsList: ActiveJob[];
}

export interface ActiveJob {
  noOfCandidate: number;
  timeAgo: string;
  jobTitle: string;
  jobDescription: string;
  employmentType: string;
  jobLocation: string;
  jobStatus: string;
  jobType: string;
  companyName: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
}
