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

const SelectionRate = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/recruiter/chart-data?type=selectionRate");

        setData(res.data.chartData || []);
      } catch {
        toast.error("Failed to load chart");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Selection Rate Per Job</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default SelectionRate;
