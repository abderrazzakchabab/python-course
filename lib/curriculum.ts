export type Level = "beginner" | "intermediate" | "advanced" | "expert";

export interface Lab { goal: string; steps: string[]; verifyId: string; starter?: string }
export interface Section { heading: string; body: string }
export interface Exercise { question: string; hint?: string; answer: string }
export interface Chapter {
  id: string;
  level: Level;
  number: number;
  title: string;
  summary: string;
  duration: string;
  sections: Section[];
  keyCommands: string[];
  exercises?: Exercise[];
  lab?: Lab;
}

const _CH7: Chapter[] = [
  {
    id: "visualization-eda",
    number: 13,
    level: "expert",
    title: "Visualization and exploratory data analysis",
    summary: "matplotlib, seaborn, plotly — what each is for. The EDA checklist, statistical first looks, and how to find the question your boss actually asked.",
    duration: "40 min",
    sections: [
      { heading: "Three plotting libraries, three jobs", body: "- **matplotlib** — the substrate. Every other library renders through it. Verbose, infinitely configurable, ugly defaults.\n- **seaborn** — statistical defaults over matplotlib. `sns.set_theme()` and you have a paper-ready chart in 5 lines.\n- **plotly** — interactive, web-native. Hover tooltips, zoom, legends-as-filters. Default for dashboards.\n- **altair** — declarative grammar of graphics (like ggplot). Great for faceting.\n\nPick by use case: EDA notebooks → seaborn (fast, statistical). Dashboards/reports → plotly. Publication figures → matplotlib (full control). Don't mix three in one notebook unless you enjoy fighting style sheets." },
      { heading: "The matplotlib mental model", body: "```python\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 8), sharex=True)\naxes[0,0].plot(x, y); axes[0,0].set_title('line')\naxes[0,1].hist(values, bins=30)\naxes[1,0].scatter(x, y, c=color, s=size, alpha=0.5)\naxes[1,1].boxplot(groups, labels=names)\nfig.suptitle('Diagnostics'); fig.tight_layout()\nfig.savefig('out.png', dpi=150, bbox_inches='tight')\n```\n\n**Figure** = the whole image. **Axes** = a single plot inside it. Always work via `fig, ax = plt.subplots()` (object-oriented API) — `plt.plot()` (pyplot state machine) is fine for one-offs but breaks when you compose. `tight_layout()` fixes label clipping; `savefig` with `bbox_inches='tight'` for PDFs/PNGs." },
      { heading: "seaborn — statistical defaults that don't lie", body: "```python\nimport seaborn as sns\nsns.set_theme(context='notebook', style='whitegrid', palette='viridis')\n\nsns.histplot(df, x='amount', hue='category', element='step', stat='density')\nsns.boxplot(df, x='category', y='amount')\nsns.scatterplot(df, x='age', y='income', hue='cluster', size='spend')\nsns.pairplot(df[['age','income','spend','tenure']], hue='churn')\nsns.heatmap(df.corr(numeric_only=True), annot=True, cmap='coolwarm', vmin=-1, vmax=1)\n```\n\nseaborn knows what statisticians want: confidence bands, paired distributions, categorical color encodings done right. `pairplot` and `heatmap(.corr())` are the two charts to run in **every** EDA notebook before doing anything else. They surface obvious leakage, multicollinearity, and skew in 5 seconds." },
      { heading: "plotly — interactive when readers will explore", body: "```python\nimport plotly.express as px\n\nfig = px.scatter(df, x='date', y='amount', color='category',\n                 size='quantity', hover_data=['order_id'],\n                 trendline='lowess', facet_col='region')\nfig.update_layout(template='plotly_dark')\nfig.write_html('chart.html'); fig.show()\n```\n\n`plotly.express` is the high-level API — one call per chart type, like seaborn. Output is an HTML file you can embed in a dashboard or email. The interactivity (hover, zoom, legend toggle) makes a single chart replace 5 static ones. For real dashboards: Streamlit or Dash, both render plotly natively." },
      { heading: "The EDA checklist", body: "Run **every time** you get a new dataset:\n\n1. `df.shape`, `df.dtypes`, `df.head()`, `df.tail()` — sanity.\n2. `df.isna().sum()` — missingness per column.\n3. `df.describe(include='all')` — distributions + cardinalities.\n4. `df.duplicated().sum()` — duplicate rows.\n5. `df.nunique()` and `df.value_counts()` on categoricals — surprise categories?\n6. `sns.heatmap(df.corr(numeric_only=True))` — multicollinearity, leakage.\n7. `sns.pairplot(df.sample(1000))` — joint distributions.\n8. Time series? Plot `df.set_index('date').resample('D').size()` — gaps, seasonality, anomalies.\n9. For the target variable: distribution, conditional means per category, lag correlations.\n10. Write the questions you'd ask the data owner. *Those* are the answers your boss is after.\n\nDoing this first prevents 80% of 'the model performs great on test but terribly in prod' incidents." }
    ],
    keyCommands: ["pip install matplotlib seaborn plotly streamlit", "jupyter lab", "python -c 'import seaborn as sns; print(sns.__version__)'"],
    exercises: [
      { question: "Why use `fig, ax = plt.subplots()` instead of `plt.plot()`?", answer: "The OO API gives you an explicit Figure/Axes pair you can pass around, configure, save, and place into grids. The pyplot state machine relies on 'current figure' globals that break the moment you have more than one chart or use a notebook with cell re-execution." },
      { question: "What does `sns.pairplot(df, hue='target')` show, and why run it early?", answer: "An NxN grid of scatter plots between every numeric column pair, color-coded by target. Diagonal shows per-column distribution by class. You instantly see which features separate classes (good predictors), which are correlated (multicollinearity), and which leak the target (suspiciously perfect separation)." }
    ],
    lab: {
      goal: "Compute the correlation matrix of three numeric columns and print it. Output must contain `1.0`.",
      steps: ["Build a small DataFrame with 3 numeric columns.", "`print(df.corr())`", "Diagonal will be 1.0."],
      verifyId: "pandas-corr",
      starter: `import pandas as pd\n\ndf = pd.DataFrame({\n  'a': [1,2,3,4,5],\n  'b': [2,4,6,8,10],\n  'c': [5,4,3,2,1],\n})\n# print correlation matrix\n`
    }
  },
  {
    id: "ml-sklearn",
    number: 14,
    level: "expert",
    title: "Machine learning with scikit-learn",
    summary: "The estimator API, train/test/validation splits, cross-validation, pipelines, hyperparameter tuning, model evaluation, and the failure modes that bite in production.",
    duration: "50 min",
    sections: [
      { heading: "The estimator API — fit, predict, transform", body: "```python\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor\nfrom sklearn.preprocessing import StandardScaler\n\nclf = LogisticRegression(max_iter=1000, C=1.0, random_state=42)\nclf.fit(X_train, y_train)\ny_pred = clf.predict(X_test)\ny_proba = clf.predict_proba(X_test)[:, 1]\n```\n\nEvery scikit-learn model implements **`fit(X, y)` → `predict(X)`** (supervised) or **`fit(X) → transform(X)`** (preprocessor/unsupervised). That uniformity is what makes the rest of the library (pipelines, grid search, calibration) work. **X is 2-D**, **y is 1-D**. If your pipeline is a mess, it's usually because you pass `X` shaped wrong somewhere." },
      { heading: "Splits — the rule you cannot break", body: "```python\nfrom sklearn.model_selection import train_test_split, StratifiedKFold\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42)\n```\n\n**Never** look at the test set until your final evaluation. Hyperparameter tuning, feature selection, normalization stats — all derived from train only. Otherwise you leak test info into training and overestimate performance.\n\nFor time series: **never** random-split. Use `TimeSeriesSplit` — train on the past, test on the future. Random splits give you a model that 'predicts' yesterday from tomorrow.\n\nFor imbalanced classes: `stratify=y` keeps the same class ratio in train/test. Otherwise a 99/1 dataset can give you a test set with no minority-class samples." },
      { heading: "Pipelines — the only safe way to preprocess", body: "```python\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\n\nnumeric = ['age', 'income']\ncategorical = ['city', 'job']\n\npre = ColumnTransformer([\n    ('num', Pipeline([('impute', SimpleImputer(strategy='median')),\n                      ('scale',  StandardScaler())]), numeric),\n    ('cat', Pipeline([('impute', SimpleImputer(strategy='most_frequent')),\n                      ('oh',     OneHotEncoder(handle_unknown='ignore'))]), categorical),\n])\n\nmodel = Pipeline([('pre', pre),\n                  ('clf', RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42))])\nmodel.fit(X_train, y_train)\n```\n\n**Always** wrap preprocessing and the model in a `Pipeline`. `pipeline.fit(X_train)` learns the imputers/scalers/encoders from train only. `pipeline.predict(X_test)` applies them — no leakage. Without this, every cross-val fold leaks normalization stats from validation into train; you're optimizing the wrong number." },
      { heading: "Cross-validation and tuning", body: "```python\nfrom sklearn.model_selection import GridSearchCV, cross_val_score\n\ngrid = {'clf__n_estimators': [100, 300, 500],\n        'clf__max_depth': [None, 10, 20]}\nsearch = GridSearchCV(model, grid, cv=5, scoring='roc_auc', n_jobs=-1, refit=True)\nsearch.fit(X_train, y_train)\nprint(search.best_params_, search.best_score_)\n```\n\n**K-fold CV** estimates generalization more honestly than a single train/val split. **`GridSearchCV`** searches a grid; **`RandomizedSearchCV`** samples from distributions (often better for >3 hyperparams); **Optuna** / **Hyperopt** are Bayesian and usually better still.\n\nThe `clf__n_estimators` syntax addresses pipeline steps by name. Always use `n_jobs=-1` for parallelism, `random_state=42` for reproducibility, and `refit=True` so the final model is trained on the full train set with the best params." },
      { heading: "Evaluation — pick metrics that match the problem", body: "```python\nfrom sklearn.metrics import (accuracy_score, precision_recall_fscore_support,\n                              roc_auc_score, confusion_matrix, classification_report,\n                              mean_absolute_error, root_mean_squared_error, r2_score)\n```\n\n**Classification**:\n- Balanced data → accuracy is fine.\n- Imbalanced → precision/recall/F1, ROC-AUC, PR-AUC.\n- Cost-sensitive (fraud, medical) → set the threshold from the precision-recall curve, not a default 0.5.\n\n**Regression**: MAE (robust), RMSE (penalizes outliers), R² (variance explained). Always plot residuals vs. fitted — if they're not random noise, your model is missing structure.\n\n**Calibration**: model probabilities should match reality. Plot a calibration curve; if `predict_proba` says 0.8 but the actual rate at that bucket is 0.5, calibrate with `CalibratedClassifierCV` before deploying." },
      { heading: "What goes wrong in production", body: "1. **Data drift** — train-time distribution ≠ inference-time distribution. Monitor input features, not just accuracy.\n2. **Target leakage** — a feature contains future info (e.g., `was_refunded` to predict purchase). Audit feature provenance.\n3. **Train/serve skew** — feature engineering differs between training notebook and serving code. Fix: same `Pipeline` object on both sides.\n4. **Cold-start** — categorical levels at serve time the model never saw. `handle_unknown='ignore'` on the encoder.\n5. **Concept drift** — the relationship itself changes. Schedule retrains.\n\nThe practitioners who ship reliably aren't the ones with the fanciest models — they're the ones with the boring discipline around splits, pipelines, and monitoring." }
    ],
    keyCommands: ["pip install scikit-learn xgboost lightgbm optuna mlflow", "python -c 'import sklearn; print(sklearn.__version__)'", "mlflow ui"],
    exercises: [
      { question: "Why scale features *inside* a Pipeline rather than before train/test split?", answer: "If you fit the scaler on the full dataset, you've leaked test-set statistics (mean, std) into your normalization. The pipeline fits the scaler on train only during `fit`, then applies the same params during `transform`. This matches how production scoring works." },
      { question: "When prefer Random Forest over Logistic Regression as a first model?", answer: "When relationships are non-linear or you have categorical features with interactions. RF handles mixed types, doesn't need scaling, captures interactions natively, and gives you `feature_importances_`. LR wins when you need an interpretable, calibrated linear model with monotonic relationships, or when n_features >> n_samples." },
      { question: "What does the ROC-AUC measure that accuracy doesn't?", answer: "Discrimination across all classification thresholds. AUC = probability that a random positive is ranked higher than a random negative. Robust to class imbalance and threshold choice. Accuracy at threshold 0.5 can be misleading on imbalanced data — a 'predict negative always' classifier hits 99% accuracy on a 1% positive rate." }
    ],
    lab: {
      goal: "Train a `LogisticRegression` on a tiny in-memory dataset and print accuracy. Output must contain `1.0`.",
      steps: ["scikit-learn may or may not be available in Pyodide; use the math directly.", "Build a tiny X, y where y = (x > 0).", "Implement a 1-param 'logistic' fit by checking sign — print 1.0."],
      verifyId: "ml-accuracy",
      starter: `# Pyodide may not include sklearn — keep this self-contained.\nX = [-2, -1, 1, 2]\ny = [0, 0, 1, 1]\npred = [1 if x > 0 else 0 for x in X]\nacc = sum(p == t for p, t in zip(pred, y)) / len(y)\nprint(acc)\n`
    }
  },
  {
    id: "capstone-data-science",
    number: 15,
    level: "expert",
    title: "Capstone — end-to-end data science project",
    summary: "Ingest a CSV, clean it, explore it, engineer features, train and evaluate a model, ship it behind a Streamlit dashboard. The exact workflow a working data scientist runs.",
    duration: "60 min",
    sections: [
      { heading: "Project structure that scales", body: "```\nchurn-predictor/\n├── pyproject.toml             # uv / poetry / hatch project file\n├── README.md\n├── .env.example               # documented env vars (never commit secrets)\n├── data/\n│   ├── raw/                   # immutable, never edited\n│   ├── interim/               # cleaned, gitignored\n│   └── processed/             # feature matrices\n├── notebooks/\n│   └── 01-eda.ipynb           # numbered, dated, throwaway\n├── src/churn/\n│   ├── __init__.py\n│   ├── ingest.py              # load_raw() -> DataFrame\n│   ├── clean.py               # clean(df) -> DataFrame  (pure function)\n│   ├── features.py            # build_features(df) -> X, y\n│   ├── model.py               # build_pipeline(), train(), evaluate()\n│   └── app.py                 # streamlit dashboard\n├── tests/                     # pytest, one file per src module\n└── models/                    # serialized pipelines (gitignored)\n```\n\nNotebooks are for exploration; **all code that runs more than once lives in `src/`** as pure, importable, testable functions. Notebooks `from churn.features import build_features` — never copy-paste. This is what separates 'science project' from 'product'." },
      { heading: "The full pipeline as code", body: "```python\n# src/churn/clean.py\nimport pandas as pd\n\ndef clean(df: pd.DataFrame) -> pd.DataFrame:\n    return (df\n        .rename(columns=str.lower)\n        .assign(tenure=lambda d: pd.to_numeric(d.tenure, errors='coerce'),\n                monthly=lambda d: pd.to_numeric(d.monthlycharges, errors='coerce'),\n                signup=lambda d: pd.to_datetime(d.signup_date, errors='coerce'),\n                churn=lambda d: d.churn.map({'Yes': 1, 'No': 0}))\n        .dropna(subset=['churn', 'tenure', 'monthly'])\n        .drop_duplicates(subset=['customer_id'])\n        .reset_index(drop=True))\n\n# src/churn/features.py\nimport pandas as pd, numpy as np\n\nNUMERIC = ['tenure', 'monthly']\nCATEGORICAL = ['contract', 'payment_method', 'internet_service']\n\ndef build_features(df: pd.DataFrame):\n    df = df.assign(\n        spend_per_month=lambda d: d.total_charges / d.tenure.replace(0, np.nan),\n        is_long_tenure=lambda d: (d.tenure > 24).astype(int),\n    )\n    X = df[NUMERIC + CATEGORICAL + ['spend_per_month', 'is_long_tenure']]\n    y = df['churn']\n    return X, y\n```\n\nEvery function takes a DataFrame and returns one. No globals, no side effects. Each is unit-testable with a 5-row fixture." },
      { heading: "Train, evaluate, persist", body: "```python\n# src/churn/model.py\nimport joblib\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom sklearn.metrics import classification_report, roc_auc_score\n\ndef build_pipeline():\n    pre = ColumnTransformer([\n        ('num', Pipeline([('imp', SimpleImputer(strategy='median')),\n                          ('sc',  StandardScaler())]), ['tenure','monthly','spend_per_month','is_long_tenure']),\n        ('cat', Pipeline([('imp', SimpleImputer(strategy='most_frequent')),\n                          ('oh',  OneHotEncoder(handle_unknown='ignore'))]), ['contract','payment_method','internet_service']),\n    ])\n    return Pipeline([('pre', pre),\n                     ('clf', GradientBoostingClassifier(n_estimators=300, max_depth=3, random_state=42))])\n\ndef train(X, y):\n    pipe = build_pipeline()\n    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n    scores = cross_val_score(pipe, X, y, cv=cv, scoring='roc_auc', n_jobs=-1)\n    print(f'CV AUC: {scores.mean():.3f} ± {scores.std():.3f}')\n    pipe.fit(X, y)\n    return pipe\n\ndef save(pipe, path='models/churn.joblib'):\n    joblib.dump(pipe, path)\n```\n\nFive-fold stratified CV gives you a defensible AUC ± std. Refit on the full train set after CV. Serialize the **pipeline**, not just the model — preprocessing must travel with it." },
      { heading: "Ship it — the Streamlit dashboard", body: "```python\n# src/churn/app.py\nimport streamlit as st\nimport pandas as pd, joblib\n\nst.set_page_config(page_title='Churn predictor', layout='wide')\nst.title('Customer churn predictor')\n\npipe = joblib.load('models/churn.joblib')\n\nuploaded = st.file_uploader('Upload customer CSV', type='csv')\nif uploaded:\n    df = pd.read_csv(uploaded)\n    proba = pipe.predict_proba(df)[:, 1]\n    df['churn_proba'] = proba\n    df['risk'] = pd.cut(proba, [0, 0.3, 0.6, 1.0], labels=['low','medium','high'])\n    st.dataframe(df.sort_values('churn_proba', ascending=False))\n    st.bar_chart(df['risk'].value_counts())\n    st.download_button('Download scored CSV',\n                       df.to_csv(index=False), 'scored.csv')\n```\n\n`streamlit run src/churn/app.py` and you have a deployable web app. Push to **Streamlit Community Cloud**, **Fly.io**, or **Modal**, attach a custom domain, charge per user. The end-to-end project from CSV to product is now ~500 lines of code." },
      { heading: "What to do next", body: "Real data-science work doesn't stop at the first model. The maturity ladder:\n\n1. **Experiment tracking** — **MLflow** or **Weights & Biases**. Every run logs params, metrics, model artifact. Comparable, reproducible.\n2. **Feature store** — **Feast** or in-house. Same feature definitions in training and serving prevents skew.\n3. **Model registry** — versioned models with staging/production tags.\n4. **Monitoring** — input drift (KL divergence between train and live distributions), output drift, performance on labeled feedback.\n5. **Retraining loop** — scheduled (weekly) or triggered (drift > threshold). The model + the pipeline retrain together.\n6. **A/B test the model itself** — never deploy a new model to 100% traffic. Shadow mode first, then 10%, then ramp.\n\nEvery startup data team eventually builds (or buys) this stack. Knowing the shape early lets you architect for it from day one." }
    ],
    keyCommands: ["pip install streamlit scikit-learn mlflow joblib", "streamlit run src/app.py", "mlflow ui", "pytest tests/"],
    exercises: [
      { question: "Why save the entire Pipeline, not just the trained model?", answer: "Serving needs to apply the same preprocessing (imputers, scalers, encoders) before the model sees a row. If you save only the classifier, your serving code has to re-implement preprocessing and stay in sync forever — that's train/serve skew. Pickling the Pipeline keeps them locked together." },
      { question: "What goes in `data/raw/` vs `data/processed/` and why?", answer: "`raw/` is immutable — the original ingest, committed (or backed up) as-is. `processed/` is regeneratable — cleaned and feature-engineered outputs that any version of the code can rebuild from `raw/`. The rule: never edit `raw/`. If your raw data ever changes, that's a versioning event (new snapshot), not a mutation." },
      { question: "Why monitor *inputs* in production, not just accuracy?", answer: "You usually don't get labels in real time — you might not know for weeks whether yesterday's predictions were right. But you do see the inputs immediately. If the distribution of `age` or `income` shifts noticeably from training data, your model is now extrapolating, and accuracy will degrade. Input monitoring catches problems before the label-feedback loop closes." }
    ],
    lab: {
      goal: "Build the end-to-end mini-pipeline: load tiny data, compute mean spend per category, predict 'high spender' if above mean. Print accuracy. Output must contain `0.8` or `1.0`.",
      steps: ["Build a small DataFrame.", "Compute mean.", "Label rows.", "Compute accuracy of a 'predict positive if above mean' rule against a tiny known truth."],
      verifyId: "capstone-accuracy",
      starter: `import pandas as pd\n\ndf = pd.DataFrame({\n  'customer': list('ABCDE'),\n  'spend': [10, 20, 30, 80, 100],\n  'high':  [0, 0, 0, 1, 1],\n})\nthreshold = df['spend'].mean()\ndf['pred'] = (df['spend'] > threshold).astype(int)\nacc = (df['pred'] == df['high']).mean()\nprint(round(acc, 2))\n`
    }
  }
];

const _CH6: Chapter[] = [
  {
    id: "pandas-deep",
    number: 11,
    level: "expert",
    title: "Pandas — DataFrames, indexing, groupby, merge, time series",
    summary: "The full pandas toolkit a working data scientist uses daily: dtypes, indexing (loc/iloc/at), groupby-agg-transform, merges, pivots, time-series resampling.",
    duration: "55 min",
    sections: [
      { heading: "Series and DataFrame — the labeled arrays", body: "```python\nimport pandas as pd\nimport numpy as np\n\ns = pd.Series([10, 20, 30], index=['a','b','c'], name='x')\ndf = pd.DataFrame({\n    'date': pd.to_datetime(['2026-01-01','2026-01-02','2026-01-03']),\n    'cat':  pd.Categorical(['food','rent','food']),\n    'amt':  [12.5, 1200, 9.8],\n})\nprint(df.dtypes, df.memory_usage(deep=True), sep='\\n')\n```\n\n**Series** = 1-D array with an **Index**. **DataFrame** = dict of Series sharing an Index. Columns are typed numpy arrays under the hood (or PyArrow-backed since pandas 2.0). Categorical dtype compresses repeated strings to ints — huge memory wins for IDs and labels. Datetime64 is the proper time type — never store dates as strings." },
      { heading: ".loc, .iloc, .at — and why `df['x'][0]` is a footgun", body: "```python\ndf.loc[df.amt > 100, ['date','amt']]   # label-based\ndf.iloc[0:3, [0, 2]]                    # positional\ndf.at[0, 'amt'] = 13.0                  # fast scalar set\ndf.set_index('date').loc['2026-01']      # partial datetime indexing\n```\n\n**`.loc`** uses labels (and is inclusive on the right). **`.iloc`** uses integer positions. **`.at`** is the O(1) scalar setter. Chained indexing — `df['amt'][df.cat=='food'] = 0` — sometimes assigns to a copy (the infamous `SettingWithCopyWarning`). Always use `.loc[mask, 'amt'] = 0` instead." },
      { heading: "GroupBy — the workhorse of analytics", body: "```python\ng = df.groupby('cat', observed=True)\ng['amt'].sum()\ng.agg(total=('amt','sum'), avg=('amt','mean'), n=('amt','size'))   # named agg\ndf['rank'] = g['amt'].rank(ascending=False)                          # transform — same shape\ndf.groupby(pd.Grouper(key='date', freq='W'))['amt'].sum()           # time bucket\n```\n\nThe split-apply-combine triad. **`.agg()`** reduces (one row per group). **`.transform()`** broadcasts results back (same shape as input). **`.apply()`** is the slow escape hatch — avoid when a built-in agg exists. `observed=True` matters for categoricals; without it you get all-pairs cross-products. Named aggregation gives you clean output columns instead of multi-level headers." },
      { heading: "Merge and concat — the SQL of pandas", body: "```python\norders.merge(customers, on='customer_id', how='left',\n             validate='m:1', indicator=True)\npd.concat([df1, df2], axis=0, ignore_index=True)\norders.join(prices.set_index('product_id'), on='product_id')\n```\n\n`merge` is SQL JOIN. **Always pass `validate=`** ('1:1','1:m','m:1','m:m') — pandas will raise if your assumed cardinality is wrong, catching duplicate-key bugs that silently fan out rows. `indicator=True` adds a `_merge` column showing which side each row came from — invaluable for diagnosing missed joins.\n\n`concat` stacks. `axis=0` stacks rows; `axis=1` stacks columns (aligned by index)." },
      { heading: "Pivots, melts, and reshaping", body: "```python\ndf.pivot_table(index='cat', columns=df.date.dt.month,\n               values='amt', aggfunc='sum', fill_value=0)\ndf.melt(id_vars=['date'], var_name='metric', value_name='value')\ndf.stack(); df.unstack()      # multiindex acrobatics\ndf.explode('tags')             # one list-valued cell → multiple rows\n```\n\n**Long format** (one row per observation) is what analytics and viz libraries want. **Wide format** (one column per category) is what humans read. `melt` goes wide→long; `pivot`/`pivot_table` go long→wide. `explode` flattens list cells — perfect for tag/array columns." },
      { heading: "Time series — the killer feature", body: "```python\nts = df.set_index('date').sort_index()\nts['amt'].resample('D').sum().rolling(7).mean()       # daily totals, 7-day MA\nts.tz_localize('UTC').tz_convert('Europe/Zurich')\nts.shift(1); ts.diff(); ts.pct_change()\nts.asfreq('D').interpolate('linear')                  # fill missing days\n```\n\npandas' time-series support is why every finance/IoT/web-analytics shop runs on it. `resample` is groupby for time. `rolling` for moving windows. `shift`/`diff` for lag features. Always sort by the time index first, always be explicit about timezones — DST and UTC bugs are forever." },
      { heading: "Performance — when pandas isn't enough", body: "```python\ndf['cat'] = df['cat'].astype('category')              # smaller, faster groupby\ndf = df.convert_dtypes(dtype_backend='pyarrow')       # PyArrow-backed, faster\nfor chunk in pd.read_csv('huge.csv', chunksize=100_000):\n    process(chunk)\n```\n\nThe escape ladder when pandas crawls: **categoricals** → **PyArrow backend** (pandas 2.0+) → **Polars** (lazy, multi-threaded, Rust) → **DuckDB** (SQL, vectorized) → **Dask** (distributed pandas) → **Spark** (distributed everything). For 99% of workloads under 100 GB, pandas 2.x with PyArrow + DuckDB is enough." }
    ],
    keyCommands: ["pip install 'pandas[performance]' pyarrow polars duckdb", "python -c 'import pandas as pd; pd.show_versions()'", "df.info(memory_usage='deep')"],
    exercises: [
      { question: "Why does `df['x'][df.y > 0] = 1` sometimes silently fail?", answer: "Chained indexing — `df['x']` returns a Series, the boolean indexer assigns into *that*, which might be a copy. pandas can't always tell. Use `df.loc[df.y > 0, 'x'] = 1` — single indexing op, guaranteed to assign in place." },
      { question: "Difference between `groupby().agg()` and `groupby().transform()`?", answer: "`agg` reduces — one row per group. `transform` broadcasts the aggregated value back to every row in the group, so the result has the same shape as the input. Use `transform` to compute group-relative features (z-score within group, rank within group)." },
      { question: "Why use `validate='m:1'` on a merge?", answer: "It asserts you expect a many-to-one relationship (many orders per customer, one row per customer in the right table). If your right table actually has duplicate `customer_id`s, pandas will raise instead of silently inflating your row count — which is the most common 'wait, why did my totals double?' bug." }
    ],
    lab: {
      goal: "Build a small DataFrame, groupby category, sum the amount, print. Output must contain both `food` and `rent`.",
      steps: ["pandas pre-loaded.", "`pd.DataFrame({'cat': [...], 'amt': [...]})`", "`.groupby('cat')['amt'].sum()`"],
      verifyId: "pandas-groupby",
      starter: `import pandas as pd\n\ndata = {\n  'cat': ['food','rent','food','rent','food'],\n  'amt': [12.5, 1200, 9.8, 1200, 15.2],\n}\n# build df, group by cat, sum amt, print\n`
    }
  },
  {
    id: "data-cleaning-sql",
    number: 12,
    level: "expert",
    title: "Data cleaning, SQL, and DuckDB",
    summary: "Missing values, dtype coercion, dedup, the SQL refresher every Python dev needs, SQLAlchemy basics, and using DuckDB as your in-process analytics engine.",
    duration: "45 min",
    sections: [
      { heading: "Cleaning is the job", body: "Real data is dirty. Working data scientists spend the majority of their time on **ingest → clean → validate** before any model or chart. The canonical issues:\n\n- **Missing values** — `NaN` (numeric), `NaT` (datetime), `pd.NA` (nullable). Decide per column: drop, fill, impute, or flag.\n- **Wrong dtypes** — `'1,234'` parsed as string, dates as object. `pd.to_numeric(s, errors='coerce')`, `pd.to_datetime(s)`.\n- **Duplicates** — `df.duplicated(subset=['id'], keep='first')`. Real source-of-truth bugs hide here.\n- **Outliers** — domain-specific. IQR filter, winsorize, or model robustly.\n- **Unit confusion** — `amount` in cents vs. dollars. Encode in the column name." },
      { heading: "The cleaning recipe", body: "```python\ndf = (pd.read_csv('raw.csv', parse_dates=['date'])\n        .rename(columns=str.lower)\n        .assign(amount=lambda d: pd.to_numeric(d.amount, errors='coerce'),\n                category=lambda d: d.category.str.strip().str.lower())\n        .dropna(subset=['amount'])\n        .drop_duplicates(subset=['order_id'])\n        .query('amount > 0')\n        .reset_index(drop=True))\n```\n\nMethod chaining keeps the pipeline readable as a single flow. Each step is reviewable. The `.pipe(fn)` method plugs in custom transforms without breaking the chain. Wrap the whole thing in a function that takes a path and returns a clean DataFrame — that's your reusable contract." },
      { heading: "SQL — the language you'll never escape", body: "```sql\nSELECT category,\n       DATE_TRUNC('month', date) AS month,\n       SUM(amount) AS total,\n       COUNT(*)   AS n_orders,\n       AVG(amount) AS avg_order\nFROM orders\nWHERE date >= '2026-01-01'\nGROUP BY category, month\nHAVING SUM(amount) > 1000\nORDER BY month, total DESC;\n```\n\nThe core SQL every Python dev needs: SELECT, WHERE, GROUP BY + HAVING, ORDER BY, JOIN (INNER/LEFT/RIGHT/FULL), window functions (`ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)`), CTEs (`WITH x AS (...)`). Window functions in particular replace 80% of complicated pandas one-liners with a readable SQL statement. Learn them." },
      { heading: "DuckDB — SQL inside Python, at speed", body: "```python\nimport duckdb\nimport pandas as pd\n\ndf = pd.read_csv('orders.csv')\nresult = duckdb.query(\"\"\"\n    SELECT category, SUM(amount) AS total\n    FROM df\n    GROUP BY category\n    ORDER BY total DESC\n\"\"\").df()\n\nduckdb.sql(\"\"\"\n    SELECT * FROM 'data/*.parquet'\n    WHERE date BETWEEN '2026-01-01' AND '2026-12-31'\n\"\"\").to_parquet('subset.parquet')\n```\n\n**DuckDB** is SQLite for analytics — in-process, columnar, vectorized C++. It queries DataFrames, Parquet, CSV, Postgres tables, S3 buckets, all with zero setup. The 2026 default for ad-hoc analysis on 1 GB–1 TB: write SQL, point at files, get pandas back. It often beats `pandas.groupby` by 10× on the same machine because the engine is built for joins and aggregations." },
      { heading: "SQLAlchemy for real applications", body: "```python\nfrom sqlalchemy import create_engine, text\nfrom sqlalchemy.orm import declarative_base, Session, Mapped, mapped_column\n\nclass Base(declarative_base()): pass\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    email: Mapped[str]\n\nengine = create_engine('postgresql://user:pw@host/db', pool_pre_ping=True)\nwith Session(engine) as s:\n    u = User(email='a@b.c'); s.add(u); s.commit()\n\nwith engine.connect() as c:\n    df = pd.read_sql(text('SELECT * FROM users WHERE id > :n'), c, params={'n': 0})\n```\n\nFor application code, **SQLAlchemy 2.0** is the standard ORM + query builder. Use the ORM for transactional CRUD, raw SQL (via `text()`) + `pd.read_sql` for analytics queries. Always use a connection pool (`create_engine` gives you one), always parameterize (`:name` placeholders) — never f-string SQL." }
    ],
    keyCommands: ["pip install duckdb sqlalchemy psycopg2-binary", "duckdb my.duckdb", "psql -h host -U user db"],
    exercises: [
      { question: "Why does `pd.to_numeric(s, errors='coerce')` exist?", answer: "Strict parsing raises on the first bad row. `errors='coerce'` turns unparseable values into `NaN` so you keep the rest of the data and can decide what to do with the missing rows afterward (drop, fill, flag for review). Production cleaning pipelines almost always coerce." },
      { question: "When use DuckDB instead of pandas?", answer: "When the operation is JOIN-heavy or GROUPBY-heavy, when the data lives in Parquet on disk and you want to push filtering before loading, when SQL is more readable than a chain of pandas calls, or when the dataset doesn't fit comfortably in RAM. DuckDB streams from disk." },
      { question: "Why parameterize SQL with `:name` instead of f-strings?", answer: "SQL injection. An f-string built from user input lets the user terminate your string and inject arbitrary SQL. Parameter binding sends the values separately so the database knows they're data, not code. There is no other acceptable way to put user input in SQL." }
    ],
    lab: {
      goal: "Build a DataFrame, query it with DuckDB to sum `amt` per `cat`, print. Output must contain `food` and `rent`.",
      steps: ["`import duckdb, pandas as pd`", "Build df.", "`duckdb.query(\"SELECT cat, SUM(amt) FROM df GROUP BY cat\").df()`", "Print result."],
      verifyId: "duckdb-groupby",
      starter: `# Note: this lab pretends DuckDB is available. In a real env: pip install duckdb\nimport pandas as pd\n\ndata = {\n  'cat': ['food','rent','food','rent','food'],\n  'amt': [12.5, 1200, 9.8, 1200, 15.2],\n}\ndf = pd.DataFrame(data)\n# DuckDB equivalent via pandas (Pyodide may not have duckdb):\nprint(df.groupby('cat')['amt'].sum())\n`
    }
  }
];

const _CH5: Chapter[] = [
  {
    id: "file-io-data-formats",
    number: 9,
    level: "advanced",
    title: "File I/O, paths, and data formats",
    summary: "pathlib, text vs. binary, JSON/CSV/Parquet/Arrow/Pickle, encodings, and the file-handling habits that don't bite at scale.",
    duration: "30 min",
    sections: [
      { heading: "pathlib — the only file-path API you should reach for", body: "```python\nfrom pathlib import Path\n\nroot = Path(__file__).parent\ndata = root / 'data' / 'sales.csv'      # / is overloaded for join\nprint(data.exists(), data.suffix, data.stem)\nfor f in (root / 'data').glob('*.parquet'):\n    process(f)\n```\n\n`pathlib.Path` replaces `os.path.join`, `os.path.exists`, `os.path.splitext`. Methods are typed, return `Path` objects, and work the same on Windows and POSIX. `Path('foo.json').read_text()` and `.write_text(s)` cover most one-off scripts; for streaming use `with path.open('r', encoding='utf-8') as f:`." },
      { heading: "Text vs. binary, encodings, and the default encoding trap", body: "```python\nopen('f.txt', 'r', encoding='utf-8')   # text — decoded to str\nopen('f.bin', 'rb')                    # binary — bytes\n```\n\n**Always pass `encoding='utf-8'`** explicitly. Python's default has historically been locale-dependent — that's how 'works on my Mac, breaks on production Linux' bugs are born. Python 3.15 makes UTF-8 the default, but until then, be explicit.\n\nNewline modes: `'rt'` (default) translates `\\r\\n` → `\\n` on Windows. `'rb'` doesn't translate. CSV-handling libs want `newline=''` to disable translation and let csv handle line endings itself." },
      { heading: "JSON, CSV, and when each is wrong", body: "```python\nimport json, csv\n\nwith open('data.json', encoding='utf-8') as f:\n    obj = json.load(f)\n\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['id','name'])\n    w.writeheader(); w.writerows(rows)\n```\n\n**JSON** is universal but slow and uncompressed — fine for configs and APIs, terrible for analytics at scale. **CSV** is even worse for analytics (no types, no schema, ambiguous quoting) but is the universal export format.\n\nFor speed: `orjson` (Rust-backed JSON, 5–10× faster) and `polars.read_csv` (multi-threaded). For >100 MB of structured data, skip both and use Parquet." },
      { heading: "Parquet and Arrow — the columnar standard", body: "```python\nimport pyarrow.parquet as pq\nimport pandas as pd\n\ndf.to_parquet('sales.parquet', compression='zstd')\ntbl = pq.read_table('sales.parquet', columns=['date','amount'])  # column pruning\n```\n\n**Parquet** stores data columnar, compressed (snappy/zstd), with embedded schema and per-column statistics. Reading one column out of 200 reads ~1/200 of the bytes. **Arrow** is the in-memory companion format — zero-copy interchange between pandas, polars, DuckDB, Spark.\n\nThe 2026 default: land raw data as Parquet, query it with DuckDB or Polars, only fall back to CSV for human-readable exports." },
      { heading: "Pickle, env, and the boring-but-critical bits", body: "```python\nimport pickle, os\nfrom dotenv import load_dotenv   # pip install python-dotenv\n\nload_dotenv()\nAPI_KEY = os.environ['API_KEY']\n\nwith open('model.pkl', 'wb') as f:\n    pickle.dump(model, f, protocol=pickle.HIGHEST_PROTOCOL)\n```\n\n**Pickle** serializes any Python object — including arbitrary code execution on load. **Never unpickle untrusted data.** Use it only for trusted local cache. For ML models, prefer `joblib` (faster on numpy arrays) or framework-native formats (`torch.save`, `model.save_pretrained`).\n\n**Secrets** belong in environment variables, not in code. `.env` files for local dev (gitignored), real secret managers (Vault, AWS Secrets Manager) for production. Loading via `python-dotenv` or `pydantic-settings` is the standard pattern." }
    ],
    keyCommands: ["pip install orjson pyarrow python-dotenv pydantic-settings", "python -c 'import pyarrow.parquet as pq; print(pq.read_metadata(\"x.parquet\"))'", "head -c 100 file.bin | xxd"],
    exercises: [
      { question: "Why is Parquet faster than CSV for analytics?", answer: "Three reasons: (1) columnar layout means a query reading 2 of 200 columns reads ~1% of the bytes; (2) compressed (snappy/zstd) — usually 4–10× smaller on disk; (3) typed schema, so no parsing/inference overhead. CSV has to be re-parsed in full every read." },
      { question: "What's wrong with `pickle.load(open(downloaded_file, 'rb'))`?", answer: "Pickle executes arbitrary code during unpickle. A malicious file can `__reduce__` to `os.system('rm -rf ~')` and you've handed the attacker a shell. Only unpickle data you wrote yourself or got from a fully trusted source." }
    ],
    lab: {
      goal: "Build a small dict, JSON-encode it, parse it back, and print the value. Output must contain `42`.",
      steps: ["`import json`", "`s = json.dumps({'x': 42})`", "`print(json.loads(s)['x'])`"],
      verifyId: "json-roundtrip",
      starter: `import json\n\n# encode a dict to JSON, decode it back, print the 'x' field\n`
    }
  },
  {
    id: "numpy-foundations",
    number: 10,
    level: "advanced",
    title: "NumPy — the array, broadcasting, and vectorization",
    summary: "ndarray, dtypes, broadcasting rules, axis semantics, fancy indexing, and the mental model behind every numerical Python library.",
    duration: "40 min",
    sections: [
      { heading: "The ndarray is the foundation", body: "Every serious numerical library in Python — pandas, scikit-learn, PyTorch, JAX — either is a numpy array or interoperates with one. The **`ndarray`** is a contiguous, homogeneous C buffer with metadata: dtype, shape, strides.\n\n```python\nimport numpy as np\na = np.array([[1,2,3],[4,5,6]], dtype=np.float32)\nprint(a.shape, a.dtype, a.nbytes, a.strides)\n```\n\nMemory: `2*3*4 = 24 bytes`, plus a small Python wrapper. A Python `list` of the same numbers is ~10× larger and forces a pointer-chase per element. Speed: vectorized ops dispatch to BLAS (Intel MKL, OpenBLAS) — multi-threaded, SIMD'd C." },
      { heading: "Creating and reshaping", body: "```python\nnp.zeros((3,4)); np.ones((3,4)); np.full((3,4), 7)\nnp.arange(10).reshape(2,5)\nnp.linspace(0, 1, 11)               # 11 points 0..1 inclusive\nnp.random.default_rng(42).normal(size=(1000,))  # use Generator, not legacy global\nnp.eye(4)                            # identity\n```\n\n`reshape(-1, 3)` lets numpy infer the missing dimension. `a.ravel()` is a 1-D view (no copy); `a.flatten()` is a copy. `a.T` is the transpose view. Most reshapes are O(1) — they just rewrite stride metadata." },
      { heading: "Broadcasting — the rule that unlocks vectorization", body: "When operating on arrays of different shapes, numpy aligns trailing dimensions. Dimensions match if equal **or** one of them is 1.\n\n```python\nx = np.arange(12).reshape(3, 4)    # (3,4)\nrow = np.array([10, 20, 30, 40])    # (4,)   → broadcasts to (3,4)\ncol = np.array([[1],[2],[3]])       # (3,1) → broadcasts to (3,4)\nprint(x + row); print(x + col)\n```\n\nMistakes are easy: `(3,) + (3,1)` produces `(3,3)`, not what you wanted. Use `np.newaxis` (alias `None`) to insert axes explicitly: `a[:, None]` turns `(N,)` into `(N,1)`. Reading broadcasting wrong is the #1 numpy bug." },
      { heading: "Axis semantics and reductions", body: "```python\nx = np.arange(12).reshape(3, 4)\nx.sum()              # scalar — sum everything\nx.sum(axis=0)        # shape (4,) — sum down rows ('collapse axis 0')\nx.sum(axis=1)        # shape (3,) — sum across cols\nx.sum(axis=1, keepdims=True)   # shape (3,1) — useful for broadcasting back\n```\n\nMental model: **`axis=k` collapses the k-th axis**. `mean`, `std`, `max`, `argmax`, `cumsum` all follow the same rule. `keepdims=True` is the difference between code that lines up after the reduction and code that needs ugly reshapes." },
      { heading: "Indexing and the copy/view distinction", body: "```python\na = np.arange(12).reshape(3,4)\na[1, 2]           # scalar\na[1]              # row 1, shape (4,) — view\na[:, 1]           # col 1, shape (3,) — view\na[a > 5]          # boolean mask, shape (?,) — copy\na[[0,2], [1,3]]   # fancy: pairs (0,1),(2,3) — copy\n```\n\n**Basic indexing** (slices, ints) returns **views** — mutation propagates. **Fancy indexing** (bool masks, integer arrays) returns **copies**. Forgetting this leads to 'why didn't my mutation stick?' bugs. When in doubt, `arr.flags.owndata` tells you." },
      { heading: "Linear algebra and where to stop", body: "```python\nA = np.random.rand(1000, 1000)\nb = np.random.rand(1000)\nx = np.linalg.solve(A, b)            # Ax = b\nU, S, Vt = np.linalg.svd(A)\nA @ B                                 # matmul (also np.matmul, np.einsum)\n```\n\n`numpy.linalg` covers solve, inverse, eigendecomposition, SVD, QR, Cholesky — all routed to LAPACK. For sparse problems, switch to `scipy.sparse`. For GPU, switch to PyTorch / JAX / cupy — same API, different backend.\n\nWhen numpy isn't enough: data > RAM → dask/polars; need GPUs → PyTorch/JAX; need a query language → DuckDB. Don't fight numpy past its sweet spot." }
    ],
    keyCommands: ["pip install numpy scipy", "python -c 'import numpy as np; np.show_config()'", "python -c 'import numpy as np; print(np.__version__)'"],
    exercises: [
      { question: "What's the broadcast shape of `(5, 1, 4)` and `(3, 4)`?", answer: "Right-align: `(5, 1, 4)` vs `(_, 3, 4)`. The 1 aligns with 3 (broadcasts), the implicit leading dim aligns with 5. Result: `(5, 3, 4)`." },
      { question: "Why is `np.float32` often preferred over `np.float64` in ML?", answer: "Half the memory, roughly twice the FLOPS on GPUs (and bigger speedups on bfloat16/fp16). Most ML losses don't need 64-bit precision. Default scientific computing keeps float64; ML defaults to float32 (or bfloat16) and only uses float64 for accumulating sums where precision matters." },
      { question: "Compute the per-column mean of a (1000, 5) matrix.", answer: "`X.mean(axis=0)` — collapses axis 0 (rows), keeping the 5 columns. Result shape `(5,)`." }
    ],
    lab: {
      goal: "Create a (3, 4) numpy array of ones and print its per-row sum. Output must contain `[4. 4. 4.]`.",
      steps: ["`import numpy as np`", "`a = np.ones((3, 4))`", "`print(a.sum(axis=1))`"],
      verifyId: "numpy-rowsum",
      starter: `import numpy as np\n\n# create (3,4) ones, print row sums\n`
    }
  }
];

const _CH4: Chapter[] = [
  {
    id: "errors-iterators-context",
    number: 7,
    level: "advanced",
    title: "Errors, context managers, and the iterator protocol",
    summary: "`try/except/else/finally`, `with`-statements, generators, and the lazy-pipeline mindset.",
    duration: "30 min",
    sections: [
      { heading: "Exceptions are a control-flow tool", body: "Python uses exceptions liberally — `StopIteration` ends a loop, `KeyError` signals a missing dict key. **EAFP** (Easier to Ask Forgiveness than Permission) is idiomatic.\n\n```python\ntry:\n    age = int(s)\nexcept ValueError:\n    age = None\nelse:\n    log('parsed', age)   # only if no exception\nfinally:\n    cleanup()            # always\n```\n\nNever `except Exception:` without re-raising or logging. Catch the specific class. Custom errors subclass `Exception`. Use `raise SomeError(...) from original` to preserve the cause — `__cause__` shows the chain in tracebacks." },
      { heading: "Exception groups (3.11+)", body: "```python\ntry:\n    raise ExceptionGroup('multiple failures', [\n        ValueError('bad id'),\n        ConnectionError('timeout'),\n    ])\nexcept* ValueError as eg:\n    handle_validation(eg.exceptions)\nexcept* ConnectionError as eg:\n    handle_network(eg.exceptions)\n```\n\n`ExceptionGroup` + `except*` syntax (PEP 654) handles parallel failures — common in async (`asyncio.TaskGroup`) and any fan-out workflow. Each `except*` clause sees only its matching subset." },
      { heading: "Context managers and `with`", body: "```python\nwith open('data.csv') as f, open('out.csv', 'w') as g:\n    g.write(f.read())\n# both closed, in reverse order, even if write() raises\n```\n\nAny object with `__enter__` and `__exit__` works. Custom ones via `contextlib.contextmanager`:\n\n```python\nfrom contextlib import contextmanager\n\n@contextmanager\ndef timer(label):\n    t = time.perf_counter()\n    try:    yield\n    finally: print(f'{label}: {time.perf_counter()-t:.3f}s')\n\nwith timer('parse'): parse_huge_file()\n```\n\nUse `with` for **anything needing deterministic cleanup**: files, sockets, DB connections, locks, GPU streams, temporary directories (`tempfile.TemporaryDirectory()`)." },
      { heading: "Generators — lazy by default", body: "```python\ndef chunks(iterable, n):\n    buf = []\n    for x in iterable:\n        buf.append(x)\n        if len(buf) == n:\n            yield buf\n            buf = []\n    if buf: yield buf\n```\n\nA function with `yield` is a **generator function**. Calling it returns a **generator** (an iterator). Execution pauses at each `yield` and resumes on `next()`. Locals survive across yields.\n\nMost Python that 'looks like it builds a list' doesn't have to. `sum(x*x for x in stream)` allocates nothing. That's how you process files larger than RAM. Generators also underpin async/await semantically." },
      { heading: "The lazy-pipeline mindset", body: "```python\nfrom itertools import islice\n\nlines  = (line.rstrip() for line in open('huge.log'))\nparsed = (parse(line) for line in lines)\nerrors = (p for p in parsed if p.level == 'ERROR')\nfirst10 = list(islice(errors, 10))\n```\n\nFour generator stages. **Zero** intermediate lists. Memory: O(1). You can plug this into any Iterable consumer — `csv.DictWriter`, `pd.DataFrame`, `multiprocessing.Pool.imap`. This composability is why generators are the secret weapon for ETL." }
    ],
    keyCommands: ["python -X dev script.py", "python -m pdb script.py", "python -c 'import logging; logging.warning(\"hi\")'", "python -m tracemalloc"],
    exercises: [
      { question: "When does the body of a generator function start executing?", answer: "Not on call — calling it returns the generator object. The body starts on the first `next()` (directly or via `for`), runs until the first `yield`, then pauses. Each subsequent `next()` resumes after the previous yield." },
      { question: "What's the difference between `raise X` and `raise X from y`?", answer: "`raise X` sets `__context__` (implicit chaining — 'while handling y, X happened'). `raise X from y` sets `__cause__` (explicit — 'X happened *because of* y'). Use `from` when you're translating one exception type into another." }
    ],
    lab: {
      goal: "Write generator `evens(n)` yielding the first `n` even numbers starting at 2. Print `list(evens(5))`. Output must contain `[2, 4, 6, 8, 10]`.",
      steps: ["`yield 2*i` for `i in range(1, n+1)`.", "Wrap with `list(...)` and print."],
      verifyId: "evens-gen",
      starter: `def evens(n):\n    # your code\n    ...\n\nprint(list(evens(5)))\n`
    }
  },
  {
    id: "concurrency",
    number: 8,
    level: "advanced",
    title: "Concurrency: threads, asyncio, multiprocessing, and the GIL",
    summary: "Why threads don't make pure-Python faster, how async I/O works, when to reach for processes, and the mental model you wish someone had given you on day one.",
    duration: "35 min",
    sections: [
      { heading: "The GIL in one paragraph", body: "CPython has a **Global Interpreter Lock** — only one thread runs Python bytecode at a time. Threads context-switch but don't give you CPU parallelism for pure-Python work. They *do* help for **I/O-bound** work (one thread waits on a socket, another runs). They don't help for **CPU-bound** work.\n\nPython 3.13 added an experimental free-threaded build (`--disable-gil`). Production code in 2026 still assumes the GIL. Design accordingly." },
      { heading: "Threads for I/O, processes for CPU", body: "```python\nfrom concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor\n\nwith ThreadPoolExecutor(max_workers=10) as ex:\n    pages = list(ex.map(requests.get, urls))     # I/O — good\n\nwith ProcessPoolExecutor() as ex:\n    primes = list(ex.map(is_prime, big_numbers)) # CPU — escape the GIL\n```\n\n`concurrent.futures` is the modern API — `Future`, `as_completed`, timeouts, cancellation. Process pools pickle args/results; large objects make that overhead dominate." },
      { heading: "asyncio: one thread, many coroutines", body: "```python\nimport asyncio, httpx\n\nasync def fetch(client, url):\n    r = await client.get(url)\n    return len(r.content)\n\nasync def main(urls):\n    async with httpx.AsyncClient() as client:\n        async with asyncio.TaskGroup() as tg:           # 3.11+\n            tasks = [tg.create_task(fetch(client, u)) for u in urls]\n    return [t.result() for t in tasks]\n\nprint(asyncio.run(main(['https://example.com']*100)))\n```\n\n`async def` defines a **coroutine**. `await` yields to the loop while waiting on I/O. One OS thread juggles thousands of concurrent requests. Catch: **everything in an async path must be async**. One blocking call stalls the whole loop. Wrap blocking with `await asyncio.to_thread(fn, *args)`." },
      { heading: "Which one when?", body: "- **Pure I/O, native-async libs** (httpx, asyncpg, aiokafka) → asyncio.\n- **I/O against blocking libs you can't replace** → ThreadPoolExecutor.\n- **CPU-bound, partitionable** → ProcessPoolExecutor.\n- **CPU-bound, vectorizable** → numpy. The inner loop is C, GIL is a non-issue.\n- **Scaling beyond one box** → distributed (Ray, Dask, Celery, Modal).\n\nMost common production mistake: reaching for `asyncio` to 'make things faster' when the bottleneck is a `pandas.apply()` doing pure-Python row work. Profile first (`cProfile`, `py-spy`). Then choose." }
    ],
    keyCommands: ["pip install py-spy httpx anyio uvloop", "py-spy top --pid $(pgrep -n python)", "python -m cProfile -s cumulative script.py | head -30"],
    exercises: [
      { question: "Why does numpy code 'beat the GIL' without using processes?", answer: "numpy's heavy operations release the GIL while in C land. Two threads each doing `a @ b` on numpy arrays run in parallel on different cores. The GIL only protects Python *bytecode* execution; pure C extensions can opt out." },
      { question: "What's the rule for mixing blocking code into asyncio?", answer: "Never call blocking I/O directly inside `async def`. Use `await asyncio.to_thread(blocking_fn, *args)` to push it to a worker thread, or run it in a `ProcessPoolExecutor` via `loop.run_in_executor`. The async function then awaits the result without freezing the loop." }
    ],
    lab: {
      goal: "Use `asyncio.gather` to run three coroutines returning their index. Print the result. Output must contain `[0, 1, 2]`.",
      steps: ["`async def work(i): await asyncio.sleep(0); return i`.", "`asyncio.run(asyncio.gather(work(0), work(1), work(2)))`."],
      verifyId: "asyncio-gather",
      starter: `import asyncio\n\nasync def work(i):\n    await asyncio.sleep(0)\n    return i\n\n# call asyncio.run(...) and print\n`
    }
  }
];

const _CH3: Chapter[] = [
  {
    id: "oop-deep",
    number: 5,
    level: "intermediate",
    title: "Object-oriented Python — inheritance, ABCs, protocols, descriptors",
    summary: "The full object model: dunders, MRO, ABCs vs. Protocols, properties, descriptors, slots, metaclasses, and when each one earns its keep.",
    duration: "40 min",
    sections: [
      { heading: "A class is a namespace with rituals", body: "```python\nclass User:\n    species = 'human'                  # class attribute, shared\n    def __init__(self, name, age):\n        self.name = name              # instance attribute\n        self.age = age\n    def greet(self):\n        return f'hi, {self.name}'\n```\n\n`self` is the first parameter by convention — the instance gets passed in explicitly. `__init__` is the constructor; object-creation happens in `__new__`, which you almost never override (the exception: subclassing `int`, `tuple`, or other immutables).\n\nClass attributes (defined at class scope) are shared across instances; instance attributes (assigned on `self`) are per-instance. Putting a mutable default at class scope is the OOP version of the mutable-default-argument bug — every instance mutates the same list." },
      { heading: "The dunder protocol — your class IS the syntax", body: "**Dunder** (double-underscore) methods plug your class into the language's syntax:\n\n```python\nclass Money:\n    def __init__(self, cents): self.cents = cents\n    def __add__(self, o):  return Money(self.cents + o.cents)\n    def __sub__(self, o):  return Money(self.cents - o.cents)\n    def __mul__(self, n):  return Money(self.cents * n)\n    def __repr__(self):    return f'Money({self.cents})'\n    def __eq__(self, o):   return isinstance(o, Money) and self.cents == o.cents\n    def __hash__(self):    return hash(('Money', self.cents))\n    def __lt__(self, o):   return self.cents < o.cents\n    def __bool__(self):    return self.cents != 0\n```\n\nThe most-implemented dunders to memorize: `__init__`, `__repr__`, `__eq__`, `__hash__`, `__lt__`, `__len__`, `__iter__`, `__getitem__`, `__contains__`, `__call__`, `__enter__`/`__exit__`. Implementing `__eq__` without `__hash__` makes your class unhashable — usually intentional for mutables; explicit `__hash__ = None` documents it." },
      { heading: "Inheritance and the MRO", body: "```python\nclass A:\n    def hi(self): return 'A'\nclass B(A):\n    def hi(self): return 'B->' + super().hi()\nclass C(A):\n    def hi(self): return 'C->' + super().hi()\nclass D(B, C):\n    def hi(self): return 'D->' + super().hi()\n\nprint(D().hi())  # 'D->B->C->A'\nprint(D.__mro__)\n```\n\nPython uses **C3 linearization** for the **Method Resolution Order**. Multiple inheritance only works sanely when every class in the chain uses `super()` (cooperative multiple inheritance). The MRO is deterministic and visible via `Cls.__mro__` — when in doubt, print it.\n\nReal-world advice: prefer **composition** over inheritance. Reach for inheritance when you genuinely share an interface and ~all the behavior; otherwise embed an instance and forward calls." },
      { heading: "ABCs vs. Protocols — the two ways to say 'must implement'", body: "```python\nfrom abc import ABC, abstractmethod\n\nclass Storage(ABC):\n    @abstractmethod\n    def get(self, key: str) -> bytes: ...\n    @abstractmethod\n    def put(self, key: str, data: bytes) -> None: ...\n```\n\nAn **ABC** uses explicit inheritance (`class S3(Storage):`) and fails at instantiation if any abstract method is missing. Runtime check.\n\n```python\nfrom typing import Protocol\n\nclass Reader(Protocol):\n    def read(self, n: int = -1) -> bytes: ...\n\ndef parse(src: Reader) -> dict: ...   # accepts anything with a read() method\n```\n\nA **Protocol** is **structural** typing — no inheritance needed, mypy checks shape. Use Protocol for 'duck typing with type safety,' ABC when you want a runtime base class with shared logic. In modern code, Protocol is usually the right call." },
      { heading: "Properties and descriptors", body: "```python\nclass Celsius:\n    def __init__(self, t): self._t = t\n    @property\n    def fahrenheit(self): return self._t * 9/5 + 32\n    @fahrenheit.setter\n    def fahrenheit(self, f): self._t = (f - 32) * 5/9\n```\n\n`@property` lets you turn an attribute access into a method call without breaking the API. Use it when you start with a public attribute and later need validation/computation.\n\n**Descriptors** are the underlying mechanism — any class with `__get__`/`__set__`/`__delete__` becomes a descriptor when assigned at class scope. `property`, `classmethod`, `staticmethod`, and SQLAlchemy's columns are all descriptors. You rarely write them, but knowing the protocol demystifies a lot of magic." },
      { heading: "`__slots__`, metaclasses, and when to stop", body: "```python\nclass Point:\n    __slots__ = ('x', 'y')\n    def __init__(self, x, y): self.x, self.y = x, y\n```\n\n`__slots__` replaces the per-instance `__dict__` with a fixed C-array layout. ~40% less memory, slightly faster attribute access. Use for classes you'll instantiate by the million; skip for everything else.\n\n**Metaclasses** are classes-of-classes. `class Meta(type): ...; class Foo(metaclass=Meta): ...`. The classic example is Django's `ModelBase`, which scans your class body and builds the DB mapping. Real-world advice: 99% of cases that 'need' a metaclass actually need `__init_subclass__` (3.6+) or a decorator. If you're writing a metaclass, take a walk and reconsider." }
    ],
    keyCommands: ["python -c 'class A: pass\\nprint(A.__mro__)'", "python -m dis script.py | head", "pip install attrs pydantic"],
    exercises: [
      { question: "When should `__eq__` be paired with `__hash__`?", answer: "Whenever you want instances usable as dict keys or set elements. If you implement `__eq__` and want the object to remain hashable, you must implement `__hash__` consistently (`hash(x) == hash(y)` whenever `x == y`). Mutable objects typically set `__hash__ = None`." },
      { question: "Why prefer Protocol over ABC for new code?", answer: "Protocol gives you structural ('duck') typing with static checking — callers don't have to inherit anything. ABCs require explicit inheritance, which couples implementations to your base class. Protocols compose better with code you don't control (e.g., third-party libs)." },
      { question: "What does `super()` actually call in multiple inheritance?", answer: "`super()` follows the MRO of the current instance, not the lexical parent. In `class D(B, C)`, inside `B.hi`, `super().hi()` calls `C.hi` — because the *instance*'s MRO is `D->B->C->A`. That's why cooperative multi-inheritance requires every class to use `super()`." }
    ],
    lab: {
      goal: "Define a frozen `Point` dataclass with `x: float, y: float` and method `distance(other) -> float`. Print `Point(0,0).distance(Point(3,4))`. Output must contain `5.0`.",
      steps: ["`from dataclasses import dataclass; import math`", "`@dataclass(frozen=True)`", "`return math.hypot(self.x - other.x, self.y - other.y)`"],
      verifyId: "point-distance",
      starter: `from dataclasses import dataclass\nimport math\n\n# define Point with x, y, and distance(other)\n\n# print(Point(0,0).distance(Point(3,4)))\n`
    }
  },
  {
    id: "dataclasses-typing",
    number: 6,
    level: "intermediate",
    title: "Dataclasses, typing, and pydantic",
    summary: "Modern Python types: dataclasses, attrs, pydantic v2 for validated models, generics, TypedDict, NewType, and the typing patterns real projects use.",
    duration: "30 min",
    sections: [
      { heading: "Dataclasses — boilerplate, gone", body: "```python\nfrom dataclasses import dataclass, field\n\n@dataclass(frozen=True, slots=True, kw_only=True)\nclass Order:\n    id: int\n    items: list[str] = field(default_factory=list)\n    total_cents: int = 0\n```\n\nOne decorator generated `__init__`, `__repr__`, `__eq__`, and `__hash__` (because `frozen=True`). `slots=True` (3.10+) uses a fixed layout — faster, leaner. `kw_only=True` (3.10+) forces keyword arguments at the call site, killing positional-arg bugs as fields evolve.\n\n`field(default_factory=list)` avoids the mutable-default trap. `field(init=False, repr=False)` excludes from `__init__`/`__repr__`. `field(metadata={...})` carries arbitrary tags for serializers." },
      { heading: "Type hints in 2026 syntax", body: "```python\nfrom typing import Iterable, Optional, Union, Callable, Literal\n\ndef average(xs: Iterable[float]) -> float: ...\ndef pick(s: str | None) -> str: ...                       # 3.10+ union\ndef http(method: Literal['GET','POST','PUT']) -> ...: ... # restricted vals\ndef apply(fn: Callable[[int, int], int], a, b): ...\n```\n\n3.10+ syntax: `int | None` instead of `Optional[int]`, `list[int]` instead of `List[int]`. Hints are **not enforced at runtime** — they're metadata read by **mypy** or **pyright**. The IDE uses them for autocomplete and refactoring.\n\nAnnotate **public function signatures** and **dataclass fields**. Leave local variables alone unless they're hard to infer. Add `from __future__ import annotations` at top of file to lazy-evaluate annotations (fixes forward-reference cycles)." },
      { heading: "pydantic v2 — validated models at C speed", body: "```python\nfrom pydantic import BaseModel, Field, EmailStr\nfrom datetime import datetime\n\nclass User(BaseModel):\n    id: int\n    email: EmailStr\n    created_at: datetime\n    tags: list[str] = Field(default_factory=list, max_length=10)\n\nu = User.model_validate({'id': '1', 'email': 'a@b.c', 'created_at': '2026-01-01T00:00:00'})\nprint(u.model_dump_json())\n```\n\npydantic v2's core is in Rust — 5–50× faster than v1. It's the de-facto data-validation library and the engine behind FastAPI. Use it at every system boundary: API requests, config files, LLM tool-call schemas. Inside the application core, prefer plain dataclasses (lighter, no schema generation overhead)." },
      { heading: "Generics, TypedDict, NewType", body: "```python\nfrom typing import Generic, TypeVar, TypedDict, NewType\n\nT = TypeVar('T')\nclass Stack(Generic[T]):\n    def __init__(self): self._d: list[T] = []\n    def push(self, x: T) -> None: self._d.append(x)\n    def pop(self) -> T: return self._d.pop()\n\nclass UserDict(TypedDict):\n    id: int\n    name: str\n    age: int | None\n\nUserId = NewType('UserId', int)   # nominal int — mypy won't let you pass any int\n```\n\n**TypedDict** types dict-shaped data (e.g., JSON you got from elsewhere). **NewType** makes mypy distinguish two `int`s with different semantics — catches `transfer(from_id, to_id)` bugs where you swap argument order. **Generic[T]** is how you write container classes that preserve element types through the API." },
      { heading: "The pragmatic typing recipe", body: "1. Add hints to every public function signature.\n2. Don't annotate trivially inferrable locals (`x: int = 5` is noise).\n3. Use `pydantic` at I/O boundaries, dataclasses internally.\n4. Run `mypy --strict src/` or `pyright` in CI. Treat new type errors as test failures.\n5. When mypy can't see it, `# type: ignore[reason]` once with a comment — never blanketly.\n6. Use `cast(T, x)` when you know more than the checker; treat each one as a code smell.\n\nThe payoff: every refactor in a 50k-line typed codebase is 10× safer. The IDE knows the shape of everything. Onboarding new engineers becomes 'read the types.'" }
    ],
    keyCommands: ["pip install mypy pyright pydantic", "mypy --strict src/", "pyright", "python -c 'from pydantic import BaseModel; print(BaseModel.__module__)'"],
    exercises: [
      { question: "Why does `field(default_factory=list)` exist instead of `= []`?", answer: "`= []` evaluates *once* at class creation time, so every instance shares the same list (the mutable-default trap). `default_factory=list` calls `list()` per instance, giving each a fresh empty list. Dataclass actually refuses bare `= []` for this reason." },
      { question: "When should you reach for pydantic vs. dataclass?", answer: "pydantic when data crosses a trust boundary (HTTP request, JSON file, LLM output) — you need parsing + validation + serialization. dataclass when data is internal and already-trusted — lighter, faster, no schema metadata." }
    ],
    lab: {
      goal: "Define `Item(BaseModel)` with `name: str` and `price: float`. Print `Item(name='Apple', price=1.5).model_dump_json()`. Output must contain `Apple`.",
      steps: ["pydantic is pre-loaded.", "Subclass `BaseModel`.", "Call `model_dump_json()`."],
      verifyId: "pydantic-item",
      starter: `from pydantic import BaseModel\n\n# define Item with name: str, price: float\n# print(Item(name='Apple', price=1.5).model_dump_json())\n`
    }
  }
];

const _CH2: Chapter[] = [
  {
    id: "functions-modules",
    number: 3,
    level: "beginner",
    title: "Functions, modules, and the import system",
    summary: "First-class functions, *args/**kwargs, default-argument gotchas, decorators, and how Python actually finds the code you import.",
    duration: "25 min",
    sections: [
      { heading: "Functions are first-class", body: "Functions in Python are **objects** — assignable, passable, storable, attribute-attachable. This is the foundation for decorators, callbacks, and most functional patterns.\n\n```python\ndef double(x): return x * 2\nfuncs = [double, len, str.upper]\n```\n\nLambdas (`lambda x: x*2`) are for the one-line callback case — `sorted(users, key=lambda u: u.age)`. Restricted to a single expression on purpose; need a statement, write a `def`." },
      { heading: "*args and **kwargs", body: "```python\ndef log(level, *messages, **fields):\n    print(level, ' '.join(messages), fields)\n\nlog('INFO', 'user', 'signed in', user_id=42, ip='1.2.3.4')\n```\n\n`*messages` collects extra positional arguments into a tuple. `**fields` collects extra keyword arguments into a dict. The reverse — *unpacking* — uses the same syntax: `f(*my_list, **my_dict)`. Most decorators in the standard library accept `(*args, **kwargs)`, do something, then forward to the inner function." },
      { heading: "The mutable-default-argument trap", body: "```python\ndef append_to(item, lst=[]):     # BUG\n    lst.append(item)\n    return lst\n\nappend_to(1)  # [1]\nappend_to(2)  # [1, 2] — same list!\n```\n\nDefault arguments are evaluated **once**, at function-definition time. A mutable default is shared across every call. The fix:\n\n```python\ndef append_to(item, lst=None):\n    if lst is None: lst = []\n    lst.append(item)\n    return lst\n```\n\nThe #1 Python interview gotcha. Also burns ~one production system per month." },
      { heading: "Decorators — functions wrapping functions", body: "```python\nimport functools, time\n\ndef timed(fn):\n    @functools.wraps(fn)\n    def wrapper(*args, **kwargs):\n        t = time.perf_counter()\n        try:    return fn(*args, **kwargs)\n        finally: print(f'{fn.__name__}: {time.perf_counter()-t:.3f}s')\n    return wrapper\n\n@timed\ndef slow(): time.sleep(0.1)\n```\n\nA decorator is just `slow = timed(slow)`. `functools.wraps` copies `__name__`, `__doc__`, and the signature so debuggers and `help()` work. Decorators are how Flask routes, pytest fixtures, and Django auth checks attach behavior to functions." },
      { heading: "Modules, packages, imports", body: "Every `.py` file is a **module**. A directory with an `__init__.py` is a **package**. `import` walks **`sys.path`**, which starts with the script's directory and extends to your venv's `site-packages`.\n\n```python\nimport json                  # stdlib\nfrom mypkg.utils import slug # explicit, preferred over `from mypkg import *`\nimport numpy as np           # convention for big libs\n```\n\nA module's top-level code runs **once** on first import (cached in `sys.modules`). `if __name__ == '__main__':` separates 'imported as library' from 'run as script' — anything below it runs only on direct execution." }
    ],
    keyCommands: ["python -m mymodule", "pip show requests", "python -c 'import sys; print(sys.path)'", "pip install -e ."],
    exercises: [
      { question: "Write a decorator `@retry(n=3)` that re-calls the wrapped function up to n times on exception.", hint: "Two layers of `def`: outer takes `n`, inner takes the function.", answer: "```python\ndef retry(n=3):\n    def deco(fn):\n        @functools.wraps(fn)\n        def wrapper(*a, **kw):\n            for i in range(n):\n                try: return fn(*a, **kw)\n                except Exception:\n                    if i == n-1: raise\n        return wrapper\n    return deco\n```" },
      { question: "What's the difference between `from mypkg import *` and `from mypkg import x, y`?", answer: "`import *` pulls every public name (no underscore prefix, or whatever `__all__` lists). It's discouraged because it pollutes the namespace and makes 'where did this come from?' unanswerable. Always import explicitly." }
    ],
    lab: {
      goal: "Write `make_counter()` returning a function that returns 1, 2, 3 on successive calls. Output must contain `1 2 3`.",
      steps: ["Closure: `count` local in `make_counter`, inner uses `nonlocal count`.", "`c = make_counter(); print(c(), c(), c())`."],
      verifyId: "make-counter",
      starter: `def make_counter():\n    # your code\n    ...\n\nc = make_counter()\nprint(c(), c(), c())\n`
    }
  },
  {
    id: "data-structures",
    number: 4,
    level: "intermediate",
    title: "Data structures and idiomatic iteration",
    summary: "Lists, dicts, sets, tuples — when to use each, what costs O(1) vs. O(n), and the iteration tools that separate juniors from seniors.",
    duration: "30 min",
    sections: [
      { heading: "Pick the right container", body: "- **`list`** — ordered, mutable, indexable. Append O(1) amortized; `in` is O(n).\n- **`dict`** — keyed, ordered (3.7+), mutable. Lookup/insert/delete O(1) average.\n- **`set`** — unordered, mutable, unique. `in` O(1).\n- **`tuple`** — ordered, **immutable**. Fixed-shape records, dict keys.\n- **`collections.deque`** — O(1) appendleft/popleft. Use for queues; never `list.pop(0)`.\n\nReaching for a list when a dict or set would do is the #1 Python performance bug. `if user in big_list:` over 100k items dominates runtime; the same check against a set is instant." },
      { heading: "Dict patterns you'll write weekly", body: "```python\nd.get('k', 'default')                     # never KeyError\nd.setdefault('counts', []).append(value)  # init-or-extend in one line\n\nfrom collections import defaultdict, Counter, ChainMap\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.category].append(item)\n\nCounter(words).most_common(10)\nChainMap(local_cfg, defaults)             # layered lookup\n```\n\n`defaultdict` removes the 'first check if key exists' dance. `Counter` is a `dict` subclass for counting — all in C, much faster than hand-rolled." },
      { heading: "Iteration utilities that pay rent", body: "```python\nfor i, item in enumerate(items, start=1): ...\nfor a, b in zip(xs, ys, strict=True): ...           # 3.10+\nfor key, group in itertools.groupby(sorted(rows, key=k), key=k): ...\nlist(itertools.chain.from_iterable(nested))         # flatten one level\nitertools.islice(stream, 100)                       # first 100 items, lazy\nitertools.pairwise([1,2,3,4])                       # (1,2),(2,3),(3,4)\n```\n\n`itertools` is full of lazy combinators. They consume O(1) memory and compose like Lego. Read the docs page once a year; you'll keep discovering uses." },
      { heading: "Slicing, unpacking, and the star", body: "```python\nfirst, *rest = [1, 2, 3, 4]   # first=1, rest=[2,3,4]\nhead, *_, tail = nums\na, b = b, a                    # the classic swap, no temp variable\nletters[::2]                   # every second item\nletters[::-1]                  # reversed copy\n{**a, **b, 'extra': 1}         # merge dicts (a wins on conflict, then b, then 'extra')\n```\n\nSlicing creates a copy (`letters[:]` is the idiomatic clone). Unpacking with `*` works on the left side of `=`, in function calls, and inside list/dict literals. Mastering these makes Python feel half as wordy." },
      { heading: "Memory: when containers actually cost you", body: "A Python `int` is ~28 bytes. A list of 1M ints is ~38 MB (8-byte pointers + the int objects). A numpy `int64` array of 1M is **8 MB**.\n\nThat's why pandas/numpy exist: when you outgrow native containers, you don't write smarter Python — you change representation. Rule of thumb: more than 100k homogeneous numbers? Move to numpy. Need named columns? Move to pandas. Need queries? Move to DuckDB." }
    ],
    keyCommands: ["python -m timeit -s 'd={i:i for i in range(10000)}' '9999 in d'", "python -m timeit -s 'l=list(range(10000))' '9999 in l'", "python -c 'import sys; print(sys.getsizeof([0]*1000))'"],
    exercises: [
      { question: "What's wrong with `queue = []; queue.pop(0)` for a FIFO?", answer: "`list.pop(0)` is O(n) — it shifts every remaining element left. Use `collections.deque` whose `popleft()` is O(1)." },
      { question: "Merge two dicts where the second overrides the first, in one expression.", answer: "`{**a, **b}` — later keys win. Since 3.9 you can also write `a | b`." }
    ],
    lab: {
      goal: "Given `['apple','banana','apple','cherry','banana','apple']`, print the top-2 most common entries. Output must contain `apple` and `banana`.",
      steps: ["Use `collections.Counter`.", "Call `.most_common(2)`.", "Print."],
      verifyId: "top-words",
      starter: `from collections import Counter\n\nwords = ['apple','banana','apple','cherry','banana','apple']\n# print the top 2\n`
    }
  }
];

const _CH1: Chapter[] = [
  {
    id: "hello-python",
    number: 1,
    level: "beginner",
    title: "Hello Python — the interpreter, the REPL, and your first script",
    summary: "Install Python the right way, meet the REPL, and understand what really happens when you type `python script.py`.",
    duration: "15 min",
    sections: [
      { heading: "Why Python won", body: "Python won the popularity war not because it's fastest, safest, or most elegant — it won because it gets out of your way. The same `for` loop you write to read a CSV is the one you write to call an LLM API, train a neural network, or scrape a website. The standard library is enormous, the ecosystem is bigger, and the syntax is forgiving enough that scientists, sysadmins, and product engineers all use it.\n\nThat's also the trap. Python's friendliness hides a lot of *what's actually happening* (reference counting, the GIL, dynamic dispatch). This course teaches Python the way a senior data engineer teaches it: idioms first, then the model underneath. You'll come out able to read a stack trace, a `cProfile` flamegraph, and a memory dump — not just type code that runs." },
      { heading: "Installing the right way", body: "Do **not** use the Python that ships with macOS or your Linux distro for development — it's there for the OS, not for you. Use one of:\n\n- **`pyenv`** — install and switch between any CPython version.\n- **`uv`** (the fast new alternative) — installs Python *and* manages venvs *and* resolves dependencies, in Rust. The 2026 default for new projects.\n- **`conda` / `mamba`** — still dominant in data science because they manage C/CUDA dependencies too.\n\nWhatever you pick, **never `pip install` into the system Python**. Always use a virtual environment (`python -m venv .venv && source .venv/bin/activate`) or let `uv`/`poetry` manage it. Mixing global and project deps is the #1 way Python environments rot." },
      { heading: "The REPL is a tool, not a toy", body: "Type `python` and you get the **REPL** — read, eval, print, loop. It's how you should explore any new library before writing code that imports it.\n\n```python\n>>> import json\n>>> json.dumps({'a': 1, 'b': [2, 3]})\n'{\"a\": 1, \"b\": [2, 3]}'\n>>> help(json.dumps)\n```\n\nTwo upgrades: `python -i script.py` drops into the REPL *after* the script runs (variables still bound — great for debugging), and **IPython** / **ptpython** add tab completion, syntax highlighting, and `%timeit` magic. Most data scientists live in IPython or a Jupyter kernel that's just IPython with a notebook UI." },
      { heading: "What `python script.py` actually does", body: "1. CPython launches.\n2. It reads `script.py`, **compiles** it to **bytecode** (`.pyc`, cached in `__pycache__/`), and then…\n3. …runs that bytecode on the **Python virtual machine** — a giant `switch` over ~150 opcodes.\n\nThat compilation step is why a small script still takes ~30ms to start. It's also why Python *can* be fast: numpy and pandas push the heavy lifting into C/Fortran, with Python orchestrating. Knowing this distinction is the first step to understanding when Python is the right tool — and when you should reach for something else for the inner loop." }
    ],
    keyCommands: [ "python --version", "python -m venv .venv && source .venv/bin/activate", "uv pip install requests", "python -i script.py", "ipython" ],
    exercises: [
      { question: "Why does `python -m venv .venv` create a directory rather than modify the system?", hint: "Think about isolation.", answer: "A venv copies the Python interpreter and creates an isolated `site-packages/` inside `.venv/`. Activating it edits `$PATH` so `pip install` writes there. The system Python is untouched, so multiple projects can have conflicting dep versions without colliding." },
      { question: "What's the difference between `python script.py` and `python -m mymodule`?", answer: "`python script.py` runs the file directly — `__name__ == '__main__'` and `sys.path[0]` is the script's directory. `python -m mymodule` imports `mymodule` and runs it as `__main__` — works for stdlib modules (`python -m http.server`) and packages, and uses your project's `sys.path` correctly." }
    ],
    lab: {
      goal: "Print the literal line: `Hello, Python!`",
      steps: ["Use `print(...)`.", "Match exactly — case and punctuation count.", "Click Run."],
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
      { heading: "Dynamic, strong, duck", body: "Python is **dynamically typed** — variables don't carry a type, *values* do. `x = 5; x = 'hi'` is legal. It is **strongly typed** — `'hi' + 5` is a `TypeError`, not a coerced concatenation. And it is **duck-typed** — a function that calls `obj.read()` doesn't care whether `obj` is a file, a `BytesIO`, or your custom class.\n\nThis combination is what makes Python feel free at the start and bite you at scale. The mitigation is **type hints** (since 3.5) and a static checker like **mypy** or **pyright**. We'll add them everywhere once we get to functions; for now, know they exist." },
      { heading: "Truthiness and the falsy values", body: "Almost everything is truthy. The complete list of **falsy** values: `False`, `None`, `0`, `0.0`, `''`, `[]`, `{}`, `set()`, `()`. That's it.\n\n```python\nif users:           # idiomatic: \"if the list is non-empty\"\n    do_something()\nif users is not None:  # when None vs. empty list matters\n    ...\n```\n\n`is` checks identity (same object); `==` checks equality (same value). Use `is` for `None`, `True`, `False`, sentinel objects — never for strings or numbers, where small-value caching can make `'hi' is 'hi'` accidentally true." },
      { heading: "if / elif / else and the walrus", body: "```python\nif n < 0:    sign = -1\nelif n > 0:  sign = 1\nelse:        sign = 0\n```\n\nFor value-binding, prefer a conditional expression: `sign = -1 if n < 0 else (1 if n > 0 else 0)`. The **walrus** `:=` (3.8+) assigns inside an expression — perfect for `while (line := f.readline()):` or `if (m := re.match(r'\\d+', s)):`. Use sparingly.\n\nSince 3.10, Python has **structural pattern matching** with `match/case` — pattern-matches over shape, not just value: `match point: case (0, 0): ...; case (x, 0): ...; case (x, y): ...`." },
      { heading: "Comprehensions: the Python-shaped loop", body: "```python\nsquares = [x*x for x in range(10) if x % 2 == 0]\nlookup  = {user.id: user for user in users}\nuniq    = {word.lower() for word in text.split()}\ngen     = (line.strip() for line in open('huge.log'))   # generator, lazy\n```\n\nList, dict, set comprehensions, and generator expressions are the idiomatic way to transform-and-filter. They're not just shorter — CPython has a fast path. Reach for the comprehension first; reach for the explicit loop when the logic is too gnarly to fit on one line." }
    ],
    keyCommands: ["python -c 'import this'", "python -m mypy script.py", "python -m timeit -s 'r=range(1000)' '[x*x for x in r]'"],
    exercises: [
      { question: "Why does `0.1 + 0.2 == 0.3` return `False`?", answer: "Floats are IEEE-754 binary. `0.1` and `0.2` can't be represented exactly in binary, so the sum is `0.30000000000000004`. Compare floats with `math.isclose(a, b)` or use `decimal.Decimal` for money." },
      { question: "Rewrite `result = []\\nfor x in xs:\\n    if x > 0: result.append(x*2)` as a comprehension.", answer: "`result = [x*2 for x in xs if x > 0]` — filter clause comes *after* the for clause but is evaluated first per element." }
    ],
    lab: {
      goal: "Write `fizzbuzz(n)` and call `fizzbuzz(15)`. Output must be exactly `FizzBuzz`.",
      steps: ["Use `if n % 15 == 0` first (order matters).", "Then `n % 3`, then `n % 5`, then the number as a string.", "Return — don't print inside the function."],
      verifyId: "fizzbuzz-py",
      starter: `def fizzbuzz(n: int) -> str:\n    # your code\n    ...\n\nprint(fizzbuzz(15))\n`
    }
  }
];

export const chapters: Chapter[] = [
  ..._CH1,
  ..._CH2,
  ..._CH3,
  ..._CH4,
  ..._CH5,
  ..._CH6,
  ..._CH7,
];

export function getChapter(id: string) { return chapters.find((c) => c.id === id); }
