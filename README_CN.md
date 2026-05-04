<p align="center">
  <b>中文</b> | <a href="README.md">English</a>
</p>

<p align="center">
  <img src="assets/posim_logo.png" alt="POSIM Logo" width="600">
</p>

<h3 align="center">POSIM — 面向社交媒体舆情演化与治理的多智能体仿真框架</h3>

<p align="center">
  <em>"所有模型都是错误的，但其中一些是有用的。" — George E. P. Box</em>
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
    <img src="https://img.shields.io/badge/🏠_项目主页-DeepCogLab.github.io/posim-blue?style=for-the-badge&logoColor=white" alt="项目主页">
  </a>
</p>

<p align="center">
  📄 <a href="#">论文（审稿中）</a>  | 
  🌐 <a href="https://DeepCogLab.github.io/posim/">主页</a>  | 
  🐛 <a href="https://github.com/DeepCogLab/posim/issues">Issues</a>
</p>

---

## 📖 目录

- [💡 为什么选择 POSIM？](#-为什么选择-posim)
- [✨ 核心特性](#-核心特性)
- [🏗️ 框架总览](#%EF%B8%8F-框架总览)
- [⚙️ 安装配置](#%EF%B8%8F-安装配置)
- [🚀 快速开始](#-快速开始)
- [🔌 扩展指南](#-扩展指南)
- [💾 数据集与伦理声明](#-数据集与伦理声明)
- [📄 许可证](#-许可证)
- [🚧 在线系统 — 敬请期待](#-在线系统--敬请期待)

---

## 💡 为什么选择 POSIM？

社交媒体上的舆情事件——从消费纠纷到公共安全事件——可以在数小时内从局部讨论升级为全网热搜。成千上万用户涌入评论区，情绪在转发链条中不断升级，一位意见领袖的一条帖子就能重塑整个公共话语。对于政府机构、媒体组织和平台运营者而言，理解舆情如何形成、演化和引导，具有重要的实践意义。

然而，对这些动态进行真实社会实验面临根本性挑战：伦理约束阻止了对公共话语的刻意操控，每个事件都是独一无二且不可复现的。这正是**计算仿真**的价值所在——它提供了一个虚拟实验室，让研究者能够在可控环境中回放、分析和实验舆情场景。

传统仿真方法——传染病模型、阈值级联模型和经典基于智能体的建模（ABM）——各自捕捉了舆论动态的某些方面，但共同存在一个关键局限：**无法显式建模个体认知过程**。这些系统中的智能体是规则驱动的自动机，既不理解其接触的内容，也不会对其回应进行推理。大语言模型（LLM）带来了突破——语义理解和类人推理能力，但现有基于 LLM 的仿真方案大多将模型作为黑箱行为生成器——输入提示词、输出动作——未建模驱动真实人类行为的中间认知状态。

**POSIM**（**P**ublic **O**pinion **Sim**ulator，舆情仿真器）填补了这一空白。通过将 LLM 嵌入结构化认知架构（Social-BDI），POSIM 创建的智能体能够：

- **维护显式信念状态** — 每个智能体跟踪其身份、心理特质、事件观点和情绪激发等结构化、可检视的数据
- **产生完全可追溯的决策** — 每个行为都可以通过意图 → 欲望 → 信念链追溯到产生它的原因
- **展现涌现的集体行为** — 舆论生命周期模式、情绪极化和级联幂律从个体智能体交互中自发涌现，而非预设规则

POSIM 面向计算社会科学、舆情动力学、危机传播和基于 LLM 的多智能体系统的研究者。同时也可作为通过反事实仿真评估治理策略的决策支持工具。

---

## ✨ 核心特性

- 🧠 **Social-BDI 智能体架构** — 将 LLM 嵌入分层认知框架（感知 → 信念 → 欲望 → 意图 → 行为），融合情绪激发和认知偏差。三个认知子系统各由独立 LLM 调用驱动，行为决策链完全可追溯。
- ⏱️ **Hawkes 过程驱动时间引擎** — Hawkes 自激点过程统一外生事件冲击与内生用户交互，结合昼夜节律调制，以分钟级分辨率再现"爆发-持续-衰退"活跃模式。
- 🛡️ **三层递进验证** — 从个体行为机制校准 → 群体现象涌现 → 统计结果一致性，逐层建立仿真可信度。
- 🔌 **高度解耦模块化架构** — 智能体、仿真环境和评估模块通过标准接口通信——可独立替换认知架构、时间引擎或评估指标。

---

## 🏗️ 框架总览

<p align="center">
  <img src="assets/framework_overview.png" alt="POSIM 框架总览" width="95%">
</p>
<p align="center"><b>图 1.</b> POSIM 总体架构。</p>

POSIM 由三大核心组件构成：

> **（1）Social-BDI 智能体** — 四层层次化信念系统（身份 → 心理 → 事件观点 → 情绪），LLM 驱动的欲望推理，以及多层级思维链意图规划。四种异质智能体类型（普通用户、意见领袖、媒体、政府）共享统一认知管线。
>
> **（2）仿真环境** — Hawkes 点过程时间引擎实现非平稳激活；虚拟社交媒体平台提供个性化推荐、三层社交网络和热搜话题。
>
> **（3）策略评估** — 干预器（事件注入、节点控制、平台策略）、仿真器（基于检查点的反事实轨迹）和评估器（跨行为、内容、拓扑三层的多维定量评估）。

### 🎭 四种异质智能体类型

| 类型                 | 角色                 | 行为特征                 | 典型表现               |
| -------------------- | -------------------- | ------------------------ | ---------------------- |
| 👤**普通用户** | 主要参与者           | 口语化、碎片化、情绪驱动 | 高激发下的冲动表达     |
| 🌟**意见领袖** | 关键中介（两级传播） | 独立见解、议程设置       | 显著影响下游用户信念   |
| 📰**媒体账号** | 信息采集与传播       | 正式、克制、及时         | 信息确认与议程框架     |
| 🏛️**政府**   | 官方立场与治理       | 低频但高权威             | 事件升级后产生关键影响 |

> 四种类型的行为模式**不是预设的**，而是通过 Social-BDI 管线自主涌现的。

---

## ⚙️ 安装配置

### 💻 系统要求

| 项目   | 最低要求 | 推荐配置                           |
| ------ | -------- | ---------------------------------- |
| Python | ≥ 3.8   | 3.10                               |
| CUDA   | —       | ≥ 11.0（本地嵌入加速）            |
| 内存   | 16 GB    | 32 GB+（大规模仿真）               |
| GPU    | —       | 推荐（sentence-transformers 加速） |

### 📦 安装步骤

```bash
git clone https://github.com/DeepCogLab/posim.git
cd posim

# 推荐使用 conda
conda create -n posim python=3.10
conda activate posim

pip install -r requirements.txt
```

### 📚 核心依赖

| 包名                      | 版本      | 用途                            |
| ------------------------- | --------- | ------------------------------- |
| `numpy`                 | ≥ 1.24.0 | 数值计算，Hawkes 过程强度采样   |
| `openai`                | ≥ 1.0.0  | LLM API 调用（OpenAI 兼容接口） |
| `pydantic`              | ≥ 2.0.0  | 配置验证与结构化数据管理        |
| `sentence-transformers` | ≥ 2.2.0  | 语义嵌入（推荐、去重、记忆）    |
| `torch`                 | ≥ 2.0.0  | 深度学习后端（嵌入模型推理）    |
| `matplotlib`            | ≥ 3.7.0  | 评估可视化                      |
| `neo4j`                 | ≥ 5.0.0  | 社交网络图数据库（可选）        |
| `websockets`            | ≥ 12.0   | 实时仿真监控                    |

---

## 🚀 快速开始

### 1️⃣ 配置 LLM

POSIM 支持**任何 OpenAI 兼容的 API 服务**。在仿真配置文件（如 `scripts/tianjiaerhuan/config.json`）中配置 LLM 端点：

#### 🔹 方案 A：本地部署（vLLM / Ollama）

使用 [vLLM](https://github.com/vllm-project/vllm)、[Ollama](https://ollama.com/) 或其他 OpenAI 兼容本地服务部署模型：

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

#### 🔹 方案 B：云端 API 服务

使用任何提供 OpenAI 兼容 API 的云服务商（OpenAI、DeepSeek 等）：

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

> 💡 **多端点支持**：在 `llm_api_configs` 中配置多个端点——框架通过统一 API 池管理，支持轮询负载均衡、按用途模型路由（信念/欲望/意图）、并发控制和自动故障转移。

### 2️⃣ 准备数据

每个仿真场景需要四个数据文件，放置于 `scripts/<event>/data/` 目录下：

| 文件                   | 内容                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `users.json`         | 用户画像（ID、昵称、性别、粉丝数、认证类型、简介、历史行为摘要） |
| `events.json`        | 外部事件序列（注入时间、事件描述、影响强度）                     |
| `initial_posts.json` | 初始帖子数据（内容、作者、时间戳、类型、关键词）                 |
| `relations.json`     | 用户关注关系                                                     |

### 3️⃣ 运行仿真

```bash
python scripts/tianjiaerhuan/run_with_monitor.py
```

**仿真流程：**
1. **初始化** — 加载用户画像，为每个智能体构建 Social-BDI 信念系统（身份 → 心理认知 → 事件观点 → 初始情绪），构建社交网络和推荐系统
2. **每步执行** — Hawkes 时间引擎确定激活智能体 → 个性化内容推荐 → 信念更新（LLM）→ 欲望推理（LLM）→ 意图规划（LLM）→ 行为执行，全程异步并发
3. **步后处理** — 社交邻居间情绪传染、热搜话题更新、新帖子索引入推荐池、仿真状态日志记录

**实时监控**：仿真启动 WebSocket 服务器，将实时数据推送到浏览器监控仪表盘（`posim/web/monitor.html`）。您可以实时观察智能体激活数量、发帖活跃度、情绪分布和热搜话题。

**仿真输出**保存在各事件脚本目录下的 `output/` 目录，包括：
- `simulation.db` — 完整仿真数据库（所有帖子、智能体状态、网络演化）
- `simulation_log.json` — 每步每个智能体认知状态和行为的结构化日志
- 智能体信念轨迹、情绪曲线和交互记录

### 4️⃣ 评估

```bash
python scripts/tianjiaerhuan/evaluate.py
```

评估框架读取仿真输出，与真实数据进行多维度对比：

- **行为层** — 行为类型分布（JSD）、活跃度热度曲线相关性、热度 RMSE
- **内容层** — 话语非理性分布、词汇多样性（TTR）、群体情感偏差
- **拓扑层** — 网络拓扑相似性、级联规模分布、幂律指数

结果保存至 `vis_results/`，包括校准图表、分布对比图，以及包含所有量化指标的综合 `evaluation_report.json`。

<details>
<summary><b>📋 完整配置参数</b></summary>

| 参数                           | 说明                 | 默认值 |
| ------------------------------ | -------------------- | :----: |
| `time_granularity`           | 仿真时间步长（分钟） |   10   |
| `hawkes_mu`                  | Hawkes 背景速率      |  0.01  |
| `hawkes_internal.alpha`      | 内生激发强度         | 0.005 |
| `hawkes_internal.beta`       | 内生衰减速率         |  0.16  |
| `hawkes_external.alpha`      | 外生激发强度         |  0.08  |
| `hawkes_external.beta`       | 外生衰减速率         | 0.005 |
| `total_scale`                | 活跃度缩放因子       |  2000  |
| `circadian_strength`         | 昼夜节律调制强度     |  0.3  |
| `recommend_count`            | 每步推荐数量         |   10   |
| `comment_count`              | 每帖展示评论数       |   5   |
| `homophily_weight`           | 推荐同质性权重       |  0.3  |
| `popularity_weight`          | 推荐热度权重         |  0.3  |
| `recency_weight`             | 推荐新鲜度权重       |  0.4  |
| `exploration_rate`           | 推荐探索率           |  0.2  |
| `relation_weight`            | 关系通道权重         |  0.5  |
| `hot_search_update_interval` | 热搜更新间隔（分钟） |   15   |

</details>

---

## 🔌 扩展指南

得益于高度解耦的模块化设计，POSIM 的核心组件可以通过标准接口独立替换和扩展。

<details>
<summary><b>➕ 添加新智能体类型</b></summary>

1. 在 `posim/agents/` 中继承 `BaseAgent` 创建新类
2. 在 `posim/prompts/` 中创建对应的角色提示模板（信念/欲望/意图）
3. 在仿真配置中注册新类型

</details>

<details>
<summary><b>🔄 替换认知架构</b></summary>

Social-BDI 的三个子系统通过结构化中间状态通信，可以独立替换：

- 信念子系统：`posim/agents/ebdi/belief/`
- 欲望子系统：`posim/agents/ebdi/desire/`
- 意图子系统：`posim/agents/ebdi/intention/`

只需保持相同的输入/输出格式即可。

</details>

<details>
<summary><b>⏱️ 更换时间引擎</b></summary>

在 `posim/engine/` 中实现新的时间引擎模块，遵循相同的强度计算和智能体采样接口。

</details>

<details>
<summary><b>📊 添加评估指标</b></summary>

在 `posim/evaluation/calibration/` 或 `posim/evaluation/mechanism/` 中添加新的评估器类，并在 `evaluator_manager.py` 中注册。

</details>

<details>
<summary><b>🔗 接入新的 LLM 服务</b></summary>

只需在 `llm_api_configs` 配置中添加新端点——框架使用统一的 OpenAI 兼容接口，无需修改代码。支持本地部署（vLLM、Ollama）、OpenAI 及其他云 API 服务。

</details>

---

## 💾 数据集与伦理声明

实验基于三起从新浪微博平台收集的代表性舆情事件：

| 事件                                                   | 代码 | 类别     | 用户数 | 帖子数 | 时长 |
| ------------------------------------------------------ | :--: | -------- | :----: | :----: | :---: |
| **天价耳环** — 公众人物佩戴的珠宝被识别为奢侈品 |  LE  | 社会争议 | 1,530 | 34,218 | ~46h |
| **武大图书馆** — 骚扰事件；法院判决重燃公众讨论 |  WL  | 校园事件 | 1,843 | 51,647 | ~190h |
| **西贝预制菜** — 网红指控知名餐饮连锁使用预制菜 |  XF  | 食品安全 | 1,987 | 14,892 | ~71h |

### ⚠️ 伦理声明与数据获取

> **本研究纯粹作为数据驱动的科学研究。所有事件的分析完全基于公开可用的数据，作者对任何涉及的事件、个人或组织不持有任何意见或立场。该仿真框架仅用于学术研究和方法验证。**

📌 所有数据集均收集自新浪微博平台的公开帖子。由于社交媒体数据涉及真实用户公开表达，我们**不**提供公开下载。如需用于学术研究，请联系：📮 **15939048354@163.com**

---

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

## 🚧 在线系统 — 敬请期待

🔥 **全功能在线舆情仿真系统正在全力开发中！** 系统将提供覆盖**舆情感知 → 分析 → 仿真推演**的端到端流程，使研究人员和实践者能够直接通过 Web 界面进行计算实验。

如果您对本项目感兴趣并希望参与开发，我们热忱欢迎您的加入！请通过邮件联系我们：**15939048354@163.com**

<p align="center">
  <img src="assets/system_prototype_1.png" alt="系统原型 1" width="420">  
  <img src="assets/system_prototype_2.png" alt="系统原型 2" width="420">
</p>
<p align="center"><em>🖼️ 早期系统Demo原型 — 正式系统敬请期待！</em></p>

---

<p align="center">
  <i>有问题或建议？欢迎提交 <a href="https://github.com/DeepCogLab/posim/issues">Issue</a> 💬</i>
</p>
