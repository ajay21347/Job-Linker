import { useEffect, useState } from "react";
import api from "@/utils/api";
import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
import StatCard from "@/components/recruiter/StatCard";
import ApplicationsByJob from "@/components/recruiter/charts/ApplicationsByJob";
import ApplicationStatusDistribution from "@/components/recruiter/charts/ApplicationStatusDistribution";
import ApplicationsOverTime from "@/components/recruiter/charts/ApplicationsOverTime";
import TopJobs from "@/components/recruiter/charts/TopJobs";
import SelectionRate from "@/components/recruiter/charts/SelectionRate";
import {
  Briefcase,
  Users,
  CheckCircle,
  UserCheck,
  TrendingUp,
} from "lucide-react";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    interviewScheduled: 0,
    hiringRate: 0,
    mostAppliedJob: "N/A",
    topJobApplications: 0,
  });

  const [selectedChart, setSelectedChart] = useState("applicationsByJob");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/recruiter/dashboard-stats");

        setStats(res.data.stats);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Jobs Posted",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "bg-gradient-to-r from-purple-600 to-indigo-600",
    },
    {
      title: "Applications",
      value: stats?.totalApplications || 0,
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      title: "Shortlisted",
      value: stats?.shortlistedCandidates || 0,
      icon: CheckCircle,
      color: "bg-gradient-to-r from-orange-500 to-yellow-500",
    },
    {
      title: "Interviews",
      value: stats?.interviewScheduled || 0,
      icon: UserCheck,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <RecruiterHeader
        title="Dashboard"
        subtitle="Track recruitment performance and hiring activity"
      />

      <div className="grid md:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Top Performing Job</h3>
          </div>

          <h2 className="text-3xl font-bold mt-5">
            {stats.mostAppliedJob || "N/A"}
          </h2>

          <p className="text-purple-100 mt-3">
            {stats.topJobApplications || 0} Applications Received
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6">
          <h3 className="text-gray-500 font-medium">Hiring Rate</h3>

          <h2 className="text-5xl font-bold text-green-600 mt-4">
            {stats.hiringRate || 0}%
          </h2>

          <p className="text-gray-500 mt-3">
            Hired candidates vs total applications
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-wrap gap-2 bg-white/80 border border-purple-100 rounded-2xl p-2 shadow-sm">
          <button
            onClick={() => setSelectedChart("applicationsByJob")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChart === "applicationsByJob"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-50"
            }`}
          >
            Applications by Job
          </button>

          <button
            onClick={() => setSelectedChart("statusDistribution")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChart === "statusDistribution"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-50"
            }`}
          >
            Status Distribution
          </button>

          <button
            onClick={() => setSelectedChart("applicationsTrend")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChart === "applicationsTrend"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-50"
            }`}
          >
            Applications Trend
          </button>

          <button
            onClick={() => setSelectedChart("topJobs")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChart === "topJobs"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-50"
            }`}
          >
            Top 5 Jobs
          </button>

          <button
            onClick={() => setSelectedChart("selectionRate")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChart === "selectionRate"
                ? "bg-purple-600 text-white shadow-md"
                : "text-purple-700 hover:bg-purple-50"
            }`}
          >
            Selection Rate
          </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md border border-purple-100 rounded-3xl shadow-xl p-8">
        {selectedChart === "applicationsByJob" && <ApplicationsByJob />}
        {selectedChart === "statusDistribution" && (
          <ApplicationStatusDistribution />
        )}
        {selectedChart === "applicationsTrend" && <ApplicationsOverTime />}
        {selectedChart === "topJobs" && <TopJobs />}
        {selectedChart === "selectionRate" && <SelectionRate />}
      </div>
    </div>
  );
};

export default DashboardOverview;
