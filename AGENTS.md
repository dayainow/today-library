# Agent Harness Pointer

This workspace is configured with a Harness-style agent team under `.claude/`.

Use `.claude/skills/app-delivery-orchestrator/SKILL.md` for app, website, full-stack feature, refactor, bugfix, integration, or QA work that benefits from multiple specialist agents. Use `.claude/skills/harness/SKILL.md` when creating, auditing, or evolving the harness itself.

The primary team is:

- `product-architect`: product intent, acceptance criteria, data contracts, implementation plan.
- `frontend-builder`: UI, client state, accessibility, responsive behavior.
- `backend-integrator`: APIs, data model, server logic, environment and integration boundaries.
- `qa-guardian`: tests, verification, build checks, cross-boundary regression review.

Keep intermediate multi-agent outputs in `_workspace/` so later agents can read prior findings without relying on chat history.
