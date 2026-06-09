export interface Question {
  id: string;
  chapterId: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    id: "q-hello-1",
    chapterId: "hello-python",
    level: "beginner",
    prompt: "Why avoid `pip install` into the system Python?",
    choices: [
      "It's slower than a venv",
      "It can break OS tools that depend on specific package versions, and it conflicts across projects",
      "System Python doesn't support pip",
      "It requires root permission on every machine"
    ],
    answer: 1,
    explanation: "The system Python belongs to the OS. Modifying its packages can break system tooling and leaves you with no way to isolate per-project dependencies. Always use a venv (or `uv`, `poetry`, `pyenv`)."
  },
  {
    id: "q-hello-2",
    chapterId: "hello-python",
    level: "beginner",
    prompt: "What does `python -i script.py` do that `python script.py` doesn't?",
    choices: [
      "Runs the script in 'interactive' performance mode",
      "Drops into the REPL after the script finishes, with all the script's variables still bound",
      "Disables imports, for security",
      "Installs the script's dependencies first"
    ],
    answer: 1,
    explanation: "`-i` is the underrated debugger. The script runs, then you land in the REPL where you can poke at every variable that was defined — much cheaper than adding prints and re-running."
  },
  {
    id: "q-types-1",
    chapterId: "types-control-flow",
    level: "beginner",
    prompt: "Which of these is NOT falsy?",
    choices: ["`[]`", "`'0'`", "`0`", "`None`"],
    answer: 1,
    explanation: "`'0'` is a non-empty string, which is truthy. `0` (integer zero) is falsy. The full falsy list: `False, None, 0, 0.0, '', [], {}, set(), ()`."
  },
  {
    id: "q-types-2",
    chapterId: "types-control-flow",
    level: "beginner",
    prompt: "Why prefer `[x*x for x in xs]` over `for x in xs: out.append(x*x)`?",
    choices: [
      "List comprehensions are syntactically required for transforms",
      "CPython has a fast path for comprehensions; they're shorter and usually faster",
      "Comprehensions are evaluated lazily",
      "`.append` mutates the wrong scope"
    ],
    answer: 1,
    explanation: "Comprehensions emit specialized bytecode that's faster than the explicit append loop. They're also tighter to read once you're used to them. Reach for them first; fall back to a loop only when logic gets gnarly."
  },
  {
    id: "q-fn-1",
    chapterId: "functions-modules",
    level: "beginner",
    prompt: "When is the default value in `def f(x, lst=[])` created?",
    choices: [
      "Once per call",
      "Once, at function-definition time — shared across every call that doesn't override it",
      "Never; defaults are evaluated lazily",
      "Once per module import"
    ],
    answer: 1,
    explanation: "The notorious mutable-default gotcha. Use `lst=None` and create a fresh list inside the function. Asked in roughly half of Python interviews."
  },
  {
    id: "q-fn-2",
    chapterId: "functions-modules",
    level: "beginner",
    prompt: "Inside a closure, why is `nonlocal x` needed to mutate a captured variable?",
    choices: [
      "It's a deprecation warning suppression",
      "Without it, `x = ...` creates a new local variable that shadows the enclosing one",
      "Python forbids reading enclosing variables without it",
      "It's purely a documentation aid"
    ],
    answer: 1,
    explanation: "Reading from an enclosing scope works automatically. *Writing* requires `nonlocal` (for nested function scopes) or `global` (for module scope), otherwise Python assumes you mean to create a new local."
  },
  {
    id: "q-ds-1",
    chapterId: "data-structures",
    level: "intermediate",
    prompt: "You need to test `user in container` ~1M times. Which container?",
    choices: [
      "`list` — fastest indexing",
      "`tuple` — immutable, fastest membership",
      "`set` — O(1) `in`, vs. O(n) for list/tuple",
      "`dict` — but only if you use the keys"
    ],
    answer: 2,
    explanation: "`in` on a list/tuple scans linearly. `in` on a set or dict-keys is O(1) average. For pure membership, set. For key→value lookups, dict."
  },
  {
    id: "q-ds-2",
    chapterId: "data-structures",
    level: "intermediate",
    prompt: "What's the cleanest replacement for `if k in d: d[k].append(v) else: d[k] = [v]`?",
    choices: [
      "`d.setdefault(k, []).append(v)`",
      "`d[k] |= [v]`",
      "`d.update({k: v})`",
      "`d.get(k, []).append(v)`"
    ],
    answer: 0,
    explanation: "`setdefault` returns the value, creating the key with the default if missing. The `.get(...).append(...)` version is a common bug — it returns a NEW list that nothing references when the key is missing."
  },
  {
    id: "q-oop-1",
    chapterId: "oop-typing",
    level: "intermediate",
    prompt: "What does `@dataclass(frozen=True, slots=True)` give you that a bare `class` doesn't?",
    choices: [
      "Auto __init__/__repr__/__eq__, hashability, fixed slot layout, ~half the memory",
      "Automatic SQL persistence",
      "JSON serialization",
      "Type-checking at runtime"
    ],
    answer: 0,
    explanation: "The dataclass machinery generates the dunders for you; `frozen` makes the class hashable (and immutable); `slots` replaces the per-instance `__dict__` with a fixed layout, saving memory and speeding up attribute access."
  },
  {
    id: "q-oop-2",
    chapterId: "oop-typing",
    level: "intermediate",
    prompt: "Are Python type hints enforced at runtime?",
    choices: [
      "Yes, the interpreter raises TypeError on mismatch",
      "Only inside `def` bodies",
      "No — they're metadata. A static checker (mypy/pyright) reads them; the runtime ignores them",
      "Only when running with `python -O`"
    ],
    answer: 2,
    explanation: "Type hints are stored on the function/class (`__annotations__`) but never checked by CPython itself. That's both the freedom and the weakness; pair them with mypy/pyright in CI."
  },
  {
    id: "q-err-1",
    chapterId: "errors-iterators-context",
    level: "advanced",
    prompt: "Why do experienced Python devs avoid bare `except:` (or `except Exception:` without re-raise)?",
    choices: [
      "It's slower than catching specific exceptions",
      "It swallows bugs — KeyboardInterrupt, programming errors, everything — and hides them silently",
      "It causes memory leaks",
      "It's deprecated in 3.12"
    ],
    answer: 1,
    explanation: "Broad `except` blocks make code 'work' by hiding the reasons it shouldn't. Catch the specific exception you can handle; let the rest propagate so the call site (or your error tracker) sees them."
  },
  {
    id: "q-err-2",
    chapterId: "errors-iterators-context",
    level: "advanced",
    prompt: "What does a function with a `yield` statement return when you call it?",
    choices: [
      "The first yielded value",
      "A list of all values it would yield",
      "A generator object — execution hasn't started yet; it runs on iteration",
      "`None` until you iterate it"
    ],
    answer: 2,
    explanation: "Calling a generator function returns a generator (an iterator). The function body doesn't execute until something calls `next()` (directly or via a `for` loop). That's the laziness that makes streaming pipelines possible."
  },
  {
    id: "q-conc-1",
    chapterId: "concurrency",
    level: "advanced",
    prompt: "You have a CPU-bound function and want to use all 8 cores. What do you reach for?",
    choices: [
      "`threading.Thread` — threads use multiple cores",
      "`asyncio.gather` — async runs in parallel",
      "`ProcessPoolExecutor` / `multiprocessing` — sidesteps the GIL",
      "`time.sleep(0)` between iterations to yield"
    ],
    answer: 2,
    explanation: "The GIL serializes Python bytecode across threads. For real CPU parallelism you need separate processes (or a C-level library like numpy that releases the GIL internally)."
  },
  {
    id: "q-conc-2",
    chapterId: "concurrency",
    level: "advanced",
    prompt: "What's the danger of calling a blocking library (like `requests.get`) inside an `async def`?",
    choices: [
      "It raises a SyntaxError",
      "It blocks the entire event loop — no other coroutine on that loop can make progress until it returns",
      "It silently spawns a new thread",
      "Nothing — async functions automatically offload to a thread pool"
    ],
    answer: 1,
    explanation: "An async function only relinquishes control at `await`. A blocking call doesn't `await` — the whole event loop stalls. Use `await asyncio.to_thread(requests.get, url)` to push it to a worker thread."
  },
  {
    id: "q-pandas-1",
    chapterId: "pandas-startup-capstone",
    level: "expert",
    prompt: "Why are vectorized pandas operations 10–1000x faster than a Python `for` row loop?",
    choices: [
      "pandas uses parallel threads transparently",
      "Columns are typed numpy arrays — the inner loop runs in C, not the Python VM",
      "The data is cached in shared memory",
      "It's not — `for` row loops are actually faster"
    ],
    answer: 1,
    explanation: "A `df['col'] * 2` dispatches to numpy, where the loop is a tight C loop over contiguous memory. A Python row loop pays interpreter overhead per cell. The 'avoid the for loop' mantra is the whole performance story."
  },
  {
    id: "q-pandas-2",
    chapterId: "pandas-startup-capstone",
    level: "expert",
    prompt: "What's `df.groupby('category')['amount'].sum()` doing?",
    choices: [
      "Filtering rows where category=='amount'",
      "Partitioning rows by category, then summing the amount column within each partition",
      "Sorting rows by category and totalling amount column",
      "Returning the count of distinct categories"
    ],
    answer: 1,
    explanation: "Split-apply-combine: split rows by the grouping column, apply an aggregation to a value column inside each group, combine the results into a labeled Series/DataFrame. The single most-used pandas pattern."
  }
];
