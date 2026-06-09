import { Terminal } from "@/components/Terminal";

export default function LabPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">The Lab</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Real CPython 3.12 in your browser via <span className="font-mono text-accent2">Pyodide</span>. First run downloads
          the runtime (~10 MB, cached). After that, every <span className="font-mono text-accent">▶ Run</span> is local —
          no server, no rate limit. <code className="text-accent">pandas</code> and <code className="text-accent">numpy</code> load on demand when you import them.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        <Terminal verifyId="free-play" />
        <aside className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 h-fit">
          <h3 className="text-sm uppercase tracking-wider text-muted mb-3">Try these</h3>
          <ul className="space-y-2 text-sm font-mono text-slate-300">
            <li className="text-accent">[x*x for x in range(10)]</li>
            <li className="text-accent">sorted(set("mississippi"))</li>
            <li className="text-accent">from collections import Counter</li>
            <li className="text-accent">import pandas as pd</li>
            <li className="text-accent">import asyncio; asyncio.run(...)</li>
          </ul>
          <div className="mt-5 pt-5 border-t border-slate-800 text-xs text-slate-500">
            CPython 3.12, full stdlib, async/await, dataclasses, pattern matching — all available. Use the chapter labs for graded exercises.
          </div>
        </aside>
      </div>
    </div>
  );
}
