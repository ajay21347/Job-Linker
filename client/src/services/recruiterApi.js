import api from "@/utils/api";

export const getDashboardStats = () => api.get("/recruiter/dashboard-stats");

export const getRecruiterJobs = () => api.get("/recruiter/jobs");

export const getApplicants = () => api.get("/recruiter/applicants");
