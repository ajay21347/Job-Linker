import { useEffect, useState } from "react";
import api from "@/utils/api";

import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
import StatCard from "@/components/recruiter/StatCard";

import { Briefcase, Users, CheckCircle, UserCheck } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    selected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/recruiter/dashboard-stats");

      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <>
      <RecruiterHeader title="Dashboard" />

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Jobs Posted"
          value={stats.totalJobs}
          icon={Briefcase}
          color="bg-purple-600"
        />

        <StatCard
          title="Applicants"
          value={stats.totalApplicants}
          icon={Users}
          color="bg-blue-600"
        />

        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={CheckCircle}
          color="bg-orange-500"
        />

        <StatCard
          title="Selected"
          value={stats.selected}
          icon={UserCheck}
          color="bg-green-600"
        />
      </div>
    </>
  );
};

export default DashboardOverview;
