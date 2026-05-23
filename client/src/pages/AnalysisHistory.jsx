import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Briefcase, CalendarDays, Sparkles } from "lucide-react";
import { toast } from "sonner";

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch History
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/ai/history");

      setHistory(res.data.history);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-500 via-blue-200 to-cyan-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-xl font-semibold text-gray-700">
            Loading Analysis History...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-blue-200 to-cyan-200 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-purple-200 rounded-3xl shadow-2xl p-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Brain className="text-white w-8 h-8" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Analysis History
              </h1>

              <p className="text-gray-600 mt-1">
                View all your previous AI resume analyses and job match reports
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center shadow-xl border border-purple-200">
            <Sparkles className="mx-auto text-purple-500 w-16 h-16 mb-4" />

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No Analysis Found
            </h2>

            <p className="text-gray-600">
              Your previous AI analyses will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="bg-white/60 backdrop-blur-md border border-purple-200 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        {item.type === "resume" ? (
                          <Brain className="text-white w-6 h-6" />
                        ) : (
                          <Briefcase className="text-white w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {item.type === "resume"
                            ? "Resume Analysis"
                            : "Job Match Analysis"}
                        </h2>

                        {item.job && (
                          <p className="text-gray-600">
                            {item.job.title} • {item.job.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4 text-purple-600" />

                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-center gap-4">
                    {/* ATS Score */}
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-xl opacity-30"></div>

                      <div className="relative w-full h-full rounded-full border-[10px] border-green-500 bg-white flex items-center justify-center shadow-xl">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold text-green-600">
                            {item.atsScore}%
                          </h2>

                          <p className="text-xs text-gray-600 font-semibold">
                            ATS
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() =>
                        navigate("/resume-analysis", {
                          state: {
                            analysis: item.analysis,
                          },
                        })
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      View Analysis
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
