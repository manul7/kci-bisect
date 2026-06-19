# Terms

Foundation of the documentation. Every other document in this repository uses these terms with the
meanings defined here.

## Core

- **Regression** — a change in observed kernel behaviour from passing to failing, or from a known
  metric baseline to a worse value. Detected before bisection starts.
- **Bisection** — search method (by default binary) applied to kernel commits to identify the change
  that introduced a regression.
- **Culprit** — the commit identified by bisection as introducing the regression.
- **Bisection campaign**, campaign, BC — one attempt to identify the culprit by bisection.
- **Bisection step**,step — one tested build inside a campaign.
- **Trigger** — registered external actor that submits campaign requests.
- **Campaign Request**, CR — the JSON document submitted by an authenticated trigger to request one
  bisection campaign.
- **Campaign admission**, admission — BCO validation and authentication step that accepts a CR,
  attaches the trigger, creates or joins a campaign, or returns an admission rejection.
- **Admission rejection** — synchronous response returned to the trigger when BCO rejects a CR
  before creating a campaign record.
- **Campaign execution profile** — system configuration that lists which campaign types and options
  can run.
- **Composition** — named runtime BTO configuration that maps planner, builder, and tester roles
  to configured instances.
- **Equivalence key** — deterministic key computed from the fields that identify the bisection
  problem. BCO uses it to prevent duplicate campaigns and to attach equivalent trigger requests
  to an existing campaign.
- **Triggering reason** — explanation or reference that justifies starting a campaign, such as a
  detected regression, a first bad build, or a filed bug.
- **Verification** — re-confirming a campaign's conclusion, typically by reverting the culprit and
  retesting.

## Git history

- **git bisect** — the binary-search command provided by `git` over commit history.
- **n-bisect** — generalisation that tests N evenly-spaced commits per iteration instead of a
  single midpoint, trading parallel resources for fewer iterations.
- **Multi-level bisect** — bisection policy that evaluates multiple levels of the Git bisection
  decision tree in one batch. At depth `D`, it selects up to `2^D - 1` candidate commits for the
  current range. It trades more parallel build/test work for fewer wall-clock bisection rounds.
- **Commit range** — the commits between the current _good_ and _bad_ boundaries, exclusive of the
  good boundary.
- **Linear history** — commit history treated as a single ordered line for selection.
- **Non-linear history** — commit history with merges or multiple development lines, where selector
  policy must define the history view it searches.

## Search boundaries

- **Good boundary** — the most recent commit known to behave correctly under the campaign scope.
  Equivalent to `git bisect good`.
- **Bad boundary** — the earliest commit known to exhibit the regression under the campaign scope.
  Equivalent to `git bisect bad`.
- **Narrowed range** — the narrower commit range a campaign converges to when it cannot pin a
  single culprit.

## Scope

- **Campaign scope** — the fixed dimensions held constant across all steps of one campaign so the
  _kernel commit is the only changing variable_. The applicable dimensions depend on the regression
  type.
- **Source identity** — source tree identity and selected commit that together identify
  the source content requested for a step.
- **Build** — a compiled snapshot of the kernel source with a specific configuration, toolchain,
  and build producer. Bisection tests builds, not source.
- **Build identity** — source identity plus architecture, kernel configuration, toolchain, and
  build producer.
- **System under test**, SUT - the hardware or VM profile a test runs on. Part of campaign scope
  for boot, test, and performance failures.
- **Workload** — the program or benchmark exercised during a performance test; part of campaign
  scope for performance.
- **Workload configuration** — performance scope fields that define what workload runs and with
  what execution settings, including workload parameters and requested repetitions.

## Evidence and decision

- **Observation** — a structured fact extracted or calculated from build or test output
  (pass/fail flag, error signature, measured or aggregated metric). Carries no step decision.
- **Expected signal** — CR field that names the target observation the campaign is trying to
  reproduce, such as a log signature or performance metric change.
- **Metric direction** — property of a performance metric that defines whether larger values are
  better or worse, sourced by the trigger from an external metric registry.
- **Baseline value** — trigger-supplied performance measurement at the good boundary. The
  bisection system does not measure boundaries.
- **Performance evidence** — Results Analyzer output for a performance step: analyzed candidate
  vs baseline comparison plus generic gating booleans and categorical magnitude.
- **Evidence path** — deployment-selected route from plan output to Decision engine input.
- **Qualification** — stage of a step decision that decides whether a candidate produced a
  usable result. A candidate that did not build, boot, run the test, or that crashed
  before producing a result is `skip`. Qualification never returns `good` or `bad`.
- **Decision strategy** — set of rules that maps a qualified result to a step decision.
  Named strategies:
  - **binary** — uses structured observation evidence for discrete regression types.
  - **performance** — uses performance evidence and strategy rules for performance regressions.
- **Step decision** — the result recorded for a step. One of:
  - `good` — tested build does not exhibit the regression.
  - `bad` — tested build exhibits the regression.
  - `skip` — cannot test at this commit (e.g. pre-existing build break). Advances the search to a
    different commit.
  - `weak` — tested but evidence uncertain (noise, partial data). Suggests re-test rather than skipping.
- **Rationale** — the recorded reason for a step decision: which evidence supported `good`/`bad`, which
  failure caused `skip`, which uncertainty caused `weak`.

## Outcomes

A campaign concludes in one of these categories:

- **Single culprit identified** — one culprit found.
- **Narrowed range** — campaign produced a narrowed range without pinning a culprit.
- **Unresolved** — evidence inconsistent or incomplete.
- **Not confirmed** — the originally suspected regression was not reproduced under the fixed campaign scope.

## Data artifacts

- **Build-test plan** — request to execute build and test work for one selected candidate.
- **Plan result** — terminal response for one build-test plan, carrying references to produced
  outputs and the normalized terminal outcome.
- **Runner outcome** — normalized terminal category that says whether backend output is usable
  content evidence, an infrastructure-attributed failure, or an invalid request.

## External tools

- **TuxMake** — reproducible kernel build tool; one builder role backend used by BTO.
- **TuxRun** — kernel test runner supporting QEMU, FVP, and LAVA backends; one tester role backend
  used by BTO.
- **LAVA** — hardware test lab; a tester role backend, used directly or via TuxRun.
- **logspec** — error-signature matching library used inside the Results Analyzer.
- **KernelCI** — CI ecosystem this toolbox can integrate with.
- **Maestro** — KernelCI's pipeline service; integration point for build/test execution and
  regression triggers.
- **KCIDB** — KernelCI's results database; possible source of historical results.
- **kci-dev** — developer-facing CLI in the KernelCI ecosystem.
