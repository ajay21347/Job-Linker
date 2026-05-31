import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { BellRing, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/application/recruiter-all-notifications");

        setNotifications(res.data.notifications);
      } catch (error) {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <BellRing className="w-12 h-12 text-purple-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-800">
            No Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            New applicant notifications will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BellRing className="w-8 h-8 text-purple-600" />
        <h1 className="text-4xl  font-bold text-gray-800">Notifications</h1>
      </div>
      {/* Notifications */}
      <div className="space-y-5">
        {notifications.map((app) => (
          <Card
            key={app._id}
            onClick={() => {
              if (app.job?._id) {
                navigate(`/applicants/${app.job._id}`);
              }
            }}
            className={`cursor-pointer rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${app.isSeen ? "bg-white" : "bg-purple-50 border border-purple-300"}`}
          >
            <CardContent className="p-6 flex items-center justify-between">
              {/* Left */}

              <div className="flex items-center gap-5">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <Briefcase className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    New applicant for {app.job?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Candidate applied to {app.job?.company}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    {new Date(app.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              {/* Badge */}
              {!app.isSeen && (
                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                  New
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterNotifications;
