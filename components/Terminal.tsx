"use client";
import { useEffect, useRef, useState } from "react";

// Pyodide-backed lab. First Run downloads CPython-in-WASM (~10MB);
// subsequent runs are instant. Auto-detects `import pandas`, `import numpy`
// and lazily loads those wheels too.

const PYODIDE_VERSION = "0.26.2";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const KNOWN_PACKAGES = ["pandas", "numpy", "micropip"];

const EXPECTED: Record<string, { contains?: string[]; equals?: string; hint: string }> = {
  "hello-python":   { equals: "Hello, Python!", hint: "Stdout must be exactly `Hello, Python!`" },
  "fizzbuzz-py":    { equals: "FizzBuzz", hint: "fizzbuzz(15) must print exactly `FizzBuzz`." },
  "make-counter":   { contains: ["1 2 3"], hint: "The three calls should print `1 2 3` on one line." },
  "top-words":      { contains: ["apple", "banana", "3", "2"], hint: "Output should include apple, banana, and their counts 3 and 2." },
  "point-distance": { contains: ["5.0"], hint: "Distance from (0,0) to (3,4) is 5.0." },
  "evens-gen":      { contains: ["[2, 4, 6, 8, 10]"], hint: "Should print `[2, 4, 6, 8, 10]`." },
  "asyncio-gather": { contains: ["[0, 1, 2]"], hint: "asyncio.gather should yield `[0, 1, 2]`." },
  "pandas-groupby": { contains: ["food", "rent"], hint: "Sum-by-category should mention both `food` and `rent`." },
  "free-play":      { hint: "Free-play mode — no verifier. Run anything you want." }
};

const DEFAULT_CODE = `import sys
print(f"Python {sys.version_info.major}.{sys.version_info.minor} in your browser via Pyodide.")
print(sum(x*x for x in range(10)))
`;

declare global {
  interface Window {
    loadPyodide?: (opts?: any) => Promise<any>;
    __pyodide__?: any;
    __pyodideLoading__?: Promise<any>;
  }
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function getPyodide(onStatus: (s: string) => void): Promise<any> {
  if (window.__pyodide__) return window.__pyodide__;
  if (window.__pyodideLoading__) return window.__pyodideLoading__;
  window.__pyodideLoading__ = (async () => {
    onStatus("downloading pyodide runtime (~10MB, cached after first run)…");
    await loadScriptOnce(`${PYODIDE_BASE}pyodide.js`);
    onStatus("initializing CPython…");
    const py = await window.loadPyodide!({ indexURL: PYODIDE_BASE });
    window.__pyodide__ = py;
    return py;
  })();
  return window.__pyodideLoading__;
}

function detectPackages(code: string): string[] {
  const found = new Set<string>();
  for (const pkg of KNOWN_PACKAGES) {
    const re = new RegExp(`(?:^|\\n)\\s*(?:import|from)\\s+${pkg}(?:\\.|\\s|$)`, "m");
    if (re.test(code)) found.add(pkg);
  }
  return [...found];
}

export function Terminal({ verifyId, goal, starter }: { verifyId?: string; goal?: string; starter?: string }) {
  const [code, setCode] = useState<string>(starter ?? DEFAULT_CODE);
  const [stdout, setStdout] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState<{ passed: boolean; message: string } | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setCode(starter ?? DEFAULT_CODE); }, [starter]);

  const run = async () => {
    setRunning(true); setVerdict(null); setStdout(""); setStderr(""); setStatus("");
    let out = ""; let err = "";
    try {
      const py = await getPyodide(setStatus);
      const pkgs = detectPackages(code);
      if (pkgs.length) {
        setStatus(`loading packages: ${pkgs.join(", ")}…`);
        await py.loadPackage(pkgs);
      }
      setStatus("running…");
      py.setStdout({ batched: (s: string) => { out += s + "\n"; } });
      py.setStderr({ batched: (s: string) => { err += s + "\n"; } });
      await py.runPythonAsync(code);
      setStatus("");
    } catch (e: any) {
      err += (e?.message ?? String(e)) + "\n";
      setStatus("");
    } finally {
      setStdout(out);
      setStderr(err);
      setRunning(false);
    }
  };

  const check = () => {
    if (!verifyId) return;
    const spec = EXPECTED[verifyId];
    if (!spec) { setVerdict({ passed: false, message: "No verifier registered for this lab." }); return; }
    const out = stdout.trim();
    if (!out) { setVerdict({ passed: false, message: "Run the code first — no output captured." }); return; }
    if (spec.equals && !out.split("\n").includes(spec.equals) && out !== spec.equals) {
      setVerdict({ passed: false, message: spec.hint }); return;
    }
    if (spec.contains) {
      const missing = spec.contains.filter((s) => !out.includes(s));
      if (missing.length) { setVerdict({ passed: false, message: `Missing: ${missing.join(", ")}. ${spec.hint}` }); return; }
    }
    setVerdict({ passed: true, message: "Output matches the expected shape. Onward." });
  };

  const reset = () => {
    setCode(starter ?? DEFAULT_CODE);
    setStdout(""); setStderr(""); setVerdict(null); setStatus("");
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-glow">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/70" />
          <span className="w-3 h-3 rounded-full bg-amber-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs font-mono text-slate-400">pyodide · CPython 3.12 in WASM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className="cursor-pointer text-xs px-3 py-1 rounded-lg bg-accent text-slate-900 font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors duration-200"
          >
            {running ? "Running…" : "▶ Run"}
          </button>
          {verifyId && verifyId !== "free-play" && (
            <button onClick={check} className="cursor-pointer text-xs px-3 py-1 rounded-lg bg-accent2/15 text-accent2 border border-accent2/40 hover:bg-accent2/25 transition-colors duration-200">
              Check my work
            </button>
          )}
          <button onClick={reset} className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-slate-700 hover:border-rose-500/60 hover:text-rose-300 transition-colors duration-200">
            Reset
          </button>
        </div>
      </div>

      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full bg-slate-950 text-slate-100 font-mono text-sm p-4 outline-none resize-y min-h-[260px] leading-relaxed"
      />

      <div className="border-t border-slate-800 bg-black/40 p-4 font-mono text-xs space-y-2 max-h-72 overflow-auto">
        {!stdout && !stderr && !status && !running && (
          <div className="text-slate-600">stdout / stderr will appear here after you click Run.</div>
        )}
        {status && <div className="text-amber-300">{status}</div>}
        {stdout && (
          <div>
            <div className="text-emerald-400 mb-1">stdout</div>
            <pre className="whitespace-pre-wrap text-slate-200">{stdout}</pre>
          </div>
        )}
        {stderr && (
          <div>
            <div className="text-rose-400 mb-1">stderr</div>
            <pre className="whitespace-pre-wrap text-rose-200/90">{stderr}</pre>
          </div>
        )}
      </div>

      {verdict && (
        <div className={`m-4 mt-0 p-4 rounded-xl border text-sm animate-slide-up ${
          verdict.passed ? "border-accent/50 bg-accent/10 text-accent" : "border-danger/50 bg-danger/10 text-rose-300"
        }`}>
          <span className="font-mono mr-2">{verdict.passed ? "✓ PASS" : "✗ FAIL"}</span>
          {verdict.message}
        </div>
      )}
      {goal && !verdict && <div className="px-4 pb-4 text-xs text-slate-500 font-mono">goal: {goal}</div>}
    </div>
  );
}
