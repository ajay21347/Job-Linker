import api from "@/utils/api";
import { Home, LogOut, User2, FileText, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationCount, setApplicationCount] = useState(0);
  const [newApplicants, setNewApplicants] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Seeker Notifications
        if (user?.role === "seeker") {
          const res = await api.get("/application/my-applications");

          setApplicationCount(res.data.updatedCount || 0);
        }

        // Recruiter Notifications
        if (user?.role === "recruiter") {
          const res = await api.get("/application/recruiter-notifications");

          setNewApplicants(res.data.count);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [location.pathname]);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white shadow-md">
      {/* Logo */}
      <h1
        onClick={() => navigate("/seeker-dashboard")}
        className="text-xl font-bold cursor-pointer"
      >
        Job Linker
      </h1>
      <div className="flex items-center gap-6">
        <div
          onClick={() => {
            if (user?.role === "recruiter") {
              navigate("/recruiter-dashboard");
            } else if (user?.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/seeker-dashboard");
            }
          }}
          className={`flex items-center gap-1 cursor-pointer hover:text-gray-200 ${isActive("/seeker-dashboard") ? "font-bold hover:underline" : ""}`}
        >
          <Home className="w-5 h-5" />
          <span className="font-bold hover:underline">Home</span>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-1 cursor-pointer hover:text-gray-200 ${isActive("/seeker-dashboard") ? "font-bold hover:underline" : ""}`}
        >
          <User2 className="w-5 h-5" />
          <span className="font-bold hover:underline">Profile</span>
        </div>

        {/* Seeker Applications */}
        {user?.role === "seeker" && (
          <div
            onClick={() => navigate("/my-applications")}
            className={`relative flex items-center gap-1 cursor-pointer hover:text-gray-200 ${
              isActive("/my-applications") ? "font-bold underline" : ""
            }`}
          >
            <FileText className="w-5 h-5" />

            <span className="font-bold hover:underline">Applications</span>

            {applicationCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce shadow-lg">
                {applicationCount}
              </span>
            )}
          </div>
        )}

        {/* Recruiter Notifications */}
        {user?.role === "recruiter" && (
          <div
            onClick={async () => {
              try {
                await api.put("/application/mark-recruiter-seen");

                setNewApplicants(0);

                navigate("/recruiter-notifications");
              } catch (error) {
                console.log(error);
              }
            }}
            className={`relative flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-all ${isActive("/recruiter-dashboard") ? "font-bold hover:underline" : ""}`}
          >
            <Bell className="w-5 h-5" />

            <span>Applicants</span>

            {newApplicants > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce shadow-lg">
                {newApplicants}
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1 bg-white text-purple-600 px-3 py-1 rounded hover:bg-gray-200"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default Navbar;
