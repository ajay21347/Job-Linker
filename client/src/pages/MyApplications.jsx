import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Briefcase,
  CheckCircle2,
  Clock3,
  XCircle,
  BellRing,
  CalendarDays,
  Building2,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusStyles = {
    Applied: {
      color: "bg-blue-100 text-blue-700",
      icon: Clock3,
    },
    "Under Review": {
      color: "bg-yellow-100 text-yellow-700",
      icon: Eye,
    },
    Shortlisted: {
      color: "bg-purple-100 text-purple-700",
      icon: CheckCircle2,
    },
    "Interview Scheduled": {
      color: "bg-indigo-100 text-indigo-700",
      icon: CalendarDays,
    },
    Selected: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/application/my-applications");

        setApplications(res.data.applications);

        const updated = res.data.applications.filter(
          (app) => app.isUpdated === true,
        );

        setNotifications(updated.length);
      } catch (error) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Sorting
  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (
      [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
      ].includes(sortBy)
    ) {
      return a.status === sortBy ? -1 : 1;
    }

    return 0;
  });

  const applied = applications.filter((app) => app.status === "Applied").length;

  const selected = applications.filter(
    (app) => app.status === "Selected",
  ).length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted",
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "Interview Scheduled",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

          <p className="text-gray-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold">No Applications Yet</h2>
          <p className="text-gray-500 mt-2">
            Start applying for jobs to track them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 ">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="relative mb-10">
          <div className=" text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              My Applications
            </h1>
          </div>

          {/* Actions */}
          <div className="absolute right-0 top-0 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-blue-50 border border-blue-200 text-blue-700 font-medium rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-blue-400 transition-all duration-300"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            {/* Notifications */}
            <div className="relative bg-white p-3 rounded-3xl shadow-md border border-gray-100">
              <BellRing className="w-6 h-6 text-red-600 bell-hover cursor-pointer" />

              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-full animate-pulse shadow-lg">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {/* Total Applications */}
        <div className="bg-white rounded-3xl shadow-lg p-5 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <h2 className="text-3xl font-bold">{applications.length}</h2>
            </div>

            <div className="bg-purple-100 p-3 rounded-2xl">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Applied */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Applied</p>
              <h2 className="text-3xl font-bold mt-2">{applied}</h2>
            </div>

            <Clock3 className="w-8 h-8" />
          </div>
        </div>

        {/* Shortlisted */}
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Shortlisted</p>
              <h2 className="text-3xl font-bold mt-2">{shortlisted}</h2>
            </div>

            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>

        {/* Interviews */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Interviews</p>
              <h2 className="text-3xl font-bold mt-2">{interviews}</h2>
            </div>

            <CalendarDays className="w-8 h-8" />
          </div>
        </div>

        {/* Selected */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Selected</p>
              <h2 className="text-3xl font-bold mt-2">{selected}</h2>
            </div>

            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
      </div>
      {/* Applications List */}
      <div className="space-y-3">
        {sortedApplications.map((app) => (
          <Card
            key={app._id}
            className={`border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
              app.isUpdated ? "ring-2 ring-purple-400 bg-purple-50" : "bg-white"
            }`}
          >
            <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              {/* Left */}
              <div className="flex items-start gap-5">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>

                <div>
                  {app.isUpdated && (
                    <div className="mb-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                      🔔 Status Updated
                    </div>
                  )}{" "}
                  <h2 className="text-lg font-bold text-gray-800">
                    {app.job.title}
                  </h2>
                  <p
                    className="text-gray-600 font-medium mt-1
                  "
                  >
                    {app.job.company}
                  </p>
                  <p className="text-sm text-gray-500">{app.job.location}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4" />

                    <span>
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {/* Right */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Status */}
                {(() => {
                  const statusInfo = statusStyles[app.status];

                  const Icon = statusInfo?.icon || Clock3;

                  return (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1  rounded-full font-semibold whitespace-nowrap ${statusInfo?.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  );
                })()}
                {/* View */}
                <button
                  onClick={() => navigate(`/job/${app.job._id}`)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  View Job Description
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
