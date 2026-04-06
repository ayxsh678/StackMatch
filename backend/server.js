require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.get("/", (req, res) => res.send("StackMatch Backend is Live"));
app.post("/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    let rawText = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      rawText = data.text;
    } else if (req.file.mimetype.includes("word")) {
      const data = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = data.value;
    } else {
      rawText = req.file.buffer.toString();
    }
    const completion = await groq.chat.completions.create({
      messages: [{
        role: "system",
        content: "You are a resume parser. Extract ONLY professionally relevant information. Ignore: personal address, phone numbers, photos, references, hobbies, date of birth, nationality, marital status. Focus on: skills, work experience, education, projects, certifications, achievements. Return clean concise plain text under 800 words."
      }, {
        role: "user",
        content: "Parse this resume:\n\n" + rawText.slice(0, 4000)
      }],
      model: "llama3-8b-8192",
    });
    res.json({ text: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Resume parse error:", err);
    res.status(500).json({ error: "Parsing failed" });
  }
});
app.post("/analyze", async (req, res) => {
  try {
    const { role, level, skills, resumeText, email } = req.body;

    // 1. Better Prompting - Force JSON structure
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a career coach. You must output ONLY valid JSON. Do not include any explanations outside the JSON object." 
        },
        { 
          role: "user", 
          content: `Analyze readiness for Role: ${role}, Level: ${level}. 
          Current Skills: ${skills}. 
          Resume: ${resumeText || "None"}.
          
          Return this exact JSON structure:
          {
            "readinessScore": number,
            "atsScore": number,
            "summary": "string",
            "skills": [{"name": "string", "current": number, "target": number, "insight": "string"}]
          }` 
        }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    const aiContent = completion.choices[0].message.content;
    
    // 2. Safe Parsing
    let result;
    try {
      result = JSON.parse(aiContent);
    } catch (e) {
      console.error("AI returned invalid JSON:", aiContent);
      return res.status(500).json({ error: "AI response was not in the correct format." });
    }

    // 3. Webhook (Only if email is valid and NOT the placeholder)
    if (email && email.includes("@") && !email.includes("example.com")) {
      fetch("https://hook.eu1.make.com/sdq0buf8ev2bewe697gd5m5c0n8rj7pm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...result, role, level })
      }).catch(err => console.log("Webhook failed but ignoring"));
    }

    res.json(result);

  } catch (err) {
    console.error("Detailed Server Error:", err);
    res.status(500).json({ error: err.message });
  }
});