const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#111118",
  card: "#16161f",
  border: "#2a2a3a",
  accent: "#00e5ff",
  accent2: "#7c3aed",
  accent3: "#f59e0b",
  text: "#e8e8f0",
  muted: "#6b6b80",
  success: "#10b981",
  danger: "#ef4444",
  warn: "#f59e0b",
};

const ROLES = [
  "Frontend Engineer", "Backend Engineer", "Full Stack Developer",
  "Data Scientist", "ML Engineer", "DevOps / SRE",
  "Product Manager", "UX Designer", "Cloud Architect",
  "Cybersecurity Analyst", "Mobile Developer", "Blockchain Developer"
];

const LEVELS = ["Junior", "Mid-level", "Senior", "Staff / Principal", "Director / VP"];

function RadarChart({ skills }) {
  if (!skills || skills.length === 0) return null;
  const cx = 150, cy = 150, r = 110;
  const n = skills.length;
  const pts = (vals) => vals.map((v, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rad = (v / 10) * r;
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
  });
  const labels = skills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rad = r + 22;
    return { x: cx + rad * Math.cos(angle), y: cy + rad * Math.sin(angle), name: s.name };
  });
  const gridLevels = [2, 4, 6, 8, 10];
  const axes = skills.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx, cy, cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const currentPts = pts(skills.map(s => s.current));
  const targetPts = pts(skills.map(s => s.target));
  const toPath = (p) => p.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0]},${pt[1]}`).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 320 }}>
      {gridLevels.map(lv => {
        const gPts = skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return [cx + (lv / 10) * r * Math.cos(angle), cy + (lv / 10) * r * Math.sin(angle)];
        });
        return <polygon key={lv} points={gPts.map(p => p.join(',')).join(' ')} fill="none" stroke={COLORS.border} strokeWidth="0.8" />;
      })}
      {axes.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.border} strokeWidth="0.8" />)}
      <polygon points={targetPts.map(p => p.join(',')).join(' ')} fill={`${COLORS.accent2}30`} stroke={COLORS.accent2} strokeWidth="1.5" strokeDasharray="4,2" />
      <polygon points={currentPts.map(p => p.join(',')).join(' ')} fill={`${COLORS.accent}25`} stroke={COLORS.accent} strokeWidth="2" />
      {currentPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={COLORS.accent} />)}
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 9, fill: COLORS.muted, fontFamily: "'Space Mono', monospace" }}>
          {l.name.length > 10 ? l.name.slice(0, 9) + '…' : l.name}
        </text>
      ))}
    </svg>
  );
}

function SkillBar({ skill, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(1), delay + 100); return () => clearTimeout(t); }, [delay]);
  const gap = skill.target - skill.current;
  const gapColor = gap > 4 ? COLORS.danger : gap > 2 ? COLORS.warn : COLORS.success;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: "'Space Mono', monospace" }}>{skill.name}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.accent, background: `${COLORS.accent}15`, padding: "2px 7px", borderRadius: 4, fontFamily: "monospace" }}>{skill.current}/10</span>
          {gap > 0 && <span style={{ fontSize: 11, color: gapColor, background: `${gapColor}15`, padding: "2px 7px", borderRadius: 4, fontFamily: "monospace" }}>-{gap}</span>}
        </div>
      </div>
      <div style={{ position: "relative", height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          position: "absolute", height: "100%", borderRadius: 4,
          width: `${(skill.target / 10) * 100}%`, background: `${COLORS.accent2}40`,
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)"
        }} />
        <div style={{
          position: "absolute", height: "100%", borderRadius: 4,
          width: width ? `${(skill.current / 10) * 100}%` : "0%",
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})`,
          transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          boxShadow: `0 0 8px ${COLORS.accent}80`
        }} />
      </div>
      <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 5, fontFamily: "sans-serif", lineHeight: 1.4 }}>{skill.insight}</p>
    </div>
  );
}

function GlowBtn({ children, onClick, disabled, secondary }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: "12px 28px", borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 1,
        background: disabled ? COLORS.border : secondary
          ? hover ? `${COLORS.accent2}30` : "transparent"
          : hover ? COLORS.accent : `${COLORS.accent}dd`,
        color: disabled ? COLORS.muted : secondary ? COLORS.accent2 : COLORS.bg,
        border: secondary ? `1px solid ${COLORS.accent2}` : "none",
        boxShadow: !disabled && !secondary && hover ? `0 0 24px ${COLORS.accent}60` : "none",
        transition: "all 0.2s ease", opacity: disabled ? 0.5 : 1
      }}>
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0" }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: `3px solid ${COLORS.border}`,
        borderTopColor: COLORS.accent,
        animation: "spin 0.8s linear infinite"
      }} />
      <span style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>ANALYZING GAPS…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 20,
      background: `${color}20`, color, border: `1px solid ${color}40`,
      fontFamily: "'Space Mono', monospace", fontWeight: 600
    }}>{children}</span>
  );
}

export default function StackMatch() {
  const [step, setStep] = useState("form"); // form | loading | results
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (step === "results" && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step]);

  // ---------------- RESUME HANDLER ----------------
  async function handleResume(e) {
    const file = e.target.files[0];
    if (!file) return;

    setResumeLoading(true);
    setResumeName(file.name);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_URL}/parse-resume`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResumeText(data.text);

      // Auto-fill skills field if currently empty
      if (!skills) {
        setSkills(data.text.slice(0, 800));
      }
    } catch (err) {
      console.error("Resume parse error:", err);
      setError("Failed to parse resume. Make sure the server is running and try again.");
      setResumeText("");
      setResumeName("");
    } finally {
      setResumeLoading(false);
    }
  }

  // ---------------- SEND TO MAKE (WEBHOOK) ----------------
  async function sendToMake(data) {
    const MAKE_WEBHOOK = "YOUR_MAKE_WEBHOOK_URL";
    if (!email || MAKE_WEBHOOK === "YOUR_MAKE_WEBHOOK_URL") return;
    try {
      await fetch(MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          level,
          readinessScore: data.readinessScore,
          readinessLabel: data.readinessLabel,
          atsScore: data.atsScore,
          atsLabel: data.atsLabel,
          summary: data.summary,
          topStrengths: data.topStrengths,
          criticalGaps: data.criticalGaps,
          timeToReady: data.timeToReady,
          salaryImpact: data.salaryImpact,
          skills: data.skills,
          learningPath: data.learningPath,
          timestamp: new Date().toISOString()
        })
      });
      setEmailSent(true);
    } catch (e) {
      console.error("Webhook failed:", e);
    }
  }

  // ---------------- ANALYZE FUNCTION ----------------
  async function analyze() {
    if (!role || !level || !skills) {
      setError("Please fill in role, level, and your current skills.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, skills, experience, goals, resumeText })
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResults(data);
      setStep("results");

      // Send to Make webhook if email is provided
      await sendToMake(data);

    } catch (err) {
      console.error("Analyze error:", err);
      setError("Analysis failed. Make sure the server is running and try again.");
      setStep("form");
    }
  }

  // ---------------- RENDER ----------------
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, padding: "32px 16px" }}>

      {/* FORM STEP */}
      {step === "form" && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, marginBottom: 8, color: COLORS.accent }}>
            StackMatch
          </h1>
          <p style={{ color: COLORS.muted, marginBottom: 32, fontSize: 14 }}>
            Get a personalized readiness report for your target role.
          </p>

          {error && (
            <div style={{ background: `${COLORS.danger}15`, border: `1px solid ${COLORS.danger}40`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: COLORS.danger, fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Role */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>TARGET ROLE</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14 }}>
              <option value="">Select a role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>TARGET LEVEL</label>
            <select value={level} onChange={e => setLevel(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14 }}>
              <option value="">Select a level…</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Current Skills */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>YOUR CURRENT SKILLS</label>
            <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={4}
              placeholder="e.g. React, TypeScript, Node.js, 3 years experience…"
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          {/* Experience */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>YEARS OF EXPERIENCE (optional)</label>
            <input value={experience} onChange={e => setExperience(e.target.value)} type="number" min="0" max="40"
              placeholder="e.g. 3"
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, boxSizing: "border-box" }} />
          </div>

          {/* Goals */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>CAREER GOALS (optional)</label>
            <textarea value={goals} onChange={e => setGoals(e.target.value)} rows={2}
              placeholder="e.g. I want to move into a tech lead role within 12 months…"
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          {/* Resume Upload */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>UPLOAD RESUME (optional)</label>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: 8, cursor: resumeLoading ? "wait" : "pointer",
              padding: "9px 16px", borderRadius: 8, border: `1px dashed ${COLORS.border}`,
              background: COLORS.card, color: resumeLoading ? COLORS.muted : COLORS.text, fontSize: 13
            }}>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResume} style={{ display: "none" }} disabled={resumeLoading} />
              {resumeLoading ? "Parsing…" : resumeName ? `✓ ${resumeName}` : "Choose file"}
            </label>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 12, color: COLORS.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>EMAIL RESULTS (optional)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              placeholder="you@example.com"
              style={{ width: "100%", padding: "10px 12px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, boxSizing: "border-box" }} />
          </div>

          <GlowBtn onClick={analyze} disabled={!role || !level || !skills}>
            ANALYZE MY GAPS →
          </GlowBtn>
        </div>
      )}

      {/* LOADING STEP */}
      {step === "loading" && <Spinner />}

      {/* RESULTS STEP */}
      {step === "results" && results && (
        <div ref={resultsRef} style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Space Mono', monospace", color: COLORS.accent, fontSize: 20 }}>Your Results</h2>
            <GlowBtn secondary onClick={() => { setStep("form"); setResults(null); setEmailSent(false); }}>← BACK</GlowBtn>
          </div>

          {emailSent && (
            <div style={{ background: `${COLORS.success}15`, border: `1px solid ${COLORS.success}40`, borderRadius: 8, padding: "10px 16px", marginBottom: 20, color: COLORS.success, fontSize: 13 }}>
              ✓ Results sent to {email}
            </div>
          )}

          {/* Score cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>READINESS</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.accent, fontFamily: "'Space Mono', monospace" }}>{results.readinessScore}%</div>
              <Tag color={COLORS.accent}>{results.readinessLabel}</Tag>
            </div>
            <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>ATS SCORE</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.accent2, fontFamily: "'Space Mono', monospace" }}>{results.atsScore}%</div>
              <Tag color={COLORS.accent2}>{results.atsLabel}</Tag>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 24 }}>
            <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{results.summary}</p>
          </div>

          {/* Skills + Radar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              {results.skills?.map((s, i) => <SkillBar key={s.name} skill={s} delay={i * 80} />)}
            </div>
            <RadarChart skills={results.skills} />
          </div>

          {/* Learning path */}
          {results.learningPath?.length > 0 && (
            <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>LEARNING PATH</h3>
              {results.learningPath.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${COLORS.accent2}30`, color: COLORS.accent2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Time to ready + salary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {results.timeToReady && (
              <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>TIME TO READY</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent3 }}>{results.timeToReady}</div>
              </div>
            )}
            {results.salaryImpact && (
              <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>SALARY IMPACT</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.success }}>{results.salaryImpact}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
