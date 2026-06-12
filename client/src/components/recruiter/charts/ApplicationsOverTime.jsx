import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ApplicationsOverTime = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/recruiter/chart-data?type=applicationsTrend",
        );

        setData(res.data.chartData || []);
      } catch {
        toast.error("Failed to load chart");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Applications Over Time</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ApplicationsOverTime;
