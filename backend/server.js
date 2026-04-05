require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");

const app = express();

// ---------------- MIDDLEWARE ----------------
// Updated CORS to allow your specific Vercel deployment
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skill-gap-analyzer-delta.vercel.app" 
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

const upload = multer();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------- HEALTH CHECK ----------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is live" });
});

// ---------------- PARSE RESUME ----------------
app.post("/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = req.file.originalname.toLowerCase();
    let text = "";

    if (filename.endsWith(".pdf")) {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else {
      text = req.file.buffer.toString("utf-8");
    }

    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();

    if (!text) {
      return res.status(422).json({ error: "Could not extract text from file" });
    }

    res.json({
      success: true,
      text,
      chars: text.length
    });

  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).json({ error: "Internal server error during parsing" });
  }
});

// ---------------- ANALYZE ----------------
app.post("/analyze", async (req, res) => {
  try {
    const { role, level, skills, experience, goals, resumeText } = req.body;

    if (!role || !level || !skills) {
      return res.status(400).json({ error: "Missing required profile fields" });
    }

    const prompt = `
Return ONLY valid raw JSON (no markdown blocks, no text before or after):
{
  "readinessScore": number,
  "readinessLabel": string,
  "atsScore": number,
  "atsLabel": string,
  "summary": string,
  "topStrengths": string[],
  "criticalGaps": string[],
  "timeToReady": string,
  "salaryImpact": string,
  "skills": [{"name": string, "current": number, "target": number, "insight": string}],
  "learningPath": [{"title": string, "description": string}]
}

Context:
Role: ${role} | Level: ${level}
Required Skills: ${skills}
Experience: ${experience || "N/A"}
Goals: ${goals || "N/A"}
Resume Text: ${resumeText?.slice(0, 2000) || "N/A"}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.1, // Lower temperature for more reliable JSON
    });

    const raw = response.choices[0].message.content;

    try {
      // Robust JSON cleaning
      const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(clean);
      res.json(data);
    } catch (e) {
      console.error("❌ Groq JSON Parse Failed:", raw);
      res.status(500).json({ error: "AI returned invalid format" });
    }

  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "AI Analysis service failed" });
  }
});

// ---------------- SERVER START ----------------
// Render provides the PORT dynamically. Using 0.0.0.0 is best practice for cloud hosting.
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server active on port ${PORT}`);
});