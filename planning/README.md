# Implementation plan

[`plan.yaml`](plan.yaml) defines execution order and dependencies. Each file under [`tasks/`](tasks/)
defines one proposed GitHub issue.

## Plan anatomy

```yaml
version: PLAN-VERSION-NUMBER
phases:
  - phase: PHASE-NUMBER, recommended execution order
    goal: "OUTCOME DESCRIPTION"
    tasks:
      group-name/task-name.md:
        stream: "STREAM-NAME, i.e working group or component"
        title: "TASK TITLE"
        priority: TASK-PRIORITY, high|medium|low
        delivers: "concrete value produced by the task"
        depends_on:
          - group-name/some-other-task.md
```

A phase groups the tasks that deliver one milestone. A task may start when every `depends_on` task
is complete.

## Task anatomy

```markdown
---
stream: "BCO"
topic: "Short classification"
priority: high
publish: false
---

# Task title

## Description

What must change and why.

## Contribution

- Delivers: Concrete capability or assurance.

## Acceptance criteria

- [ ] Short, verifiable result.

## Sources

- [Owning design or contract](../../../docs/example.md)
```

Keep acceptance criteria short and testable. Use `Sources` for the documents that define the required
behavior.

## Publishing tasks to GitHub

- `publish: false`: the task is a draft. A GitHub publishing action must skip it. Its path may change.
- `publish: true`: the task is approved. A GitHub publishing action may create or update its issue.
- After an issue is created, keep the task path unchanged so the action can match the file to that issue.
- The task title and body may still change after publication.

This branch does not contain the GitHub publishing action. Changing the flag alone does not create or update
an issue.
