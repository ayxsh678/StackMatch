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
    } catch (err) { 
      setError("Failed to process resume. Please type skills manually."); 
    } finally { 
      setResumeLoading(false); 
    }
  };

  const handleAnalyze = async () => {
    if (!skills.trim()) {
      setError("Please enter your skills or upload a resume first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, skills, resumeText, email })
      });
      
      if (!res.ok) throw new Error("Server responded with an error");
      
      const data = await res.json();
      setResult(data);
    } catch (err) { 
      setError("Analysis failed. Make sure the server is running and try again."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-gray-900 text-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">StackMatch</h2>
      <p className="text-gray-400 mb-6">Get a personalized readiness report for your target role.</p>

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700">
            <option>Frontend Engineer</option>
            <option>Backend Engineer</option>
            <option>ML Engineer</option>
            <option>Product Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-3 bg-gray-800 rounded border border-gray-700">
            <option>Junior</option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Director / VP</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Current Skills</label>
          <textarea 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            className="w-full p-3 h-28 bg-gray-800 rounded border border-gray-700 focus:border-cyan-500 outline-none transition-all" 
            placeholder="e.g. React, Node.js, Python..."
          />
        </div>

        <div className="border-2 border-dashed border-gray-700 p-4 rounded-lg text-center bg-gray-800/30">
          <input type="file" onChange={handleResume} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer text-cyan-400 hover:text-cyan-300 font-medium">
            {resumeLoading ? "Processing..." : resumeName ? `✓ ${resumeName}` : "Upload Resume (Auto-fill)"}
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Results (Optional)</label>
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 bg-gray-800 rounded border border-gray-700" 
            placeholder="you@example.com" 
          />
        </div>

        <button 
          onClick={handleAnalyze} 
          disabled={loading || resumeLoading} 
          className="w-full p-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 text-black font-bold rounded-lg transition-all"
        >
          {loading ? "ANALYZING..." : "ANALYZE MY GAPS →"}
        </button>
      </div>

      {result && (
        <div className="mt-10 p-6 bg-gray-800 rounded-xl border border-cyan-500/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-cyan-400">Analysis Result</h3>
            <span className="bg-cyan-900 text-cyan-200 px-3 py-1 rounded-full text-sm font-bold">
              Score: {result.readinessScore}/10
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
        </div>
      )}
    </div>
  );
}