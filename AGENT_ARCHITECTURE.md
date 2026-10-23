# Agentic infrastructure operations architecture

## Why this is not another AIOps dashboard

Vendor platforms already monitor their estates well. OpsPilot does not replace IBM Storage Insights, Dell AIOps, VMware, ServiceNow, Prometheus or automation platforms. It gives them coordinated agency.

The unit of work is a **mission**, not an alert or chat message:

> Restore checkout p95 below 800 ms, make no production changes without approval, and prove recovery for 15 minutes.

The Incident Commander decomposes the mission. Domain agents use existing systems as tools, exchange signed evidence, challenge hypotheses and propose an action. The Change Guardian checks policy, blast radius, rollback and approval. The mission closes only when the outcome is verified.

## Agent contracts

Every agent has:

- a narrow responsibility and scoped service identity;
- an allowlist of read and write tools;
- structured inputs and outputs rather than free-form chat;
- an evidence ledger containing query, timestamp, source and result hash;
- a time and tool-call budget;
- explicit uncertainty and competing hypotheses;
- stop conditions and escalation rules;
- an evaluation score tied to operational outcomes.

## Specialist mesh

| Agent | Reads | Produces | May change |
|---|---|---|---|
| Storage SRE | IBM/Dell/NetApp health, volumes, paths, replication | storage hypotheses and safe checks | nothing by default |
| Fabric & Network | switch ports, errors, zoning, flows, routes | path health and congestion evidence | approved port/path operations |
| Compute & Cloud | VMware, Redfish, OS and cloud APIs | contention, hardware and placement findings | approved workload actions |
| Application SRE | OpenTelemetry, Prometheus, Kubernetes, deploy history | SLO impact and dependency evidence | approved rollout or scaling actions |
| Change Guardian | CMDB, ITSM, policies, maintenance windows | risk score, approval route and rollback requirements | creates/updates change records |
| Incident Commander | all structured agent findings | ranked causal graph and mission decision | delegates only |

## Mission state machine

```text
INTAKE -> PLAN -> OBSERVE -> HYPOTHESIZE -> CHALLENGE -> PROPOSE
                                                      |
                           BLOCKED <- POLICY CHECK <-+
                                                      |
                            VERIFY <- EXECUTE <- APPROVE
                               |
                         CLOSE or ROLLBACK
```

No generative model directly receives infrastructure credentials. A policy-enforcing tool gateway validates tenant, role, resource, method, arguments, time window and approval token before calling a connector.

## First sellable wedge

Build **Cross-Vendor Incident Evidence Pack** first. It is valuable even with zero autonomous changes:

1. Receive an alert or ServiceNow incident.
2. Map the affected service to host, fabric and storage dependencies.
3. Delegate read-only evidence collection.
4. Produce a ranked root-cause graph with contradictory evidence shown.
5. Generate a vendor-ready support bundle and a change-ready remediation plan.

This saves war-room time, avoids asking a customer to replace existing investments, and creates the trust needed for later automation.

## Evaluation before production

- Build 20 labelled lab incidents across storage, SAN, compute and Kubernetes.
- Measure root-cause top-1/top-3 accuracy, false escalation rate and evidence completeness.
- Measure time to first useful hypothesis and total tool-call cost.
- Run every proposed action against policy fixtures and failure injection.
- Require deterministic rollback and post-checks for every write tool.
- Red-team prompt injection in logs, tickets, device names and runbooks.

## Recommended implementation sequence

1. FastAPI control plane, PostgreSQL evidence store and a durable workflow engine.
2. Read-only IBM Storage Insights, Prometheus and vCenter connectors.
3. Service-to-infrastructure topology model.
4. Deterministic correlation rules plus agent-generated hypotheses.
5. ServiceNow incident and change integration.
6. Ansible execution only in a lab, behind approval and rollback policies.
