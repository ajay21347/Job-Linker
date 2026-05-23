import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  AlertTriangle,
  Brain,
  Briefcase,
  Sparkles,
  Target,
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

  const isOpen = openSection === id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md border border-purple-200 rounded-3xl shadow-xl p-6 cursor-pointer hover:scale-[1.01] transition-all duration-300"
      onClick={() => setOpenSection(isOpen ? null : id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}

          <h2 className={`text-3xl font-bold text-${color}-700`}>{title}</h2>
        </div>

        <span className={`text-${color}-600 text-3xl font-bold`}>
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
                    className={`px-4 py-2 rounded-full bg-${color}-100 text-${color}-700 border border-${color}-300 shadow-sm`}
                  >
                    {item}
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`px-4 py-3 rounded-2xl shadow-sm bg-${color}-100/60 border border-${color}-200 text-gray-700`}
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
  const atsMatch = analysis.match(/ATS Match Percentage:\s*(\d+)/i)?.[1] || 75;

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

  analysis.split("\n").forEach((line) => {
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

                <h1 className="text-5xl font-bold text-gray-800">
                  AI Resume Analysis
                </h1>
              </div>
            </div>

            {/* ATS Circle */}
            <div className="relative w-44 h-44">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-2xl opacity-40"></div>

              <div className="relative w-full h-full rounded-full border-[12px] border-green-500 bg-white flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-green-600">
                    {atsMatch}%
                  </h2>

                  <p className="text-gray-600 font-semibold">ATS Match</p>
                </div>
              </div>
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

        {/* Bottom Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
