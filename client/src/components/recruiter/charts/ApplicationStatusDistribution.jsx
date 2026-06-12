import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "sonner";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const ApplicationStatusDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/recruiter/chart-data?type=statusDistribution",
        );

        setData(res.data.chartData || []);
      } catch {
        toast.error("Failed to load chart");
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">
        Application Status Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ApplicationStatusDistribution;
