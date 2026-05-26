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
- [✨ Key Features](#-key-features)
- [🏗️ Framework Overview](#%EF%B8%8F-framework-overview)
- [⚙️ Installation](#%EF%B8%8F-installation)
- [🚀 Quick Start](#-quick-start)
- [🔌 Extension Guide](#-extension-guide)
- [💾 Datasets & Ethics](#-datasets--ethics)
- [📄 License](#-license)
- [🚧 Online System — Coming Soon](#-online-system--coming-soon)

---

## 💡 Why POSIM?

Public opinion events on social media — from consumer disputes to public safety incidents — can escalate from a local discussion to a nationwide trending topic within hours. Thousands of users flood comment sections, emotions intensify through repost chains, and a single opinion leader's post can reshape the entire discourse. For government agencies, media organizations, and platform operators, understanding how public opinion forms, evolves, and can be guided is of critical practical importance.

However, conducting real-world social experiments on these dynamics faces fundamental challenges: ethical constraints prevent deliberate manipulation of public discourse, and each event is unique and irreproducible. This is where **computational simulation** becomes invaluable — it provides a virtual laboratory where researchers can replay, analyze, and experiment with public opinion scenarios in a controlled environment.

Traditional simulation approaches — epidemic models, threshold cascade models, and classic agent-based modeling (ABM) — each capture certain aspects of opinion dynamics, but share a critical limitation: **they cannot explicitly model individual cognitive processes**. Agents in these systems are rule-driven automatons that neither understand the content they encounter nor reason about their responses. Large language models (LLMs) offer a breakthrough with semantic understanding and human-like reasoning, yet most existing LLM-based simulations treat the model as a black-box behavior generator — prompt in, action out — without modeling the intermediate cognitive states that drive real human behavior.

**POSIM** (**P**ublic **O**pinion **Sim**ulator) bridges this gap. By embedding LLMs within a structured cognitive architecture (Social-BDI), POSIM creates agents that:

- **Maintain explicit belief states** — each agent tracks its identity, psychological traits, event opinions, and emotional arousal as structured, inspectable data
- **Produce fully traceable decisions** — every action can be traced back through the intention → desire → belief chain that produced it
- **Exhibit emergent collective behaviors** — opinion lifecycle patterns, emotional polarization, and cascade power laws arise spontaneously from individual agent interactions, without being programmed in

POSIM is designed for researchers studying computational social science, public opinion dynamics, crisis communication, and LLM-based multi-agent systems. It can also serve as a decision-support tool for evaluating governance strategies through counterfactual simulation.

---

## ✨ Key Features

- 🧠 **Social-BDI Agent Architecture** — LLMs embedded in a layered cognitive framework (Perception → Belief → Desire → Intention → Action) with emotional arousal and cognitive biases. Three cognitive subsystems powered by independent LLM calls, fully traceable decision chains.

- ⏱️ **Hawkes Process-Driven Temporal Engine** — Hawkes self-exciting point process unifying exogenous event shocks and endogenous user interactions with circadian rhythm modulation, reproducing realistic "outbreak–sustain–decay" activity patterns at minute-level resolution.

- 🛡️ **Three-Tier Progressive Validation** — From individual behavioral mechanism calibration → collective phenomenon emergence → statistical consistency, establishing simulation credibility layer by layer.

- 🔌 **Highly Decoupled Modular Architecture** — Agents, environment, and evaluation modules communicate through standard interfaces — swap the cognitive architecture, temporal engine, or evaluation metrics independently.

---

## 🏗️ Framework Overview

<p align="center">
  <img src="assets/framework_overview.png" alt="POSIM Framework Overview" width="95%">
</p>
<p align="center"><b>Figure 1.</b> Overall architecture of POSIM.</p>

POSIM comprises three core components:

> **(1) Social-BDI Agents** — Four-layer hierarchical belief system (identity → psychology → event opinion → emotion), LLM-driven desire inference, and multi-level chain-of-thought intention planning. Four heterogeneous agent types (ordinary users, opinion leaders, media, governments) share the unified cognitive pipeline.
>
> **(2) Simulation Environment** — Hawkes point process temporal engine for non-stationary activation; virtual social media platform with personalized recommendation, three-layer social networks, and trending topics.
>
> **(3) Strategy Evaluation** — Intervenor (event injection, node control, platform policy), Simulator (checkpoint-based counterfactual trajectories), and Evaluator (multi-dimensional quantitative assessment across behavior, content, and topology layers).

### 🎭 Four Heterogeneous Agent Types

| Type | Role | Behavioral Traits | Typical Manifestation |
| --- | --- | --- | --- |
| 👤 **Ordinary Users** | Primary participants | Colloquial, fragmented, emotion-driven | Impulsive expression under high arousal |
| 🌟 **Opinion Leaders** | Key intermediaries (two-step flow) | Independent views, agenda-setting | Significant influence on downstream beliefs |
| 📰 **Media Accounts** | Information gathering & dissemination | Formal, restrained, timely | Information confirmation & agenda framing |
| 🏛️ **Governments** | Official stance & governance | Low frequency, high authority | Pivotal influence after event escalation |

> All behavioral patterns emerge autonomously through the Social-BDI pipeline — they are **not** preset by rules.

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

### 📚 Core Dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `numpy` | ≥ 1.24.0 | Numerical computation, Hawkes process sampling |
| `openai` | ≥ 1.0.0 | LLM API calls (OpenAI-compatible interface) |
| `pydantic` | ≥ 2.0.0 | Configuration validation & structured data |
| `sentence-transformers` | ≥ 2.2.0 | Semantic embeddings (recommendation, dedup, memory) |
| `torch` | ≥ 2.0.0 | Deep learning backend (embedding inference) |
| `matplotlib` | ≥ 3.7.0 | Evaluation visualization |
| `neo4j` | ≥ 5.0.0 | Social network graph database (optional) |
| `websockets` | ≥ 12.0 | Real-time simulation monitoring |

---

## 🚀 Quick Start

### 1️⃣ Configure LLM

POSIM supports **any OpenAI-compatible API service**. Configure the LLM endpoint in your simulation config file (e.g., `scripts/tianjiaerhuan/config.json`):

#### 🔹 Option A: Local Deployment (vLLM / Ollama)

Deploy a model locally using [vLLM](https://github.com/vllm-project/vllm), [Ollama](https://ollama.com/), or any OpenAI-compatible local server:

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
        "name": "local-qwen",
        "enabled": true,
        "base_url": "http://localhost:8000/v1/",
        "api_key": "not-needed",
        "model": "Qwen/Qwen2.5-14B-Instruct",
        "temperature": 0.7,
        "top_p": 0.9,
        "weight": 1.0
      }
    ]
  }
}
```

#### 🔹 Option B: Cloud API Service

Use any cloud provider that offers an OpenAI-compatible API (OpenAI, DeepSeek, etc.):

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
        "name": "cloud-api",
        "enabled": true,
        "base_url": "https://api.your-provider.com/v1/",
        "api_key": "sk-your-api-key",
        "model": "your-model-name",
        "temperature": 0.7,
        "top_p": 0.9,
        "weight": 1.0
      }
    ]
  }
}
```

> 💡 **Multi-endpoint support**: Configure multiple endpoints in `llm_api_configs` — the framework manages them through a unified API pool with round-robin load balancing, per-purpose model routing (belief/desire/intention), concurrency control, and automatic failover.

### 2️⃣ Prepare Data

Each simulation scenario requires four data files under `scripts/<event>/data/`. You can prepare your own data following the formats below.

#### `users.json` — User Profiles

A JSON array of user objects. Each user contains identity, behavior tendency, initial emotion, and cognitive descriptions generated from their historical data.

```json
[
  {
    "user_id": "1234567890",
    "username": "example_user",
    "agent_type": "citizen",
    "followers_count": 323,
    "following_count": 840,
    "posts_count": 6069,
    "verified": false,
    "description": "User bio text",
    "raw_profile": {
      "gender": "男",
      "location": "北京",
      "verified_type": "普通用户",
      "register_time": "2018-01-01 00:00:00"
    },
    "behavior_tendency": {
      "repost": 1,
      "long_comment": 1,
      "like": 3
    },
    "emotion_vector": {
      "happiness": 0.0, "sadness": 0.0, "anger": 0.0,
      "fear": 0.0, "surprise": 0.0, "disgust": 0.0
    },
    "history_posts": [],
    "identity_description": "A text summary of the user's identity and behavioral patterns.",
    "psychological_beliefs": [
      "Belief statement 1 about the user's values and tendencies.",
      "Belief statement 2 ..."
    ],
    "event_opinions": [
      {
        "time": "2025-01-01T12:00",
        "subject": "Event name",
        "opinion": "User's initial opinion on the event.",
        "reason": "Why the user holds this opinion."
      }
    ]
  }
]
```

| Field | Required | Description |
| --- | :---: | --- |
| `user_id` | ✅ | Unique user identifier |
| `username` | ✅ | Display name |
| `agent_type` | ✅ | One of `citizen`, `kol`, `media`, `government` |
| `followers_count` / `following_count` / `posts_count` | ✅ | Basic social metrics |
| `verified` | ✅ | Whether the user is verified |
| `raw_profile` | ✅ | Gender, location, verification type, register time |
| `behavior_tendency` | ✅ | Relative weights for `repost`, `long_comment`, `like` |
| `emotion_vector` | ✅ | Initial 6-dimensional emotion (all 0.0 if neutral) |
| `identity_description` | ✅ | LLM-generated summary of the user's identity |
| `psychological_beliefs` | ✅ | List of belief statements about the user's psychology |
| `event_opinions` | ✅ | Initial opinions on the event being simulated |

#### `events.json` — External Event Sequence

A JSON array of event objects injected during the simulation. Two types: `global_broadcast` (platform-wide events) and `node_post` (specific user posts that trigger discussion).

```json
[
  {
    "time": "2025-01-02T09:00",
    "type": "global_broadcast",
    "source": ["external"],
    "topic": "Event topic title",
    "content": "Detailed description of what happened.",
    "influence": 1.0,
    "metadata": {
      "original_tags": ["tag1", "tag2"],
      "group_name": "Event group name",
      "reason": "Why this event matters."
    }
  },
  {
    "time": "2025-01-02T12:00",
    "type": "node_post",
    "source": ["1234567890"],
    "topic": "Discussion topic",
    "content": "Content of the key post.",
    "influence": 1.0,
    "metadata": {
      "trigger_type": "Opinion leader post",
      "selection_reason": "Why this post is important."
    },
    "source_post": {
      "user_id": "1234567890",
      "username": "key_user",
      "agent_type": "citizen",
      "time": "2025-01-02T12:00:00",
      "content": "Original post content",
      "reposts": 100, "comments": 50, "likes": 500,
      "tags": ["tag1"]
    }
  }
]
```

#### `initial_posts.json` — Seed Posts

A JSON array of initial posts/comments/reposts that populate the platform before simulation starts.

```json
[
  {
    "type": "comment",
    "author": "username",
    "author_id": "1234567890",
    "content": "Comment text",
    "raw_content": "Original unprocessed text",
    "time": "2025-01-01 10:00:00",
    "level": 1,
    "replied_to_user": null,
    "replied_to_content": "",
    "original_post_content": "The post being commented on",
    "original_post_url": "http://...",
    "url": "http://...",
    "sensitivity": "非敏感",
    "keywords": "keyword1,keyword2"
  },
  {
    "type": "repost",
    "author": "username",
    "author_id": "1234567890",
    "user_content": "Repost comment",
    "time": "2025-01-01 11:00:00",
    "root_author": "original_author",
    "root_content": "Original post content",
    "root_time": "2025-01-01 10:00:00",
    "repost_chain": [{"author": "...", "content": "...", "level": 0}],
    "sensitivity": "非敏感",
    "keywords": "keyword1"
  }
]
```

#### `relations.json` — Social Network

A JSON array of follow relationships between users.

```json
[
  {
    "follower_id": "1111111111",
    "following_id": "2222222222",
    "relation_type": "follow",
    "timestamp": 1746878497
  }
]
```

> 💡 **Tips for preparing your own data**: The `identity_description`, `psychological_beliefs`, and `event_opinions` fields in `users.json` can be generated by prompting an LLM with the user's profile and historical posts. The `events.json` should capture the key external events that drive the public opinion lifecycle. `initial_posts.json` provides the seed content that agents will see at the start of the simulation.

### 3️⃣ Run Simulation

```bash
python scripts/tianjiaerhuan/run_with_monitor.py
```

**Simulation pipeline:**
1. **Initialization** — Load user profiles, build Social-BDI belief system for each agent (identity → psychological cognition → event opinions → initial emotion), construct social networks and recommendation system
2. **Per-step execution** — Hawkes temporal engine determines activated agents → personalized content recommendation → belief update (LLM) → desire inference (LLM) → intention planning (LLM) → action execution, all running with async concurrency
3. **Post-step processing** — Emotion contagion among social neighbors, trending topic updates, new post indexing into recommendation pool, simulation state logging

**Real-time monitoring**: The simulation starts a WebSocket server that pushes live data to a browser-based monitoring dashboard (`posim/web/monitor.html`). You can observe agent activation counts, posting activity, emotion distributions, and trending topics in real time.

**Simulation outputs** are saved to the `output/` directory under each event script folder, including:
- `simulation.db` — Full simulation database (all posts, agent states, network evolution)
- `simulation_log.json` — Structured log of every agent's cognitive state and action per step
- Agent belief trajectories, emotion curves, and interaction records

### 4️⃣ Evaluate

```bash
python scripts/tianjiaerhuan/evaluate.py
```

The evaluation framework reads simulation outputs and compares them against real-world data across multiple dimensions:

- **Behavior layer** — Action type distribution (JSD), activity hotness curve correlation, hotness RMSE
- **Content layer** — Discourse irrationality distribution, lexical diversity (TTR), group sentiment deviation
- **Topology layer** — Network topological similarity, cascade size distribution, power-law exponent

Results are saved to `vis_results/`, including calibration charts, distribution comparisons, and a comprehensive `evaluation_report.json` with all quantitative metrics.

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

Simply add a new endpoint in the `llm_api_configs` configuration — the framework uses a unified OpenAI-compatible interface, no code changes needed. Supports local deployments (vLLM, Ollama), OpenAI, and other cloud API services.

</details>

---

## 💾 Datasets & Ethics

Experiments are based on three representative public opinion events collected from the Sina Weibo platform:

| Event | Code | Category | #Users | #Posts | Duration |
| --- | :---: | --- | :---: | :---: | :---: |
| **Luxury Earring** — Jewelry worn by a public figure identified as luxury item | LE | Social Controversy | 1,530 | 34,218 | ~46h |
| **WHU Library** — Reported harassment incident; court verdict reignited discourse | WL | Campus Incident | 1,843 | 51,647 | ~190h |
| **Xibei Prepared Food** — Allegations of prepared food use in restaurant chain | XF | Food Safety | 1,987 | 14,892 | ~71h |

### ⚠️ Ethical Statement & Data Access

> **This study is conducted purely as data-driven scientific research. All events are analyzed based entirely on publicly available data, and the authors hold no opinions or positions regarding any events, individuals, or organizations involved. The simulation framework is intended exclusively for academic research and methodological validation.**

📌 All datasets are collected from publicly available posts on Sina Weibo. Due to the sensitive nature of social media data, we do **not** provide open downloads. For academic research access, please contact: 📮 **15939048354@163.com**

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
