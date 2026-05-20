import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import {
  ArrowUpDown,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Applicants = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/application/applicants/${jobId}`);
        setApplications(res.data.applications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/application/update-status/${id}`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? {
                ...app,
                status,
              }
            : app,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "alphabetical") {
      return a.applicant?.name.localeCompare(b.applicant?.name);
    }
    if (sortBy === "accepted") {
      return a.status === "accepted" ? -1 : 1;
    }
    if (sortBy === "rejected") {
      return a.status === "rejected" ? -1 : 1;
    }
    if (sortBy === "pending") {
      return a.status === "pending" ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-8">Applicants</h1>
          <p className="text-gray-500 mt-1">
            Manage applicants and hiring status
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-md">
          <ArrowUpDown className="w-5 h-5 text-purple-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="outline-none bg-transparent text-sm font-medium"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">A-Z</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      {/* Applicants */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-lg text-center text-gray-500 text-lg">
          No applicants yet.
        </div>
      ) : (
        <div className="space-y-5">
          {sortedApplications.map((app) => (
            <Card
              key={app._id}
              className={` rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                app.isSeen
                  ? "bg-white"
                  : "bg-purple-50 border border-purple-300"
              }`}
            >
              <CardContent className="p-6 flex xl:flex-row xl:items-center justify-between gap-6">
                {/* Left Section */}
                <div className="grid md:grid-cols-5 gap-6 flex-1">
                  {/* Name */}
                  <div>
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <User2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Name</span>
                    </div>
                    <h2 className="text-lg text-gray-800 font-bold">
                      {app.applicant?.name}
                    </h2>
                  </div>
                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-2  text-indigo-600  mb-1">
                      <Mail className="w-4 h-4 " />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-gray-700 break-all">
                      {app.applicant?.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Phone className="w-4 h-4 " />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-gray-700">
                      {" "}
                      {app.applicant?.phone || "No phone provided"}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">Applied</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Resume */}
                  <div>
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Resume</span>
                    </div>

                    <Button
                      className="bg-purple-500 hover:bg-purple-700 rounded-xl"
                      onClick={() =>
                        window.open(
                          `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(app.resume?.url)}`,
                          "_blank",
                        )
                      }
                    >
                      View Resume
                    </Button>
                  </div>
                </div>

                {/* Right Section */}
                <div
                  className="flex flex-col items-center gap-4 min-w-[180px]
                "
                >
                  {/* Status */}
                  <div>
                    {app.status === "accepted" && (
                      <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                        Accepted
                      </span>
                    )}
                    {app.status === "rejected" && (
                      <span className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-semibold">
                        Rejected
                      </span>
                    )}

                    {(!app.status || app.status === "pending") && (
                      <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {(!app.status || app.status === "pending") && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updateStatus(app._id, "accepted")}
                        className="bg-green-600 hover:bg-green-700 rounded-xl"
                      >
                        Accept
                      </Button>

                      <Button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 rounded-xl"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
