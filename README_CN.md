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
  📄 <a href="#">论文（审稿中）</a>  | 
  🌐 <a href="https://DeepCogLab.github.io/posim/">主页</a>  | 
  🐛 <a href="https://github.com/DeepCogLab/posim/issues">Issues</a>
</p>

---

## 📖 目录

- [💡 为什么选择 POSIM？](#-为什么选择-posim)
- [✨ 核心贡献](#-核心贡献)
- [🏗️ 框架总览](#%EF%B8%8F-框架总览)
- [💾 数据集](#-数据集)
- [📊 实验亮点](#-实验亮点)
- [🌳 项目结构](#-项目结构)
- [⚙️ 安装配置](#%EF%B8%8F-安装配置)
- [🚀 快速开始](#-快速开始)
- [🔌 扩展指南](#-扩展指南)
- [📄 许可证](#-许可证)
- [🚧 在线系统 — 敬请期待](#-在线系统--敬请期待)

---

## 💡 为什么选择 POSIM？

真实世界的社会实验面临伦理约束和不可复现性的根本挑战。传统仿真方法——传染病模型、阈值级联模型或经典 ABM——共同面临一个瓶颈：**无法显式建模个体的认知过程**。而 LLM 虽然带来了新可能，但现有工作大多将其作为端到端行为生成器，未建模中间认知状态，行为机制不透明。

**POSIM**（**P**ublic **O**pinion **Sim**ulator，舆情仿真器）正是为解决这些挑战而设计的。

| **平台**            | **显式认知建模** | **验证体系 (M/P/S)** | **真实事件干预** | **LLM多类型智能体** |  **时间精度**  | **模块化设计** |
| :------------------------ | :--------------------: | :------------------------: | :--------------------: | :-----------------------: | :------------------: | :------------------: |
| S3                        |           ✗           |          ✗/✓/✓          |           ✗           |            ✗            |        ★★★        |        ★★★        |
| HiSim                     |           ✗           |          ✗/✗/✓          |           ✗           |            ✗            |         ★★         |         ★★         |
| GA-S3                     |           ✗           |          ✗/✗/✓          |           ✗           |            ✓            |        ★★★        |         ★★         |
| SPARK                     |           ✗           |          ✗/✓/✗          |           ✗           |            ✓            |         ★★         |         ★★         |
| FDE-LLM                   |           ✗           |          ✗/✗/✓          |           ✗           |            ✗            |         ★★         |         ★★         |
| TrendSim                  |           ✗           |          ✓/✗/✗          |           ✗           |            ✓            |       ★★★★       |        ★★★        |
| OASIS                     |           ✗           |          ✗/✓/✓          |           ✗           |            ✗            |       ★★★★       |       ★★★★       |
| LMAgent                   |           ✗           |          ✗/✗/✓          |           ✗           |            ✓            |         ★★         |         ★★         |
| **POSIM（本框架）** |      **✓**      |     **✓/✓/✓**     |      **✓**      |       **✓**       | **★★★★★** | **★★★★★** |

> *M = 机制验证；P = 现象验证；S = 统计验证。*

---

## ✨ 核心贡献

1. 🧠 **Social-BDI 智能体架构** — 将 LLM 嵌入分层认知框架（感知 → 信念 → 欲望 → 意图 → 行为），融合情绪激发和认知偏差。三个认知子系统各自由独立 LLM 调用驱动，通过结构化中间状态通信。整个行为生成过程完全可追溯——不再是"提示输入、答案输出"的黑盒。
2. ⏱️ **Hawkes 过程驱动的仿真环境** — Hawkes 自激点过程统一了外生事件冲击（突发新闻、官方声明）与内生用户交互（转发和评论的滚雪球效应），结合昼夜节律调制，以分钟级时间分辨率再现非平稳的"爆发-持续-衰退"活跃模式。
3. 🛡️ **三层递进验证框架** — 借鉴仿真工程经典 V&V 原则，验证从个体行为机制校准 → 群体现象涌现校准 → 统计结果一致性校准逐层递进，逐层建立仿真可信度。
4. 🔌 **高度解耦的模块化架构** — 智能体、仿真环境和策略评估通过标准接口通信，可独立替换——更换认知架构、更换时间引擎或添加新评估指标，无需触及其他模块。

---

## 🏗️ 框架总览

<p align="center">
  <img src="assets/framework_overview.png" alt="POSIM 框架总览" width="95%">
</p>
<p align="center"><b>图 1.</b> POSIM 总体架构。Social-BDI 智能体架构实现认知管线（左）；基于 Hawkes 过程的时间引擎与虚拟社交媒体平台构成仿真环境（中上）；策略评估模块支持反事实治理评估（右下）。</p>

POSIM 由三大核心组件协同工作：

> **（1）Social-BDI 智能体** — 基于 BDI 认知架构融合情绪激发和认知偏差，从真实用户数据和 LLM 驱动的结构化访谈生成多类型智能体（普通用户、意见领袖、媒体账号、政府）。每个智能体维护从角色身份信念到实时情绪激发的完整认知状态。
>
> **（2）仿真环境** — Hawkes 自激点过程时间引擎控制智能体激活时序；虚拟社交媒体平台提供个性化推荐、社交网络和热搜话题，构成智能体感知和交互的虚拟世界。
>
> **（3）策略评估** — 干预器、仿真器和评估器三模块协同工作，支持事件注入、节点控制和平台策略干预。检查点回调生成平行演化轨迹，实现反事实推理。

---

## 💾 数据集

实验基于三起从新浪微博平台收集的代表性舆情事件，涵盖社会争议、校园事件和食品安全三个类别。仿真时间分辨率：**10分钟/步**。

| 事件                                                   | 代码 | 类别     | 用户数 | 帖子数 | 时长 | 步数 |
| ------------------------------------------------------ | :--: | -------- | :----: | :----: | :---: | :---: |
| **天价耳环** — 公众人物佩戴的珠宝被识别为奢侈品 |  LE  | 社会争议 | 1,530 | 34,218 | ~46h |  276  |
| **武大图书馆** — 骚扰事件；法院判决重燃公众讨论 |  WL  | 校园事件 | 1,843 | 51,647 | ~190h | 1,140 |
| **西贝预制菜** — 网红指控知名餐饮连锁使用预制菜 |  XF  | 食品安全 | 1,987 | 14,892 | ~71h |  426  |

### ⚠️ 伦理声明与数据获取

> **本研究纯粹作为数据驱动的科学研究，旨在推进舆情仿真的计算方法。所有事件的分析完全基于公开可用的数据，作者对任何涉及的事件、个人或组织不持有任何意见、判断或立场。该仿真框架仅用于学术研究和方法验证。**

📌 **关于数据**：所有数据集均收集自新浪微博平台的公开帖子。由于数据敏感性，我们**不**提供公开下载。

- 📧 如需获取**实验数据集**或**原始数据**用于学术研究，请通过邮件联系我们。

**联系方式**：📮 **15939048354@163.com**

---

## 📊 实验亮点

### 🔬 个体行为机制校准

| 方法                                 | 认知-行为链一致性 (0–5) ↑ |   人格稳定性 (0–1) ↑   |   决策鲁棒性 (0–1) ↑   |
| ------------------------------------ | :-------------------------: | :----------------------: | :----------------------: |
| Direct-Nothink (Qwen2.5-7B-Instruct) |        1.47 ± 0.50        |      0.478 ± 0.263      |      0.629 ± 0.240      |
| Direct-Think (Qwen3-8B)              |        1.75 ± 0.43        |      0.448 ± 0.269      |      0.603 ± 0.299      |
| CoT（单次调用串行推理）              |        3.09 ± 0.29        |      0.516 ± 0.272      |      0.541 ± 0.356      |
| **Social-BDI（本方法）**       |   **4.64 ± 0.48**   | **0.661 ± 0.215** | **0.695 ± 0.213** |

### 🌊 涌现群体现象

以下所有宏观现象均从智能体交互中**自发涌现**——它们**不是**由预设规则驱动的。

<p align="center">
  <img src="assets/fig_lifecycle_paper.png" alt="舆情生命周期" width="80%">
</p>
<p align="center"><b>图 2.</b> 仿真舆情生命周期，E₁–E₇ 标记外生事件注入点。</p>

- 🎢 **舆情生命周期** — 多阶段演化（爆发→再爆发→衰退），累计发帖呈 S 曲线，符合扩散理论。
- 👥 **行为异质性** — “公众情绪化、官方中性化”分层：用户/KOL 高激发（0.645/0.603），媒体/政府低激发。
- ⚡ **情绪极化** — 极化指数从 0.41 → 0.67（增幅 63%，$p < 0.001$）。
- 🕸️ **无标度拓扑** — 度分布幂律指数 $\gamma = 1.87$；级联 CCDF 指数 $\alpha = 3.70$。

### ⚖️ 统计校准

<p align="center">
  <img src="assets/fig_three_event_calibration.png" alt="校准结果" width="80%">
</p>

> 📈 **总体表现**：POSIM 在三个数据集上的行为、内容和拓扑指标分别比最优基线提升了 **5.0%**、**13.0%** 和 **8.5%**。

---

## 🌳 项目结构

```
posim/
├── posim/                                 # 核心框架
│   ├── agents/                            # 智能体模块
│   │   ├── base_agent.py                  # 基础智能体（认知管线调度）
│   │   ├── citizen_agent.py               # 普通用户智能体
│   │   ├── kol_agent.py                   # 意见领袖智能体
│   │   ├── media_agent.py                 # 媒体智能体
│   │   ├── government_agent.py            # 政府智能体
│   │   └── ebdi/                          # Social-BDI 认知架构
│   │       ├── belief/                    # 信念子系统（四层层次化）
│   │       ├── desire/                    # 欲望子系统（动机推理）
│   │       ├── intention/                 # 意图子系统（多层级思维链）
│   │       └── memory/                    # 流式记忆（近因-相关性）
│   ├── config/                            # 配置管理（加载器 + 模式）
│   ├── data/                              # 数据管理（加载 + 预处理）
│   ├── engine/                            # 仿真引擎
│   │   ├── simulator.py                   # 主仿真循环（异步并发）
│   │   ├── hawkes_process.py              # Hawkes 自激点过程
│   │   └── time_engine.py                 # 时间引擎（昼夜节律调制）
│   ├── environment/                       # 仿真环境
│   │   ├── recommendation.py              # 双通道内容推荐
│   │   ├── social_network.py              # 三层有向社交网络
│   │   ├── hot_search.py                  # 热搜话题
│   │   └── event_queue.py                 # 外部事件队列
│   ├── evaluation/                        # 评估框架
│   │   ├── calibration/                   # 统计校准（行为、内容、拓扑）
│   │   └── mechanism/                     # 现象涌现验证
│   ├── llm/                               # LLM 资源管理
│   │   ├── api_pool.py                    # 多端点池（负载均衡、故障转移）
│   │   └── llm_client.py                  # 统一 LLM 调用客户端
│   ├── prompts/                           # 提示模板（按智能体类型）
│   ├── storage/                           # 数据存储（SQLite + 日志）
│   └── utils/                             # 工具函数
├── scripts/                               # 仿真与评估脚本
│   ├── tianjiaerhuan/                     # LE — 天价耳环事件
│   ├── wudatushuguan/                     # WL — 武大图书馆事件
│   └── xibeiyuzhicai/                     # XF — 西贝预制菜事件
├── docs/                                  # 项目主页（GitHub Pages）
├── assets/                                # 静态资源（logo、论文图表）
└── requirements.txt                       # Python 依赖
```

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

### 📚 依赖说明

| 包名                      | 版本      | 用途                                     |
| ------------------------- | --------- | ---------------------------------------- |
| `numpy`                 | ≥ 1.24.0 | 数值计算，Hawkes 过程强度采样            |
| `openai`                | ≥ 1.0.0  | LLM API 调用（兼容任何 OpenAI 格式服务） |
| `pydantic`              | ≥ 2.0.0  | 配置验证与结构化数据管理                 |
| `sentence-transformers` | ≥ 2.2.0  | 语义嵌入（推荐、去重、记忆）             |
| `torch`                 | ≥ 2.0.0  | 深度学习后端（嵌入模型推理）             |
| `matplotlib`            | ≥ 3.7.0  | 评估可视化                               |
| `neo4j`                 | ≥ 5.0.0  | 社交网络图数据库（可选）                 |
| `websockets`            | ≥ 12.0   | 实时仿真监控                             |

---

## 🚀 快速开始

### 1️⃣ 配置 LLM

POSIM 支持**任何 OpenAI 兼容的 API 服务**。以下是常用选项：

#### 🔹 方案 A：硅基流动 SiliconFlow（中文场景推荐）

[硅基流动](https://siliconflow.cn/) 提供高性价比的开源 LLM 访问（Qwen、DeepSeek 等），具有 OpenAI 兼容的 API 接口。

1. 在 [siliconflow.cn](https://siliconflow.cn/) 注册并获取 API Key
2. 在仿真配置中配置端点：

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

#### 🔹 方案 B：本地部署（vLLM）

```json
{
  "base_url": "http://localhost:8000/v1/",
  "api_key": "not-needed",
  "model": "Qwen/Qwen2.5-14B-Instruct"
}
```

#### 🔹 方案 C：OpenAI / 其他服务商

```json
{
  "base_url": "https://api.openai.com/v1/",
  "api_key": "sk-your-openai-key",
  "model": "gpt-4o-mini"
}
```

> 💡 **多端点支持**：框架通过统一 API 池管理多个 LLM 端点，支持轮询负载均衡、按用途模型路由（信念/欲望/意图）、并发控制和自动故障转移。为防止输出同质化，每次调用对采样参数进行随机扰动。

### 2️⃣ 准备数据

每个仿真场景需要四个数据文件：

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

仿真流程：加载用户数据 → 初始化 Social-BDI 信念系统 → 构建社交网络与推荐系统 → 启动 Hawkes 时间引擎 → 每步执行认知管线（推荐→信念→欲望→意图，异步并发）→ 情绪传染 → 更新热搜 → 记录轨迹。支持 WebSocket 实时监控仪表盘。

### 4️⃣ 评估

```bash
python scripts/tianjiaerhuan/evaluate.py
```

评估结果保存至 `vis_results/`，包括行为校准、热度校准、情感校准、话语非理性校准、网络拓扑校准可视化图表，以及综合 `evaluation_report.json`。

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

只需在 `llm_api_configs` 配置中添加新端点——框架使用统一的 OpenAI 兼容接口，无需修改代码。支持本地 vLLM 部署、硅基流动、OpenAI 及其他云 API 服务。

</details>

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
