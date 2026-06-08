import { useEffect, useState } from "react";

import api from "@/utils/api";

import RecruiterHeader from "@/components/recruiter/RecruiterHeader";
import AnalyticsCard from "@/components/recruiter/AnalyticsCard";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.get("/recruiter/analytics");

      setAnalytics(res.data);
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return null;

  return (
    <>
      <RecruiterHeader title="Analytics" />

      <div className="grid md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Most Applied Job"
          value={analytics.mostAppliedJob}
        />

        <AnalyticsCard
          title="Total Applications"
          value={analytics.totalApplications}
        />

        <AnalyticsCard title="Selected" value={analytics.selected} />
      </div>
    </>
  );
};

export default Analytics;
