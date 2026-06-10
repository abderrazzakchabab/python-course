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
    id: "q-hello-1", chapterId: "hello-python", level: "beginner",
    prompt: "Why avoid `pip install` into the system Python?",
    choices: ["It's slower than a venv", "It can break OS tools that depend on specific package versions, and it conflicts across projects", "System Python doesn't support pip", "It requires root on every machine"],
    answer: 1, explanation: "The system Python belongs to the OS. Modifying its packages can break system tooling and leaves you with no way to isolate per-project dependencies."
  },
  {
    id: "q-hello-2", chapterId: "hello-python", level: "beginner",
    prompt: "What does `python -i script.py` do?",
    choices: ["Runs in 'interactive' performance mode", "Drops into the REPL after the script finishes with all variables still bound", "Disables imports for security", "Installs the script's dependencies first"],
    answer: 1, explanation: "`-i` is the underrated debugger. The script runs, then you land in the REPL with every variable bound — much cheaper than adding prints and re-running."
  },
  {
    id: "q-types-1", chapterId: "types-control-flow", level: "beginner",
    prompt: "Which is NOT falsy?", choices: ["`[]`", "`'0'`", "`0`", "`None`"],
    answer: 1, explanation: "`'0'` is a non-empty string, which is truthy. `0` is falsy."
  },
  {
    id: "q-types-2", chapterId: "types-control-flow", level: "beginner",
    prompt: "Why prefer `[x*x for x in xs]` over `for x in xs: out.append(x*x)`?",
    choices: ["Required syntax for transforms", "CPython has a fast path; they're shorter and usually faster", "Comprehensions are lazy", "`.append` mutates the wrong scope"],
    answer: 1, explanation: "Comprehensions emit specialized bytecode that's faster than the explicit append loop."
  },
  {
    id: "q-fn-1", chapterId: "functions-modules", level: "beginner",
    prompt: "When is the default value in `def f(x, lst=[])` created?",
    choices: ["Once per call", "Once, at function-definition time, shared across calls", "Lazily", "Once per import"],
    answer: 1, explanation: "The notorious mutable-default gotcha. Use `lst=None` and create a fresh list inside the function."
  },
  {
    id: "q-fn-2", chapterId: "functions-modules", level: "beginner",
    prompt: "Why does `nonlocal x` exist?",
    choices: ["Deprecation suppression", "Without it, `x = ...` creates a new local that shadows the enclosing one", "To allow reading enclosing scope", "Documentation aid"],
    answer: 1, explanation: "Reading from enclosing scope works automatically. *Writing* requires `nonlocal` (nested) or `global` (module)."
  },
  {
    id: "q-fn-3", chapterId: "functions-modules", level: "intermediate",
    prompt: "What does `@functools.wraps(fn)` do inside a decorator?",
    choices: ["Catches exceptions", "Copies the wrapped function's metadata (__name__, __doc__, signature) onto the wrapper", "Caches the return value", "Inlines the function for speed"],
    answer: 1, explanation: "Without `wraps`, your decorated function looks like `wrapper` to debuggers, `help()`, and pytest discovery."
  },
  {
    id: "q-ds-1", chapterId: "data-structures", level: "intermediate",
    prompt: "You test `user in container` 1M times. Which container?",
    choices: ["`list` — fastest indexing", "`tuple` — immutable", "`set` — O(1) `in` vs O(n) for list/tuple", "`dict` — only with keys"],
    answer: 2, explanation: "`in` on list/tuple is linear. On a set or dict-keys, O(1) average."
  },
  {
    id: "q-ds-2", chapterId: "data-structures", level: "intermediate",
    prompt: "Cleanest replacement for `if k in d: d[k].append(v) else: d[k] = [v]`?",
    choices: ["`d.setdefault(k, []).append(v)`", "`d[k] |= [v]`", "`d.update({k: v})`", "`d.get(k, []).append(v)`"],
    answer: 0, explanation: "`setdefault` returns the value, creating with the default if missing. `.get(...).append(...)` is a bug — it returns a NEW list that nothing references."
  },
  {
    id: "q-ds-3", chapterId: "data-structures", level: "intermediate",
    prompt: "Why is `queue.pop(0)` on a list bad for FIFOs?",
    choices: ["It's O(n) — shifts every remaining element", "It mutates the list during iteration", "It returns the wrong type", "It raises on empty"],
    answer: 0, explanation: "Use `collections.deque` for O(1) popleft."
  },
  {
    id: "q-oop-1", chapterId: "oop-deep", level: "intermediate",
    prompt: "What's the MRO of `class D(B, C)` where B,C both inherit A?",
    choices: ["D, B, A, C, A", "D, B, C, A (C3 linearization)", "D, A, B, C", "Undefined — Python forbids diamond inheritance"],
    answer: 1, explanation: "C3 linearization produces `D, B, C, A`. `super()` follows this, not the lexical parent. Visible via `D.__mro__`."
  },
  {
    id: "q-oop-2", chapterId: "oop-deep", level: "intermediate",
    prompt: "Difference between ABC and Protocol?",
    choices: ["No real difference — Protocol is an alias", "ABC requires inheritance and checks at instantiation; Protocol is structural (duck typing) and checked by mypy", "Protocol is faster", "ABC works only in 3.12+"],
    answer: 1, explanation: "ABCs are nominal (you must inherit). Protocols are structural — any class with matching methods conforms, no inheritance needed. Modern code prefers Protocol."
  },
  {
    id: "q-oop-3", chapterId: "oop-deep", level: "advanced",
    prompt: "What does `__slots__` actually do?",
    choices: ["Marks attributes as private", "Replaces per-instance __dict__ with a fixed C-array layout, saving memory and speeding attribute access", "Locks the class against subclassing", "Required for frozen dataclasses"],
    answer: 1, explanation: "~40% less memory per instance and slightly faster attribute access. Use for classes you instantiate by the million."
  },
  {
    id: "q-dc-1", chapterId: "dataclasses-typing", level: "intermediate",
    prompt: "Why does `field(default_factory=list)` exist instead of `= []`?",
    choices: ["Performance", "`= []` evaluates once at class creation, sharing the list across all instances (mutable-default trap)", "Stylistic preference", "Required for slots"],
    answer: 1, explanation: "Dataclasses actually refuse bare mutable defaults and force you to use `default_factory`."
  },
  {
    id: "q-dc-2", chapterId: "dataclasses-typing", level: "intermediate",
    prompt: "When pydantic vs. dataclass?",
    choices: ["Always pydantic — it's strictly better", "pydantic at trust boundaries (HTTP, JSON, LLM output) for parse+validate; dataclass internally for trusted data", "pydantic only in async code", "dataclass only in libraries"],
    answer: 1, explanation: "pydantic does validation/serialization at boundaries. Internally, dataclass is lighter."
  },
  {
    id: "q-err-1", chapterId: "errors-iterators-context", level: "advanced",
    prompt: "Why do experienced devs avoid `except Exception:` without re-raise?",
    choices: ["Slow", "Swallows bugs — programming errors, system signals — and hides them silently", "Memory leaks", "Deprecated in 3.12"],
    answer: 1, explanation: "Broad excepts hide why code shouldn't be working. Catch the specific exception; let the rest propagate."
  },
  {
    id: "q-err-2", chapterId: "errors-iterators-context", level: "advanced",
    prompt: "What does a `yield`-containing function return when called?",
    choices: ["The first yielded value", "A list of all yields", "A generator — body hasn't run yet", "None until iterated"],
    answer: 2, explanation: "Calling returns a generator. Body executes on `next()`/`for`. That's the laziness that makes streaming pipelines possible."
  },
  {
    id: "q-err-3", chapterId: "errors-iterators-context", level: "advanced",
    prompt: "Difference between `raise X` and `raise X from y`?",
    choices: ["Identical", "`from` sets `__cause__` (explicit chain); bare raise sets `__context__` (implicit)", "`from` suppresses the traceback", "`from` is only for async"],
    answer: 1, explanation: "Use `from` when translating one exception into another to preserve the cause."
  },
  {
    id: "q-conc-1", chapterId: "concurrency", level: "advanced",
    prompt: "CPU-bound work across 8 cores — what do you reach for?",
    choices: ["`threading.Thread`", "`asyncio.gather`", "`ProcessPoolExecutor` / multiprocessing — sidesteps the GIL", "`time.sleep(0)`"],
    answer: 2, explanation: "GIL serializes Python bytecode across threads. Use separate processes or numpy (which releases the GIL in C)."
  },
  {
    id: "q-conc-2", chapterId: "concurrency", level: "advanced",
    prompt: "Danger of calling blocking `requests.get` inside `async def`?",
    choices: ["SyntaxError", "Blocks the entire event loop — no other coroutine progresses until it returns", "Silently threads it", "Nothing — async auto-offloads"],
    answer: 1, explanation: "Async only yields at `await`. Blocking calls stall the loop. Use `await asyncio.to_thread(...)`."
  },
  {
    id: "q-file-1", chapterId: "file-io-data-formats", level: "advanced",
    prompt: "Why pass `encoding='utf-8'` to `open()` explicitly?",
    choices: ["Required for speed", "Default has historically been locale-dependent — explicit prevents 'works on Mac, breaks on Linux' bugs", "Forced by mypy", "Enables binary mode"],
    answer: 1, explanation: "Until 3.15, the default depends on the locale. Always be explicit."
  },
  {
    id: "q-file-2", chapterId: "file-io-data-formats", level: "advanced",
    prompt: "Why is Parquet much faster than CSV for analytics?",
    choices: ["More popular", "Columnar layout (column pruning), compression, embedded typed schema — no parsing overhead", "Smaller files only", "Auto-indexes rows"],
    answer: 1, explanation: "Reading 2 of 200 columns reads ~1% of bytes. Compressed 4–10×. Typed."
  },
  {
    id: "q-file-3", chapterId: "file-io-data-formats", level: "advanced",
    prompt: "Why is `pickle.load(untrusted_file)` dangerous?",
    choices: ["Slow", "Pickle executes arbitrary code on load — equivalent to running attacker-supplied Python", "Wrong encoding", "Returns None"],
    answer: 1, explanation: "A crafted pickle can `__reduce__` to `os.system('rm -rf ~')`. Only unpickle trusted data."
  },
  {
    id: "q-numpy-1", chapterId: "numpy-foundations", level: "advanced",
    prompt: "Broadcast shape of `(5, 1, 4)` and `(3, 4)`?",
    choices: ["Error", "`(5, 3, 4)` — right-align, the 1 matches the 3, leading dim is 5", "`(5, 4)`", "`(15, 4)`"],
    answer: 1, explanation: "Right-align trailing dims; size 1 broadcasts to anything; missing leading dims are treated as 1 and broadcast."
  },
  {
    id: "q-numpy-2", chapterId: "numpy-foundations", level: "advanced",
    prompt: "`x.sum(axis=0)` on shape `(3, 4)` gives shape:",
    choices: ["scalar", "`(4,)` — axis 0 (rows) collapsed", "`(3,)`", "`(3, 1)`"],
    answer: 1, explanation: "axis=k collapses dimension k. Use `keepdims=True` to preserve it for broadcasting."
  },
  {
    id: "q-numpy-3", chapterId: "numpy-foundations", level: "advanced",
    prompt: "Basic vs. fancy indexing — copy or view?",
    choices: ["Both views", "Both copies", "Basic (slices, ints) returns views; fancy (bool, int arrays) returns copies", "Depends on dtype"],
    answer: 2, explanation: "That's why `a[mask] = 0` works but `a[mask][a[mask]>5] = 0` doesn't — second mask is on a copy."
  },
  {
    id: "q-pandas-1", chapterId: "pandas-deep", level: "expert",
    prompt: "Why are vectorized pandas ops 10–1000× faster than a row `for` loop?",
    choices: ["Parallel threads", "Columns are numpy arrays — inner loop runs in C, not the Python VM", "Caching", "It's not — loops are faster"],
    answer: 1, explanation: "`df['col'] * 2` dispatches to numpy, a tight C loop over contiguous memory."
  },
  {
    id: "q-pandas-2", chapterId: "pandas-deep", level: "expert",
    prompt: "Why does `df['x'][df.y > 0] = 1` sometimes silently fail?",
    choices: ["Wrong dtype", "Chained indexing — `df['x']` may return a copy; the assignment hits the copy, not the original", "Boolean masks not supported", "Requires `.loc`"],
    answer: 1, explanation: "Use `df.loc[df.y > 0, 'x'] = 1` — single indexing op, guaranteed in-place."
  },
  {
    id: "q-pandas-3", chapterId: "pandas-deep", level: "expert",
    prompt: "Difference between `groupby().agg()` and `groupby().transform()`?",
    choices: ["Identical", "`agg` reduces to one row per group; `transform` broadcasts back to the original shape", "`transform` is lazy", "`agg` only works on numerics"],
    answer: 1, explanation: "`transform` is how you compute group-relative features (z-score within group, rank within group)."
  },
  {
    id: "q-pandas-4", chapterId: "pandas-deep", level: "expert",
    prompt: "Why pass `validate='m:1'` to `merge`?",
    choices: ["Style", "Asserts expected cardinality; pandas raises if your right side has duplicates that would inflate row count", "Faster merge", "Required for left joins"],
    answer: 1, explanation: "Catches the most common 'why did totals double?' bug at merge time."
  },
  {
    id: "q-clean-1", chapterId: "data-cleaning-sql", level: "expert",
    prompt: "Why use `pd.to_numeric(s, errors='coerce')` instead of strict parsing?",
    choices: ["Faster", "Bad rows become NaN so you keep the rest; let downstream decide to drop/fill/flag", "Strict parsing doesn't exist", "Required for ints"],
    answer: 1, explanation: "Strict raises on the first bad row. Coerce keeps the data flowing."
  },
  {
    id: "q-clean-2", chapterId: "data-cleaning-sql", level: "expert",
    prompt: "Why never f-string user input into SQL?",
    choices: ["Style", "SQL injection — user can terminate the string and inject arbitrary SQL", "Performance", "Encoding issues only"],
    answer: 1, explanation: "Always parameterize: `text('... WHERE id = :id')`, pass `{'id': value}`."
  },
  {
    id: "q-clean-3", chapterId: "data-cleaning-sql", level: "expert",
    prompt: "When DuckDB over pandas?",
    choices: ["Never", "JOIN/GROUPBY-heavy work, querying Parquet on disk, SQL more readable, data exceeds RAM (DuckDB streams)", "Only for small data", "Only with Postgres"],
    answer: 1, explanation: "In-process, columnar, vectorized C++. Often 10× faster than pandas on the same machine."
  },
  {
    id: "q-viz-1", chapterId: "visualization-eda", level: "expert",
    prompt: "Why prefer `fig, ax = plt.subplots()` over `plt.plot()`?",
    choices: ["Faster", "Explicit Figure/Axes you can compose, save, place into grids — pyplot relies on fragile global state", "Required for color", "Only API mpl supports"],
    answer: 1, explanation: "The OO API survives notebook re-execution and multi-panel layouts."
  },
  {
    id: "q-viz-2", chapterId: "visualization-eda", level: "expert",
    prompt: "What does `sns.pairplot(df, hue='target')` surface in 5 seconds?",
    choices: ["Nothing useful", "Per-pair scatterplots colored by target — which features separate classes, multicollinearity, target leakage", "Just histograms", "Confidence intervals"],
    answer: 1, explanation: "Run it early — it catches leaky features that would otherwise produce a 'too good' model."
  },
  {
    id: "q-ml-1", chapterId: "ml-sklearn", level: "expert",
    prompt: "Why scale features *inside* a Pipeline, not before split?",
    choices: ["Style", "Fitting on full data leaks test-set mean/std into training; Pipeline fits on train only during cv", "Required by sklearn", "Speed"],
    answer: 1, explanation: "The Pipeline guarantees the same preprocessing flow used in training is used in serving — and that CV folds don't leak."
  },
  {
    id: "q-ml-2", chapterId: "ml-sklearn", level: "expert",
    prompt: "Why never random-split time-series data?",
    choices: ["Slower", "It puts future data in the train set and past data in the test set — model 'predicts' yesterday from tomorrow", "Sklearn forbids it", "It's fine"],
    answer: 1, explanation: "Use `TimeSeriesSplit`: train on past, test on future, mimicking deployment."
  },
  {
    id: "q-ml-3", chapterId: "ml-sklearn", level: "expert",
    prompt: "What does ROC-AUC measure that accuracy doesn't?",
    choices: ["Same thing", "Threshold-independent discrimination (probability that a random positive ranks above a random negative); robust to class imbalance", "Calibration", "Latency"],
    answer: 1, explanation: "On 99/1 imbalanced data, predicting always-negative gets 99% accuracy. AUC reveals it's useless."
  },
  {
    id: "q-cap-1", chapterId: "capstone-data-science", level: "expert",
    prompt: "Why save the entire Pipeline, not just the model?",
    choices: ["Smaller", "Serving must apply identical preprocessing; saving only the classifier creates train/serve skew forever", "Required by joblib", "It's deprecated to save the model alone"],
    answer: 1, explanation: "Imputer, scaler, encoder all travel with the model in one artifact."
  },
  {
    id: "q-cap-2", chapterId: "capstone-data-science", level: "expert",
    prompt: "Why monitor input features in production, not just accuracy?",
    choices: ["Inputs are easier to log", "Labels arrive late or never; input drift is the earliest signal that performance is about to degrade", "Accuracy can't be measured", "Required by GDPR"],
    answer: 1, explanation: "When the input distribution drifts (KL divergence vs. training), your model is extrapolating. You see this immediately; you might not see accuracy for weeks."
  },
  {
    id: "q-cap-3", chapterId: "capstone-data-science", level: "expert",
    prompt: "What's `data/raw/` for in a data-science project layout?",
    choices: ["Discard pile", "Immutable original ingest — never edited; `processed/` is regeneratable from it", "Intermediate scratch", "Test fixtures"],
    answer: 1, explanation: "If raw ever changes, that's a new snapshot, not a mutation. Reproducibility depends on this rule."
  }
];
