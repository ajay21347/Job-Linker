import Analysis from "../models/AnalysisModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import groq from "../utils/groq.js";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

//Extract Resume
const extractResumeText = async (req, user) => {
  let pdfBuffer;

  if (req.file?.buffer) {
    pdfBuffer = req.file.buffer;
  } else if (user?.resume?.url) {
    const pdfResponse = await axios.get(user.resume.url, {
      responseType: "arraybuffer",
    });

    pdfBuffer = pdfResponse.data;
  } else {
    throw new Error("Please upload resume first or use your profile resume");
  }

  const uint8Array = new Uint8Array(pdfBuffer);

  const pdf = await pdfjsLib.getDocument(uint8Array).promise;

  let resumeText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");

    resumeText += pageText + " ";
  }

  return resumeText.replace(/\s+/g, " ").trim().slice(0, 12000);
};

// Analyze Resume
export const analyzeResumeOpenAI = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const resumeText = await extractResumeText(req, user);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
          You are an expert ATS resume analyzer.
          STRICTLY follow this exact format.
          
          ATS Match Percentage: 82%
          Strengths:
          - Point 1
          - Point 2
          - Point 3

          Weaknesses:
          - Point 1
          - Point 2

          Missing Skills:
          - Skill 1
          - Skill 2

          ATS Suggestions:
          - Suggestion 1
          - Suggestion 2

          Recommended Improvements:
          - Improvement 1
          - Improvement 2

          Recommended Job Roles:
          - Role 1
          - Role 2

          Important Keywords Missing:
          - Keyword 1
          - Keyword 2

          Rules:
          - Always use headings exactly as above
          - Always use bullet points
          - Never write paragraphs
          - Never merge sections
          - Never skip formatting
          `,
        },
        {
          role: "user",
          content: `Analyze this resume:\n\n${resumeText}`,
        },
      ],
    });

    const analysis = completion.choices[0].message.content;

    const atsMatch =
      analysis.match(/ATS Match Percentage:\s*(\d+)/i)?.[1] || 75;

    await Analysis.create({
      user: userId,
      type: "resume",
      atsScore: Number(atsMatch),
      analysis,
      resumeUrl: user?.resume?.url || "",
    });

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.log("GROQ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI analysis failed",
    });
  }
};

//Job Match
export const analyzeJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const resumeText = await extractResumeText(req, user);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS and recruitment AI.

      Compare the candidate resume with job description.

      STRICT FORMAT:

ATS Match Percentage:
85%

Strengths:
- Point 1
- Point 2

Weaknesses:
- Point 1
- Point 2

Missing Skills:
- Skill 1
- Skill 2

ATS Suggestions:
- Suggestion 1
- Suggestion 2

Recommended Improvements:
- Improvement 1
- Improvement 2

Recommended Job Roles:
- Role 1
- Role 2

Important Keywords Missing:
- Keyword 1
- Keyword 2

Rules:
- Always use these headings exactly
- Always use bullet points
- Never write paragraphs
      `,
        },

        {
          role: "user",
          content: `
      JOB DESCRIPTION:${job.description}

      REQUIRED SKILLS:${job.skills?.join(", ")}

      RESUME:${resumeText}`,
        },
      ],
    });

    const analysis = completion.choices[0].message.content;

    const atsMatch =
      analysis.match(/ATS Match Percentage:\s*(\d+)/i)?.[1] || 75;

    await Analysis.create({
      user: userId,
      type: "job-match",
      atsScore: Number(atsMatch),
      analysis,
      resumeUrl: user?.resume?.url || "",
      job: jobId,
    });

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Job match analysis failed" });
  }
};

// Analysis History
export const getAnalysisHistory = async (req, res) => {
  try {
    const { sort = "latest" } = req.query;

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const history = await Analysis.find({
      user: req.user.id,
    })
      .populate("job", "title company")
      .sort(sortOption);

    return res.status(200).json({ success: true, history });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch history",
    });
  }
};

// AI Chat
export const aiChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message && !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
        You are an AI Career Assistant.

      Help users with:
      - resumes
      - ATS optimization
      - interview preparation
      - career guidance
      - learning roadmap
      - jobs
      - skills

      Keep answers concise and professional.
      `,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: "AI chat failed" });
  }
};

// Generate Interview Questions
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobId } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const resumeText = await extractResumeText(req, user);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",

          content: `
Generate interview questions.

STRICT FORMAT:

Technical Questions:
- Question 1
- Question 2

Project Questions:
- Question 1
- Question 2

HR Questions:
- Question 1
- Question 2

Coding Questions:
- Question 1
- Question 2
`,
        },

        {
          role: "user",

          content: `
JOB DESCRIPTION:
${job.description}

SKILLS:
${job.skills?.join(", ")}

RESUME:
${resumeText}
`,
        },
      ],
    });

    const questions = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
    });
  }
};

// Career Suggestions
export const careerSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const resumeText = await extractResumeText(req, user);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",

          content: `
Provide:
- career suggestions
- missing skills
- improvement roadmap
- recommended technologies
- learning path

Use bullet points only.
`,
        },

        {
          role: "user",

          content: `
RESUME:
${resumeText}
`,
        },
      ],
    });

    const suggestions = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Career suggestions failed",
    });
  }
};

//Ai Analysis History
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate(
      "job",
      "title company",
    );

    if (!analysis) {
      return res
        .status(400)
        .json({ success: false, message: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
};
