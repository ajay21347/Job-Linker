import Analysis from "../models/AnalysisModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import groq from "../utils/groq.js";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzeResumeOpenAI = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user?.resume?.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload resume first",
      });
    }

    const pdfResponse = await axios.get(user.resume.url, {
      responseType: "arraybuffer",
    });

    const uint8Array = new Uint8Array(pdfResponse.data);

    const pdf = await pdfjsLib.getDocument(uint8Array).promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item) => item.str).join(" ");

      resumeText += pageText + " ";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim().slice(0, 12000);

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

export const analyzeJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user?.resume?.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload resume first",
      });
    }
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const pdfResponse = await axios.get(user.resume.url, {
      responseType: "arraybuffer",
    });

    const uint8Array = new Uint8Array(pdfResponse.data);

    const pdf = await pdfjsLib.getDocument(uint8Array).promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item) => item.str).join("");

      resumeText += pageText + " ";
    }

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
    });

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Job match analysis failed" });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Analysis.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("job", "title company");

    return res.status(200).json({ success: true, history });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch history",
    });
  }
};
