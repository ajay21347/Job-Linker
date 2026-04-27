import { Home, LogOut, User2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white shadow-md">
      {/* Logo */}
      <h1
        onClick={() => navigate("/seeker-dashboard")}
        className="text-xl font-bold cursor-pointer"
      >
        Job Portal
      </h1>
      <div className="flex items-center gap-6">
        <div
          onClick={() => navigate("/seeker-dashboard")}
          className={`flex items-center gap-1 cursor-pointer hover:text-gray-200 ${isActive("/seeker-dashboard") ? "font-bold underline" : ""}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-1 cursor-pointer hover:text-gray-200 ${isActive("/seeker-dashboard") ? "font-bold underline" : ""}`}
        >
          <User2 className="w-5 h-5" />
          <span>Profile</span>
        </div>
        <span className="hidden md:block text-sm bg-purple-500 px-3 py-1 rounded">
          {user?.name}
        </span>
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
