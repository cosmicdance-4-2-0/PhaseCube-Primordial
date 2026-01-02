# PhaseCube Field 0.2.a1  
## Relational Flux Lattice — A Minimal Event-Driven Substrate for Persistent Structure and Emergent Knot-Objects

**Status:** Proof-of-Concept (POC) design paper  
**Primary intent:** browser-runnable, single-agent sim; minimal ontology → minimal dynamics  
**Author (concept origin):** Christopher “Kisuul” Lohman  
**Draft:** 0.2.a1

> **Tagline:** *The Universe is the Universal Computer—and the simulation it is running.*

---

## Table of Contents
- [Abstract](#abstract)
- [1. Intent and Non-Goals](#1-intent-and-non-goals)
- [2. Ontological Postulates (Operationalized)](#2-ontological-postulates-operationalized)
- [3. Minimal Layer Stack (POC Constraint)](#3-minimal-layer-stack-poc-constraint)
- [4. Substrate and Topology](#4-substrate-and-topology)
- [5. Flux in a Binary Substrate](#5-flux-in-a-binary-substrate)
- [6. Core Local Rule Family](#6-core-local-rule-family)
- [7. Anti-Singularity: Shedding and Redistribution](#7-anti-singularity-shedding-and-redistribution)
- [8. Dynamic Knotting and the Matter Boundary](#8-dynamic-knotting-and-the-matter-boundary)
- [9. Recursion: “One Force” Running an Instance of Itself](#9-recursion-one-force-running-an-instance-of-itself)
- [10. Observer Operator](#10-observer-operator)
- [11. Expected Phenomenology](#11-expected-phenomenology)
- [12. Diagnostics (Minimal, Human-Friendly)](#12-diagnostics-minimal-human-friendly)
- [13. Parameters (POC Defaults)](#13-parameters-poc-defaults)
- [14. Limitations and Open Questions](#14-limitations-and-open-questions)
- [15. Roadmap (Incremental)](#15-roadmap-incremental)
- [Closing](#closing)

---

## Abstract

PhaseCube Field is a minimal, event-driven lattice model intended to explore how **persistent structure** can arise in a substrate constrained to avoid absorbing extremes. The model operates on a **binary computational substrate** while approximating **ternary flux** as a *process* rather than a stored digit. Its guiding ontology treats reality as **difference + relation** under balance constraints: no privileged global tick; only local “tocks” (events). Stable “objects” arise not as primitive atoms but as **metastable knots in relational gradients**, formed dynamically at branch/intersect/pinch points.

A key conjecture is that once a knot closes over itself, it can host a localized instance of the same relational grammar with new effective degrees of freedom (e.g., charge/spin/phase), enabling force-like behaviors (EM/plasma analogs) as **matter effects** rather than primitive laws.

---

## 1. Intent and Non-Goals

### 1.1 Intent
- Produce persistent macroscopic structure (islands / filaments / webs / voids) with ongoing microscopic motion.
- Forbid singularities: no perfect “infinite curvature” states; instead: nodal intersects, pinches, and redistribution.
- Maintain a **three-layer** architecture suitable for a single-agent POC.

### 1.2 Non-Goals
- Not a literal physical cosmology claim; this is a modeling lens.
- Not a full matter model yet; v0.2 focuses on **force-process dynamics** and **knot formation gates**.
- Not aiming for quantitative EM/plasma fidelity; only qualitative structural analogies.

---

## 2. Ontological Postulates (Operationalized)

These are treated as modeling axioms; they are not asserted as empirical truth.

### 2.1 No global ticks
Physics is defined by **local update events**; any render cadence is measurement, not fundamental time.

> *No global ticks. Just infinite recursive tocks.*

### 2.2 No absolute points, no absolute lines
“Entities” are observer-robust patterns (“clouds”), and “trajectories” are gradients/flows of relation, not primitive geometry.

### 2.3 Balance constraints (no absorbing extremes)
The system must not converge to either:
- **perfect coherence** (maximal lock; “fries/freezes” the manifold), nor
- **perfect cancellation** (no distinguishable gradients; “rip a new 0 hole”).

Operationally: the dynamics must include **anti-singularity shedding** and **redistribution**.

---

## 3. Minimal Layer Stack (POC Constraint)

### Layer 1 — Dyad (Difference)
A published polarity in a binary substrate.

- **Published field:** `s[i] ∈ {−1, +1}`

### Layer 2 — Triad (Mediation / Metastable Operator)
A local hidden mediator that resolves ambiguity and sustains metastability without global coordination.

Two interchangeable implementations are defined (choose one per run):
- **Triad A (Phase):** `p[i] ∈ {0, 1}` (local phase / parity / ambiguity resolver)
- **Triad B (Carrier):** `acc[i] ∈ ℝ` (local integrator producing 1-bit pulses)

### Layer 3 — Observer (Intervention / Measurement)
A separate operator that can inject localized constraints/flux and perform measurement transforms. Observer input is optional; the closed system must remain active without it.

---

## 4. Substrate and Topology

### 4.1 Lattice
- 2D grid `W × H` with toroidal wrap (default).
- Neighborhood: radius `r` (default `r = 2` → 5×5 excluding center).

### 4.2 Update semantics (event-driven)
At each measurement frame, perform `N` local update events:
- pick random cell `i`
- read neighbor states (in-place or from snapshot)
- compute local rule
- write updated variables for cell `i`

This yields a **partial order of events**, not a synchronous global step.

### 4.3 Read/write regimes
- **Async in-place:** each event reads the latest published neighbor values.
- **Snapshot-per-frame:** capture `sSnapshot = s.slice()` once per frame; all events read snapshot.

Either is valid; snapshot mode improves interpretability.

---

## 5. Flux in a Binary Substrate

The practical problem: binary machines “step” states; they do not naturally “flux” ternary. PhaseCube treats ternary as **emergent measurement**, not stored trit.

### 5.1 Triad A — Local phase mediation
Each cell holds `p[i]` used only in ambiguous contexts. Phase flips under stress and may diffuse.

- Benefit: simple, close to early parity designs.
- Requirement: **local** phase only (no global god-bit).

### 5.2 Triad B — Pulse-density carrier (sigma-delta; recommended)
Each cell holds an integrator `acc[i]` and publishes 1-bit pulses `s[i]`.

**Publish:**
- `s[i] = sign(acc[i]) ∈ {−1, +1}`

**Feedback:**
- `acc[i] ← acc[i] + drive − q * s[i]`

**Observation (ternary proxy):**
Compute a low-pass filtered mean `avg[i]`:
- render as `+1` if `avg[i] > θ`
- render as `−1` if `avg[i] < −θ`
- else render `0`

This matches the intent: **ternary flux emerges from binary pulses**.

---

## 6. Core Local Rule Family

PhaseCube is defined as a family of rules built from:
- neighborhood influence
- ambiguity resolution (Triad layer)
- curvature/stress detection
- anti-singularity shedding + redistribution

### 6.1 Neighborhood influence
Compute:
- `Σ(i) = Σ s[j]` over neighborhood `N(i)`
- optional structural stats: sign mix, edge density, junction detection

### 6.2 Ambiguity region
When `Σ(i)` is near 0 (weak/competing influence), do not “step a trit.” Use the Triad:
- Triad A: resolve by `p[i]`
- Triad B: integrator decides the next pulse

### 6.3 Curvature/stress proxy (singularities forbidden)
Model “curvature approaching infinity” as a local stress condition (not mere uniformity). Practical proxies:
- **Edge density:** count neighbors with `s[j] != s[i]`
- **Junction score:** strong presence of both signs + high edge density
- **Integrator stress (Triad B):** large `|acc[i]|` under disagreement

---

## 7. Anti-Singularity: Shedding and Redistribution

When curvature/stress exceeds a threshold, the system **must shed energy** and **redistribute**. It can never reach “perfect.”

Design requirement:
- Shedding must be **local** and preferably **propagating** (along overlap manifolds / gradients), not global instantaneous correction.

Operational behaviors (choose one or combine lightly):
- **Redistribution wave (Triad B):** dump part of `acc[i]` into neighbors preferentially along strong gradients.
- **Phase shock (Triad A):** flip `p[i]` and probabilistically propagate phase diffusion outward like a relief front.
- **Dipole shedding:** emit paired opposite disturbances locally to preserve statistical neutrality.

**Spin as shedding channel (hypothesis):**
Persistent rotational dynamics can delay breakdown by continuously shedding/redistributing stress.

---

## 8. Dynamic Knotting and the Matter Boundary

### 8.1 v0.2 scope: force-process first
v0.2 primarily models **force-process interactions** in a pre-matter field. Matter is introduced only as an emergent boundary condition.

### 8.2 Knotting is dynamic (not spontaneous)
Matter-like knots are permitted only at **nodal branch/intersect/pinch points** that persist.

Define a **pinch detector**:
- high junction score (both signs present strongly)
- high curvature/stress
- sustained across events

Implement via local accumulator:
- `pinchScore[i] += 1` while pinch holds; decays otherwise
- nucleate a knot if `pinchScore[i] > K`

### 8.3 Canonical statement
> **Matter is when the process partially closes over itself—running a local instance of the same relational grammar with new effective degrees of freedom (charge/spin/phase).**

Interpretation:
- once knotted, it does not strictly obey the same micro-rules that produced it
- it introduces new degrees of freedom and back-reacts on the surrounding field

---

## 9. Recursion: “One Force” Running an Instance of Itself

Conjecture: the field is one relational grammar; “EM/plasma behavior” is a **matter effect** (an effective regime that appears when knots exist).

### 9.1 Minimal internal DOF for knots
Each knot maintains a minimal “internal PhaseCube” analogue:
- `k.q ∈ {−1, +1}` (charge sign proxy)
- `k.phase` or `k.acc` (spin/phase proxy)
- `k.m` (coupling strength / radius)

This is “an instance of the game inside the game.”

### 9.2 Backreaction (field warps around knots)
Knots influence the surrounding field without closing it off:
- modify coupling strength locally (stiffen/soften gradients)
- bias ambiguity resolution near the knot
- emit structured pulses (spin as persistent shedding)
- redirect redistribution paths along overlap manifolds

### 9.3 Qualitative EM/plasma analogy
- “Charge” is consistent bias in mediation/response fields.
- “Spin” is circulating carrier dynamics that shed stress.
- “Plasma-like” regimes appear when many knots overlap.

No claim of Maxwell/MHD fidelity; this is an emergent interaction analogy.

---

## 10. Observer Operator

### 10.1 Intervention (aware influence)
Observer can locally influence:
- Triad A: set/flip local phase `p[i]`
- Triad B: add bias to `acc[i]` or inject dither

This is conceptually separate from the closed dynamics.

### 10.2 Measurement / collapse
“Collapse” is a visualization operator unless explicitly configured to back-react. Default is strict separation.

---

## 11. Expected Phenomenology

**Closed dynamics (no observer):**
- rapid macro-domain emergence
- persistent filaments/webs; active boundaries
- anti-singularity shedding prevents perfect lock
- pinch points form; optional knot nucleation (if enabled)
- knots backreact, producing long-lived structured interactions

**With observer input:**
- local edits seed or steer pinch formation
- effects propagate preferentially along overlap gradients

---

## 12. Diagnostics (Minimal, Human-Friendly)

Recommended live measures:
- **Boundary length:** count edges where `s[i] != s[neighbor]`
- **Junction count:** number of high-mix, high-edge neighborhoods (pinch candidates)
- **Mean bias:** drift monitor (global)
- **Flip rate / variance:** local “temperature” proxy
- **Knot count / lifetimes:** if knotting enabled

---

## 13. Parameters (POC Defaults)

- Grid: `120 × 120` torus
- Neighborhood radius: `r = 2`
- Events per render: `N = 600` (tune)
- Triad mode: **B (pulse-density)** recommended; **A (local phase)** supported
- Shedding thresholds: tuned to prevent lock-in without exploding into noise
- Knotting: **disabled by default**, enabled for matter-boundary experiments

---

## 14. Limitations and Open Questions

- **Curvature proxy:** mapping local statistics to “stress” is design-dependent.
- **Shedding routing:** how best to bias redistribution along overlap manifolds remains experimental.
- **Knot rulebook:** define internal knot dynamics that remain thermodynamically honest (no free energy).
- **Layer depth:** deeper arities are conjectured; POC compresses them into the Triad mediator.

---

## 15. Roadmap (Incremental)

1. Replace any global carrier/parity with **local mediation** (Triad A) or **pulse-density carrier** (Triad B).  
2. Implement curvature-based shedding as **local redistribution waves**.  
3. Add `pinchScore` and deterministic knot nucleation gates (dynamic, not spontaneous).  
4. Add knot objects with minimal internal DOF (charge/spin/phase) + backreaction.  
5. Observe whether knot networks reproduce stable higher-level “force” behaviors.  
6. Explore arity variants (3/5/11/13) by altering neighborhood sampling or mediator cardinality.

---

## Closing

**The Universe is the Universal Computer—and the simulation it is running.**  
In PhaseCube terms: one relational grammar, self-hosting through partial closure, with objects as metastable knots that rerun the same game inside themselves.
