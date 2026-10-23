# OpsPilot AI — product and career strategy

## The positioning

**One sentence:** OpsPilot AI is a vendor-neutral infrastructure reliability copilot that connects storage, SAN/network, compute and application signals, explains probable service impact, and prepares safe human-approved remediation.

This is stronger than presenting yourself only as an IBM/EMC storage administrator. Your existing depth becomes the foundation for a broader Platform Engineering, SRE, AIOps, Infrastructure Automation or Solutions Architecture profile.

## Pain map and product response

| Domain | Common operational pain | What OpsPilot demonstrates |
|---|---|---|
| Storage | Capacity surprise, latency, hot volumes, snapshot sprawl, replication risk, multipath faults | Forecasting, workload baseline, path analysis, reclamation and DR readiness |
| SAN/network | Congestion, CRC errors, oversubscription, zoning drift, asymmetric paths | Fabric telemetry, dependency graph, blast-radius analysis and validated path checks |
| Compute | Host contention, memory pressure, firmware drift, failed hardware, noisy neighbors | Redfish/vCenter/Kubernetes inventory, anomaly context and change correlation |
| Application | Error-rate and latency symptoms with unclear infrastructure cause | SLO mapping, service ownership and end-to-end causal chains |
| Operations | Alert floods, tool switching, tribal knowledge, slow handoffs, risky fixes | Deduplication, evidence bundles, runbook retrieval, confidence and approval gates |
| Leadership | No service-level view of risk, cost or operational improvement | Health score, MTTR, risk forecasts, avoided downtime and reclaimable capacity |

## Architecture to build next

```text
IBM Storage Insights ─┐
Dell AIOps / CloudIQ ─┤
VMware / Redfish ─────┼─> collectors ─> normalized events/metrics ─> topology graph
Kubernetes / Prom ────┤                                          │
SNMP / syslog ────────┘                                          ├─> correlation engine
OpenTelemetry ────────────────────────────────────────────────────┘         │
                                                                             v
                                                           evidence-aware AI investigator
                                                                             │
                                          read-only checks -> approval -> action -> validation
```

### Guardrails that make the agent credible

- Separate observation, recommendation and execution permissions.
- Every conclusion links to metrics, events, changes and a runbook section.
- Show confidence and competing hypotheses; do not present guesses as facts.
- Default every connector to read-only.
- Require approval for changes and capture before/after evidence.
- Define rollback conditions before execution.
- Never send credentials or raw sensitive logs to an LLM.

## Twelve-week build roadmap

### Weeks 1–2 — portfolio foundation

- Finish the interactive product demo and record a 3-minute walkthrough.
- Publish an architecture diagram and one detailed incident case study.
- Add a small Python collector that loads sanitized IBM/Dell sample JSON.

### Weeks 3–5 — real observability

- Add Prometheus metrics and a FastAPI backend.
- Normalize assets, health, metrics, events and relationships.
- Add PostgreSQL/TimescaleDB or a lightweight equivalent for history.
- Create synthetic failure scenarios with reproducible expected results.

### Weeks 6–8 — explainable investigation

- Implement deterministic correlation before adding an LLM.
- Add change-event and dependency context.
- Add retrieval over your own runbooks and vendor documentation.
- Evaluate root-cause ranking against labelled scenarios.

### Weeks 9–10 — safe automation

- Build read-only pre-check tools and policy-based approval.
- Add Ansible runbooks for low-risk lab remediations.
- Record every action, output, approval and post-check.

### Weeks 11–12 — market proof

- Publish two technical articles and three short demo clips.
- Invite five infrastructure peers to test the demo.
- Turn feedback into a public backlog and one release note.
- Apply with the live demo to Platform Engineer, SRE, AIOps Engineer, Infrastructure Automation and Solutions Architect roles.

## Three flagship case studies

1. **Application latency traced to SAN path imbalance** — the story currently implemented in the demo. Show cross-domain reasoning and safe remediation.
2. **Storage capacity risk prevented without new hardware** — forecast exhaustion, identify orphaned volumes/snapshots, estimate reclaimable capacity and generate an approval plan.
3. **Ransomware-resilience readiness audit** — validate immutable copies, replication health, recovery objectives, access separation and test-recovery evidence. Keep the demo defensive and non-destructive.

For each case study publish: business symptom, telemetry, topology, hypotheses, evidence, decision, guardrail, result and measurable benefit.

## How this can earn

### Fastest: consulting proof-of-value

Offer a fixed-scope **Infrastructure Health & Automation Assessment** for small and mid-sized environments. Deliver an inventory, risk heatmap, capacity forecast, top five automation opportunities and a 90-day plan. The product becomes your assessment interface.

### Strongest job signal

Use the demo in interviews. In five minutes, walk through the incident, explain why cross-domain correlation matters, open the remediation drawer, and emphasize read-only evidence plus human approval. Follow with the architecture and roadmap.

### Longer-term product

Start with one narrow paid wedge: multi-vendor storage health reporting or capacity-risk forecasting. Avoid promising a universal autonomous agent before real connectors, evaluations and change controls exist.

## Interview narrative

> I spent years close to enterprise storage and infrastructure. I used that operational knowledge to build OpsPilot AI, a vendor-neutral reliability cockpit that connects storage, network, compute and application symptoms. It does not just summarize alerts: it produces an evidence-backed causal chain and a safe remediation plan with approval and rollback controls. The demo uses deterministic telemetry today, and the architecture is designed for IBM Storage Insights, Dell AIOps, Prometheus, OpenTelemetry, VMware, Kubernetes and Redfish connectors.

## Definition of a credible v1

- Two working read-only connectors, not ten logos.
- Five repeatable incident scenarios with expected results.
- Evidence-linked findings and measurable correlation precision.
- RBAC, secrets isolation, audit logs and approval gates.
- A polished demo, architecture document, setup guide and recorded walkthrough.
- No unsupported claim that the system autonomously fixes production.
