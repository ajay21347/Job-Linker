import Interview from "../models/InterviewModel.js";
import Job from "../models/JobModel.js";
import groq from "../utils/groq.js";

export const startInterview = async (req, res) => {
  try {
    const { jobId, previousQuestions = [] } = req.body;

    const userId = req.user.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI interviewer.

Generate EXACTLY 5 NEW interview questions.

Rules:
- Match the job role.
- Include technical questions.
- Include project questions.
- Include HR questions.
- Do NOT repeat any question from the previous list.

Previous Questions:
${previousQuestions.join("\n")}

Return ONLY a JSON array.

Example:
[
 "Question 1",
 "Question 2"
]
`,
        },
        {
          role: "user",
          content: `
      JOB TITLE:${job.title}
      
      JOB DESCRIPTION:${job.description}
      
      SKILLS:${job.skills?.join(",")}`,
        },
      ],
    });

    let questions = [];

    try {
      questions = JSON.parse(completion.choices[0].message.content);
    } catch {
      questions = ["Tell me about yourself"];
    }

    const interview = await Interview.create({
      user: userId,
      job: jobId,
      questions,
      answers: [],
    });

    return res.status(200).json({
      success: true,
      interviewId: interview._id,
      questions,
      jobTitle: job.title,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

export const completeInterview = async (req, res) => {
  try {
    console.log("COMPLETE INTERVIEW HIT");
    const { interviewId, transcript, duration } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.transcript = transcript;

    interview.duration = duration;

    interview.completed = true;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview saved successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save interview",
    });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    })
      .populate("job", "title company")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(interviews);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
};

export const getInterviewById = async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate(
    "job",
    "title company",
  );

  res.json(interview);
};

export const generateFeedback = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI interviewer.

Evaluate the answer.

Give:
- 1 strength
- 1 improvement

Return ONLY feedback.

Example:

Good understanding of React hooks.
Try to explain useEffect more clearly.
`,
        },
        {
          role: "user",
          content: `
QUESTION:
${question}

ANSWER:
${answer}
`,
        },
      ],
    });

    return res.json({
      success: true,
      feedback: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate feedback",
    });
  }
};
