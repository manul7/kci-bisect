# Software Requirements Specification (SRS)

**Status:** Draft

**Version:** 0.1

## 1. Purpose

This document defines the requirements for the complete kci-bisect system. The
[initial release](requirements/mvp.md) and [later extensions](requirements/evolution.md) state
which requirements apply to each delivery stage.

The following requirement terms apply to this SRS and its subdocuments:

- `SHALL`: required;
- `SHALL NOT`: prohibited;
- `MAY`: optional.

Only uppercase uses have these meanings. `TBD` means that a decision has not been made yet.

## 2. Background

Kernel regressions can affect builds, boot, configuration, unit tests, or performance. Bisection
tests candidate commits under fixed conditions and narrows the good-to-bad range until it finds the
commit that introduced the regression.

kci-bisect can be used after a regression is detected. It coordinates the search, builds, tests,
evidence evaluation, recovery, inspection, and reporting. It does not depend on a specific backend.

## 3. System Goals

- automate Linux kernel regression bisection from an accepted request to a recorded conclusion;
- produce reproducible conclusions that are backed by evidence and easy to explain;
- provide campaign progress and results in human-readable and machine-readable forms.

## 4. Scope

### 4.1 In scope

A campaign starts when an authenticated requester submits a request for a detected regression and
provides its good and bad boundary commits.

- request validation, authorization, admission, and duplicate handling;
- durable campaign lifecycle and recovery;
- source history validation and candidate selection;
- coordination of build and test execution providers;
- normalization and evaluation of build and test results;
- search-range updates and final conclusions;
- campaign inspection and control interfaces;
- programmatic API and command-line access;
- human-readable and machine-readable reporting;
- finding report recipients and delivering reports as configured;
- local, cloud, and combined deployment and execution environments;
- administration, security, observability, data-control policy enforcement, backup, and restore.

Work on a campaign ends when the campaign is terminal, its report is available, and every delivery
scheduled when the report became available is terminal.

### 4.2 Out of scope

- detect the original regression or decide when to start a campaign;
- choose or measure the initial good and bad boundary commits;
- classify stored or referenced data into policy classes;
- enforce geographic data-residency or permitted-location requirements;
- host the source repository;
- act as a general-purpose CI system;
- own the external catalog that defines performance metrics or metric direction;
- own the external catalog that defines available toolchains;
- implement backend-native build systems, test systems, schedulers, labs, or artifact services;
- permanently change source history or fix the regression;
- verify a campaign conclusion after bisection;
- depend on a particular CI system, execution provider, storage technology, analysis implementation,
  or report-delivery channel.

## 5. Users and Roles

Kernel developers and testers use the system. They submit requests, monitor and control campaigns,
diagnose failures, and read campaign status and results.

System roles:

- **Administrator:** configures and runs the system, including identities, permissions, integrations,
  providers, limits, data-control policy, and recovery.
- **Report recipient:** receives or retrieves a campaign report.
- **Maintainer:** updates the system and its extension interfaces without breaking consumers.

## 6. Glossary

This SRS uses the [project glossary](terms.md). The terms below have more specific meanings here.

- **Campaign:** one bisection investigation of a regression.
- **Campaign request:** input from a user asking the system to start a campaign.
- **System-under-test description:** hardware or virtual-machine profile with an architecture and
  execution properties. Any target that matches the profile may be used.
- **Step:** evaluation of one selected commit within a campaign.
- **Campaign scope:** resolved build and test inputs that stay fixed across all steps. This includes
  the system-under-test description and test configuration when applicable. Only the selected commit
  may change.
- **Attempt:** one recorded execution within a step; re-executing the step creates another attempt.
- **Evidence:** normalized observations or measurements, with references to their source outputs,
  used to make a step decision.
- **Raw output:** provider-native log, measurement, diagnostic, or result not yet normalized as
  evidence.
- **Metric:** named measured quantity with a unit and a direction indicating whether larger or
  smaller values are better.
- **Target signal:** request-supplied identification of the observation or metric to evaluate.
- **Operational failure:** system, provider, configuration, or infrastructure problem that blocks
  campaign progress but says nothing about the regression.
- **Build identity:** complete set of build input parameters that must match before an existing
  artifact can be reused.
- **Build reuse:** using an artifact from earlier work instead of building again. The artifact may
  come from the same or another campaign if it meets the reuse requirements.
- **History view:** rules that determine which source commits and relationships are visible during a
  search.
- **Search policy:** rules for a search. They define its history view, validate source history, select
  commits, apply step decisions to the search state, handle multiple or unusable candidates, and
  decide when the search has converged or cannot progress.
- **Policy:** configured rules for one system behavior that do not prescribe its implementation.
- **Data-control policy:** rules for data access, transfer between environments, retention, export,
  and deletion.
- **Execution environment:** configured infrastructure where system functions, integrations, data
  stores, or external work run.
- **Execution provider:** integration through which the system submits and observes build or test
  work.
- **Execution composition:** named deployment configuration that assigns build and test work to
  configured execution providers.
- **Build producer:** provider component that performs a build. Its identity and characteristics are
  build inputs.
- **Local deployment:** all configured functions, integrations, data stores, and external work run on
  local infrastructure controlled by the administrator. There is no cloud runtime.
- **Cloud deployment:** all configured functions, integrations, data stores, and external work run in
  cloud infrastructure. There is no local runtime.
- **Combined deployment:** one installation runs configured functions, integrations, data stores, or
  external work across local and cloud infrastructure.
- **Terminal campaign:** campaign in the `completed`, `failed`, or `canceled` state.
- **Active campaign:** campaign not in a terminal state.
- **Cancellation:** authorized request to stop an active campaign. It is neither a bisection
  conclusion nor an operational failure.
- **Report:** recorded campaign facts in a human-readable or machine-readable form.
- **Report generation:** creating human-readable and machine-readable reports from recorded campaign
  facts.
- **Report delivery:** sending a generated report to resolved recipients through a configured channel.
- **Report-delivery settings:** user settings that control whether and how available reports are
  delivered.

## 7. Assumptions and Dependencies

- A performance campaign relies on an external trigger. The trigger gets the metric identity and
  direction from an external metric registry. It also provides a good-boundary baseline measured
  with the requested system-under-test and workload configuration.
- A campaign requires access to its source repository and toolchain. It also requires providers that
  support the resolved architecture and other build and test inputs.
- Administrators configure the supported regression types, required providers and policies, and
  permitted execution environments before the system accepts campaigns.
- If report delivery uses external sources for settings or recipients, or an external delivery
  channel, those sources and channels must be available.

## 8. Functional Requirements

### 8.1 Request and admission

- **FR-REQ-001:** Authenticated requesters SHALL be able to submit campaign requests.
- **FR-REQ-002:** A request SHALL include the source repository, good and bad boundary commits,
  regression type, inputs needed to define the campaign scope, and target signal.
- **FR-REQ-003:** The request model SHALL represent regressions in kernel build outcome (`build`), boot
  progress (`boot`), generated kernel configuration (`config`), unit-test outcome (`unit_test`), and
  performance metrics (`performance`).
- **FR-REQ-018:** If a request includes a system-under-test description, admission SHALL resolve the
  description and its architecture. The campaign scope SHALL include the resolved description and
  the selected build and test inputs.
- **FR-REQ-006:** A request MAY select a supported search policy. Otherwise, the system SHALL use the
  configured default. Each resolved search policy SHALL state which history view it uses to validate
  boundaries and select candidates.
- **FR-REQ-007:** Before accepting a request, admission SHALL validate its structure, authorization,
  resolved search policy, and required capabilities. It SHALL also check that the request contains
  every input needed for its campaign scope, target signal, and regression type.
- **FR-REQ-009:** If admission rejects a request, it SHALL return machine-readable errors with
  human-readable explanations and SHALL NOT create a campaign.
- **FR-REQ-010:** The system SHALL compute a stable equivalence identity. It SHALL use the accepted
  and resolved values that define the regression, campaign scope, search policy, execution
  composition, and configured ownership scope. The versioned request interface SHALL list every
  value used.
  Execution, evidence, decision, retry, and resource policies SHALL NOT affect the identity. The
  requester identity SHALL affect it only through the configured ownership scope.
- **FR-REQ-012:** Admission SHALL create at most one active campaign for each equivalence identity. If
  one already exists, admission SHALL check whether the requester may join and read it. If allowed,
  the requester SHALL join it instead of creating another campaign. Otherwise, admission SHALL
  reject the request without revealing whether the campaign exists.
- **FR-REQ-013:** The accepted request and resolved campaign scope SHALL NOT change during a campaign.
  The resolved execution composition SHALL also stay fixed. The identities and versions of the
  resolved search, execution, evidence, decision, retry, and resource policies SHALL stay fixed too.
- **FR-REQ-019:** If an equivalent campaign is already terminal, a configured policy SHALL tell the
  system whether to return that campaign or start a new one. The policy SHALL state how long this
  rule applies.

### 8.2 Campaign lifecycle and control

- **FR-CAM-001:** Admission SHALL return a stable campaign identity without waiting for campaign
  completion.
- **FR-CAM-002:** The system SHALL make each campaign's lifecycle state available.
- **FR-CAM-003:** A campaign SHALL follow only these state transitions:
  - `accepted` to `running`, `canceling`, or `failed`;
  - `running` to `canceling`, `completed`, or `failed`;
  - `canceling` to `canceled`.
- **FR-CAM-004:** The system SHALL show the latest step with a recorded decision and any failure that
  blocks progress.
- **FR-CAM-005:** Concurrent workers SHALL NOT make conflicting lifecycle or search-state changes to
  the same campaign, including during restart or recovery.

Lifecycle state meanings are:

- `accepted`: admission is durably complete, but the campaign has not started;
- `running`: campaign work is running;
- `canceling`: no new work may start while the system cancels or reconciles in-flight work;
- `completed`: the campaign has a normal conclusion;
- `failed`: an operational failure blocks further progress;
- `canceled`: cancellation is complete.

- **FR-CAM-006:** An authorized user SHALL be able to request cancellation of an active campaign.
- **FR-CAM-007:** When the system accepts a cancellation request, it SHALL move the campaign to
  `canceling` and start no new work. It SHALL ask providers to cancel in-flight work when supported
  and preserve all recorded results.
- **FR-CAM-008:** Cancellation SHALL produce the `canceled` terminal state.

- **FR-CAM-009:** A campaign SHALL become `canceled` only after every in-flight work item has finished
  or the system has durably recorded that it will take no further action on that work. FR-CAM-010
  applies to any result that arrives later.
- **FR-CAM-010:** A result received after cancellation was accepted SHALL remain available for audit.
  It SHALL NOT create a step decision, move a boundary, or change the campaign conclusion.
- **FR-CAM-011:** A cancellation record SHALL include who requested it, when they requested it, and
  any reason they supplied. It SHALL track the outcome of every in-flight work item and record when
  the campaign became `canceled`.
- **FR-CAM-014:** After an interruption, recovery SHALL resume and finish cancellation.

### 8.3 Candidate selection and execution

- **FR-EXE-001:** The system SHALL provide standard Git bisection as a supported search policy.
- **FR-EXE-002:** Candidate selection SHALL use the resolved search policy and its history view. It
  SHALL resolve both boundary commits and validate their required relationship. It SHALL then return
  one or more candidate commits, report that the search converged or cannot progress, or report an
  invalid request. The initial boundary checks SHALL finish before the first execution starts. An
  invalid selection request SHALL fail the campaign with a machine-readable reason. No further
  execution work SHALL be submitted.
- **FR-EXE-003:** A documented extension interface SHALL support additional search policies without
  changing the meaning of step decisions, conclusions, reports, authorization, or audit records.
- **FR-EXE-004:** Every step SHALL use the accepted campaign scope unchanged; only the selected
  commit MAY vary.
- **FR-EXE-005:** Each step and attempt SHALL have a durable identity.
- **FR-EXE-006:** The system SHALL submit each attempt as one logical build-test work item. For an
  accepted item, it SHALL receive one bundled terminal result unless it records under FR-CAM-009 that
  it will take no further action on the work. It SHALL NOT receive more than one result.
- **FR-EXE-007:** Each submission SHALL include the selected source, target signal, build and test
  inputs from the accepted campaign scope, execution composition resolved at admission, and an
  idempotency identity. It SHALL request at least one output class: artifacts, raw outputs, or
  diagnostics.
- **FR-EXE-008:** Execution SHALL translate the resolved execution composition into provider-specific
  build and test requests internally. This SHALL NOT change the selected source or the build and test
  inputs.
- **FR-EXE-009:** Repeating a submission with the same idempotency identity SHALL return the same
  logical work identity and SHALL NOT create duplicate work. If the content differs, the system SHALL
  reject the submission without creating or changing work.
- **FR-EXE-010:** A new attempt SHALL NOT reuse a prior test result.

- **FR-EXE-011:** A terminal result SHALL distinguish a build or test outcome from an infrastructure
  failure or invalid request. A build or test outcome SHALL show which stages completed, failed, or
  did not run. It SHALL also reference the output produced.
- **FR-EXE-012:** Execution output SHALL NOT itself be a step decision.
- **FR-EXE-013:** The system SHALL keep references to the artifacts, raw outputs, and diagnostics from
  each attempt.
- **FR-EXE-014:** The system SHALL enforce configured concurrency, timeout, retry, and resource
  limits and SHALL NOT retry indefinitely.
- **FR-EXE-015:** If a retry limit is exhausted or a timeout or resource limit is reached, the system
  SHALL record why.
- **FR-EXE-016:** The system MAY reuse a build artifact only if policy allows reuse and the required
  build identity exactly matches the identity recorded for the artifact.
- **FR-EXE-017:** The build-identity interface SHALL define a versioned identity. It SHALL include
  every input that can affect the artifact, including the build producer's identity and
  characteristics. Provider job or run identities and other non-input execution metadata SHALL be
  recorded as provenance when available. They SHALL NOT be part of the build identity.
- **FR-EXE-018:** Before reusing an artifact, the system SHALL check that it is available and intact.
  It SHALL record the artifact, build identity, provenance, integrity information, and policy
  decision.
- **FR-EXE-019:** The system SHALL NOT reuse an artifact that is unavailable, unauthorized, expired,
  corrupt, or not an exact match. It SHALL build again or record an explicit failure as required by
  the build-reuse policy.

The default retry policy, supported limit scopes, and multi-candidate search behavior are TBD under
`OPD-001` through `OPD-003`.

### 8.4 Evidence and step decisions

- **FR-DEC-001:** Before using a build or test outcome for a step decision, the system SHALL normalize
  it with the resolved evidence policy. It SHALL do so only when the campaign state allows a
  decision. Normalized evidence SHALL NOT include a step decision.
- **FR-DEC-002:** Evidence SHALL reference its source outputs so a consumer can trace a decision to
  them without embedding large logs or measurements.
- **FR-DEC-003:** For every evidence record except a normalized `parse_error`, the system SHALL first
  check whether the candidate reached the state needed to evaluate the regression type.
- **FR-DEC-004:** If the candidate did not reach that state, its decision SHALL be `skip` with a clear
  reason. It SHALL NOT be evaluated as `good` or `bad`.

- **FR-DEC-005:** The system SHALL evaluate usable evidence with the resolved decision policy for the
  regression type.
- **FR-DEC-006:** A step decision SHALL be exactly one of:
  - `good`: the evidence does not show the expected regression;
  - `bad`: the evidence shows the expected regression;
  - `skip`: the available evidence cannot support `good` or `bad` for this step;
  - `weak`: usable evidence exists but is too uncertain for `good` or `bad`.
- **FR-DEC-007:** Every decision SHALL explain in plain language why it was made and reference its
  evidence. Machine-readable details SHALL say whether the expected signal matched for `good` or
  `bad`, why the decision was `skip`, or why it was `weak`.
- **FR-DEC-010:** Evaluating the same evidence again with the same decision policy SHALL produce an
  equivalent decision. Only generated identity and time metadata may differ.
- **FR-DEC-011:** If an infrastructure failure, invalid execution request, or system failure prevents
  normalized evidence or a valid step decision, the system SHALL record an operational failure, not
  a step decision.
- **FR-DEC-012:** A normalized `parse_error` evidence record SHALL produce `skip` with the
  machine-readable reason `parse_error`.
- **FR-DEC-013:** Before recording `good`, `bad`, or `weak`, the system SHALL apply the matching rules
  from the resolved decision policy. A mismatch SHALL produce `skip` with a machine-readable reason.
- **FR-DEC-014:** Normalizing the same inputs again with the same evidence policy SHALL produce
  equivalent evidence. Only generated identity, time, and producer metadata may differ.

### 8.5 Range updates and conclusion

- **FR-OUT-001:** The system SHALL apply every recorded step decision to the search state using the
  resolved search policy.
- **FR-OUT-002:** A `good` or `bad` decision SHALL update its search boundary as required by the
  resolved search policy. A `skip` or `weak` decision SHALL NOT move either boundary.

- **FR-OUT-003:** The system SHALL continue selecting candidates until the search converges, cannot
  progress, is canceled, fails, or reaches a configured limit.
- **FR-OUT-004:** A campaign that completes normally SHALL have exactly one conclusion:
  - `single_culprit`: the search converged on one introducing commit, and at least one tested
    candidate was `bad`;
  - `not_confirmed`: no tested candidate was `bad`;
  - `narrowed_range`: the search did not converge, at least one tested candidate was `bad`, and the
    latest good and bad boundaries give a reportable range smaller than the initial range;
  - `unresolved`: the search did not converge, at least one tested candidate was `bad`, and evidence
    or search constraints prevented a smaller reportable range.
- **FR-OUT-005:** Operational failures and cancellations SHALL remain separate from normal
  conclusions.
- **FR-OUT-006:** A `single_culprit` result SHALL name the culprit commit.
- **FR-OUT-007:** A `narrowed_range` result SHALL include its latest good and bad boundaries.
- **FR-OUT-008:** A `not_confirmed` or `unresolved` result SHALL include a rationale.
- **FR-OUT-009:** Each configured limit that can stop a campaign SHALL state whether reaching it uses
  the normal conclusion rules or fails the campaign.

### 8.6 Campaign output and inspection

- **FR-VIEW-001:** An authorized consumer SHALL be able to retrieve a campaign's current state by its
  identity.
- **FR-VIEW-002:** Campaign output SHALL include the accepted request, resolved defaults, initial and
  latest boundaries, lifecycle state, and any final conclusion, failure, or cancellation reason.
- **FR-VIEW-003:** Campaign output SHALL list steps in order. For each step, it SHALL include the
  selected commit, attempts, execution status, evidence references, decision, and rationale when
  available.
- **FR-VIEW-004:** Campaign output SHALL use references for large artifacts, logs, measurements, and
  provider-native records.
- **FR-VIEW-005:** Authorized users SHALL be able to list campaigns and filter them by lifecycle
  state, regression type, source repository, requester, and submission time.
- **FR-VIEW-006:** Inspection output SHALL clearly separate incomplete work, normal conclusions,
  operational failures, cancellations, report-generation failures, and report-delivery failures.

### 8.7 Reporting and delivery

- **FR-REP-001:** The system SHALL generate a report for every terminal campaign.
- **FR-REP-002:** Machine-readable and human-readable reports for the same campaign SHALL contain the
  same facts.
- **FR-REP-003:** A report SHALL include:
  - campaign identity, requester identities the consumer may view, and campaign start and terminal
    times;
  - the campaign and step facts required by `FR-VIEW-002` and `FR-VIEW-003`;
  - the identities and versions of the resolved search, execution, evidence, decision, retry, and
    resource policies;
  - references to evidence, logs, measurements, artifacts, and diagnostics;
  - the version of its format or template and its generation time.
- **FR-REP-004:** Reports SHALL clearly separate normal conclusions, operational failures, and
  cancellations. Report-delivery failures SHALL appear in delivery status, not as campaign results.
- **FR-REP-005:** Reports SHALL use recorded campaign data. Report generation SHALL NOT rerun or
  change the campaign.
- **FR-REP-006:** An authorized consumer SHALL be able to retrieve a report without using report
  delivery.
- **FR-REP-007:** When a report is available, the system SHALL use each authorized requester's
  report-delivery settings to find recipients and schedule enabled delivery through configured
  channels.
- **FR-REP-008:** Changing a delivery channel SHALL NOT change report content or campaign execution.
- **FR-REP-009:** For each delivery attempt, the system SHALL record the settings used, recipients,
  channel, final status, and failure reason.
- **FR-REP-010:** Each logical delivery SHALL have a stable identity. If the channel supports
  idempotency, the delivery SHALL use it.
- **FR-REP-011:** A delivery failure SHALL NOT change the campaign conclusion and SHALL remain visible
  to administrators.

- **FR-REP-012:** Reports SHALL omit or redact secrets and data the consumer is not authorized to
  view.
- **FR-REP-013:** If a channel cannot confirm delivery, the system SHALL record `unknown`, not
  success, and SHALL apply the configured retry policy.
- **FR-REP-014:** Report generation status SHALL be exactly one of `pending`, `generating`,
  `available`, or `failed`.
- **FR-REP-015:** Report generation SHALL start as `pending`, move to `generating`, and finish as
  `available` or `failed`. Retrying a failed report version SHALL move it back to `generating`.
  `available` SHALL be terminal for that report version.
- **FR-REP-016:** If report generation fails, the system SHALL record a machine-readable reason and a
  plain-language explanation. The failure SHALL remain separate from the campaign conclusion and
  delivery status. The system SHALL support recovery without rerunning or changing the campaign.
- **FR-REP-017:** Authorized users SHALL be able to configure report-delivery settings outside
  campaign requests and within administrator-defined permissions.
- **FR-REP-018:** An authorized user SHALL be able to request delivery of an available report using
  current report-delivery settings. The request SHALL NOT create, reopen, or rerun a campaign.

Machine-readable report formats, human-readable templates, report-delivery setting sources,
recipient sources, delivery channels, and delivery retry policy are TBD under `OPD-004`.

### 8.8 API and CLI access

- **FR-ACC-001:** The system SHALL provide a versioned API for submitting requests, checking campaign
  status, listing and canceling campaigns, and retrieving campaign output and reports.
- **FR-ACC-002:** The CLI SHALL support the same core operations as the API.
- **FR-ACC-003:** The API and CLI SHALL use the same validation, authorization, lifecycle, error, and
  output rules.
- **FR-ACC-004:** A call that starts long-running work SHALL return a stable identity and SHALL NOT
  require the client connection to remain open.
- **FR-ACC-005:** API and CLI errors SHALL include a machine-readable code and a concise
  human-readable message.
- **FR-ACC-006:** Campaign submission SHALL support idempotency. Every other state-changing operation
  SHALL define whether clients may retry it and how repeated requests are handled. Repeating a
  retryable operation SHALL NOT create duplicate logical work or conflicting state.
- **FR-ACC-007:** The API and CLI SHALL provide authorized operations for administration, data
  inventory, export, retention, deletion, deployment, and health.
- **FR-ACC-008:** The API and CLI SHALL let authorized users configure report-delivery settings and
  request delivery of available reports.

The API protocol and CLI command structure and packaging are TBD under `OPD-005`.

### 8.9 Administration and configuration

- **FR-ADM-001:** Administrators SHALL be able to add, disable, and remove user identities and set
  their permissions.
- **FR-ADM-002:** Administrators SHALL be able to configure:
  - supported regression types and search policies;
  - execution compositions, providers, and policies;
  - evidence and decision policies;
  - report generation and delivery channels;
  - defaults for these settings; and
  - concurrency, retry, timeout, and resource limits.
- **FR-ADM-003:** The system SHALL validate configuration before using it to admit new campaigns.
- **FR-ADM-004:** If new configuration is invalid or incomplete, the system SHALL identify the
  failing setting and keep the last valid configuration unchanged.
- **FR-ADM-005:** Credentials for source repositories, execution providers, and delivery channels
  SHALL come from secret references or service-local configuration. They SHALL NOT appear in
  campaign requests.
- **FR-ADM-006:** The system SHALL audit every administration and configuration change.
- **FR-ADM-007:** Before disabling an integration, the system SHALL show whether active work will
  finish or stop. It SHALL follow the behavior shown.
- **FR-ADM-008:** Administrators SHALL be able to configure retention, encryption, export, deletion,
  backup, and cross-environment data-transfer policies within their permissions.
- **FR-ADM-009:** Administrators SHALL be able to link each private source repository to a credential
  reference. The reference SHALL be limited to that repository and its permitted operations.
- **FR-ADM-010:** Once a campaign references a policy version, that version SHALL NOT change. A change
  in behavior SHALL create a new policy version.

The administration interface and configuration rollout model are TBD under `OPD-005`.

### 8.10 Operations and observability

- **FR-OPS-001:** Each deployed runtime SHALL report its health and readiness.
- **FR-OPS-002:** Structured logs and traces SHALL cover admission, campaign state changes,
  cancellation, candidate selection, execution and provider calls, evidence processing, decisions,
  recovery, report generation, and report delivery.
- **FR-OPS-003:** Logs, metrics, traces, diagnostics, and audit records SHALL use the same campaign,
  step, attempt, and logical work identities when they describe the same work across processes or
  environments.
- **FR-OPS-004:** Metrics SHALL show admission results, active and queued work, step and campaign
  duration, operational failures by reason, attempts, retries, reached limits, recovery, campaign
  states and conclusions, and report-generation and report-delivery status.
- **FR-OPS-005:** Every operational failure SHALL include a machine-readable reason and a
  plain-language explanation.
- **FR-OPS-006:** Logs, metrics, traces, and diagnostics SHALL NOT contain secrets.
- **FR-OPS-007:** Authorized administrators SHALL be able to inspect audit records without direct
  storage access.

### 8.11 Deployment and execution environments

- **FR-DEP-001:** The system SHALL support local, cloud, and combined deployments as defined in the
  glossary.
- **FR-DEP-002:** Deployment mode SHALL NOT change the meaning of campaign states, decisions, outputs,
  reports, or audit records. It SHALL NOT change authorization rules.
- **FR-DEP-003:** Deployment configuration SHALL assign each system function, data store, and
  integration to a permitted environment. It SHALL also state the permitted environments for
  external work.
- **FR-DEP-004:** A local deployment SHALL operate with cloud access disabled.
- **FR-DEP-005:** A cloud deployment SHALL operate without a local runtime.
- **FR-DEP-006:** Communication between local and cloud environments SHALL be authenticated and
  encrypted. Every data transfer between them SHALL be declared and allowed by the applicable
  data-control policy.
- **FR-DEP-007:** A temporary loss of connectivity between environments SHALL NOT lose accepted
  work, corrupt state, or duplicate a completed result.
- **FR-DEP-008:** When connectivity returns, the system SHALL reconcile in-flight external work
  before it submits replacement work.
- **FR-DEP-009:** Deployment configuration SHALL identify each environment, its trust boundary,
  endpoints, capabilities, and data-control policy.
- **FR-DEP-010:** Admission SHALL reject work if no permitted environment has the required
  capability.
- **FR-DEP-011:** Credentials for each environment SHALL be configured separately. They SHALL NOT be
  copied to another environment unless the configured security policy allows it.
- **FR-DEP-012:** Each attempt record SHALL identify every environment in which its external work
  ran.
- **FR-DEP-013:** Each supported deployment mode SHALL have repeatable procedures for installation,
  configuration validation, upgrade, and rollback.
- **FR-DEP-014:** Upgrade and rollback SHALL preserve durable campaign and configuration data. The
  selected version SHALL become active only after interface and stored-data compatibility checks
  pass.

### 8.12 Regression-type requirements

- **FR-TYP-001:** A `performance` request SHALL include the metric name, unit, direction, and
  good-boundary baseline value.
- **FR-TYP-002:** A `performance` campaign scope SHALL include the system-under-test description and
  workload configuration, including the requested repetitions.
- **FR-TYP-003:** Each performance evaluation SHALL compare its candidate with the good-boundary
  baseline and use the metric direction from the request.
- **FR-TYP-004:** Performance evidence SHALL report significance, consistency, and statistical power
  as true/false values, and effect size as a named level. It SHALL NOT include detailed calculations
  or aggregation data.

- **FR-TYP-005:** A `build` campaign scope SHALL include the architecture, kernel configuration,
  and toolchain identity. The build result, including failure, SHALL be evidence.

- **FR-TYP-006:** A `config` campaign scope SHALL include the architecture, base kernel configuration,
  and toolchain identity.
- **FR-TYP-007:** A `config` campaign SHALL use the generated kernel configuration as evidence. A
  generation failure or unexpected value SHALL also be evidence.

- **FR-TYP-008:** A `boot` campaign scope SHALL include the system-under-test description, kernel
  configuration, and toolchain identity.
- **FR-TYP-009:** In a `boot` campaign, a candidate that fails before boot starts SHALL produce
  `skip`; a failure after boot starts SHALL be evidence. In a `unit_test` campaign, a candidate that
  fails before the selected test starts SHALL produce `skip`; a failure after it starts SHALL be
  evidence.

- **FR-TYP-010:** A `unit_test` campaign scope SHALL include the system-under-test description,
  kernel configuration, toolchain identity, and the test suite and test case identity.

## 9. Data and Recovery Requirements

- **DR-001:** Accepted requests, resolved policies, campaigns, steps, attempts, evidence references,
  decisions, conclusions, failures, cancellations, reports, delivery attempts, and audit events
  SHALL be stored durably.
- **DR-002:** Before initiating an external side effect, the system SHALL durably record enough
  intent and correlation state to recover or reconcile it.
- **DR-003:** Completed external results SHALL be stored before the campaign advances to dependent
  work.
- **DR-004:** Restarting any runtime process SHALL NOT lose accepted work, duplicate a recorded
  decision, or create a second logical campaign for the same active equivalence identity.
- **DR-005:** Terminal campaign, step, decision, and report facts SHALL be immutable; later events MAY
  append audit, delivery, retention, or correction metadata without rewriting history.

- **DR-006:** Large logs, artifacts, and measurements MAY live outside the primary record store, but
  their durable identity, location, integrity metadata, and retention state SHALL be recorded.
- **DR-007:** Administrators SHALL be able to configure retention periods for system records and
  artifacts.
- **DR-008:** Expiration or deletion SHALL preserve required audit evidence and SHALL NOT leave an
  output that falsely claims unavailable evidence is retrievable.
- **DR-009:** Authorized administrators SHALL be able to export campaign records and reports in a
  machine-readable format.
- **DR-010:** The system SHALL support consistent backup and restore of durable campaign and
  configuration state.
- **DR-013:** The system SHALL NOT transfer data to another site, region, provider, or environment
  unless the applicable data-control policy permits the transfer.
- **DR-014:** An authorized administrator SHALL be able to inspect, export, and request deletion of
  the data associated with an organization, project, requester, or campaign.
- **DR-015:** Deletion SHALL cover copies stored by the system and request deletion from configured
  external providers when they support it; unsupported or failed deletion SHALL be reported.
- **DR-016:** The system SHALL expose an inventory of retained system data and external references,
  including owner, retention deadline, and availability.
- **DR-017:** Stored campaign, evidence, artifact, report, configuration, and backup data SHALL
  support encryption at rest and integrity verification.
- **DR-018:** Access, export, transfer, retention change, and deletion of protected data SHALL be
  authorized and auditable.
- **DR-020:** Backup and restore SHALL preserve data-control policy, ownership, access rules,
  retention state, and audit history.

Retention periods, correction policy, backup frequency, recovery point objective, and recovery time
objective are TBD under `OPD-006`.

## 10. External Interface Requirements

- **IR-001:** Public request, output, report, administration, and extension interfaces SHALL be
  versioned.
- **IR-002:** Interface specifications SHALL define required and optional fields, allowed values,
  absence behavior, errors, idempotency, and compatibility rules.
- **IR-003:** Consumers SHALL be able to ignore unknown optional fields within a compatible interface
  version.
- **IR-004:** A producer SHALL NOT change the meaning or requiredness of an existing field within a
  compatible interface version.
- **IR-005:** Execution, evidence, storage, and delivery extension interfaces SHALL use
  implementation-neutral shared concepts and keep provider-native payloads behind the extension
  boundary.
- **IR-006:** An interface that starts external work SHALL provide a correlation identity and an
  idempotent way to find or reconcile the logical work item.
- **IR-007:** References to artifacts or external records SHALL include enough information for an
  authorized consumer to resolve them and detect stale or unavailable content.
- **IR-008:** Cross-environment interfaces SHALL expose endpoint identity, supported interface
  versions, capabilities, and health.
- **IR-009:** Data transferred across an environment boundary SHALL retain campaign correlation,
  ownership, and retention metadata.

## 11. Quality Requirements

### 11.1 Portability

- **NFR-PORT-001:** Core behavior SHALL NOT require a particular CI system, execution provider,
  storage technology, analysis implementation, or delivery channel.
- **NFR-PORT-002:** Replacing one configured integration with another conforming integration SHALL
  NOT change public campaign or report semantics.
- **NFR-PORT-003:** The system SHALL support deployment as part of a CI system and as a standalone
  installation used through its API or CLI.

### 11.2 Reproducibility

- **NFR-AUD-001:** Each step SHALL record enough source, build, test, scope, provider, and policy
  identity to explain what was evaluated.
- **NFR-AUD-002:** A consumer SHALL be able to trace every conclusion to step decisions and every
  step decision to evidence and originating execution output.
- **NFR-AUD-003:** Generated reports SHALL be reproducible from retained campaign records, apart from
  rendering time and delivery metadata.

### 11.3 Reliability

- **NFR-REL-001:** Duplicate requests, submissions, notifications, callbacks, and delivery retries
  SHALL NOT corrupt state or create duplicate logical work.
- **NFR-REL-003:** Loss of a notification SHALL NOT make an already completed external result
  unrecoverable.
- **NFR-REL-004:** Partial provider or delivery outages SHALL be isolated and surfaced without
  corrupting completed campaign data.

### 11.4 Deployment and data control

- **NFR-DATA-001:** Deployment mode SHALL NOT change the meaning, ownership, or protection level of
  campaign data.
- **NFR-DATA-002:** Cross-environment data transfer SHALL be observable and authorized before data
  leaves its current environment.
- **NFR-DATA-003:** A configuration or integration failure SHALL fail closed when the system cannot
  determine whether a data transfer is permitted.
- **NFR-DATA-004:** Data export SHALL preserve identity, relationships, and integrity metadata in a
  documented machine-readable form.
- **NFR-DATA-005:** Deletion and retention enforcement SHALL produce auditable status without
  rewriting historical conclusions.

### 11.5 Performance and scalability

Requirements are TBD under `OPD-007`.

### 11.6 Usability

Requirements are TBD under `OPD-008`.

## 12. Acceptance Criteria

- **AC-001:** Every applicable normative requirement SHALL be linked to one or more verification
  artifacts that use test, inspection, analysis, or demonstration.
- **AC-002:** Each delivery stage SHALL list its applicable requirement IDs, resolved defaults,
  measurable targets, and acceptance criteria. It SHALL NOT change SRS meaning.
- **AC-003:** Valid requests for every supported regression type SHALL be admitted, while invalid or
  unauthorized requests SHALL create no campaign.
- **AC-004:** Concurrent equivalent requests SHALL create one campaign with correct requester
  visibility.
- **AC-005:** Standard bisection SHALL execute repeated steps and produce every defined conclusion
  when supplied with the corresponding evidence and terminal search result.
- **AC-006:** Campaign scope SHALL remain unchanged across all steps.
- **AC-007:** Success, build failure, test failure, infrastructure failure, invalid request,
  cancellation, `skip`, and `weak` SHALL remain distinct. A normalized `parse_error` SHALL produce
  `skip` and remain distinct from evidence-processing failure.
- **AC-008:** Provider retries, duplicate notifications, process restarts, and worker races SHALL NOT
  duplicate logical work or decisions.
- **AC-009:** Cancellation SHALL stop new work, resolve every in-flight work item as the
  cancellation rules require, preserve late results for audit without applying them, and produce
  its distinct terminal state.
- **AC-010:** Every terminal campaign SHALL produce retrievable machine-readable and human-readable
  reports.
- **AC-011:** Automatic and user-requested report delivery SHALL record recipient, channel, status,
  and retry-safe attempts without changing the campaign conclusion or rerunning the campaign.
- **AC-012:** API and CLI operations SHALL produce equivalent validation, authorization,
  lifecycle, error, and output semantics.
- **AC-013:** A controlled campaign SHALL behave the same and produce equivalent results in local,
  cloud, and combined deployments.
- **AC-014:** A local deployment SHALL operate with cloud access disabled.
- **AC-015:** A combined deployment SHALL recover from temporary environment disconnection without
  losing or duplicating work.
- **AC-016:** Unauthorized source, campaign, evidence, artifact, administration, data-control, and
  report access SHALL be rejected and audited.
- **AC-017:** Prohibited cross-environment data transfer SHALL be blocked, while permitted transfer
  SHALL retain ownership and retention metadata.
- **AC-018:** Authorized inventory, export, retention, and deletion operations SHALL enforce
  data-control policy and record their outcome.
- **AC-019:** Backup and restore SHALL recover a consistent campaign state within the agreed recovery
  targets.
- **AC-020:** Expired evidence SHALL be represented honestly in outputs and reports.
- **AC-021:** All public and extension interfaces SHALL pass their version and compatibility tests.
- **AC-022:** A combined deployment SHALL use each configured function, integration, and data store
  only in its assigned environment and submit external work only to permitted environments.
- **AC-023:** Report generation failure, restart, and retry SHALL preserve the campaign conclusion,
  avoid duplicate report versions, and make the report available after recovery.
- **AC-024:** Each supported user-facing report format SHALL pass its declared accessibility,
  localization, and rendering checks.
- **AC-025:** A delivery stage SHALL NOT be accepted while an applicable requirement contains an
  unresolved TBD.

## 13. Open Questions

- **OPD-001:** Which search policies beyond standard bisection are required, and what are their
  multi-candidate round semantics?
- **OPD-002:** Which events are retryable, what is the default retry policy, and how is exhaustion
  mapped to campaign state?
- **OPD-003:** Which concurrency, timeout, and resource-budget scopes are configurable, what are
  their defaults, and what terminal disposition applies when each limit is reached?
- **OPD-004:** Which machine-readable report formats, human-readable templates, report-delivery
  setting sources, recipient sources, delivery channels, and delivery retry behavior are required?
- **OPD-005:** Which API protocol, CLI command structure and packaging, administration interface, and
  configuration rollout behavior are required?
- **OPD-006:** What are the retention periods, correction rules, backup frequency, recovery point
  objective, and recovery time objective?
- **OPD-007:** What are the latency, throughput, campaign-concurrency, capacity, and availability
  targets?
- **OPD-008:** Which accessibility, localization, and report-format requirements apply?
- **OPD-009:** Which identity provider, secret provider, and credential rotation behavior are
  required?
- **OPD-010:** Which external system owns the toolchain catalog, and what fields uniquely identify a
  toolchain?
- **OPD-011:** Which operating systems, cloud environments, regions, installation forms, and upgrade
  paths are required for each deployment mode?
- **OPD-012:** What temporary-disconnection duration and maximum reconciliation time are required for
  a combined deployment?
- **OPD-013:** Which ownership model, encryption-key integrations, and deletion guarantees are
  required?
- **OPD-014:** When an equivalent campaign has completed, failed, or been canceled, does a new request
  return it or start a new campaign, and how long does that rule apply?
- **OPD-015:** When several requesters share one equivalent campaign, which of them has cancellation
  permission and how are the others notified?
- **OPD-016:** How do deletion requests interact with immutable conclusions, retained audit evidence,
  external-provider copies, and backups, and how does restore prevent deleted data from becoming
  accessible again?
