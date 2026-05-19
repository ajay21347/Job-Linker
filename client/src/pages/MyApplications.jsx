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

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [sortBy, setSortBy] = useState("latest");

  const navigate = useNavigate();

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
        console.log(error);
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

    if (sortBy === "accepted") {
      return a.status === "accepted" ? -1 : 1;
    }

    if (sortBy === "pending") {
      return a.status === "pending" ? -1 : 1;
    }

    if (sortBy === "rejected") {
      return a.status === "rejected" ? -1 : 1;
    }

    return 0;
  });

  const accepted = applications.filter(
    (app) => app.status === "accepted",
  ).length;

  const pending = applications.filter((app) => app.status === "pending").length;

  const rejected = applications.filter(
    (app) => app.status === "rejected",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 ">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              My Applications
            </h1>
            <p className="text-gray-500 mt-2">
              Track your applications and recruiter responses
            </p>
          </div>
          {/* Actions */}
          <div
            className="flex items-center gap-2 bg-white
           px-4 py-3 rounded-2xl shadow-md border-collapse border-gray-100"
          >
            <ArrowUpDown className="w-5 h-5 text-purple-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="outline-none bg-transparent text-sm font-medium cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {/* Notifications */}
          <div className="relative bg-white p-3 rounded-3xl shadow-md border border-gray-100">
            <BellRing className="w-6 h-6 text-purple-600" />
            {notifications > 0 && (
              <span className=" absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-[20px] flex items-center justify-center rounded-full animate-bounce">
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Total */}
        <div className="bg-white rounded-3xl shadow-lg p-5 border border-purple-100">
          <div className="flex origin-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <h2 className="text-3xl font-bold">{applications.length}</h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-2xl">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
        {/* Accepted */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Accepted</p>
              <h2 className="text-3xl font-bold mt-2">{accepted}</h2>
            </div>
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        {/* Pending */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Pending</p>
              <h2 className="text-3xl font-bold mt-2">{pending}</h2>
            </div>
            <Clock3 className="w-8 h-8" />
          </div>
        </div>
        {/* Rejected */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between ">
            <div>
              <p className="text-sm">Rejected</p>
              <h2 className="text-3xl font-bold mt-2">{rejected}</h2>
            </div>
            <XCircle className="w-8 h-8" />
          </div>
        </div>
      </div>
      {/* Applications List */}
      <div className="space-y-5">
        {sortedApplications.map((app) => (
          <Card
            key={app._id}
            className="border-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
          >
            <CardContent className="p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              {/* Left */}
              <div className="flex items-start gap-5">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {app.job.title}
                  </h2>
                  <p
                    className="text-gray-600 font-medium mt-1
                  "
                  >
                    {app.job.company}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4" />

                    <span>
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {/* Right */}
              <div className="flex flex-wrap ic gap-4">
                {/* Status */}
                {app.status === "accepted" && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Accepted
                  </div>
                )}
                {app.status === "pending" && (
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
                    <Clock3 className="w-5 h-5" />
                    Pending
                  </div>
                )}{" "}
                {app.status === "rejected" && (
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2 rounded-full font-semibold">
                    <XCircle className="w-5 h-5" />
                    Rejected
                  </div>
                )}
                {/* View */}
                <button
                  onClick={() => navigate(`/job/${app.job._id}`)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 rounded-2xl transition-all duration-300 shadow-lg"
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
