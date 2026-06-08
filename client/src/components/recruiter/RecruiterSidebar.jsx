import {
  LayoutDashboard,
  Briefcase,
  Users,
  PlusCircle,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/recruiter-dashboard",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    path: "/recruiter-dashboard/jobs",
  },
  {
    title: "Applicants",
    icon: Users,
    path: "/recruiter-dashboard/applicants",
  },
  {
    title: "Create Job",
    icon: PlusCircle,
    path: "/recruiter-dashboard/create-job",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/recruiter-dashboard/analytics",
  },
];

const RecruiterSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-10">
        Recruiter Hub
      </h1>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default RecruiterSidebar;
