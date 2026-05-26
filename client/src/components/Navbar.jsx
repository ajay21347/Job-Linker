import api from "@/utils/api";
import { Home, LogOut, User2, FileText, Bell, Sparkles } from "lucide-react";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { useAiAssistant } from "@/context/AiAssistantContext";

const Navbar = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [applicationCount, setApplicationCount] = useState(0);

  const [newApplicants, setNewApplicants] = useState(0);

  const { open, setOpen } = useAiAssistant();

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
        if (user?.role === "seeker") {
          const res = await api.get("/application/my-applications");

          setApplicationCount(res.data.updatedCount || 0);
        }

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
    <div
      className={`sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-800/95 via-indigo-800/95 to-slate-900/95 backdrop-blur-xl text-white shadow-2xl border-b border-cyan-400/10 overflow-hidden  transition-all duration-300 ${open ? "mr-[-120px]" : "mr-0"}`}
    >
      <div className="absolute top-0 left-20 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute right-20 top-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Logo */}
      <h1
        onClick={() => navigate("/seeker-dashboard")}
        className="relative text-2xl font-extrabold cursor-pointer bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
      >
        Job Linker
      </h1>

      {/* Nav Items */}
      <div className="relative flex items-center gap-8">
        {/* Home */}
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
          className={`group flex items-center gap-2 cursor-pointer transition-all duration-300 hover:text-cyan-300 hover:scale-105 ${
            isActive("/seeker-dashboard") ? "text-cyan-300" : ""
          }`}
        >
          <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

          <span className="font-semibold">Home</span>
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className={`group flex items-center gap-2 cursor-pointer transition-all duration-300 hover:text-fuchsia-300 hover:scale-105 ${
            isActive("/profile") ? "text-fuchsia-300" : ""
          }`}
        >
          <User2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

          <span className="font-semibold">Profile</span>
        </div>

        {/* Applications */}
        {user?.role === "seeker" && (
          <div
            onClick={() => navigate("/my-applications")}
            className={`group relative flex items-center gap-2 cursor-pointer transition-all duration-300 hover:text-indigo-300 hover:scale-105 ${
              isActive("/my-applications")
                ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,283,0.8)]"
                : ""
            }`}
          >
            <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

            <span className="font-semibold">Applications</span>

            {applicationCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-red-500/30">
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
            className={`group relative flex items-center gap-2 cursor-pointer transition-all duration-300 hover:text-yellow-300 hover:scale-105 ${
              isActive("/recruiter-notifications") ? "text-yellow-300" : ""
            }`}
          >
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

            <span className="font-semibold">Applicants</span>

            {newApplicants > 0 && (
              <span className="absolute -top-3 -right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-red-500/30">
                {newApplicants}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="relative flex items-center gap-4">
        {/* AI Assistant */}
        <button
          onClick={() => setOpen(true)}
          className="group relative overflow-hidden bg-fuchsia-500/20 backdrop-blur-md border border-fuchsia-300/30 text-fuchsia-100 px-5 py-2 rounded-xl shadow-lg hover:bg-fuchsia-500/30 hover:shadow-fuchsia-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-300/20 to-fuchsia-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <Sparkles
            size={18}
            className="relative z-10 animate-pulse group-hover:rotate-12 group-hover:scale-125 transition-all duration-300"
          />

          <span className="relative z-10 font-semibold">AI Assistant</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group relative overflow-hidden flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-red-500/20 hover:border-red-300/20 hover:text-red-100 transition-all duration-300 shadow-md hover:scale-105 hover:shadow-red-500/30"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />

          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
