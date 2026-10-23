# OpsPilot AI

**Live demo:** [Open OpsPilot StorageFit AI](https://manmeetnain.github.io/opspilot-storagefit-ai/)

OpsPilot AI is a portfolio-grade, vendor-neutral infrastructure operations cockpit. It demonstrates how storage, network, compute, and application telemetry can be correlated into one incident narrative with an explainable, human-approved remediation plan.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. Use `⌘K` / `Ctrl+K`, click any incident, or choose **Review remediation plan** to explore the interactive demo.

Run the deterministic decision-engine tests with:

```bash
npm test
```

## StorageFit decision engine

The **StorageFit Agent** section is backed by versioned product evidence and a deterministic scoring module rather than hard-coded UI rankings:

- `src/storage-data.js` contains vendor facts, claim scope, evidence confidence and workload profiles.
- `src/scoring.js` applies customer-controlled weights plus capacity, latency and uncertainty penalties.
- `test/scoring.test.js` verifies ordering, evidence penalties, capacity penalties and score bounds.

The language-model/agent layer is intended to collect evidence, identify gaps, challenge claims and explain results. It does not directly calculate or secretly alter product scores.

## What this proves

- Cross-domain operations thinking: storage → SAN/network → compute → application
- IBM and Dell/EMC domain credibility without locking the product to one vendor
- AIOps/agentic workflow design with confidence, evidence, safe pre-checks, approvals, and auditability
- Product thinking around SLO impact, alert correlation, MTTR, capacity forecasting, and remediation
- A credible foundation for consulting demos, interviews, and a future managed-service offering

## Production architecture path

1. **Collectors:** IBM Storage Insights REST API, Dell AIOps/CloudIQ API, Redfish, VMware vCenter, Kubernetes, Prometheus, OpenTelemetry, SNMP and syslog.
2. **Normalization:** OpenTelemetry-style resource identities plus a vendor-neutral asset and metric schema.
3. **Correlation:** topology graph + time-window correlation + change/event enrichment.
4. **Reasoning:** retrieval over runbooks and vendor documentation, with evidence-linked output and confidence scoring.
5. **Action:** read-only pre-check tools first; mutations require policy checks, change records, approval, rollback and post-validation.

The current UI uses deterministic simulated telemetry so it is safe and immediately demonstrable.
