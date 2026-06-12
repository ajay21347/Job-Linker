import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TopJobs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/recruiter/chart-data?type=topJobs");

        setData(res.data.chartData || []);
      } catch {
        toast.error("Failed to load chart");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Top 5 Jobs by Applications</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} tickCount={5} />
          <YAxis type="category" dataKey="jobTitle" width={150} />
          <Tooltip />
          <Bar dataKey="applications" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default TopJobs;
