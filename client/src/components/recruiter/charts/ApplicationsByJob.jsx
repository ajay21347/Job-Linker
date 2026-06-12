import api from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ApplicationsByJob = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/recruiter/chart-data?type=applicationsByJob",
        );
        setData(res.data.chartData || []);
      } catch (error) {
        toast.error("Failed to load chart");
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Applications By Job</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} tickCount={5} />
          <YAxis type="category" dataKey="jobTitle" width={150} />
          <Tooltip />
          <Bar dataKey="applications" fill="#7c3aed" />{" "}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ApplicationsByJob;
