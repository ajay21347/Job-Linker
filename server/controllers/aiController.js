import User from "../models/UserModel.js";
import groq from "../utils/groq.js";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzeResumeOpenAI = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);

    // Check resume
    if (!user?.resume?.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload resume first",
      });
    }

    // Download PDF
    const pdfResponse = await axios.get(user.resume.url, {
      responseType: "arraybuffer",
    });

    // Convert PDF buffer
    const uint8Array = new Uint8Array(pdfResponse.data);

    // Load PDF
    const pdf = await pdfjsLib.getDocument(uint8Array).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item) => item.str).join(" ");

      resumeText += pageText + " ";
    }

    // Clean and limit text
    resumeText = resumeText.replace(/\s+/g, " ").trim().slice(0, 12000);

    // AI Analysis
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
You are an expert ATS resume analyzer.

STRICTLY follow this exact format.

ATS Match Percentage:
82%

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
