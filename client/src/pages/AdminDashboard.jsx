import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { Users, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/user/all-users");
        const jobRes = await api.get("/jobs");

        setUsers(userRes.data.users);
        setJobs(jobRes.data.jobs);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        <p className="text-gray-500 mt-1">Platform overview and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Total Users */}
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 flex items-center gap-4">
            <Users className="w-10 h-10 text-blue-600" />

            <div>
              <p className="text-gray-500 text-sm">Total Users</p>

              <h2 className="text-3xl font-bold">{users.length}</h2>
            </div>
          </CardContent>
        </Card>

        {/* Total Jobs */}
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 flex items-center gap-4">
            <Briefcase className="w-10 h-10 text-purple-600" />

            <div>
              <p className="text-gray-500 text-sm">Total Job Posts</p>

              <h2 className="text-3xl font-bold">{jobs.length}</h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
