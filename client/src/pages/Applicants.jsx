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
import { toast } from "sonner";

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
        toast.error("Failed to load applicants");
      }
    };
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/application/update-status/${id}`, { status });

      toast.success(`Status updated to ${status}`);

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
      toast.error("Failed to update applicant status");
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
    if (
      [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
      ].includes(sortBy)
    ) {
      return a.status === sortBy ? -1 : 1;
    }
    return 0;
  });

  const statusStyles = {
    Applied: "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    Shortlisted: "bg-purple-100 text-purple-700",
    "Interview Scheduled": "bg-indigo-100 text-indigo-700",
    Selected: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-8">Applicants</h1>
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
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
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
                      onClick={() => {
                        toast.info("Opening resume...");
                        window.open(
                          `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(app.resume?.url)}`,
                          "_blank",
                        );
                      }}
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
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        statusStyles[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Actions */}

                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className="border rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">
                      Interview Scheduled
                    </option>
                    <option value="Selected">Selected</option>
                  </select>
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
