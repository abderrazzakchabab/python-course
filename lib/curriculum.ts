export type Level = "beginner" | "intermediate" | "advanced" | "expert";

export interface Lab { goal: string; steps: string[]; verifyId: string; starter?: string }
export interface Section { heading: string; body: string }
export interface Chapter {
  id: string;
  level: Level;
  number: number;
  title: string;
  summary: string;
  duration: string;
  sections: Section[];
  keyCommands: string[];
  lab?: Lab;
}

export const chapters: Chapter[] = [
  {
    id: "hello-python",
    number: 1,
    level: "beginner",
    title: "Hello Python — the interpreter, the REPL, and your first script",
    summary: "Install Python the right way, meet the REPL, and understand what really happens when you type `python script.py`.",
    duration: "15 min",
    sections: [
      {
        heading: "Why Python won",
        body: "Python won the popularity war not because it's the fastest, the safest, or the most elegant language — it won because it gets out of your way. The same `for` loop you write to read a CSV is the one you write to call an LLM API, train a neural network, or scrape a website. The standard library is enormous, the ecosystem is bigger, and the syntax is forgiving enough that scientists, sysadmins, and product engineers all use it.\n\nThat's also the trap. Python's friendliness hides a lot of *what's actually happening* (reference counting, the GIL, dynamic dispatch). This course teaches Python the way a senior engineer would teach it: idioms first, then the model underneath them. You'll come out able to read a stack trace and a `cProfile` flamegraph, not just type code that runs."
      },
      {
        heading: "Installing the right way",
        body: "Do **not** use the Python that ships with macOS or your Linux distro for development — it's there for the OS, not for you. Use one of:\n\n- **`pyenv`** — install and switch between any CPython version. `pyenv install 3.12 && pyenv global 3.12`.\n- **`uv`** (the fast new alternative) — installs Python *and* manages venvs *and* resolves dependencies, in Rust. `uv python install 3.12`.\n- **Official installer** (Windows) — fine, but tick the 'Add to PATH' box.\n\nWhatever you pick, **never `pip install` into the system Python**. Always use a virtual environment (`python -m venv .venv && source .venv/bin/activate`) or let `uv`/`poetry` manage it for you."
      },
      {
        heading: "The REPL is a tool, not a toy",
        body: "Type `python` and you get the **REPL** — read, eval, print, loop. It's how you should explore any new library before writing code that imports it.\n\n```python\n>>> import json\n>>> json.dumps({'a': 1, 'b': [2, 3]})\n'{\"a\": 1, \"b\": [2, 3]}'\n>>> help(json.dumps)\n```\n\nTwo upgrades worth knowing: `python -i script.py` drops into the REPL *after* running the script (your variables are still bound — great for debugging), and **IPython** / **ptpython** add tab completion, syntax highlighting, and `%timeit` magic. Most experienced devs reach for IPython rather than the bare REPL."
      },
      {
        heading: "What `python script.py` actually does",
        body: "1. The CPython interpreter binary launches.\n2. It reads `script.py`, **compiles** it to **bytecode** (`.pyc`, cached in `__pycache__/`), and then…\n3. …runs that bytecode on the **Python virtual machine** — a giant `switch` over ~150 opcodes.\n\nThat compilation step is why a small Python script still takes ~30ms to start. It's also why Python *can* be fast for the right workload: numpy and pandas push the heavy lifting into C/Fortran, with Python just orchestrating. Knowing this distinction is the first step to understanding when Python is the right tool — and when you should reach for something else for the inner loop."
      }
    ],
    keyCommands: [
      "python --version",
      "python -m venv .venv && source .venv/bin/activate",
      "pip install --upgrade pip",
      "python -i script.py",
      "uv pip install requests"
    ],
    lab: {
      goal: "Print the literal line: `Hello, Python!`",
      steps: [
        "Use `print(...)`.",
        "Make sure the output matches exactly — case and punctuation count.",
        "Click Run; the output panel should show your line."
      ],
      verifyId: "hello-python",
      starter: `# Welcome. The lab runs real CPython (via Pyodide) in your browser.\nprint("Hello, world!")\n`
    }
  },
  {
    id: "types-control-flow",
    number: 2,
    level: "beginner",
    title: "Types, control flow, and comprehensions",
    summary: "Python is dynamically typed but strongly typed. Learn what that buys you, why comprehensions beat for-loops, and how truthiness actually works.",
    duration: "20 min",
    sections: [
      {
        heading: "Dynamic, strong, duck",
        body: "Python is **dynamically typed** — variables don't carry a type, *values* do. `x = 5; x = 'hi'` is legal. It is **strongly typed** — `'hi' + 5` is a `TypeError`, not a coerced concatenation. And it is **duck-typed** — a function that calls `obj.read()` doesn't care whether `obj` is a file, a `BytesIO`, or your custom class.\n\nThis combination is what makes Python feel free at the start and bite you in production at scale. The mitigation is **type hints** (since 3.5) and a static checker like **mypy** or **pyright**. We'll add them everywhere once we get to functions; for now, know they exist."
      },
      {
        heading: "Truthiness and the falsy values",
        body: "Almost everything in Python is truthy. The complete list of **falsy** values is short enough to memorize: `False`, `None`, `0`, `0.0`, `''`, `[]`, `{}`, `set()`, `()`. That's it.\n\n```python\nif users:           # idiomatic: \"if the list is non-empty\"\n    do_something()\nif users is not None:  # when None vs. empty list matters\n    ...\n```\n\nThe `is` vs. `==` distinction matters here. `is` checks identity (same object); `==` checks equality (same value). Use `is` for `None`, `True`, `False`, and sentinel objects — never for strings or numbers, where small-value caching can make `'hi' is 'hi'` accidentally true."
      },
      {
        heading: "if / elif / else and the walrus",
        body: "```python\nif n < 0:    sign = -1\nelif n > 0:  sign = 1\nelse:        sign = 0\n```\n\nFor the value-binding case, prefer a conditional expression: `sign = -1 if n < 0 else (1 if n > 0 else 0)`.\n\nThe **walrus** operator `:=` (3.8+) lets you assign inside an expression — perfect for `while (line := f.readline()):` or `if (m := re.match(r'\\d+', s)):`. Use it sparingly; abused, it makes code hard to read."
      },
      {
        heading: "Comprehensions: the Python-shaped loop",
        body: "```python\nsquares = [x*x for x in range(10) if x % 2 == 0]\nlookup  = {user.id: user for user in users}\nuniq    = {word.lower() for word in text.split()}\ngen     = (line.strip() for line in open('huge.log'))   # generator, lazy\n```\n\nList, dict, set comprehensions, and generator expressions are the idiomatic way to transform-and-filter. They're not just shorter — CPython has a fast path for them. A `for` loop with `.append()` is fine, but reach for the comprehension first; reach for the loop when the logic is too gnarly to fit on one line."
      }
    ],
    keyCommands: [
      "python -c 'import this'   # the Zen of Python",
      "python -m mypy script.py",
      "python -m timeit -s 'r=range(1000)' '[x*x for x in r]'"
    ],
    lab: {
      goal: "Write `fizzbuzz(n)` and call `fizzbuzz(15)`. Output must be exactly `FizzBuzz`.",
      steps: [
        "Use `if n % 15 == 0` first (the order matters).",
        "Then `n % 3`, then `n % 5`, then the number as a string.",
        "Return — don't print inside the function. Print only at the call site."
      ],
      verifyId: "fizzbuzz-py",
      starter: `def fizzbuzz(n: int) -> str:\n    # your code\n    ...\n\nprint(fizzbuzz(15))\n`
    }
  },
  {
    id: "functions-modules",
    number: 3,
    level: "beginner",
    title: "Functions, modules, and the import system",
    summary: "First-class functions, *args/**kwargs, default-argument gotchas, and how Python actually finds the code you import.",
    duration: "20 min",
    sections: [
      {
        heading: "Functions are first-class",
        body: "Functions in Python are **objects** — you can assign them, pass them, store them in lists, attach attributes. This is the foundation for decorators, callbacks, and most functional patterns you'll see.\n\n```python\ndef double(x): return x * 2\nfuncs = [double, len, str.upper]\nprint([f('hello') if f is not double else f(7) for f in funcs])\n```\n\nLambdas (`lambda x: x*2`) exist for the one-line callback case — `sorted(users, key=lambda u: u.age)`. They're restricted to a single expression on purpose; if you need a statement, write a `def`."
      },
      {
        heading: "*args and **kwargs",
        body: "```python\ndef log(level, *messages, **fields):\n    print(level, ' '.join(messages), fields)\n\nlog('INFO', 'user', 'signed in', user_id=42, ip='1.2.3.4')\n```\n\n`*messages` collects extra positional arguments into a tuple. `**fields` collects extra keyword arguments into a dict. The reverse — *unpacking* — uses the same syntax: `f(*my_list, **my_dict)` calls `f` with the list's items as positional args and the dict's items as keyword args.\n\nThis is how most decorators and wrappers in the standard library are written: accept `(*args, **kwargs)`, do something, then forward to the inner function."
      },
      {
        heading: "The mutable-default-argument trap",
        body: "```python\ndef append_to(item, lst=[]):     # BUG\n    lst.append(item)\n    return lst\n\nappend_to(1)  # [1]\nappend_to(2)  # [1, 2] — same list!\n```\n\nDefault arguments are evaluated **once**, at function-definition time. A mutable default (list, dict, set) is shared across every call that doesn't override it. The fix is the canonical idiom:\n\n```python\ndef append_to(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst\n```\n\nThis is the single most-asked Python interview gotcha. It also burns ~one production system per month somewhere."
      },
      {
        heading: "Modules, packages, imports",
        body: "Every `.py` file is a **module**. A directory with an `__init__.py` (often empty) is a **package**. `import` finds modules by walking **`sys.path`**, which starts with the directory of the script you ran and extends to your venv's `site-packages`.\n\n```python\nimport json                  # stdlib\nfrom mypkg.utils import slug # explicit, preferred over `from mypkg import *`\nimport numpy as np           # convention for big libs\n```\n\nTwo things to know early: a module's top-level code runs **once** on first import (cached in `sys.modules`), and `if __name__ == '__main__':` is how you separate 'imported as a library' from 'run as a script'."
      }
    ],
    keyCommands: [
      "python -m mymodule           # run a module as a script",
      "pip show requests            # see what version & where it's installed",
      "python -c 'import sys; print(sys.path)'"
    ],
    lab: {
      goal: "Write `make_counter()` that returns a function. Each call to that function returns the next integer starting at 1. Output must contain `1 2 3`.",
      steps: [
        "Use a **closure**: a `count` local in `make_counter`, the returned function uses `nonlocal count` to increment it.",
        "`c = make_counter(); print(c(), c(), c())` should print `1 2 3`.",
        "Why `nonlocal`? Without it, assignment creates a new local."
      ],
      verifyId: "make-counter",
      starter: `def make_counter():\n    # your code\n    ...\n\nc = make_counter()\nprint(c(), c(), c())\n`
    }
  },
  {
    id: "data-structures",
    number: 4,
    level: "intermediate",
    title: "Data structures and idiomatic iteration",
    summary: "Lists, dicts, sets, tuples — when to use each, the operations that cost O(1) vs. O(n), and the iteration tools that separate juniors from seniors.",
    duration: "25 min",
    sections: [
      {
        heading: "Pick the right container",
        body: "- **`list`** — ordered, mutable, indexable. Append is amortized O(1); `in` is O(n). Use it when you need order.\n- **`dict`** — keyed, ordered (since 3.7), mutable. Lookup/insert/delete are O(1) average. Use it as your default keyed store.\n- **`set`** — unordered, mutable, unique elements. `in` is O(1). Use for membership tests and deduplication.\n- **`tuple`** — ordered, **immutable**. Use for fixed-shape records and as dict keys.\n\nReaching for a list when a dict or set would do is the #1 Python performance bug. `if user in big_list:` over 100k items will dominate your runtime; the same check against a set is instant."
      },
      {
        heading: "Dict patterns you'll write weekly",
        body: "```python\nd.get('k', 'default')                     # never KeyError\nd.setdefault('counts', []).append(value)  # init-or-extend in one line\n\nfrom collections import defaultdict, Counter\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.category].append(item)\n\nCounter(words).most_common(10)            # top-10 frequency table\n```\n\n`defaultdict` removes the 'first check if key exists' dance. `Counter` is a `dict` subclass for counting. Both are in the standard library; both are faster than the rolled-by-hand versions because the inner loop is in C."
      },
      {
        heading: "Iteration utilities that pay rent",
        body: "```python\nfor i, item in enumerate(items, start=1):   # index + value\n    ...\nfor a, b in zip(xs, ys, strict=True):       # parallel iteration (3.10+)\n    ...\nfor key, group in itertools.groupby(sorted(rows, key=k), key=k):\n    ...\nlist(itertools.chain.from_iterable(nested))  # flatten one level\n```\n\nThe `itertools` module is full of lazy iterator combinators (`chain`, `islice`, `takewhile`, `pairwise`, `product`, `combinations`). They consume O(1) memory and compose like Lego. Read the docs page once a year; you'll keep discovering uses."
      },
      {
        heading: "Slicing, unpacking, and the star",
        body: "```python\nfirst, *rest = [1, 2, 3, 4]   # first=1, rest=[2,3,4]\nhead, *_, tail = nums          # _ is a 'don't care' convention\na, b = b, a                    # the classic swap, no temp variable\nletters[::2]                   # every second item\nletters[::-1]                  # reversed copy\n```\n\nSlicing creates a copy (`letters[:]` is the idiomatic clone). Unpacking with `*` works on the left side of `=`, in function calls, and inside list/dict literals (`[*a, *b]`, `{**a, **b}`). Mastering these makes Python feel half as wordy."
      }
    ],
    keyCommands: [
      "python -m timeit -s 'd={i:i for i in range(10000)}' '9999 in d'",
      "python -m timeit -s 'l=list(range(10000))' '9999 in l'",
      "python -c 'import itertools; help(itertools)'"
    ],
    lab: {
      goal: "Given `['apple','banana','apple','cherry','banana','apple']`, print the top-2 most common entries. Output must contain `apple` and `banana` with their counts (3 and 2).",
      steps: [
        "Use `collections.Counter`.",
        "Call `.most_common(2)`.",
        "Print the result."
      ],
      verifyId: "top-words",
      starter: `from collections import Counter\n\nwords = ['apple','banana','apple','cherry','banana','apple']\n# print the top 2\n`
    }
  },
  {
    id: "oop-typing",
    number: 5,
    level: "intermediate",
    title: "Classes, dataclasses, and type hints",
    summary: "Python's object model: dunders, properties, dataclasses, and how type hints turn a dynamic language into one mypy can check.",
    duration: "25 min",
    sections: [
      {
        heading: "A class is a namespace with rituals",
        body: "```python\nclass User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def greet(self):\n        return f'hi, {self.name}'\n```\n\n`self` is the first parameter by convention — the instance gets passed in explicitly. `__init__` is the constructor; actual object-creation happens in `__new__`, which you almost never override.\n\nClass *attributes* (defined at class scope) are shared across instances; *instance* attributes (assigned on `self`) are per-instance. Putting a mutable default at class scope and then mutating it through an instance is the OOP version of the mutable-default-argument bug."
      },
      {
        heading: "Dunders make Python feel like Python",
        body: "**Dunder** (double-underscore) methods are how your class plugs into the language's syntax:\n\n```python\nclass Money:\n    def __init__(self, cents): self.cents = cents\n    def __add__(self, other): return Money(self.cents + other.cents)\n    def __repr__(self): return f'Money({self.cents})'\n    def __eq__(self, other): return isinstance(other, Money) and self.cents == other.cents\n    def __hash__(self): return hash(('Money', self.cents))\n```\n\nNow `Money(100) + Money(50)` works, `repr()` is debuggable, equality is meaningful, and the object is hashable (usable as a dict key / set element). The most-implemented dunders: `__init__`, `__repr__`, `__eq__`, `__hash__`, `__lt__`, `__len__`, `__iter__`, `__enter__`/`__exit__`."
      },
      {
        heading: "Dataclasses: 80% of the boilerplate, gone",
        body: "```python\nfrom dataclasses import dataclass, field\n\n@dataclass(frozen=True, slots=True)\nclass Point:\n    x: float\n    y: float\n    tags: list[str] = field(default_factory=list)\n```\n\nThat one decorator generated `__init__`, `__repr__`, `__eq__`, and (with `frozen=True`) `__hash__`. `slots=True` (3.10+) replaces the per-instance `__dict__` with a fixed slot layout — faster attribute access, ~half the memory.\n\nFor anything more dynamic — JSON serialization, validation, defaults from env vars — graduate to **`pydantic`** or **`attrs`**. Both are de-facto standards in production codebases."
      },
      {
        heading: "Type hints: optional, but worth it",
        body: "```python\nfrom typing import Iterable\n\ndef average(xs: Iterable[float]) -> float:\n    xs = list(xs)\n    return sum(xs) / len(xs) if xs else 0.0\n```\n\nType hints are **not enforced at runtime** by the interpreter — they're metadata. A static checker (**mypy**, **pyright**) reads them and tells you when callers pass the wrong shape. The IDE uses them for autocomplete and refactoring.\n\nThe rule of thumb in modern Python (3.10+): annotate **public function signatures and dataclass fields**, leave local variables alone unless they're hard to infer. `list[int]` and `dict[str, int]` work without `from typing import` since 3.9 — use them."
      }
    ],
    keyCommands: [
      "pip install mypy && mypy script.py",
      "python -m dis script.py | head    # peek at bytecode",
      "pip install pydantic"
    ],
    lab: {
      goal: "Define a frozen `Point` dataclass with `x: float, y: float`. Add a method `distance(other) -> float`. Print the distance from `Point(0,0)` to `Point(3,4)`. Output must contain `5.0`.",
      steps: [
        "`from dataclasses import dataclass; import math`",
        "`@dataclass(frozen=True)` on the class.",
        "`def distance(self, other): return math.hypot(self.x - other.x, self.y - other.y)`"
      ],
      verifyId: "point-distance",
      starter: `from dataclasses import dataclass\nimport math\n\n# define Point with x, y, and distance(other)\n\n# print(Point(0,0).distance(Point(3,4)))\n`
    }
  },
  {
    id: "errors-iterators-context",
    number: 6,
    level: "advanced",
    title: "Errors, context managers, and the iterator protocol",
    summary: "The patterns that show up everywhere: `try/except/else/finally`, `with`-statements, and the generator-as-coroutine trick.",
    duration: "30 min",
    sections: [
      {
        heading: "Exceptions are a control-flow tool",
        body: "Python uses exceptions liberally — `StopIteration` ends a loop, `KeyError` signals a missing dict key. The **EAFP** principle (Easier to Ask Forgiveness than Permission) is idiomatic: try the operation, catch what fails, instead of checking preconditions.\n\n```python\ntry:\n    age = int(s)\nexcept ValueError:\n    age = None\nelse:\n    log('parsed', age)   # only if no exception\nfinally:\n    cleanup()            # always\n```\n\nNever `except Exception:` without re-raising or logging — that swallows real bugs. Catch the specific class you expect. If you need a custom error type, subclass `Exception` (not `BaseException`)."
      },
      {
        heading: "Context managers and `with`",
        body: "```python\nwith open('data.csv') as f:\n    for line in f:\n        process(line)\n# f.close() is guaranteed, even if process() raises\n```\n\nAny object with `__enter__` and `__exit__` works with `with`. The cleanest way to write your own is `contextlib.contextmanager`:\n\n```python\nfrom contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer(label):\n    t = time.perf_counter()\n    try:\n        yield\n    finally:\n        print(f'{label}: {time.perf_counter()-t:.3f}s')\n\nwith timer('parse'):\n    parse_huge_file()\n```\n\nUse `with` for **anything that needs deterministic cleanup**: files, sockets, DB connections, locks."
      },
      {
        heading: "Iterators and the lazy mindset",
        body: "```python\nclass Counter:\n    def __init__(self, end): self.i, self.end = 0, end\n    def __iter__(self): return self\n    def __next__(self):\n        if self.i >= self.end: raise StopIteration\n        self.i += 1\n        return self.i\n\nfor n in Counter(3): print(n)   # 1 2 3\n```\n\nAny object with `__iter__` returning something that has `__next__` is iterable. Writing one by hand is verbose, which is why generators exist (next section).\n\nThe upshot: most Python code that 'looks like it builds a list' doesn't have to. `sum(x*x for x in big_data)` allocates nothing — the generator yields one value at a time and `sum` consumes them. That's how you process files larger than RAM in idiomatic Python."
      },
      {
        heading: "Generators: lazy by default",
        body: "```python\ndef chunks(iterable, n):\n    buf = []\n    for x in iterable:\n        buf.append(x)\n        if len(buf) == n:\n            yield buf\n            buf = []\n    if buf:\n        yield buf\n```\n\nA function with a `yield` is a **generator function**. Calling it returns a **generator** (an iterator). Execution pauses at each `yield` and resumes on the next `next()`/`for` step. The function's local variables — `buf` here — survive across yields.\n\nThis is the trick behind async/await in Python (originally implemented on top of generator semantics), and it's why a transform pipeline — read, parse, filter, batch, write — can stream gigabytes without ever holding more than one batch in memory."
      }
    ],
    keyCommands: [
      "python -X dev script.py     # development mode: stricter warnings",
      "python -m pdb script.py     # the standard debugger",
      "python -c 'import logging; logging.warning(\"hi\")'"
    ],
    lab: {
      goal: "Write a generator `evens(n)` that yields the first `n` even numbers starting at 2. Print `list(evens(5))`. Output must contain `[2, 4, 6, 8, 10]`.",
      steps: [
        "Use a `for` loop and `yield`.",
        "Or compute: yield `2*i` for `i in range(1, n+1)`.",
        "Convert with `list(...)` and print."
      ],
      verifyId: "evens-gen",
      starter: `def evens(n):\n    # your code\n    ...\n\nprint(list(evens(5)))\n`
    }
  },
  {
    id: "concurrency",
    number: 7,
    level: "advanced",
    title: "Concurrency: threads, asyncio, and the GIL",
    summary: "Why threads don't make pure-Python code faster (and when they do). How async I/O works. When to reach for `multiprocessing`. The mental model you wish someone had given you on day one.",
    duration: "30 min",
    sections: [
      {
        heading: "The GIL in one paragraph",
        body: "CPython has a **Global Interpreter Lock** — only one thread runs Python bytecode at a time. Hardware concurrency is real (threads exist and can context-switch), but they don't give you CPU parallelism for pure-Python work. They *do* help for **I/O-bound** work: while one thread is waiting on a socket, another can run. They don't help for **CPU-bound** work: two threads computing `x*x` for hours finish in the same wall time as one.\n\nPython 3.13 added an experimental free-threaded build (`--disable-gil`). Production code in 2026 still assumes the GIL exists. Design accordingly."
      },
      {
        heading: "Threads for I/O, processes for CPU",
        body: "```python\nfrom concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor\n\nwith ThreadPoolExecutor(max_workers=10) as ex:\n    pages = list(ex.map(requests.get, urls))     # I/O-bound — good fit\n\nwith ProcessPoolExecutor() as ex:\n    primes = list(ex.map(is_prime, big_numbers)) # CPU-bound — escape the GIL\n```\n\n`concurrent.futures` is the modern, ergonomic API — `Future` objects, `as_completed`, timeouts, cancellation. Prefer it over raw `threading.Thread` / `multiprocessing.Process` for almost everything. Process pools pickle arguments/results across the boundary; if your work item is huge, that overhead can dominate."
      },
      {
        heading: "asyncio: one thread, many coroutines",
        body: "```python\nimport asyncio, httpx\n\nasync def fetch(client, url):\n    r = await client.get(url)\n    return len(r.content)\n\nasync def main(urls):\n    async with httpx.AsyncClient() as client:\n        return await asyncio.gather(*(fetch(client, u) for u in urls))\n\nprint(asyncio.run(main(['https://example.com'] * 100)))\n```\n\n`async def` defines a **coroutine**. `await` yields control to the event loop while waiting on I/O. One OS thread can juggle thousands of concurrent requests because nothing blocks. The catch: **everything** in an async path must be async. One call to a blocking library and you stall the whole loop. Mix carefully via `asyncio.to_thread(...)`."
      },
      {
        heading: "Which one when?",
        body: "- **Pure I/O, modern web client/server work** → asyncio + a native-async library (httpx, asyncpg, aiokafka).\n- **I/O against blocking libraries you can't replace** → ThreadPoolExecutor.\n- **CPU-bound number crunching, can be partitioned** → ProcessPoolExecutor or `multiprocessing.Pool`.\n- **CPU-bound number crunching, can be vectorized** → numpy. Drop into a real array library and the GIL is a non-issue because the inner loop is C.\n\nThe most common production mistake: reaching for `asyncio` to 'make things faster' when the bottleneck is a `pandas` `.apply()` doing pure-Python row work. Profile first (`cProfile`, `py-spy`). Then choose."
      }
    ],
    keyCommands: [
      "pip install py-spy && py-spy top --pid $(pgrep -n python)",
      "python -m cProfile -s cumulative script.py | head -30",
      "pip install httpx anyio uvloop"
    ],
    lab: {
      goal: "Use `asyncio.gather` to run three coroutines that each return their index after `await asyncio.sleep(0)`. Print the result. Output must contain `[0, 1, 2]`.",
      steps: [
        "Define `async def work(i): await asyncio.sleep(0); return i`.",
        "`asyncio.run(asyncio.gather(work(0), work(1), work(2)))`.",
        "Print the result."
      ],
      verifyId: "asyncio-gather",
      starter: `import asyncio\n\nasync def work(i):\n    await asyncio.sleep(0)\n    return i\n\n# call asyncio.run(...) and print\n`
    }
  },
  {
    id: "pandas-startup-capstone",
    number: 8,
    level: "expert",
    title: "Capstone — a pandas-powered analytics startup",
    summary: "The startup project. Load real data with pandas, group it, summarize it, and ship a tiny in-browser analytics tool. The same pipeline you'd put behind a SaaS dashboard.",
    duration: "45 min",
    sections: [
      {
        heading: "Why pandas is the startup story",
        body: "Most data startups are, under the hood, a UI on top of a pandas pipeline. Mode, Hex, Deepnote, Plotly Studio — all of them let users push data through `read_csv → groupby → agg → plot`. The 'product' is the UX, the integrations, and the speed-of-iteration; the engine is open source.\n\nWhich means: if you can write a clean pandas pipeline, you can prototype the analytics MVP yourself. This chapter walks the exact pipeline a 'CSV insights' startup would ship behind their dashboard."
      },
      {
        heading: "DataFrames in 90 seconds",
        body: "```python\nimport pandas as pd\nfrom io import StringIO\n\ndata = '''date,category,amount\n2024-01-05,food,12.5\n2024-01-05,rent,1200\n2024-01-12,food,9.8\n2024-01-15,rent,1200\n2024-02-02,food,15.2'''\n\ndf = pd.read_csv(StringIO(data), parse_dates=['date'])\n```\n\nA **DataFrame** is a labeled 2-D array — think 'spreadsheet, indexed.' Each column is a typed numpy array under the hood; that's why vectorized operations are 10–1000x faster than row-by-row Python. Almost every pandas idiom revolves around 'avoid the for loop, let the column do it.'"
      },
      {
        heading: "The groupby–agg–pivot trinity",
        body: "```python\nmonthly = df.groupby(df['date'].dt.to_period('M'))['amount'].sum()\nby_cat  = df.groupby('category')['amount'].agg(['sum', 'mean', 'count'])\npivot   = df.pivot_table(index='category', columns=df['date'].dt.month,\n                         values='amount', aggfunc='sum', fill_value=0)\n```\n\n**`groupby` + `agg`** is the workhorse of every analytics dashboard ('revenue per region per month'). **`pivot_table`** reshapes long-format data into a matrix for heatmaps and cohort tables. Once you internalize these three calls, 80% of 'business intelligence' is mechanical."
      },
      {
        heading: "Shipping it as a product",
        body: "A minimum analytics SaaS is three components:\n\n1. **Ingestion** — accept a CSV upload or a database connection. `pd.read_csv`, `pd.read_sql`, or `pd.read_parquet`.\n2. **Transform** — a notebook's worth of `groupby` and `merge`. Refactor into pure functions: `def monthly_revenue(df) -> pd.Series`.\n3. **Present** — a chart library (Plotly, Altair) + a thin web frontend. For the MVP, **Streamlit** turns a 100-line Python script into a deployable dashboard in one `streamlit run app.py`.\n\nReal startups graduate from Streamlit to FastAPI + React + DuckDB as they scale, but every one of them started with someone proving the pipeline in pandas first. This chapter's lab is that exact proof."
      },
      {
        heading: "From prototype to scale",
        body: "Pandas in 2026 has two important neighbors. **Polars** (Rust-backed, lazy execution) handles datasets that make pandas swap to disk. **DuckDB** runs SQL over pandas DataFrames at C++ speed — `duckdb.query('SELECT category, SUM(amount) FROM df GROUP BY 1').df()`. Most analytics startups end up using all three: pandas for ergonomics, DuckDB for the heavy queries, Polars for the streaming ingest path.\n\nIf you want to keep going after this course: take the pandas pipeline from the lab, wrap it in a Streamlit dashboard, deploy on Vercel/Fly/Modal, charge $19/month. That's a real product. Several have been acquired for low-seven-figures with not much more under the hood than what you're about to write."
      }
    ],
    keyCommands: [
      "pip install pandas duckdb polars streamlit plotly",
      "streamlit run app.py",
      "python -c 'import pandas as pd; print(pd.__version__)'"
    ],
    lab: {
      goal: "Load the inline CSV with pandas, group by `category`, sum `amount`. Print the result. Output must contain both `food` and `rent`.",
      steps: [
        "`from io import StringIO; import pandas as pd`",
        "`df = pd.read_csv(StringIO(data))`",
        "`print(df.groupby('category')['amount'].sum())`"
      ],
      verifyId: "pandas-groupby",
      starter: `import pandas as pd\nfrom io import StringIO\n\ndata = """date,category,amount\n2024-01-05,food,12.5\n2024-01-05,rent,1200\n2024-01-12,food,9.8\n2024-01-15,rent,1200\n2024-02-02,food,15.2"""\n\n# load, group by category, sum amount, print\n`
    }
  }
];

export function getChapter(id: string) { return chapters.find((c) => c.id === id); }
