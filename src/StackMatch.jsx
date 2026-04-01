import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0a0f", surface: "#111118", card: "#16161f", border: "#2a2a3a",
  accent: "#00e5ff", accent2: "#7c3aed", accent3: "#f59e0b",
  text: "#e8e8f0", muted: "#6b6b80", success: "#10b981", danger: "#ef4444", warn: "#f59e0b",
};

const ROLES = ["Frontend Engineer","Backend Engineer","Full Stack Developer","Data Scientist","ML Engineer","DevOps / SRE","Product Manager","UX Designer","Cloud Architect","Cybersecurity Analyst","Mobile Developer","Blockchain Developer"];
const LEVELS = ["Junior","Mid-level","Senior","Staff / Principal","Director / VP"];

// ✅ SAFE: backend URL only — no API keys in frontend
const BACKEND = "https://skill-gap-backend-s5w9.onrender.com";

function RadarChart({ skills }) {
  if (!skills || skills.length === 0) return null;
  const cx = 150, cy = 150, r = 110, n = skills.length;
  const pts = (vals) => vals.map((v, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + (v/10)*r*Math.cos(angle), cy + (v/10)*r*Math.sin(angle)];
  });
  const labels = skills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx+(r+22)*Math.cos(angle), y: cy+(r+22)*Math.sin(angle), name: s.name };
  });
  const currentPts = pts(skills.map(s => s.current));
  const targetPts = pts(skills.map(s => s.target));
  return (
    <svg viewBox="0 0 300 300" style={{ width:"100%", maxWidth:320 }}>
      {[2,4,6,8,10].map(lv => (
        <polygon key={lv} points={skills.map((_,i) => {
          const a=(Math.PI*2*i)/n-Math.PI/2;
          return [cx+(lv/10)*r*Math.cos(a), cy+(lv/10)*r*Math.sin(a)].join(",");
        }).join(" ")} fill="none" stroke={COLORS.border} strokeWidth="0.8"/>
      ))}
      {skills.map((_,i) => {
        const a=(Math.PI*2*i)/n-Math.PI/2;
        return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke={COLORS.border} strokeWidth="0.8"/>;
      })}
      <polygon points={targetPts.map(p=>p.join(",")).join(" ")} fill={`${COLORS.accent2}30`} stroke={COLORS.accent2} strokeWidth="1.5" strokeDasharray="4,2"/>
      <polygon points={currentPts.map(p=>p.join(",")).join(" ")} fill={`${COLORS.accent}25`} stroke={COLORS.accent} strokeWidth="2"/>
      {currentPts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3.5" fill={COLORS.accent}/>)}
      {labels.map((l,i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" style={{fontSize:9,fill:COLORS.muted,fontFamily:"monospace"}}>
          {l.name.length>10?l.name.slice(0,9)+"…":l.name}
        </text>
      ))}
    </svg>
  );
}

function SkillBar({ skill, delay=0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setW(1),delay+100); return ()=>clearTimeout(t); },[delay]);
  const gap = skill.target-skill.current;
  const gc = gap>4?COLORS.danger:gap>2?COLORS.warn:COLORS.success;
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:13,fontWeight:600,color:COLORS.text,fontFamily:"monospace"}}>{skill.name}</span>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:11,color:COLORS.accent,background:`${COLORS.accent}15`,padding:"2px 7px",borderRadius:4,fontFamily:"monospace"}}>{skill.current}/10</span>
          {gap>0&&<span style={{fontSize:11,color:gc,background:`${gc}15`,padding:"2px 7px",borderRadius:4,fontFamily:"monospace"}}>-{gap}</span>}
        </div>
      </div>
      <div style={{position:"relative",height:8,background:COLORS.border,borderRadius:4,overflow:"hidden"}}>
        <div style={{position:"absolute",height:"100%",borderRadius:4,width:`${(skill.target/10)*100}%`,background:`${COLORS.accent2}40`}}/>
        <div style={{position:"absolute",height:"100%",borderRadius:4,width:w?`${(skill.current/10)*100}%`:"0%",background:`linear-gradient(90deg,${COLORS.accent},${COLORS.accent2})`,transition:`width 0.8s ease ${delay}ms`}}/>
      </div>
      <p style={{fontSize:11,color:COLORS.muted,marginTop:5,lineHeight:1.4}}>{skill.insight}</p>
    </div>
  );
}

function GlowBtn({ children, onClick, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:"12px 28px",borderRadius:8,border:"none",cursor:disabled?"not-allowed":"pointer",fontFamily:"monospace",fontSize:13,fontWeight:700,letterSpacing:1,background:disabled?COLORS.border:h?COLORS.accent:`${COLORS.accent}dd`,color:disabled?COLORS.muted:COLORS.bg,boxShadow:!disabled&&h?`0 0 24px ${COLORS.accent}60`:"none",transition:"all 0.2s",opacity:disabled?0.5:1}}>
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"40px 0"}}>
      <div style={{width:48,height:48,borderRadius:"50%",border:`3px solid ${COLORS.border}`,borderTopColor:COLORS.accent,animation:"spin 0.8s linear infinite"}}/>
      <span style={{color:COLORS.muted,fontFamily:"monospace",fontSize:12}}>ANALYZING GAPS…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Tag({ children, color }) {
  return <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:`${color}20`,color,border:`1px solid ${color}40`,fontFamily:"monospace",fontWeight:600}}>{children}</span>;
}

export default function StackMatch() {
  const [step, setStep] = useState("form");
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
    if (step==="results"&&resultsRef.current) resultsRef.current.scrollIntoView({behavior:"smooth"});
  },[step]);

  async function handleResume(e) {
    const file = e.target.files[0];
    if (!file) return;
    setResumeLoading(true);
    setResumeName(file.name);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch(`${BACKEND}/parse-resume`, { method:"POST", body:formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResumeText(data.text);
      if (!skills) setSkills(data.text.slice(0,800));
    } catch(err) {
      setError("Could not read resume: "+err.message);
    }
    setResumeLoading(false);
  }

  async function analyze() {
    if (!role||!level||!skills) { setError("Please fill in role, level, and your current skills."); return; }
    setError("");
    setStep("loading");

    // ✅ Call your OWN backend — Groq API key stays server-side
    try {
      const res = await fetch(`${BACKEND}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          skills,
          experience: experience || "",
          goals: goals || "",
          resumeText: resumeText ? resumeText.slice(0, 1500) : "",
          email: email || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      if (data.error) throw new Error(data.error);

      setResults(data);
      setStep("results");
      if (data.emailSent) setEmailSent(true);
    } catch(e) {
      setError(`Analysis failed: ${e.message || "Please try again."}`);
      setStep("form");
    }
  }

  const rc = results ? results.readinessScore>=70?COLORS.success:results.readinessScore>=40?COLORS.warn:COLORS.danger : COLORS.accent;

  return (
    <div style={{minHeight:"100vh",background:COLORS.bg,color:COLORS.text,fontFamily:"sans-serif",backgroundImage:`radial-gradient(ellipse at 20% 20%,${COLORS.accent2}18 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,${COLORS.accent}10 0%,transparent 60%)`}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{borderBottom:`1px solid ${COLORS.border}`,padding:"20px 32px",display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accent2})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <h1 style={{margin:0,fontSize:18,fontFamily:"'Syne',sans-serif",fontWeight:800}}>STACK<span style={{color:COLORS.accent}}>MATCH</span></h1>
          <p style={{margin:0,fontSize:11,color:COLORS.muted,fontFamily:"monospace"}}>AI-POWERED CAREER INTELLIGENCE</p>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
        {(step==="form"||step==="loading")&&(
          <div>
            <div style={{textAlign:"center",marginBottom:40}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,margin:"0 0 12px",lineHeight:1.1}}>
                Map your path to<br/><span style={{background:`linear-gradient(90deg,${COLORS.accent},${COLORS.accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>mastery</span>
              </h2>
              <p style={{color:COLORS.muted,fontSize:15,maxWidth:480,margin:"0 auto"}}>Tell us where you are and where you want to be.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div>
                <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>TARGET ROLE *</label>
                <select value={role} onChange={e=>setRole(e.target.value)} style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,color:role?COLORS.text:COLORS.muted,fontSize:14,outline:"none",appearance:"none",cursor:"pointer"}}>
                  <option value="">Select a role…</option>
                  {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>TARGET LEVEL *</label>
                <select value={level} onChange={e=>setLevel(e.target.value)} style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,color:level?COLORS.text:COLORS.muted,fontSize:14,outline:"none",appearance:"none",cursor:"pointer"}}>
                  <option value="">Select a level…</option>
                  {LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>UPLOAD RESUME (OPTIONAL)</label>
              <label style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:COLORS.card,border:`1px dashed ${resumeName?COLORS.accent:COLORS.border}`,borderRadius:8,cursor:"pointer"}}>
                <span style={{fontSize:20}}>{resumeLoading?"⏳":resumeName?"✅":"📄"}</span>
                <div>
                  <div style={{fontSize:13,color:resumeName?COLORS.accent:COLORS.text,fontWeight:600}}>{resumeLoading?"Reading resume...":resumeName||"Click to upload your resume"}</div>
                  <div style={{fontSize:11,color:COLORS.muted,marginTop:2}}>Supports .pdf, .docx, .txt</div>
                </div>
                <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleResume} style={{display:"none"}}/>
              </label>
              {resumeName&&<button onClick={()=>{setResumeText("");setResumeName("");setSkills("");}} style={{marginTop:8,fontSize:11,color:COLORS.danger,background:"none",border:"none",cursor:"pointer"}}>✕ Remove resume</button>}
            </div>

            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>YOUR CURRENT SKILLS & EXPERIENCE *</label>
              <textarea value={skills} onChange={e=>setSkills(e.target.value)} placeholder="e.g. 2 years of React, some Node.js, basic SQL…" rows={4} style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,color:COLORS.text,fontSize:14,outline:"none",resize:"vertical",fontFamily:"sans-serif",boxSizing:"border-box"}}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div>
                <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>YEARS OF EXPERIENCE</label>
                <input value={experience} onChange={e=>setExperience(e.target.value)} placeholder="e.g. 2 years" style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,color:COLORS.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>CAREER GOALS</label>
                <input value={goals} onChange={e=>setGoals(e.target.value)} placeholder="e.g. join MAANG…" style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:8,color:COLORS.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:11,fontFamily:"monospace",color:COLORS.muted,marginBottom:8,letterSpacing:1}}>EMAIL — GET REPORT IN INBOX</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{width:"100%",padding:"12px 14px",background:COLORS.card,border:`1px solid ${email?COLORS.accent:COLORS.border}`,borderRadius:8,color:COLORS.text,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              <p style={{fontSize:11,color:COLORS.muted,marginTop:6,fontFamily:"monospace"}}>Optional — we'll email your full report automatically</p>
            </div>

            {error&&<p style={{color:COLORS.danger,fontSize:13,marginBottom:16,fontFamily:"monospace"}}>⚠ {error}</p>}
            {step==="loading"?<Spinner/>:<GlowBtn onClick={analyze}>ANALYZE MY SKILL GAPS →</GlowBtn>}
          </div>
        )}

        {step==="results"&&results&&(
          <div ref={resultsRef}>
            {emailSent&&<div style={{background:`${COLORS.success}15`,border:`1px solid ${COLORS.success}40`,borderRadius:10,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}><span>✅</span><span style={{fontSize:13,color:COLORS.success,fontFamily:"monospace"}}>Report sent to {email}!</span></div>}

            <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:32,marginBottom:24,display:"grid",gridTemplateColumns:"1fr auto",gap:24,alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <Tag color={COLORS.accent}>{role}</Tag>
                  <Tag color={COLORS.accent2}>{level}</Tag>
                </div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,margin:"0 0 10px"}}>Your Analysis is Ready</h2>
                <p style={{color:COLORS.muted,fontSize:14,lineHeight:1.6,maxWidth:500}}>{results.summary}</p>
                <div style={{display:"flex",gap:24,marginTop:20,flexWrap:"wrap"}}>
                  <div><div style={{fontSize:11,color:COLORS.muted,fontFamily:"monospace",marginBottom:4}}>TIME TO READY</div><div style={{fontSize:14,color:COLORS.accent3,fontWeight:600}}>{results.timeToReady}</div></div>
                  <div><div style={{fontSize:11,color:COLORS.muted,fontFamily:"monospace",marginBottom:4}}>SALARY IMPACT</div><div style={{fontSize:14,color:COLORS.success,fontWeight:600}}>{results.salaryImpact}</div></div>
                  {results.atsScore&&<div><div style={{fontSize:11,color:COLORS.muted,fontFamily:"monospace",marginBottom:4}}>ATS SCORE</div><div style={{fontSize:14,fontWeight:600,color:results.atsScore>=70?COLORS.success:results.atsScore>=40?COLORS.warn:COLORS.danger}}>{results.atsScore}/100 — {results.atsLabel}</div></div>}
                </div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{width:110,height:110,borderRadius:"50%",border:`4px solid ${rc}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 0 30px ${rc}50`,background:`${rc}10`}}>
                  <div style={{fontSize:32,fontWeight:800,fontFamily:"'Syne',sans-serif",color:rc}}>{results.readinessScore}</div>
                  <div style={{fontSize:10,color:COLORS.muted,fontFamily:"monospace"}}>/100</div>
                </div>
                <div style={{fontSize:12,color:rc,fontFamily:"monospace",marginTop:8,fontWeight:700}}>{results.readinessLabel}</div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
              <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:12,fontFamily:"monospace",color:COLORS.success,letterSpacing:1}}>✦ TOP STRENGTHS</h3>
                {results.topStrengths?.map((s,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10}}><span style={{color:COLORS.success}}>◆</span><span style={{fontSize:13,lineHeight:1.5}}>{s}</span></div>)}
              </div>
              <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20}}>
                <h3 style={{margin:"0 0 16px",fontSize:12,fontFamily:"monospace",color:COLORS.danger,letterSpacing:1}}>✦ CRITICAL GAPS</h3>
                {results.criticalGaps?.map((g,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10}}><span style={{color:COLORS.danger}}>◆</span><span style={{fontSize:13,lineHeight:1.5}}>{g}</span></div>)}
              </div>
            </div>

            {results.atsScore&&(
              <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:24,marginBottom:24}}>
                <h3 style={{margin:"0 0 20px",fontSize:12,fontFamily:"monospace",color:COLORS.muted,letterSpacing:1}}>✦ ATS RESUME SCORE</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  {results.atsFeedback?.map((item,i)=>(
                    <div key={i} style={{background:COLORS.surface,borderRadius:8,padding:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:12,fontWeight:600,color:COLORS.text,fontFamily:"monospace"}}>{item.category}</span>
                        <span style={{fontSize:12,color:item.score>=70?COLORS.success:item.score>=40?COLORS.warn:COLORS.danger,fontFamily:"monospace"}}>{item.score}/100</span>
                      </div>
                      <div style={{height:6,background:COLORS.border,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                        <div style={{height:"100%",borderRadius:3,width:`${item.score}%`,background:item.score>=70?COLORS.success:item.score>=40?COLORS.warn:COLORS.danger,transition:"width 0.8s ease"}}/>
                      </div>
                      <p style={{fontSize:11,color:COLORS.muted,margin:0,lineHeight:1.4}}>{item.feedback}</p>
                    </div>
                  ))}
                </div>
                {results.atsImprovements?.map((tip,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:8}}><span style={{color:COLORS.accent3}}>→</span><span style={{fontSize:13,lineHeight:1.5}}>{tip}</span></div>)}
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24,marginBottom:24,alignItems:"start"}}>
              <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:24}}>
                <h3 style={{margin:"0 0 20px",fontSize:12,fontFamily:"monospace",color:COLORS.muted,letterSpacing:1}}>SKILL BREAKDOWN</h3>
                {results.skills?.map((s,i)=><SkillBar key={i} skill={s} delay={i*100}/>)}
              </div>
              <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20,textAlign:"center"}}>
                <h3 style={{margin:"0 0 16px",fontSize:12,fontFamily:"monospace",color:COLORS.muted,letterSpacing:1}}>SKILL RADAR</h3>
                <RadarChart skills={results.skills}/>
              </div>
            </div>

            <div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:24,marginBottom:24}}>
              <h3 style={{margin:"0 0 24px",fontSize:12,fontFamily:"monospace",color:COLORS.muted,letterSpacing:1}}>✦ YOUR LEARNING ROADMAP</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                {results.learningPath?.map((phase,i)=>(
                  <div key={i} style={{background:COLORS.surface,borderRadius:10,padding:16,borderTop:`3px solid ${[COLORS.accent,COLORS.accent2,COLORS.accent3][i]}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:[COLORS.accent,COLORS.accent2,COLORS.accent3][i],marginBottom:12,fontFamily:"monospace"}}>{phase.phase}</div>
                    {phase.actions?.map((a,j)=><div key={j} style={{fontSize:12,color:COLORS.text,marginBottom:6,paddingLeft:12,borderLeft:`2px solid ${COLORS.border}`,lineHeight:1.4}}>{a}</div>)}
                    {phase.resources?.length>0&&<div style={{marginTop:12}}>
                      <div style={{fontSize:10,color:COLORS.muted,fontFamily:"monospace",marginBottom:6}}>RESOURCES</div>
                      {phase.resources.map((r,j)=><div key={j} style={{fontSize:11,color:COLORS.muted,marginBottom:4,paddingLeft:12}}>→ {r}</div>)}
                    </div>}
                  </div>
                ))}
              </div>
            </div>

            <GlowBtn onClick={()=>{setStep("form");setResults(null);}}>← ANALYZE AGAIN</GlowBtn>
          </div>
        )}
      </div>
    </div>
  );
}
