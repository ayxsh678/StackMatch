import React, { useState } from "react";

const API_URL = "https://skill-gap-backend-s5w9.onrender.com";

export default function StackMatch() {
  const [role, setRole] = useState("Frontend Engineer");
  const [level, setLevel] = useState("Junior");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeLoading(true);
    setResumeName(file.name);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch(`${API_URL}/parse-resume`, { method: "POST", body: formData });
      const data = await res.json();
      setResumeText(data.text);

      const exRes = await fetch(`${API_URL}/extract-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.text })
      });
      const exData = await exRes.json();
      setSkills(exData.skills);
    } catch (err) { setError("Failed to process resume"); }
    finally { setResumeLoading(false); }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, skills, resumeText, email })
      });
      if (!res.ok) throw new Error("Server Error");
      const data = await res.json();
      setResult(data);
    } catch (err) { setError("Analysis failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-gray-900 text-white rounded-xl">
      <h1 className="text-2xl font-bold mb-4">StackMatch</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="space-y-4">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 bg-gray-800">
          <option>Frontend Engineer</option>
          <option>Product Manager</option>
          <option>Backend Engineer</option>
        </select>

        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 bg-gray-800">
          <option>Junior</option>
          <option>Senior</option>
          <option>Staff / Principal</option>
        </select>

        <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 h-24 bg-gray-800" placeholder="Skills..." />

        <input type="file" onChange={handleResume} className="block w-full text-sm" />
        {resumeLoading && <p>Processing Resume...</p>}

        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 bg-gray-800" placeholder="Email (optional)" />

        <button onClick={handleAnalyze} disabled={loading} className="w-full p-3 bg-cyan-500 text-black font-bold">
          {loading ? "Analyzing..." : "ANALYZE MY GAPS →"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border border-cyan-500 rounded">
          <h2 className="text-xl font-bold">Score: {result.readinessScore}/10</h2>
          <p className="mt-2 text-gray-400">{result.summary}</p>
        </div>
      )}
    </div>
  );
}