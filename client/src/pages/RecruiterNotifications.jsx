import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { BellRing, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/application/recruiter-all-notifications");

        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

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
            onClick={() => navigate(`/applicants/${app.job._id}`)}
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
