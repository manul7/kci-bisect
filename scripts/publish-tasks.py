#!/usr/bin/env python3
"""Create a GitHub issue for each task marked publish: true, labeled with its phase"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "planning" / "plan.yaml"
TASKS = ROOT / "planning" / "tasks"

PHASE_LINE = re.compile(r"^  - phase: (\d+)$")
TASK_LINE = re.compile(r"^      ([a-z0-9][a-z0-9-/]*\.md):$")
TITLE_LINE = re.compile(r"^# (.+)$")
PUBLISH_LINE = re.compile(r"^publish: true$", re.MULTILINE)
MARKER = re.compile(r"<!-- task: (\S+) -->")
LABEL_COLOR = "1d76db"


def task_phases() -> dict[str, int]:
    phases: dict[str, int] = {}
    current: int | None = None
    for line in PLAN.read_text(encoding="utf-8").splitlines():
        if match := PHASE_LINE.match(line):
            current = int(match.group(1))
        elif match := TASK_LINE.match(line):
            if current is None:
                raise ValueError(f"Task outside a phase: {line}")
            phases[match.group(1)] = current
    if not phases:
        raise ValueError("No tasks found in plan")
    return phases


def existing_tasks() -> set[str]:
    result = subprocess.run(
        ["gh", "issue", "list", "--state", "all", "--limit", "1000", "--json", "body"],
        check=True,
        capture_output=True,
        text=True,
    )
    return {
        marker
        for issue in json.loads(result.stdout)
        for marker in MARKER.findall(issue["body"] or "")
    }


def issue_content(task: str) -> tuple[str, str]:
    text = (TASKS / task).read_text(encoding="utf-8")
    title = next(match.group(1) for line in text.splitlines() if (match := TITLE_LINE.match(line)))
    body = text.split("---\n", 2)[2].lstrip()
    body = re.sub(r"^# .+\n+", "", body)
    body += f"\n---\nTask file: `planning/tasks/{task}`\n<!-- task: {task} -->\n"
    return title, body


def main() -> None:
    parser = argparse.ArgumentParser(description="Publish tasks marked publish: true as issues")
    parser.add_argument("--dry-run", action="store_true", help="list what would be created")
    args = parser.parse_args()

    phases = task_phases()
    publishable = [
        (task, phase)
        for task, phase in sorted(phases.items())
        if PUBLISH_LINE.search((TASKS / task).read_text(encoding="utf-8"))
    ]
    if not publishable:
        print("no tasks marked publish: true")
        return

    if args.dry_run:
        for task, phase in publishable:
            print(f"would create: {task} (phase-{phase})")
        return

    existing = existing_tasks()
    for task, phase in publishable:
        if task in existing:
            print(f"exists, skipped: {task}")
            continue
        title, body = issue_content(task)
        label = f"phase-{phase}"
        subprocess.run(
            ["gh", "label", "create", label, "--color", LABEL_COLOR],
            check=False,
            capture_output=True,
        )
        subprocess.run(
            ["gh", "issue", "create", "--title", title, "--body", body, "--label", label],
            check=True,
        )
        print(f"created: {task} ({label})")


if __name__ == "__main__":
    main()
