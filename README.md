<p align="center">
  <a href="README_CN.md">中文</a> | <b>English</b>
</p>

<p align="center">
  <img src="assets/posim_logo.png" alt="POSIM Logo" width="600">
</p>

<h3 align="center">POSIM — A Multi-Agent Simulation Framework for Social Media Public Opinion Evolution and Governance</h3>

<p align="center">
  <em>"All models are wrong, but some are useful." — George E. P. Box</em>
</p>

<p align="center">
  <a href="https://www.python.org/downloads/"><img src="https://img.shields.io/badge/python-3.8+-blue.svg" alt="Python 3.8+"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT"></a>
  <a href="https://pytorch.org/"><img src="https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg" alt="PyTorch"></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/LLM-OpenAI_Compatible-412991.svg" alt="LLM"></a>
</p>

---

<h2 align="center">
  🌐 <a href="https://DeepCogLab.github.io/posim/">https://DeepCogLab.github.io/posim/</a> 🌐
</h2>

<p align="center">
  <a href="https://DeepCogLab.github.io/posim/">
    <img src="https://img.shields.io/badge/🏠_Project_Homepage-DeepCogLab.github.io/posim-blue?style=for-the-badge&logoColor=white" alt="Project Homepage">
  </a>
</p>

<p align="center">
  📄 <a href="#">Paper (under review)</a> &nbsp;|&nbsp;
  🌐 <a href="https://DeepCogLab.github.io/posim/">Homepage</a> &nbsp;|&nbsp;
  🐛 <a href="https://github.com/DeepCogLab/posim/issues">Issues</a>
</p>

---

## 📖 Table of Contents

- [💡 Why POSIM?](#-why-posim)
- [✨ Key Contributions](#-key-contributions)
- [🏗️ Framework Overview](#%EF%B8%8F-framework-overview)
- [🧠 Social-BDI Agent Architecture](#-social-bdi-agent-architecture)
- [🌍 Simulation Environment](#-simulation-environment)
- [🧪 Strategy Evaluation](#-strategy-evaluation)
- [🛡️ Three-Tier Progressive Validation](#%EF%B8%8F-three-tier-progressive-validation)
- [💾 Datasets](#-datasets)
- [📊 Experimental Results](#-experimental-results)
- [🌳 Project Structure](#-project-structure)
- [⚙️ Installation](#%EF%B8%8F-installation)
- [🚀 Quick Start](#-quick-start)
- [🔌 Extension Guide](#-extension-guide)
- [📄 License](#-license)
- [🚧 Online System — Coming Soon](#-online-system--coming-soon)

---

## 💡 Why POSIM?

A single breaking event can sweep across social networks within hours — thousands of users flood comment sections, emotions escalate through repost chains, and a single opinion leader's post can reshape public discourse. Understanding and anticipating these complex collective dynamics is of critical value for social governance, crisis response, and public policy.

However, real-world social experiments face fundamental challenges of ethical constraints and irreproducibility. Traditional computational simulation methods — whether epidemic models, threshold cascade models, or classic agent-based modeling (ABM) — each have strengths, but share a common bottleneck: **they cannot explicitly model individual cognitive processes**. Rule-driven agents can neither perceive complex environmental information nor simulate emotional evolution, motivational reasoning, and autonomous decision-making.

Recent breakthroughs in large language models (LLMs) bring new possibilities — semantic understanding, contextual reasoning, and autonomous decision-making enable simulation agents to truly "understand" events and make human-like decisions. Yet most existing work treats LLMs as end-to-end behavior generators without explicitly modeling intermediate cognitive states, leaving behavioral mechanisms opaque in long-horizon simulations.

**POSIM** (**P**ublic **O**pinion **Sim**ulator) is designed to address these challenges.

| **Platform** | **Explicit Cognitive Modeling** | **Validation (M/P/S)** | **Real-Case Intervention** | **LLM Multi-Type Agents** | **Temporal Precision** | **Modular Design** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| S3 | ✗ | ✗/✓/✓ | ✗ | ✗ | ★★★ | ★★★ |
| HiSim | ✗ | ✗/✗/✓ | ✗ | ✗ | ★★ | ★★ |
| GA-S3 | ✗ | ✗/✗/✓ | ✗ | ✓ | ★★★ | ★★ |
| SPARK | ✗ | ✗/✓/✗ | ✗ | ✓ | ★★ | ★★ |
| FDE-LLM | ✗ | ✗/✗/✓ | ✗ | ✗ | ★★ | ★★ |
| TrendSim | ✗ | ✓/✗/✗ | ✗ | ✓ | ★★★★ | ★★★ |
| OASIS | ✗ | ✗/✓/✓ | ✗ | ✗ | ★★★★ | ★★★★ |
| LMAgent | ✗ | ✗/✗/✓ | ✗ | ✓ | ★★ | ★★ |
| **POSIM (Ours)** | **✓** | **✓/✓/✓** | **✓** | **✓** | **★★★★★** | **★★★★★** |

> *M = Mechanism validation; P = Phenomenon validation; S = Statistical validation.*

---

## ✨ Key Contributions

1. 🧠 **Social-BDI Agent Architecture** — Embeds LLMs within a layered cognitive framework (Perception → Belief → Desire → Intention → Action), incorporating emotional arousal and cognitive biases. Three cognitive subsystems are each powered by independent LLM calls, communicating through structured intermediate states. The entire behavioral generation process is fully traceable — no longer a "prompt in, answer out" black box.

2. ⏱️ **Hawkes Process-Driven Simulation Environment** — A Hawkes self-exciting point process unifies exogenous event shocks (breaking news, official statements) with endogenous user interactions (the snowball effect of reposts and comments), coupled with circadian rhythm modulation, reproducing non-stationary "outbreak–sustain–decay" activity patterns at minute-level temporal resolution.

3. 🛡️ **Three-Tier Progressive Validation Framework** — Drawing on classical V&V principles from simulation engineering, validation progresses from individual behavioral mechanism calibration → collective phenomenon emergence calibration → statistical result consistency calibration, establishing simulation credibility layer by layer.

4. 🔌 **Highly Decoupled Modular Architecture** — Agents, simulation environment, and strategy evaluation communicate through standard interfaces and can be independently replaced — swap the cognitive architecture, change the temporal engine, or add new evaluation metrics without touching other modules.

---

## 🏗️ Framework Overview

<p align="center">
  <img src="assets/framework_overview.png" alt="POSIM Framework Overview" width="95%">
</p>
<p align="center"><b>Figure 1.</b> Overall architecture of POSIM. The Social-BDI agent architecture implements the cognitive pipeline (left); the Hawkes-based temporal engine and virtual social media platform form the simulation environment (center-top); the strategy evaluation module supports counterfactual governance assessment (right-bottom).</p>

POSIM comprises three core components working in concert:

> **(1) Social-BDI Agents** — Built on the BDI cognitive architecture with emotional arousal and cognitive biases, generating multi-type agents (ordinary users, opinion leaders, media accounts, governments) from real user data and LLM-driven structured interviews. Each agent maintains a complete cognitive state from role identity beliefs to real-time emotional arousal.
>
> **(2) Simulation Environment** — The Hawkes self-exciting point process temporal engine controls agent activation timing; the virtual social media platform provides personalized recommendations, social networks, and trending topics, forming the virtual world where agents perceive and interact.
>
> **(3) Strategy Evaluation** — Intervenor, Simulator, and Evaluator modules work together, supporting event injection, node control, and platform policy interventions. Checkpoint callback generates parallel evolution trajectories for counterfactual reasoning.

---

## 🧠 Social-BDI Agent Architecture

Traditional reactive agents are merely stateless behavior generators — given an input, producing an output, with no insight into the intermediate process. POSIM takes a fundamentally different approach: building on the classic BDI cognitive architecture, it integrates emotional arousal and cognitive biases to construct agents with **explicit cognitive states** and an **auditable multi-stage decision chain**. The cognitive pipeline is formalized as:

$$
\text{Perception}(P_t) \;\to\; \text{Belief}(B_t) \;\to\; \text{Desire}(D_t) \;\to\; \text{Intention}(I_t) \;\to\; \text{Action}(A_t)
$$

### 💭 Belief Subsystem — How Agents "Understand the World"

Psychological research shows that different cognitive layers have different stability — core personality traits are highly stable in the short term, while immediate emotions change rapidly with information input. Based on this cognitive stratification, POSIM designs a four-layer hierarchical belief system:

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │  B^id  — Role Identity Belief     Gender, region, occupation, fans   │  ← Fixed (personality anchor)
  │  B^psy — Psychological Cognition  Conformity, prejudice, catharsis   │  ← Highly stable
  │  B^evt — Event Opinion Belief     Stance & reasoning per actor       │  ← Evolves with new information
  │  B^emo — Emotional Arousal        [happy, sad, angry, fear, ...]     │  ← Real-time fluctuation
  └──────────────────────────────────────────────────────────────────────┘
                              ▲  Modification difficulty decreasing  ▼
```

Key design highlights:

- **Psychological cognition initialization** — Based on analysis of real public opinion events, representative psychological patterns are identified (self-actualization, curiosity-seeking, cathartic venting, anti-authority resentment, bandwagon conformity), each containing ~30 cognitive entries distilled from real data. During initialization, an LLM matches the best-fitting profile based on each user's historical behavior.
- **Event opinion extraction** — LLM-driven structured interviews, with each opinion stored as a structured quadruple $\langle t, \text{subject}, \text{opinion}, \text{reason} \rangle$.
- **Three-mechanism emotion dynamics** — Temporal decay ($\mathbf{e}(t) = \mathbf{e}(t_0) \cdot e^{-\lambda_e(t-t_0)}$), content stimulation, and social contagion among neighbors ($(1-\rho) \cdot \mathbf{e}_i + \rho \cdot \bar{\mathbf{e}}_{\text{neighbor}}$).
- **Explicit cognitive bias injection** — Confirmation bias, anchoring effects, affect-driven reasoning, and simplistic attribution tendencies are injected during belief updates via prompts, simulating systematic biases in real user cognition.

### 🎯 Desire Subsystem — What Agents "Want to Do"

Social media users' participation motivations are highly diverse — some vent anger, some seek information, some simply follow the crowd. The desire subsystem leverages LLM commonsense reasoning to automatically infer behavioral motivations, outputting a weighted motivation list:

> *Emotional catharsis (high)* · *Justice advocacy (medium)* · *Self-expression (low)* · *Information seeking (very low)* · ...

The motivation list constrains downstream intention planning — when emotional catharsis dominates, agents tend toward short comments with intense expression; when information seeking leads, agents are more likely to repost with commentary or publish long-form analysis.

### 🛠️ Intention Subsystem — How Agents "Carry Out Actions"

Unlike traditional single-step behavior generation, the intention subsystem employs a **multi-level chain-of-thought** for progressive decision-making:

```
  L1 — What to do & to whom
    Select from atomic operations (like / repost / repost with comment / short comment /
    long comment / short original / long original), determine interaction target

  L2 — How to express
    Four orthogonal dimensions: Emotion (type + intensity) × Stance (support / oppose / neutral)
    × Style (rational / sarcastic / aggressive / empathetic / questioning)
    × Narrative (factual / labeling / call-to-action / authority citation)

  L3 — What exactly to say
    Constrained by L1 + L2, generate text matching the agent's role characteristics
```

This decomposition provides **explicit strategy constraints** for content generation, preventing the LLM from producing bland, averaged text. Every decision is logged for full traceability.

### 🎭 Four Heterogeneous Agent Types

Real public opinion involves complex interactions among multiple actor types. All four types share the unified Social-BDI pipeline, with behavioral differences arising solely from differentiated role-guiding prompts:

| Type | Role | Behavioral Traits | Typical Manifestation |
| --- | --- | --- | --- |
| 👤 **Ordinary Users** | Primary participants | Colloquial, fragmented, emotion-driven | Impulsive expression under high arousal |
| 🌟 **Opinion Leaders** | Key intermediaries (two-step flow) | Independent views, agenda-setting | Significant influence on downstream beliefs |
| 📰 **Media Accounts** | Information gathering & dissemination | Formal, restrained, timely | Information confirmation & agenda framing |
| 🏛️ **Governments** | Official stance & governance | Low frequency, high authority | Pivotal influence after event escalation |

> Behavioral patterns of all four types are **not preset**, but emerge autonomously through the Social-BDI pipeline constrained by role-guiding prompts.

---

## 🌍 Simulation Environment

### ⏱️ Hawkes Point Process Temporal Engine

Real public opinion activity exhibits highly non-uniform temporal distributions — breaking news can trigger thousands of reposts within minutes, while activity drops sharply during lulls. Conventional fixed-step activation cannot reproduce these event-driven surges.

POSIM adopts a Hawkes self-exciting point process to model collective activity intensity. The core intuition is analogous to "contagion": each event occurrence briefly raises the probability of subsequent events, like a viral post stimulating more participation before the effect decays.

$$
\lambda(t) = \underbrace{\mu}_{\text{Background rate}} + \underbrace{\sum \alpha_{ext} e^{-\beta_{ext}(t - t_i)}}_{\text{Exogenous excitation (strong · slow decay)}} + \underbrace{\sum \alpha_{int} e^{-\beta_{int}(t - t_j)}}_{\text{Endogenous excitation (weak · fast decay)}}
$$

| Parameter | Symbol | Default | Description |
| --- | --- | :---: | --- |
| Background rate | $\mu$ | 0.01 | Baseline posting behavior during opinion lulls |
| Exogenous intensity | $\alpha_{ext}$ | 0.08 | Impact from breaking news, official statements |
| Exogenous decay | $\beta_{ext}$ | 0.005 | Duration of external event influence |
| Endogenous intensity | $\alpha_{int}$ | 0.005 | Snowball effect from user interactions |
| Endogenous decay | $\beta_{int}$ | 0.16 | Short-term interaction stimulus decay |
| Circadian amplitude | $s_{circ}$ | 0.3 | Natural activity drop during late-night hours |

### 📱 Virtual Social Media Platform

After the temporal engine determines which agents are activated, the virtual platform determines **what they see** and **what attracts them**:

- 🔗 **Social Network** — Three-layer directed structure: follower network (static infrastructure), real-time repost network, and real-time comment network (growing dynamically during simulation).

- 📋 **Content Recommendation** — Dual-channel retrieval (relationship + public domain), with three-dimensional weighted scoring:

$$
S_{exp}(u, p) = \alpha \cdot H(u, p) + \beta \cdot P(p) + \gamma \cdot R(p)
$$

> where $H$ = homophily (semantic similarity), $P$ = popularity (engagement signals), $R$ = freshness (time decay). Exploration slots break filter bubbles; a history mechanism prevents repeated exposure. Embedding model: [BGE-small-zh-v1.5](https://huggingface.co/BAAI/bge-small-zh-v1.5) (cosine deduplication threshold 0.92).

- 🔥 **Trending Topics** — Automatically tracks hashtag popularity, combining engagement signals with time decay for periodic ranking updates, simulating the attention-focusing amplification of real trending lists.

---

## 🧪 Strategy Evaluation

POSIM is not just a simulator — it also serves as a **computational experimentation platform** for governance strategy evaluation. Decision-makers often ask: *"If we adopt a certain intervention, how will opinion trajectories change?"*

```
         ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
         │  Intervenor  │  ──→  │  Simulator   │  ──→  │  Evaluator   │
         └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
                │                       │                       │
     ┌──────────┼──────────┐    Checkpoint callback →     Hotness curves
     │          │          │    Parallel trajectories     Sentiment dist.
  Event Queue  Node     Platform   ↓ Counterfactual      Opinion dist.
   Injection  Control   Policy       reasoning            ↓ Multi-dim eval
```

- 🎯 **Intervenor** — Three injection granularities: event queue (e.g., inject official statement), node control (e.g., modify a KOL's belief state), platform policy (e.g., adjust recommendation weights or restrict propagation)
- 🔄 **Simulator** — Checkpoint callback periodically saves complete state snapshots; load from any checkpoint with different interventions to generate parallel evolution trajectories for counterfactual comparison
- 📊 **Evaluator** — Fully decoupled from the simulation engine; reads simulation logs through standard interfaces for multi-dimensional quantitative assessment

---

## 🛡️ Three-Tier Progressive Validation

Drawing on classical V&V (Verification & Validation) principles from simulation engineering, POSIM establishes a progressive validation framework spanning **mechanism → phenomenon → statistics**:

```
  ╔═══════════════════════════════════════════════════╗
  ║  Tier 1: Individual Behavioral Mechanism           ║  ← "Have we built the model correctly?"
  ║  · Cognitive-behavior chain consistency (0–5)      ║
  ║  · Personality stability (0–1)                     ║
  ║  · Decision robustness (0–1)                       ║
  ╠═══════════════════════════════════════════════════╣
  ║  Tier 2: Collective Phenomenon Emergence           ║  ← Do micro mechanisms spontaneously
  ║  · Public opinion lifecycle                        ║    produce theory-predicted macro patterns?
  ║  · Multi-agent behavioral heterogeneity            ║
  ║  · Emotional arousal & polarization                ║
  ║  · Scale-free topology & cascade power law         ║
  ╠═══════════════════════════════════════════════════╣
  ║  Tier 3: Statistical Result Consistency            ║  ← "Are the model's results accurate?"
  ║  · Behavior layer: 3 metrics                       ║
  ║  · Content layer: 3 metrics                        ║
  ║  · Topology layer: 3 metrics                       ║
  ╚═══════════════════════════════════════════════════╝
```

The third tier covers **9 quantitative metrics** across behavior, content, and topology:

| Layer | Metric | Description |
| --- | --- | --- |
| **Behavior** | BType JSD ↓ | Jensen-Shannon divergence of action type distributions |
| | Act. ρ ↑ | Pearson correlation of behavioral hotness curves |
| | Act. RMSE ↓ | Root mean squared error of hotness curves |
| **Content** | Irrat. Sim. ↑ | Discourse irrationality distribution similarity (irrational / rational / neutral) |
| | \|ΔTTR\| ↓ | Lexical diversity deviation (Type-Token Ratio) |
| | \|ΔS̄\| ↓ | Group sentiment mean deviation |
| **Topology** | Net. Sim. ↑ | Interaction network topological feature similarity |
| | Casc. Sim. ↑ | Information cascade size distribution similarity |
| | Casc. PL ↑ | Cascade power-law exponent proximity |

---

## 💾 Datasets

Experiments are based on three representative public opinion events collected from the Sina Weibo platform, spanning social controversy, campus incident, and food safety categories. Simulation temporal resolution: **10 minutes/step**.

| Event | Code | Category | #Users | #Posts | Duration | #Steps |
| --- | :---: | --- | :---: | :---: | :---: | :---: |
| **Luxury Earring** — Jewelry worn by a public figure identified as luxury item | LE | Social Controversy | 1,530 | 34,218 | ~46h | 276 |
| **WHU Library** — Reported harassment incident; court verdict reignited discourse | WL | Campus Incident | 1,843 | 51,647 | ~190h | 1,140 |
| **Xibei Prepared Food** — Allegations of prepared food use in restaurant chain | XF | Food Safety | 1,987 | 14,892 | ~71h | 426 |

Data preprocessing pipeline: post ID deduplication → low-activity user filtering (posts < 2) → advertisement & spam removal → irrelevant content filtering → content quality filtering (original ≥ 20 chars, repost/comment ≥ 10 chars) → timestamp normalization to minute-level. Agent beliefs are initialized from each user's historical posts before the simulation start time, sequentially constructing role identity, psychological cognition, event opinion, and initial emotion to form a complete personalized Social-BDI belief system.

### ⚠️ Ethical Statement & Data Access

> **This study is conducted purely as data-driven scientific research aimed at advancing computational methods for public opinion simulation. All events are analyzed based entirely on publicly available data, and the authors hold no opinions, judgments, or positions regarding any events, individuals, or organizations involved. All descriptions present only publicly documented facts without expressing or implying any evaluative stance. The simulation framework is intended exclusively for academic research and methodological validation.**

📌 **About the data**: All datasets are collected from publicly available posts on the Sina Weibo platform. Due to the sensitive nature of social media data involving real users' public expressions, and in accordance with responsible data sharing principles, we do **not** provide open downloads or an apply-and-download mechanism.

- 📧 If you are interested in the **experimental datasets** (preprocessed simulation-ready data) for academic research purposes, please contact us via email to discuss access.
- 📧 If you need the **full-scale raw data** (original crawled data before preprocessing), please contact us via email for further discussion on data sharing agreements.

**Contact**: 📮 **15939048354@163.com**

---

## 📊 Experimental Results

### 🔬 Individual Behavioral Mechanism Calibration

We randomly sample $N=500$ users as agents and run $T=12$ rounds. All methods operate under identical conditions:

| Method | Cognitive-Behavior Chain Consistency (0–5) ↑ | Personality Stability (0–1) ↑ | Decision Robustness (0–1) ↑ |
| --- | :---: | :---: | :---: |
| Direct-Nothink (Qwen2.5-7B-Instruct) | 1.47 ± 0.50 | 0.478 ± 0.263 | 0.629 ± 0.240 |
| Direct-Think (Qwen3-8B) | 1.75 ± 0.43 | 0.448 ± 0.269 | 0.603 ± 0.299 |
| CoT (single-call serialized reasoning) | 3.09 ± 0.29 | 0.516 ± 0.272 | 0.541 ± 0.356 |
| **Social-BDI (Ours)** | **4.64 ± 0.48** | **0.661 ± 0.215** | **0.695 ± 0.213** |

> 💡 **Key insight**: CoT's decision robustness (0.541) is the lowest among all methods — serialized reasoning in a single call lacks stable state anchoring, and input perturbations propagate through the entire reasoning chain. Social-BDI's explicit belief states and desire subsystem provide effective cognitive grounding — even under equivalent input perturbations, stable belief states serve as consistent decision anchors.

### 🌊 Emergent Collective Phenomena

All macroscopic phenomena below emerge **spontaneously** from agent interactions — they are **not** driven by preset rules.

<p align="center">
  <img src="assets/fig_lifecycle_paper.png" alt="Opinion Lifecycle" width="80%">
</p>
<p align="center"><b>Figure 2.</b> Simulated public opinion lifecycle: posting volume (bars, left axis) and cumulative posting S-curve (solid line, right axis). E₁–E₇ mark exogenous event injection points.</p>

- 🎢 **Public Opinion Lifecycle** — The simulation clearly exhibits multi-phase evolution from outbreak through plateau and resurgence to decay, with each phase transition traceable to specific exogenous events. The cumulative posting percentage follows an S-curve consistent with diffusion theory.
- 👥 **Multi-Agent Behavioral Heterogeneity** — Ordinary users and opinion leaders maintain high emotional arousal (avg. 0.645 / 0.603); media and government agents stay in the low-arousal range, showing a "public emotionality, official neutrality" stratification.
- ⚡ **Emotional Polarization** — High-arousal emotion ratio reaches 73.5%; comment-chain emotion consistency 0.772; escalation/de-escalation ratio 4.78 (significant ratchet effect). Polarization index rises from 0.41 → 0.67 (63% increase, $p < 0.001$).
- 🕸️ **Scale-Free Topology & Cascade Power Law** — Degree distribution power-law exponent $\gamma = 1.87$ (within the 1.5–3 range of real social networks); cascade size CCDF exponent $\alpha = 3.70$, confirming the "most posts go unnoticed, a few go viral" long-tail phenomenon.

### ⚖️ Statistical Calibration Results

<p align="center">
  <img src="assets/fig_three_event_calibration.png" alt="Calibration Results" width="80%">
</p>
<p align="center"><b>Figure 3.</b> Behavioral hotness and distribution calibration across three events. Left: simulated vs. real hotness curves; Right: action type proportion comparisons.</p>

**Behavior Layer** (average scores, higher = better)

| Dataset | Rule-based ABM | POSIM w/ Direct LLM | POSIM w/ CoT | **POSIM (Ours)** |
| --- | :---: | :---: | :---: | :---: |
| LE | 0.741 | 0.783 | 0.754 | **0.821** |
| WL | 0.746 | 0.789 | 0.800 | **0.853** |
| XF | 0.721 | 0.746 | 0.742 | **0.804** |

**Content Layer** (average scores, higher = better)

| Dataset | POSIM w/ Direct LLM | POSIM w/ CoT | **POSIM (Ours)** |
| --- | :---: | :---: | :---: |
| LE | 0.680 | 0.774 | **0.910** |
| WL | 0.640 | 0.673 | **0.876** |
| XF | 0.858 | 0.875 | **0.926** |

**Topology Layer** (average scores, higher = better)

| Dataset | Rule-based ABM | POSIM w/ Direct LLM | POSIM w/ CoT | **POSIM (Ours)** |
| --- | :---: | :---: | :---: | :---: |
| LE | 0.552 | 0.739 | 0.763 | **0.896** |
| WL | 0.736 | 0.592 | 0.784 | **0.858** |
| XF | 0.474 | 0.650 | 0.641 | **0.698** |

> 📈 **Overall**: POSIM's behavior, content, and topology metrics improve by **5.0%**, **13.0%**, and **8.5%** respectively over the best baselines across all three datasets.

### 🔍 Governance-Oriented Case Studies

**Cognitive Priming Experiment** — Rational cognition priming (RC) reduces negative emotion ratio from 0.844 to 0.571 (32.3% reduction) with a clear threshold effect beyond 60% coverage. The most theoretically significant finding is the **empathy paradox**: empathy priming (EP) *increases* negative sentiment (0.878 vs. 0.844 control), showing a reverse dose-response effect. Empathetic understanding heightens sensitivity to others' suffering, which through Social-BDI's cognitive pipeline and social contagion mechanisms, amplifies cascading negative sentiment diffusion.

**Counterfactual Strategy Evaluation** — Consumer Dialogue (CD) yields the best crisis response (NER 0.744), followed by Swift Early Apology (SEA, 0.749) and Proactive Transparency (PT, 0.773); Strategic Silence (SS) performs worst (0.831), confirming that silence is not optimal in crisis communication.

---

## 🌳 Project Structure

```
posim/
├── posim/                                 # Core Framework
│   ├── agents/                            # Agent Module
│   │   ├── base_agent.py                  # Base agent (cognitive pipeline scheduling)
│   │   ├── citizen_agent.py               # Ordinary user agent
│   │   ├── kol_agent.py                   # Opinion leader agent
│   │   ├── media_agent.py                 # Media agent
│   │   ├── government_agent.py            # Government agent
│   │   └── ebdi/                          # Social-BDI Cognitive Architecture
│   │       ├── belief/                    # Belief Subsystem
│   │       │   ├── belief_system.py       # Belief system orchestrator
│   │       │   ├── belief_updater.py      # LLM-driven belief update
│   │       │   ├── emotion_belief.py      # Emotional arousal belief
│   │       │   ├── event_belief.py        # Event opinion belief
│   │       │   ├── identity_belief.py     # Role identity belief
│   │       │   └── psychological_belief.py # Psychological cognition belief
│   │       ├── desire/                    # Desire Subsystem
│   │       │   ├── desire_system.py       # Motivation inference engine
│   │       │   └── desire_types.py        # Predefined motivation types
│   │       ├── intention/                 # Intention Subsystem
│   │       │   ├── __init__.py
│   │       │   └── intention_system.py    # Multi-level chain-of-thought planning
│   │       └── memory/                    # Streaming Memory
│   │           ├── memory_retrieval.py    # Recency-relevance retrieval scoring
│   │           └── stream_memory.py       # Time-decayed memory store
│   ├── config/                            # Configuration
│   │   ├── config_manager.py              # Configuration loader
│   │   └── config_schema.py              # Dataclass configuration schema
│   ├── data/                              # Data Management
│   │   ├── data_loader.py                 # Data loading utilities
│   │   └── preprocessor.py               # Data preprocessing
│   ├── engine/                            # Simulation Engine
│   │   ├── simulator.py                   # Main simulation loop (async concurrent)
│   │   ├── hawkes_process.py              # Hawkes self-exciting point process
│   │   └── time_engine.py                # Temporal engine (circadian modulation)
│   ├── environment/                       # Simulation Environment
│   │   ├── recommendation.py              # Dual-channel content recommendation
│   │   ├── social_network.py              # Three-layer directed social network
│   │   ├── hot_search.py                  # Trending topics
│   │   └── event_queue.py                # External event queue
│   ├── evaluation/                        # Evaluation Framework
│   │   ├── __init__.py
│   │   ├── base.py                        # Base evaluator class
│   │   ├── data_loader.py                 # Evaluation data loader
│   │   ├── evaluator_manager.py           # Evaluation orchestrator
│   │   ├── utils.py                       # Evaluation utilities
│   │   ├── visualization.py               # Visualization tools
│   │   ├── calibration/                   # Statistical Calibration
│   │   │   ├── __init__.py
│   │   │   ├── behavior.py               # Behavior layer (JSD, ρ, RMSE)
│   │   │   ├── emotion.py                # Emotion calibration
│   │   │   ├── hotness.py                # Hotness curve calibration
│   │   │   ├── network.py                # Network topology & cascade
│   │   │   ├── opinion_index.py          # Discourse irrationality index
│   │   │   └── topic.py                  # Topic analysis
│   │   └── mechanism/                     # Phenomenon Emergence Validation
│   │       ├── __init__.py
│   │       ├── agent_behavior.py          # Agent behavior analysis
│   │       ├── lifecycle.py               # Opinion lifecycle analysis
│   │       ├── macro_phenomenon.py        # Macro phenomenon validation
│   │       ├── opinion_polarization.py    # Polarization analysis
│   │       └── propagation_structure.py   # Cascade & network structure
│   ├── llm/                               # LLM Resource Management
│   │   ├── api_pool.py                    # Multi-endpoint pool (load balancing, failover)
│   │   └── llm_client.py                 # Unified LLM call client
│   ├── prompts/                           # Prompt Templates (per agent type)
│   │   ├── prompt_loader.py               # Dynamic prompt loader
│   │   ├── ablation_prompts.py            # Ablation experiment prompts
│   │   ├── citizen_prompts/               # Ordinary user prompts
│   │   │   ├── belief_prompts.py
│   │   │   ├── desire_prompts.py
│   │   │   └── intention_prompts.py
│   │   ├── kol_prompts/                   # Opinion leader prompts
│   │   │   ├── belief_prompts.py
│   │   │   ├── desire_prompts.py
│   │   │   └── intention_prompts.py
│   │   ├── media_prompts/                 # Media prompts
│   │   │   ├── belief_prompts.py
│   │   │   ├── desire_prompts.py
│   │   │   └── intention_prompts.py
│   │   └── government_prompts/            # Government prompts
│   │       ├── belief_prompts.py
│   │       ├── desire_prompts.py
│   │       └── intention_prompts.py
│   └── storage/                           # Data Storage
│       ├── database.py                    # SQLite database
│       └── log_manager.py                # Simulation logging
├── scripts/                               # Simulation & Evaluation Scripts
│   ├── tianjiaerhuan/                     # LE — Luxury Earring Event
│   │   ├── run_with_monitor.py            # Run simulation with live monitoring
│   │   └── evaluate.py                   # Run evaluation pipeline
│   ├── wudatushuguan/                     # WL — WHU Library Event
│   │   ├── run_with_monitor.py
│   │   ├── evaluate.py
│   │   └── visualize_network.py          # Network visualization
│   └── xibeiyuzhicai/                     # XF — Xibei Prepared Food Event
│       ├── run_with_monitor.py
│       └── evaluate.py
├── docs/                                  # Project Homepage (GitHub Pages)
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── assets/                                # Static Resources (logo, figures)
└── requirements.txt                       # Python dependencies
```

---

## ⚙️ Installation

### 💻 System Requirements

| Item | Minimum | Recommended |
| --- | --- | --- |
| Python | ≥ 3.8 | 3.10 |
| CUDA | — | ≥ 11.0 (local embedding acceleration) |
| RAM | 16 GB | 32 GB+ (large-scale simulation) |
| GPU | — | Recommended (sentence-transformers acceleration) |

### 📦 Setup

```bash
git clone https://github.com/DeepCogLab/posim.git
cd posim

# Recommended: use conda
conda create -n posim python=3.10
conda activate posim

pip install -r requirements.txt
```

### 📚 Dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `numpy` | ≥ 1.24.0 | Numerical computation, Hawkes process intensity sampling |
| `openai` | ≥ 1.0.0 | LLM API calls (compatible with any OpenAI-format service) |
| `pydantic` | ≥ 2.0.0 | Configuration validation & structured data management |
| `sentence-transformers` | ≥ 2.2.0 | Semantic embeddings (recommendation, deduplication, memory) |
| `torch` | ≥ 2.0.0 | Deep learning backend (embedding model inference) |
| `matplotlib` | ≥ 3.7.0 | Evaluation visualization |
| `neo4j` | ≥ 5.0.0 | Graph database for social networks (optional) |
| `websockets` | ≥ 12.0 | Real-time simulation monitoring |

---

## 🚀 Quick Start

### 1️⃣ Configure LLM

POSIM supports **any OpenAI-compatible API service**. Here are common options:

#### 🔹 Option A: SiliconFlow (Recommended for Chinese scenarios)

[SiliconFlow](https://siliconflow.cn/) provides cost-effective access to open-source LLMs (Qwen, DeepSeek, etc.) with an OpenAI-compatible API interface.

1. Sign up at [siliconflow.cn](https://siliconflow.cn/) and obtain your API key
2. Configure the endpoint in your simulation config:

```json
{
  "llm": {
    "max_concurrent_requests": 30,
    "use_local_embedding_model": true,
    "local_embedding_model_path": "path/to/bge-small-zh-v1.5",
    "embedding_dimension": 512,
    "embedding_device": "cuda",
    "llm_api_configs": [
      {
        "name": "siliconflow-qwen",
        "enabled": true,
        "base_url": "https://api.siliconflow.cn/v1/",
        "api_key": "sk-your-siliconflow-api-key",
        "model": "Qwen/Qwen2.5-14B-Instruct",
        "temperature": 0.7,
        "top_p": 0.9,
        "weight": 1.0
      }
    ]
  }
}
```

#### 🔹 Option B: Local Deployment (vLLM)

```json
{
  "base_url": "http://localhost:8000/v1/",
  "api_key": "not-needed",
  "model": "Qwen/Qwen2.5-14B-Instruct"
}
```

#### 🔹 Option C: OpenAI / Other Providers

```json
{
  "base_url": "https://api.openai.com/v1/",
  "api_key": "sk-your-openai-key",
  "model": "gpt-4o-mini"
}
```

> 💡 **Multi-endpoint support**: The framework manages multiple LLM endpoints through a unified API pool with round-robin load balancing, per-usage-type model routing (belief/desire/intention), concurrency control, and automatic failover. To prevent output homogenization, sampling parameters are randomly perturbed on each call.

### 2️⃣ Prepare Data

Each simulation scenario requires four data files:

| File | Contents |
| --- | --- |
| `users.json` | User profiles (ID, nickname, gender, followers, verification type, description, historical behavior summary) |
| `events.json` | External event sequence (injection time, event description, impact intensity) |
| `initial_posts.json` | Initial post data (content, author, timestamp, type, keywords) |
| `relations.json` | User follow relationships |

### 3️⃣ Run Simulation

```bash
python scripts/tianjiaerhuan/run_with_monitor.py
```

Simulation flow: Load user data → Initialize Social-BDI belief system → Build social network & recommendation system → Start Hawkes temporal engine → Execute cognitive pipeline per step (recommendation → belief → desire → intention, async concurrent) → Emotion contagion → Update trending → Record trajectory. Supports WebSocket real-time monitoring dashboard.

### 4️⃣ Evaluate

```bash
python scripts/tianjiaerhuan/evaluate.py
```

Evaluation outputs are saved to `vis_results/`, including behavior calibration, hotness calibration, emotion calibration, discourse irrationality calibration, network topology calibration visualizations, and a comprehensive `evaluation_report.json`.

<details>
<summary><b>📋 Full Configuration Parameters</b></summary>

| Parameter | Description | Default |
| --- | --- | :---: |
| `time_granularity` | Simulation time step (minutes) | 10 |
| `hawkes_mu` | Hawkes background rate | 0.01 |
| `hawkes_internal.alpha` | Endogenous excitation intensity | 0.005 |
| `hawkes_internal.beta` | Endogenous decay rate | 0.16 |
| `hawkes_external.alpha` | Exogenous excitation intensity | 0.08 |
| `hawkes_external.beta` | Exogenous decay rate | 0.005 |
| `total_scale` | Activity scaling factor | 2000 |
| `circadian_strength` | Circadian rhythm modulation strength | 0.3 |
| `recommend_count` | Recommended items per step | 10 |
| `comment_count` | Displayed comments per post | 5 |
| `homophily_weight` | Recommendation homophily weight | 0.3 |
| `popularity_weight` | Recommendation popularity weight | 0.3 |
| `recency_weight` | Recommendation freshness weight | 0.4 |
| `exploration_rate` | Recommendation exploration rate | 0.2 |
| `relation_weight` | Relationship channel weight | 0.5 |
| `hot_search_update_interval` | Trending update interval (minutes) | 15 |

</details>

---

## 🔌 Extension Guide

Thanks to the highly decoupled modular design, POSIM's core components can be independently replaced and extended through standard interfaces.

<details>
<summary><b>➕ Add a New Agent Type</b></summary>

1. Inherit `BaseAgent` in `posim/agents/` to create a new class
2. Create corresponding role prompt templates in `posim/prompts/` (belief / desire / intention)
3. Register the new type in the simulation configuration

</details>

<details>
<summary><b>🔄 Replace the Cognitive Architecture</b></summary>

The three Social-BDI subsystems communicate through structured intermediate states and can be independently replaced:

- Belief subsystem: `posim/agents/ebdi/belief/`
- Desire subsystem: `posim/agents/ebdi/desire/`
- Intention subsystem: `posim/agents/ebdi/intention/`

Simply maintain the same input/output format.

</details>

<details>
<summary><b>⏱️ Switch the Temporal Engine</b></summary>

Implement a new temporal engine module in `posim/engine/`, following the same intensity computation and agent sampling interface.

</details>

<details>
<summary><b>📊 Add Evaluation Metrics</b></summary>

Add a new evaluator class in `posim/evaluation/calibration/` or `posim/evaluation/mechanism/`, and register it in `evaluator_manager.py`.

</details>

<details>
<summary><b>🔗 Connect a New LLM Service</b></summary>

Simply add a new endpoint in the `llm_api_configs` configuration — the framework uses a unified OpenAI-compatible interface, no code changes needed. Supports local vLLM deployments, SiliconFlow, OpenAI, and other cloud API services.

</details>

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 🚧 Online System — Coming Soon

🔥 **A full-featured online public opinion simulation system is under active development!** The system will provide an end-to-end pipeline covering **public opinion sensing → analysis → simulation & forecasting**, enabling researchers and practitioners to conduct computational experiments directly from a web interface.

If you are interested in this project and would like to contribute to its development, we warmly welcome you to join us! Feel free to reach out via email: **15939048354@163.com**

<p align="center">
  <img src="assets/system_prototype_1.png" alt="System Prototype 1" width="420">&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/system_prototype_2.png" alt="System Prototype 2" width="420">
</p>
<p align="center"><em>🖼️ Early-stage system demo prototypes — the official system is coming soon, stay tuned!</em></p>

---

<p align="center">
  <i>Questions or suggestions? Feel free to open an <a href="https://github.com/DeepCogLab/posim/issues">Issue</a> 💬</i>
</p>
