import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Search, Sparkles, FileText, ArrowUpRight, Loader2, CheckCircle2, Circle, Copy, Download } from "lucide-react";
import "./styles.css";

const API = "http://localhost:8000";

const nodes = [
  { key: "Planner", icon: BrainCircuit, desc: "Break the mission into actions" },
  { key: "Research", icon: Search, desc: "Gather fresh web information" },
  { key: "Synthesis", icon: Sparkles, desc: "Connect and summarize findings" },
  { key: "Report", icon: FileText, desc: "Deliver a polished result" },
];

function App() {
  const [task, setTask] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!task.trim() || running) return;
    setRunning(true);
    setResult(null);
    setActive(0);
    const timer = setInterval(() => setActive(v => Math.min(v + 1, 3)), 2200);
    try {
      const res = await fetch(`${API}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      });
      const data = await res.json();
      setResult(data);
      setActive(3);
    } catch (e) {
      setResult({ report: "Could not reach the backend. Make sure start.bat is running.", status: ["Backend connection failed"] });
    } finally {
      clearInterval(timer);
      setRunning(false);
    }
  }

  function downloadReport() {
    if (!result?.report) return;
    const blob = new Blob([result.report], {type: "text/markdown"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "autonomous-agent-report.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyReport() {
    if (!result?.report) return;
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  }

  return (
    <div className="app">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="grid" />

      <header className="topbar">
        <div className="brand"><span className="brand-mark"><BrainCircuit size={19}/></span> NEURA</div>
        <div className="pill"><span className="dot"/> LOCAL AI • $0 API COST</div>
      </header>

      <main>
        <section className="hero">
          <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="eyebrow">
            <Sparkles size={15}/> AUTONOMOUS RESEARCH ENGINE
          </motion.div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.1}}>
            Give it a mission.<br/><span>Watch it think.</span>
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}}>
            An autonomous AI agent that plans multi-step work, researches the web,
            synthesizes information, and delivers a finished report.
          </motion.p>

          <motion.div className="command" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.35}}>
            <div className="command-label"><span className="live"/> MISSION CONTROL</div>
            <textarea
              value={task}
              onChange={e=>setTask(e.target.value)}
              placeholder="e.g. Research the top AI coding tools and create a comparison report..."
              onKeyDown={e=>{ if(e.ctrlKey && e.key==="Enter") run(); }}
            />
            <div className="command-bottom">
              <span>Ctrl + Enter to launch</span>
              <button onClick={run} disabled={running || !task.trim()}>
                {running ? <><Loader2 className="spin" size={17}/> Running</> : <>Launch mission <ArrowUpRight size={17}/></>}
              </button>
            </div>
          </motion.div>
        </section>

        <section className="workflow">
          <div className="section-head"><span>01</span><h2>Agent workflow</h2><div/></div>
          <div className="nodes">
            {nodes.map((n,i)=>{
              const Icon=n.icon;
              const done = result && (i < 3 || !running);
              const on = running ? i===active : false;
              return <React.Fragment key={n.key}>
                <motion.div className={`node ${on?"active":""} ${done?"done":""}`} animate={{y:on?-7:0}} transition={{type:"spring",stiffness:250}}>
                  <div className="node-icon">{done ? <CheckCircle2 size={22}/> : <Icon size={22}/>}</div>
                  <div><b>{n.key}</b><small>{n.desc}</small></div>
                  <span className="node-state">{on ? "RUNNING" : done ? "DONE" : "IDLE"}</span>
                </motion.div>
                {i<nodes.length-1 && <div className={`connector ${active>i || result ? "lit":""}`}><span/></div>}
              </React.Fragment>
            })}
          </div>
        </section>

        <AnimatePresence>
          {result && (
            <motion.section className="result" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <div className="section-head"><span>02</span><h2>Mission output</h2><div/></div>
              <div className="result-grid">
                <div className="side-card">
                  <label>MISSION</label><p>{result.task || task}</p>
                  <label>ACTIVITY</label>
                  {(result.status||[]).map((s,i)=><div className="activity" key={i}><CheckCircle2 size={15}/>{s}</div>)}
                </div>
                <article className="report">
                  <div className="report-head">
                    <div><span className="report-tag">GENERATED REPORT</span><h3>Research synthesis</h3></div>
                    <div className="actions">
                      <button onClick={copyReport}>{copied?<CheckCircle2 size={16}/>:<Copy size={16}/>}</button>
                      <button onClick={downloadReport}><Download size={16}/></button>
                    </div>
                  </div>
                  <pre>{result.report}</pre>
                </article>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <footer>NEURA / Autonomous AI Agent <span>Built with LangGraph + Ollama + React</span></footer>
    </div>
  )
}

createRoot(document.getElementById("root")).render(<App />);