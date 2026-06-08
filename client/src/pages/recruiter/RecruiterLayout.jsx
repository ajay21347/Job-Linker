import { Outlet } from "react-router-dom";
import RecruiterSidebar from "@/components/recruiter/RecruiterSidebar";

const RecruiterLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <RecruiterSidebar />

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default RecruiterLayout;
