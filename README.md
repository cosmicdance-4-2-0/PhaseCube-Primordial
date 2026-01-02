PhaseCube Field 0.2.a1
Relational Flux Lattice: A Minimal Event-Driven Substrate for Persistent Structure and Emergent Knot-Objects

Author: Christopher “Kisuul” Lohman (concept origin)
Draft: 0.2.a1 (formal design paper)
Scope: Single-agent proof-of-concept (POC) simulator; browser-runnable; minimal ontology → minimal dynamics.

Abstract

PhaseCube Field is a minimal, event-driven lattice model intended to explore how persistent structure can arise in a substrate constrained to avoid absorbing extremes. The model operates on a binary computational substrate while approximating ternary flux as a process rather than a stored digit. Its guiding ontology treats reality as difference + relation under balance constraints: no privileged global tick; only local “tocks” (events). Stable “objects” arise not as primitive atoms but as metastable knots in relational gradients, formed dynamically at branch/intersect/pinch points. A key conjecture is that once a knot closes over itself, it can host a localized instance of the same relational grammar with new effective degrees of freedom (e.g., charge/spin/phase), enabling force-like behaviors (EM/plasma analogs) as matter effects rather than primitive laws.

1. Intent and Non-Goals
1.1 Intent

Produce persistent macroscopic structure (islands / filaments / webs / voids) with ongoing microscopic motion.

Avoid singularities: no perfect uniform lock (max coherence) and no perfect indistinguishability (null collapse).

Keep a three-layer architecture (Dyad / Triad / Observer) suitable for a single-agent POC.

1.2 Non-Goals

Not a literal physical cosmology claim; this is a modeling lens.

Not a full matter model yet; v0.2 focuses on force-process dynamics and knot formation gates.

Not aiming for quantitative match to EM/plasma; only structural analogies (qualitative).

2. Ontological Postulates (Operationalized)

These are treated as modeling axioms; they are not asserted as empirical truth.

2.1 No global ticks

Physics is defined by local update events; any render cadence is measurement, not fundamental time.

No global ticks. Just infinite recursive tocks.

2.2 No absolute points, no absolute lines

“Entities” are coarse-grained, observer-robust patterns (“clouds”), and “trajectories” are gradients/flows of relation, not primitive geometry.

2.3 Balance constraints (no absorbing extremes)

The system must not converge to either:

perfect coherence (a locked maximal state), nor

perfect cancellation (no distinguishable gradients).

Operationally: the dynamics must include anti-singularity shedding and redistribution.

3. Minimal Layer Stack (POC Constraint)
Layer 1 — Dyad (Difference)

A local published variable representing polarity in a binary substrate.

𝑠
𝑖
∈
{
−
1
,
+
1
}
s
i
	​

∈{−1,+1}

Layer 2 — Triad (Mediation / Metastable Operator)

A local hidden mediator that resolves ambiguity and sustains metastability without global coordination.

Two interchangeable implementations are defined (choose one per run):

Triad A: Local phase bit 
𝑝
𝑖
∈
{
0
,
1
}
p
i
	​

∈{0,1}

Triad B: Local integrator/carrier 
𝑎
𝑖
∈
𝑅
a
i
	​

∈R with 1-bit pulse output (sigma-delta / pulse-density)

Layer 3 — Observer (Intervention / Measurement)

A separate operator that can inject localized constraints/flux and perform measurement transforms. The observer is optional; the closed system must remain active without it.

4. Substrate and Topology
4.1 Lattice

2D grid 
𝑊
×
𝐻
W×H with toroidal wrap (default).

Neighborhood: radius 
𝑟
r (default 
𝑟
=
2
r=2 → 5×5 local context excluding center).

4.2 Update Semantics

Event-driven: at each measurement frame, perform 
𝑁
N local update events on randomly sampled cells.

No global “physics step.” The only ordering is the partial order of events.

Two read/write regimes:

In-place async: each event reads the latest published neighbor values.

Snapshot-per-frame: all events read a snapshot of 
𝑠
s captured at frame start.

Either is acceptable; snapshot mode improves interpretability.

5. Flux in a Binary Substrate

The core practical problem: a binary machine “steps” states; it does not naturally “flux” ternary. PhaseCube treats ternary as emergent measurement rather than stored trit.

5.1 Triad A: Local Phase Bit (minimal carrier hack, localized)

Each cell holds a hidden phase bit 
𝑝
𝑖
p
i
	​

 used only to resolve ambiguous local contexts. Phase can flip under high stress and can optionally diffuse.

Benefits: simple, close to earlier parity designs.

Risk: if global, it becomes nonlocal. v0.2 requires local phase only.

5.2 Triad B: Pulse-Density Carrier (sigma-delta; recommended)

Each cell holds an integrator 
𝑎
𝑖
a
i
	​

 and publishes a 1-bit pulse 
𝑠
𝑖
s
i
	​

. The “ternary” state is read as a local time average.

Publish:

𝑠
𝑖
=
s
i
g
n
(
𝑎
𝑖
)
∈
{
−
1
,
+
1
}
s
i
	​

=sign(a
i
	​

)∈{−1,+1}

Feedback:

𝑎
𝑖
←
𝑎
𝑖
+
Δ
𝑎
−
𝑞
⋅
𝑠
𝑖
a
i
	​

←a
i
	​

+Δa−q⋅s
i
	​


Observation (ternary proxy):

𝑠
ˉ
𝑖
s
ˉ
i
	​

 = low-pass filtered average of 
𝑠
𝑖
s
i
	​


Render as:

𝑠
ˉ
𝑖
>
𝜃
⇒
+
1
s
ˉ
i
	​

>θ⇒+1

𝑠
ˉ
𝑖
<
−
𝜃
⇒
−
1
s
ˉ
i
	​

<−θ⇒−1

else 
0
0

This matches the intended story: ternary flux emerges from binary pulses.

6. Core Local Rule Family

PhaseCube is defined as a family of rules built from:

a neighborhood influence measure,

an ambiguity region,

a curvature/stress measure,

an anti-singularity shedding response.

6.1 Neighborhood influence

Compute at cell 
𝑖
i:

Σ
𝑖
=
∑
𝑗
∈
𝑁
(
𝑖
)
𝑠
𝑗
Σ
i
	​

=∑
j∈N(i)
	​

s
j
	​


Optional structural stats: sign mix, edge density, junction detection.

6.2 Ambiguity region

When influence is weak/competing (i.e., 
Σ
𝑖
Σ
i
	​

 near 0), do not “step” a trit. Use the Triad layer:

Triad A: resolve by local phase 
𝑝
𝑖
p
i
	​


Triad B: let the integrator decide pulse output

6.3 Curvature / singularity proxy

Singularities are forbidden. In PhaseCube, “singularity pressure” is modeled as local curvature/stress rather than “uniformity.” Practical proxies include:

Edge density: how many neighbors disagree with the center.

Junction score: strong presence of both signs in neighborhood plus high edge density.

Integrator stress (Triad B): large 
∣
𝑎
𝑖
∣
∣a
i
	​

∣ under high disagreement indicates stored strain.

6.4 Anti-singularity shedding (must be local and redistributive)

When curvature/stress exceeds threshold, the system must shed and redistribute—it cannot approach a perfect state. “Spin” is treated as one possible shedding channel.

Operational behaviors (choose one or combine lightly):

Redistribute integrator energy: dump portion of 
𝑎
𝑖
a
i
	​

 into neighboring 
𝑎
𝑗
a
j
	​

 along high-gradient directions.

Phase shock: flip 
𝑝
𝑖
p
i
	​

 and propagate a small probability of phase copying outward (a wavefront).

Dipole shedding: emit paired opposite-sign disturbances locally to preserve global neutrality statistically.

This replaces global-parity “kicks” with propagating local relief.

7. Dynamic Knotting and the Matter Boundary
7.1 Matter is not a base state (in v0.2)

The simulator uses matter-like language for intuition, but v0.2 models force-process interactions. Matter is introduced only as an emergent boundary condition at special events.

7.2 Knot formation is dynamic, not spontaneous

Knot creation occurs only at nodal branch/intersect/pinch points that persist.

Define a pinch detector:

high junction score (both signs strongly present)

high curvature/stress

sustained for a minimum persistence count (event-based, no global time required)

This persistence count is a local accumulator:

pinchScore[i] += 1 when pinch holds; decays otherwise.

create a knot when pinchScore[i] > K.

7.3 Knot semantics: partial closure over itself

Once created, a knot is treated as a new entity with backreaction.

Matter is when the process partially closes over itself—running a local instance of the same relational grammar with new effective degrees of freedom (charge/spin/phase).

Interpretation:

the knot no longer obeys the exact same update rule as the open field that formed it;

it introduces new degrees of freedom (internal state) and couples to the external field via backreaction.

8. Recursion: “One Force” Running an Instance of Itself

A central conjecture: the field is a single relational grammar; “forces” like EM/plasma appear as matter effects, i.e., behaviors that only exist once knots exist.

8.1 Knot internal degrees of freedom (minimal)

Each knot maintains an internal mini-state analogous to Dyad/Triad:

k.q ∈ {−1,+1} (charge sign proxy)

k.φ or k.p (spin/phase proxy; can be discrete or continuous)

k.m (strength / coupling radius)

This is the “instance of the game inside the game.”

8.2 Backreaction (external coupling)

Knots influence the outer field locally without “closing it off”:

modify coupling strength near knot (stiffen/soften gradients)

bias ambiguity resolution (local phase bias)

emit rotating pulses (spin shedding channel)

mediate redistribution paths (prefer overlap manifolds)

8.3 EM/plasma analogy (qualitative)

“Charge” manifests as consistent directional bias in the surrounding mediation field.

“Spin” manifests as circulating carrier dynamics (persistent rotational shedding).

“Plasma-like” behavior appears when many knots exist and their backreaction fields overlap.

This is not claimed to match Maxwell/MHD; it is an effective descriptor for emergent interaction patterns.

9. Observer Operator
9.1 Intervention

Observer can locally influence:

Triad A: set/flip local phase 
𝑝
𝑖
p
i
	​


Triad B: add bias to integrator 
𝑎
𝑖
a
i
	​

, or inject dither

This models an agent altering local constraints intentionally (distinct from the closed dynamics).

9.2 Measurement / collapse

“Collapse” is a visualization operator unless explicitly configured to back-react. The model maintains a strict separation unless intentionally violated.

10. Expected Phenomenology

With no observer input:

rapid emergence of macro domains

persistent filaments/webs with active boundaries

avoidance of static absorbing states via shedding

formation of pinch points; occasional knot nucleation (if enabled)

knots backreact, creating long-lived, structured interaction regions

With observer input:

local edits seed or steer pinch formation

effects propagate preferentially along overlap gradients

11. Diagnostics (Minimal, Human-Friendly)

Recommended measures that can be displayed live:

boundary length (edge density)

junction count (pinch candidates)

mean bias (for global drift monitoring)

knot count + knot lifetime distribution

local “temperature” proxy (variance of 
𝑠
ˉ
s
ˉ
 or event-to-event flip rate)

12. Parameterization (POC defaults)

Grid: 120×120 torus

Neighborhood radius: 2

Events per render: 600 (tune per device)

Triad mode: B (sigma-delta) recommended; A supported

Shedding thresholds: tuned to prevent lock-in without exploding noise

Knotting: disabled by default; enabled for “matter boundary” experiments

13. Limitations and Open Questions

Curvature proxy choice: the mapping from local stats to “curvature/stress” is model-dependent.

Shedding dynamics: how to best route redistribution along overlap manifolds remains an experimental design question.

Knot rulebook: defining knot internal dynamics that remain thermodynamically honest (no free energy) is critical.

Layer depth: deeper “odd prime arity” structures are conjectured but intentionally compressed into the Triad layer for this POC.

14. Roadmap (Incremental)

Replace any global carrier/parity with local mediation (Triad A) or pulse-density carrier (Triad B).

Implement curvature-based shedding as redistribution waves (local only).

Add pinchScore and deterministic knot nucleation gates (dynamic, not spontaneous).

Add knot objects with minimal internal state (charge/spin/phase) and backreaction.

Observe whether knot networks reproduce stable higher-level “force” behaviors.

Explore arity variants (3/5/11/13) by altering neighborhood sampling or mediator state cardinality.

Closing Tagline

The Universe is the Universal Computer—and the simulation it is running.
In PhaseCube terms: one relational grammar, self-hosting through partial closure, with objects as metastable knots that rerun the same game inside themselves.
