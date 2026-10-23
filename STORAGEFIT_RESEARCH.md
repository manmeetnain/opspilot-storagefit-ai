# StorageFit Agent — researched product concept

Research snapshot: 23 October 2026. Product specifications must be refreshed from official vendor sources before use in an active procurement.

## Product objective

StorageFit is an evidence-backed procurement and architecture agent for enterprise storage. It turns customer workload evidence into a vendor-neutral request, gathers current product facts, normalizes unlike claims, creates a shortlist, and validates finalists through a common proof-of-concept.

It must never output a universal “best array.” The answer is always conditional on workload, resilience, ecosystem, operations, migration, support and commercial constraints.

## Current product landscape

| Vendor | Representative platform | Published position relevant to the concept | Important comparison caveat |
|---|---|---|---|
| IBM | FlashSystem 9600 | Up to 6.3M 4K read-hit IOPS, 86 GB/s read bandwidth, under 50 μs published read response, 11.8 PBe effective in one enclosure | IOPS is explicitly a 4K read-hit figure; effective capacity is not raw or usable capacity |
| Dell | PowerMax 8500 | Under 60 μs published response, 18 PBe effective, 2–16 nodes, 65M secure snapshots | Published response is based on Dell internal OLTP testing; effective capacity assumes reduction |
| Dell | PowerStore 9200T | 112 CPU cores, 2.56 TB memory, up to 5.90 PBe per appliance and 23.60 PBe per cluster, unified block/file/vVol | Capacity is effective and cluster maximum differs from per-appliance limits |
| NetApp | AFF A1K | Portfolio literature states up to 40M IOPS and 1 TB/s; A1K scales to 24 nodes and 330 PB effective | Portfolio-level headline must not be treated automatically as a single A1K-pair result; effective capacity assumes 5:1 |
| Pure Storage | FlashArray//XL R5 | 150 μs published latency, 45 GB/s throughput and up to 1.9 PB raw capacity | Throughput note uses 512K, 100% read, 1:1 conditions; not directly comparable with small-block mixed OLTP |
| HPE | Alletra Storage MP B10000 | Up to 5.9 PB per switched solution, disaggregated controller/capacity scaling, unified block/file positioning | Public specifications emphasize architecture and guarantees; performance must be validated against the target configuration |
| Hitachi Vantara | VSP One Block 28 | Response as low as 41 μs; up to 4.3 PB internal physical capacity in the 20-series specification | “As low as” is not a sustained mixed-workload SLA; model and workload conditions require validation |

## Agentic workflow

### 1. Requirement agent

Ingests Live Optics, PerfMon, AWR, vCenter, Prometheus or storage telemetry and derives:

- IOPS distribution rather than one peak number;
- read/write ratio and sequential/random mix;
- block-size distribution;
- average, p95 and p99 latency requirements;
- working set, change rate and compressibility;
- capacity growth, snapshots and replication;
- availability, RPO, RTO and cyber-recovery needs;
- host OS, hypervisor, database, protocol and SAN dependencies.

### 2. Evidence agent

Collects official datasheets, configuration limits, interoperability matrices, release notes, guarantees and API capabilities. Every extracted fact keeps:

- vendor and product;
- document title and URL;
- publication/revision date;
- model and software version;
- test conditions and footnotes;
- whether it is raw, usable or effective;
- whether it is measured, guaranteed, estimated or marketing language;
- confidence and expiry date.

### 3. Claim-normalization agent

Prevents invalid comparisons such as:

- 4K read-hit IOPS versus 16K 70/30 mixed IOPS;
- single-controller pair versus full cluster;
- raw capacity versus effective capacity;
- sub-100 μs minimum latency versus sustained p99 latency;
- controller bandwidth versus host-observed throughput;
- data-reduction guarantee versus expected reduction for encrypted or compressed data.

### 4. Architecture agent

Produces a valid configuration for each candidate, including controllers, drives, ports, fabrics, rack units, power, replication target, quorum/witness, licenses and migration path. A product is not scored if a valid configuration cannot be constructed.

### 5. Commercial and sustainability agent

Compares five-year cost using the same assumptions:

- acquisition/subscription and mandatory software;
- support and renewal escalation;
- rack, power and cooling;
- migration services;
- required replication and backup infrastructure;
- operational labor;
- forecast expansion and technology refresh.

### 6. Adversarial review agents

Each shortlisted design is challenged independently:

- performance critic;
- resilience and failure-domain critic;
- cyber-recovery critic;
- interoperability critic;
- vendor-lock-in and exit-cost critic;
- evidence-quality critic.

### 7. Validation agent

Creates identical proof-of-concept acceptance tests. Vendor-supplied test results are kept separate from customer-observed results. The final recommendation is recalculated using observed performance, failure behavior, recovery time and operating effort.

## Scoring model

Do not hide trade-offs in one unexplained number. Provide a weighted score plus raw evidence:

```text
Fit = performance 25%
    + resilience 20%
    + data services 15%
    + ecosystem/interoperability 15%
    + operations/automation 10%
    + five-year economics 10%
    + sustainability 5%
```

Weights are customer-controlled. Missing evidence reduces confidence; it must never silently become a zero or an assumed pass.

## Minimum viable product

1. Support IBM FlashSystem, Dell PowerMax/PowerStore and NetApp AFF first.
2. Accept a structured workload questionnaire plus optional sanitized telemetry CSV.
3. Maintain a versioned product-evidence catalogue from official sources.
4. Normalize capacity, performance, connectivity, resilience and automation attributes.
5. Generate a shortlist, evidence gaps, clarification questions and a common POC plan.
6. Export an executive comparison and a detailed architecture workbook.

Pure, HPE and Hitachi can follow once the data model and evidence review process are stable.

## Commercial path

- Fixed-price storage refresh assessment
- Independent RFQ/RFP technical scoring
- Vendor proposal validation
- Storage consolidation and migration planning
- Continuous hardware/software lifecycle intelligence
- Partner tool for systems integrators and independent consultants

The first paid service can be delivered manually with the agent as an analyst copilot. This produces real evaluation data before attempting full automation.
