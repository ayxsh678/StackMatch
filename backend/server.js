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
    const { role, level, skills, resumeText, yearsExp, careerGoals, email } = req.body;
    const prompt = "You are a senior tech career coach. Analyze skill gaps for someone targeting a " + level + " " + role + " position.\n\nCandidate Info:\n- Current Skills: " + (skills || "Not provided") + "\n- Years of Experience: " + (yearsExp || "Not specified") + "\n- Career Goals: " + (careerGoals || "Not specified") + "\n- Resume Summary: " + (resumeText ? resumeText.slice(0, 1500) : "Not provided") + "\n\nReturn JSON ONLY with this exact structure:\n{\n  \"readinessScore\": 0,\n  \"atsScore\": 0,\n  \"summary\": \"\",\n  \"skills\": [{\"name\": \"\", \"current\": 0, \"target\": 0, \"priority\": \"\"}],\n  \"topGaps\": [],\n  \"recommendations\": [],\n  \"timelineMonths\": 0\n}\nInclude 6-8 relevant skills for the " + role + " role.";
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(completion.choices[0].message.content);
    if (email && email.includes("@") && email !== "you@example.com") {
      try {
        await fetch("https://hook.eu1.make.com/sdq0buf8ev2bewe697gd5m5c0n8rj7pm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, ...result, role, level })
        });
      } catch (e) { console.log("Webhook error:", e.message); }
    }
    res.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
