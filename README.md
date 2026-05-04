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
  📄 <a href="#">Paper (Under Review)</a> &nbsp;|&nbsp;
  🌐 <a href="https://DeepCogLab.github.io/posim/">Homepage</a> &nbsp;|&nbsp;
  🐛 <a href="https://github.com/DeepCogLab/posim/issues">Issues</a>
</p>

---

## 📖 Table of Contents

- [💡 Why POSIM?](#-why-posim)
- [✨ Key Contributions](#-key-contributions)
- [🏗️ Framework Overview](#%EF%B8%8F-framework-overview)
- [ Datasets](#-datasets)
- [📊 Experimental Highlights](#-experimental-highlights)
- [🌳 Project Structure](#-project-structure)
- [⚙️ Installation](#%EF%B8%8F-installation)
- [🚀 Quick Start](#-quick-start)
- [🔌 Extension Guide](#-extension-guide)
- [📄 License](#-license)
- [🚧 Online System — Coming Soon](#-online-system--coming-soon)

---

## 💡 Why POSIM?

Real-world social experiments face fundamental challenges of ethical constraints and irreproducibility. Traditional simulation methods — epidemic models, threshold cascades, or classic ABM — share a common bottleneck: **they cannot explicitly model individual cognitive processes**. While LLMs bring new possibilities, most existing work treats them as end-to-end behavior generators without modeling intermediate cognitive states, leaving behavioral mechanisms opaque.

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

## 💾 Datasets

Experiments are based on three representative public opinion events collected from the Sina Weibo platform, spanning social controversy, campus incident, and food safety categories. Simulation temporal resolution: **10 minutes/step**.

| Event | Code | Category | #Users | #Posts | Duration | #Steps |
| --- | :---: | --- | :---: | :---: | :---: | :---: |
| **Luxury Earring** — Jewelry worn by a public figure identified as luxury item | LE | Social Controversy | 1,530 | 34,218 | ~46h | 276 |
| **WHU Library** — Reported harassment incident; court verdict reignited discourse | WL | Campus Incident | 1,843 | 51,647 | ~190h | 1,140 |
| **Xibei Prepared Food** — Allegations of prepared food use in restaurant chain | XF | Food Safety | 1,987 | 14,892 | ~71h | 426 |

### ⚠️ Ethical Statement & Data Access

> **This study is conducted purely as data-driven scientific research aimed at advancing computational methods for public opinion simulation. All events are analyzed based entirely on publicly available data, and the authors hold no opinions, judgments, or positions regarding any events, individuals, or organizations involved. The simulation framework is intended exclusively for academic research and methodological validation.**

📌 **About the data**: All datasets are collected from publicly available posts on the Sina Weibo platform. Due to the sensitive nature of social media data, we do **not** provide open downloads.

- 📧 For **experimental datasets** or **raw data** access for academic research, please contact us via email.

**Contact**: 📮 **15939048354@163.com**

---

## 📊 Experimental Highlights

### 🔬 Individual Behavioral Mechanism Calibration

| Method | Cognitive-Behavior Chain Consistency (0–5) ↑ | Personality Stability (0–1) ↑ | Decision Robustness (0–1) ↑ |
| --- | :---: | :---: | :---: |
| Direct-Nothink (Qwen2.5-7B-Instruct) | 1.47 ± 0.50 | 0.478 ± 0.263 | 0.629 ± 0.240 |
| Direct-Think (Qwen3-8B) | 1.75 ± 0.43 | 0.448 ± 0.269 | 0.603 ± 0.299 |
| CoT (single-call serialized reasoning) | 3.09 ± 0.29 | 0.516 ± 0.272 | 0.541 ± 0.356 |
| **Social-BDI (Ours)** | **4.64 ± 0.48** | **0.661 ± 0.215** | **0.695 ± 0.213** |

### 🌊 Emergent Collective Phenomena

All macroscopic phenomena below emerge **spontaneously** from agent interactions — they are **not** driven by preset rules.

<p align="center">
  <img src="assets/fig_lifecycle_paper.png" alt="Opinion Lifecycle" width="80%">
</p>
<p align="center"><b>Figure 2.</b> Simulated public opinion lifecycle with E₁–E₇ marking exogenous event injection points.</p>

- 🎢 **Public Opinion Lifecycle** — Multi-phase evolution from outbreak through resurgence to decay, with S-curve cumulative posting consistent with diffusion theory.
- 👥 **Behavioral Heterogeneity** — "Public emotionality, official neutrality" stratification: users/KOLs at high arousal (0.645/0.603), media/government at low arousal.
- ⚡ **Emotional Polarization** — Polarization index rises from 0.41 → 0.67 (63% increase, $p < 0.001$).
- 🕸️ **Scale-Free Topology** — Degree distribution power-law exponent $\gamma = 1.87$; cascade CCDF exponent $\alpha = 3.70$.

### ⚖️ Statistical Calibration

<p align="center">
  <img src="assets/fig_three_event_calibration.png" alt="Calibration Results" width="80%">
</p>

> 📈 **Overall**: POSIM's behavior, content, and topology metrics improve by **5.0%**, **13.0%**, and **8.5%** respectively over the best baselines across all three datasets.

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
│   │       ├── belief/                    # Belief Subsystem (4-layer hierarchical)
│   │       ├── desire/                    # Desire Subsystem (motivation inference)
│   │       ├── intention/                 # Intention Subsystem (multi-level CoT)
│   │       └── memory/                    # Streaming Memory (recency-relevance)
│   ├── config/                            # Configuration (loader + schema)
│   ├── data/                              # Data Management (loader + preprocessor)
│   ├── engine/                            # Simulation Engine
│   │   ├── simulator.py                   # Main simulation loop (async concurrent)
│   │   ├── hawkes_process.py              # Hawkes self-exciting point process
│   │   └── time_engine.py                 # Temporal engine (circadian modulation)
│   ├── environment/                       # Simulation Environment
│   │   ├── recommendation.py              # Dual-channel content recommendation
│   │   ├── social_network.py              # Three-layer directed social network
│   │   ├── hot_search.py                  # Trending topics
│   │   └── event_queue.py                 # External event queue
│   ├── evaluation/                        # Evaluation Framework
│   │   ├── calibration/                   # Statistical Calibration (behavior, content, topology)
│   │   └── mechanism/                     # Phenomenon Emergence Validation
│   ├── llm/                               # LLM Resource Management
│   │   ├── api_pool.py                    # Multi-endpoint pool (load balancing, failover)
│   │   └── llm_client.py                  # Unified LLM call client
│   ├── prompts/                           # Prompt Templates (per agent type)
│   ├── storage/                           # Data Storage (SQLite + logging)
│   └── utils/                             # Utility Helpers
├── scripts/                               # Simulation & Evaluation Scripts
│   ├── tianjiaerhuan/                     # LE — Luxury Earring Event
│   ├── wudatushuguan/                     # WL — WHU Library Event
│   └── xibeiyuzhicai/                     # XF — Xibei Prepared Food Event
├── docs/                                  # Project Homepage (GitHub Pages)
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
