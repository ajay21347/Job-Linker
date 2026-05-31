import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  AlertTriangle,
  Brain,
  Briefcase,
  Sparkles,
  Target,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Section Card
const SectionCard = ({
  id,
  title,
  icon,
  color,
  content,
  type = "bullets",
  openSection,
  setOpenSection,
  hasContent,
}) => {
  if (!hasContent(content)) return null;

  const colorClasses = {
    green: {
      title: "text-green-700",
      icon: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-300",
      card: "bg-green-50 border-green-200",
    },
    red: {
      title: "text-red-700",
      icon: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-300",
      card: "bg-red-50 border-red-200",
    },
    yellow: {
      title: "text-yellow-700",
      icon: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-300",
      card: "bg-yellow-50 border-yellow-200",
    },
    cyan: {
      title: "text-cyan-700",
      icon: "text-cyan-600",
      bg: "bg-cyan-100",
      border: "border-cyan-300",
      card: "bg-cyan-50 border-cyan-200",
    },
    purple: {
      title: "text-purple-700",
      icon: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-300",
      card: "bg-purple-50 border-purple-200",
    },
    pink: {
      title: "text-pink-700",
      icon: "text-pink-600",
      bg: "bg-pink-100",
      border: "border-pink-300",
      card: "bg-pink-50 border-pink-200",
    },
    orange: {
      title: "text-orange-700",
      icon: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-300",
      card: "bg-orange-50 border-orange-200",
    },
  };

  const isOpen = openSection === id;
  const styles = colorClasses[color];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md border p-4 cursor-pointer hover:shadow-lg transition-all"
      onClick={() => setOpenSection(isOpen ? null : id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}

          <h2 className={`text-xl font-semibold text-${styles.title}-700`}>
            {title}
          </h2>
        </div>

        <span className={`text-${styles.icon}-600 text-3xl font-bold`}>
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <div
              className={`flex ${
                type === "tags" ? "flex-wrap gap-4" : "flex-col gap-4"
              }`}
            >
              {content.map((item, index) =>
                type === "tags" ? (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-full bg-${styles.bg}-100 text-${styles.title}-700 border border-${styles.border}-300 shadow-sm`}
                  >
                    {item}
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`px-4 py-3 rounded-xl shadow-sm ${styles.card} border text-gray-700`}
                  >
                    • {item}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ResumeAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;

  const [openSection, setOpenSection] = useState(null);
  // ATS Score
  const atsMatch = analysis?.match(/ATS Match Percentage:\s*(\d+)/i)?.[1] || 75;

  // Structured parser
  const sections = {
    strengths: [],
    weaknesses: [],
    missingSkills: [],
    suggestions: [],
    improvements: [],
    roles: [],
    keywords: [],
  };

  let currentSection = "";

  (analysis || "").split("\n").forEach((line) => {
    const cleanLine = line.trim();

    // Headings
    if (cleanLine === "Strengths:") {
      currentSection = "strengths";
      return;
    }

    if (cleanLine === "Weaknesses:") {
      currentSection = "weaknesses";
      return;
    }

    if (cleanLine === "Missing Skills:") {
      currentSection = "missingSkills";
      return;
    }

    if (cleanLine === "ATS Suggestions:") {
      currentSection = "suggestions";
      return;
    }

    if (cleanLine === "Recommended Improvements:") {
      currentSection = "improvements";
      return;
    }

    if (cleanLine === "Recommended Job Roles:") {
      currentSection = "roles";
      return;
    }

    if (cleanLine === "Important Keywords Missing:") {
      currentSection = "keywords";
      return;
    }

    // Bullet points
    if (
      currentSection &&
      (cleanLine.startsWith("-") || cleanLine.startsWith("•"))
    ) {
      sections[currentSection].push(cleanLine.replace(/^[-•]\s*/, ""));
    }
  });

  const hasContent = (arr) => arr.length > 0;

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-500 via-blue-200 to-cyan-200 p-6">
        <div className="bg-white/70 backdrop-blur-md border border-purple-200 rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Analysis Found
          </h2>

          <button
            onClick={() => navigate("/profile")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-blue-200 to-cyan-200 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800  text-white rounded-xl shadow-md hover:shadow-lg transition hover:scale-105"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-purple-200 rounded-3xl shadow-2xl p-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />

                <h1 className="text-3xl font-bold text-gray-800">
                  AI Resume Analysis
                </h1>
              </div>
            </div>

            {/* ATS Circle */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-8 py-6 shadow-md">
              <p className="text-gray-600 text-sm">ATS Score</p>

              <h2 className="text-5xl font-bold text-green-600 mt-2">
                {atsMatch}%
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          <SectionCard
            id="strengths"
            title="Strengths"
            icon={<Trophy className="text-green-600" />}
            color="green"
            content={sections.strengths}
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />

          <SectionCard
            id="weaknesses"
            title="Weaknesses"
            icon={<AlertTriangle className="text-red-500" />}
            color="red"
            content={sections.weaknesses}
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />

          <SectionCard
            id="skills"
            title="Missing Skills"
            icon={<Target className="text-yellow-600" />}
            color="yellow"
            content={sections.missingSkills}
            type="tags"
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />

          <SectionCard
            id="suggestions"
            title="ATS Suggestions"
            icon={<Brain className="text-cyan-600" />}
            color="cyan"
            content={sections.suggestions}
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />

          <SectionCard
            id="improvements"
            title="Improvements"
            icon={<Sparkles className="text-purple-600" />}
            color="purple"
            content={sections.improvements}
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />

          <SectionCard
            id="roles"
            title="Recommended Roles"
            icon={<Briefcase className="text-pink-600" />}
            color="pink"
            content={sections.roles}
            type="tags"
            openSection={openSection}
            setOpenSection={setOpenSection}
            hasContent={hasContent}
          />
        </div>

        {/* Keywords */}
        <SectionCard
          id="keywords"
          title="Important Keywords Missing"
          icon={<Target className="text-orange-500" />}
          color="orange"
          content={sections.keywords}
          type="tags"
          openSection={openSection}
          setOpenSection={setOpenSection}
          hasContent={hasContent}
        />
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
