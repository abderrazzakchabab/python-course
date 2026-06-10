import Link from "next/link";
import { notFound } from "next/navigation";
import { chapters, getChapter } from "@/lib/curriculum";
import { questions } from "@/lib/quiz";
import { Markdown } from "@/components/Markdown";
import { Quiz } from "@/components/Quiz";
import { Terminal } from "@/components/Terminal";

export function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }));
}

export default function ChapterPage({ params }: { params: { id: string } }) {
  const c = getChapter(params.id);
  if (!c) notFound();
  const idx = chapters.findIndex((x) => x.id === c.id);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const chapterQs = questions.filter((q) => q.chapterId === c.id);

  return (
    <article className="space-y-12">
      <header>
        <div className="text-xs font-mono text-muted">Chapter {String(c.number).padStart(2, "0")} · {c.level} · {c.duration}</div>
        <h1 className="text-4xl font-semibold mt-1">{c.title}</h1>
        <p className="text-slate-400 mt-3 text-lg max-w-3xl">{c.summary}</p>
      </header>

      <section className="space-y-8">
        {c.sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold mb-2">{s.heading}</h2>
            <Markdown source={s.body} />
          </div>
        ))}
      </section>

      {c.keyCommands.length > 0 && (
        <section className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
          <h3 className="text-sm uppercase tracking-wider text-muted mb-3">Key commands</h3>
          <ul className="space-y-1 font-mono text-sm">
            {c.keyCommands.map((k) => (
              <li key={k} className="text-accent before:content-['$_'] before:text-slate-600">{k}</li>
            ))}
          </ul>
        </section>
      )}

      {c.exercises && c.exercises.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Exercises</h2>
          <div className="space-y-3">
            {c.exercises.map((ex, i) => (
              <details key={i} className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                <summary className="cursor-pointer text-slate-200 font-medium list-none flex items-start gap-3">
                  <span className="text-accent2 font-mono text-sm mt-0.5">Q{i + 1}.</span>
                  <span className="flex-1">{ex.question}</span>
                  <span className="text-xs text-slate-500 group-open:hidden">show answer</span>
                  <span className="text-xs text-slate-500 hidden group-open:inline">hide</span>
                </summary>
                {ex.hint && <div className="mt-3 text-sm text-slate-400 italic">Hint: {ex.hint}</div>}
                <div className="mt-3 pl-7 text-sm text-slate-300 border-l border-accent/30 whitespace-pre-wrap">{ex.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {c.lab && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Lab</h2>
          <div className="p-5 rounded-2xl border border-accent/30 bg-accent/5">
            <div className="text-xs uppercase tracking-wider text-accent mb-2">Goal</div>
            <div className="text-slate-200">{c.lab.goal}</div>
            <ol className="mt-4 space-y-1 list-decimal pl-5 text-slate-300 text-sm">
              {c.lab.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          <Terminal verifyId={c.lab.verifyId} goal={c.lab.goal} starter={c.lab.starter} />
        </section>
      )}

      {chapterQs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Check your understanding</h2>
          <Quiz questions={chapterQs} />
        </section>
      )}

      <nav className="flex justify-between pt-8 border-t border-slate-800">
        <div>
          {prev && (
            <Link href={`/chapters/${prev.id}`} className="cursor-pointer text-slate-300 hover:text-accent2 transition-colors">
              ← {prev.title}
            </Link>
          )}
        </div>
        <div>
          {next ? (
            <Link href={`/chapters/${next.id}`} className="cursor-pointer text-slate-300 hover:text-accent transition-colors">
              {next.title} →
            </Link>
          ) : (
            <Link href="/quiz" className="cursor-pointer text-accent hover:underline">Take the full quiz →</Link>
          )}
        </div>
      </nav>
    </article>
  );
}
