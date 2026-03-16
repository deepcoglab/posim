# Cosmograph 可视化集成核心经验

> 本文档记录了 POSIM Web 前端集成 Cosmograph v2 进行大规模网络可视化的核心经验，供后续开发参考。

---

## 1. Cosmograph v2 React API 要点

### 1.1 核心组件

```tsx
import {
  Cosmograph,
  CosmographConfig,
  prepareCosmographData,
  CosmographDataPrepConfig,
} from '@cosmograph/react'
```

- **`Cosmograph`**: 主渲染组件，可独立使用，不强制需要 `CosmographProvider`
- **`prepareCosmographData`**: 数据预处理函数，将原始点/链接数组转换为 Cosmograph 内部格式
- **`CosmographDataPrepConfig`**: 数据列映射配置（`pointColorBy`, `pointSizeBy`, `linkSourceBy`, `linkTargetsBy` 等）

### 1.2 获取实例

```tsx
// 推荐方式：通过 onMount 回调获取实例
<Cosmograph
  onMount={(instance) => { cosmoRef.current = instance }}
  {...config}
/>

// 实例方法
instance.fitView()
instance.zoomIn()
instance.zoomOut()
instance.selectPoints(indices: number[])
instance.unselectPoints()
```

### 1.3 回调签名（v2 与 v1 不同）

```tsx
// v2 正确签名
onPointClick: (index: number | undefined, pointPosition: [number, number] | undefined, event: MouseEvent) => void
onBackgroundClick: (event: MouseEvent) => void
```

### 1.4 关键配置属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `pointColorBy` | `string` | 数据列名，用于节点着色 |
| `pointSizeBy` | `string` | 数据列名，用于节点大小 |
| `pointLabelBy` | `string` | 数据列名，用于节点标签 |
| `pointClusterBy` | `string` | 数据列名，用于聚类 |
| `pointColorStrategy` | `CosmographPointColorStrategy` | 着色策略：`categorical`, `continuous`, `degree`, `direct`, `single` |
| `pointSizeStrategy` | `CosmographPointSizeStrategy` | 大小策略：`degree`, `preciseDegree`, `auto`, `direct`, `single` |
| `showLabels` | `boolean` | 是否显示标签 |
| `showDynamicLabels` | `boolean` | 是否动态显示标签 |
| `simulationGravity` | `number` | 引力 |
| `simulationRepulsion` | `number` | 斥力 |
| `simulationDecay` | `number` | 衰减 |
| `simulationCluster` | `boolean` | 是否启用聚类力 |
| `simulationClusterStrength` | `number` | 聚类强度 |

### 1.5 CosmographTimeline 问题

官方 `CosmographTimeline` 组件需要数据中有正确的时间戳列且值分布合理。如果所有值相同或为0，会显示 "Empty or invalid timeline data"。

**解决方案**：自行实现自定义时间轴（RangeSlider + 直方图），更灵活且可与仿真步骤对应：

```tsx
<RangeSlider
  min={0} max={totalSteps}
  value={timelineRange}
  onChange={setTimelineRange}
/>
```

### 1.6 样式覆盖（Vite 模块导入问题）

Cosmograph 内部 `licensing-manager.js` 会导入 `@/cosmograph/style.module.css`。需要在项目中创建对应文件：

```
web/src/cosmograph/style.module.css
```

内容：
```css
.attribution { position: absolute; bottom: 4px; right: 4px; font-size: 10px; opacity: 0.5; pointer-events: none; }
```

---

## 2. 无标度网络数据生成

### 2.1 核心算法

真实社交网络具有无标度特性（power-law degree distribution），关键要素：

1. **幂律粉丝分布**：使用 Zipf 分布生成 followers_count
2. **偏好连接（Preferential Attachment）**：高粉丝节点更容易被连接
3. **社区结构**：不同 agent_type 形成天然社区
4. **孤立节点**：约 15% 节点无连接，模拟现实中的沉默用户

```typescript
// 幂律分布
function zipf(rng: () => number, n: number, s: number): number {
  const items = Array.from({ length: n }, (_, i) => 1 / Math.pow(i + 1, s))
  const sum = items.reduce((a, b) => a + b, 0)
  let r = rng() * sum, acc = 0
  for (let i = 0; i < n; i++) { acc += items[i]; if (r <= acc) return i }
  return n - 1
}
```

### 2.2 链接生成策略

```
1. citizen → hub（KOL/media）: 偏好连接，概率正比于 followers_count
2. hub ↔ hub: 互连，形成核心网络骨架
3. 同类型 peer links: 度偏置采样，形成社区内部连接
4. 跨类型弱连接: 少量随机跨社区链接
```

### 2.3 可复现性

使用 **seeded PRNG**（mulberry32）确保每次生成相同网络：

```typescript
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

---

## 3. 布局架构

### 3.1 从绝对定位到 Flex 布局

**之前的问题**：左/右面板、配置面板、时间轴都使用 `position: absolute`，导致：
- z-index 冲突（配置面板浮在弹窗之上）
- 面板间间距需要硬编码像素值
- 窗口缩放时布局错乱

**解决方案**：Flex 布局

```
.sim-view (flex column, height: 100%)
  ├── .sim-view__topbar (flex-shrink: 0)
  ├── .sim-view__main (flex: 1, flex row)  ← 核心改动
  │     ├── .sim-view__left (width: 280px, flex-shrink: 0)
  │     ├── .graph-config-sidebar (width: 260px, conditional)
  │     ├── .sim-view__center (flex: 1, position: relative)
  │     │     └── .network-graph (position: absolute, inset: 0)
  │     └── .sim-view__right (width: 320px, flex-shrink: 0)
  └── .sim-view__bottom (flex-shrink: 0, height: 110px)
```

### 3.2 配置面板集成

配置面板（`GraphConfigSidebar`）作为 flex 子元素参与布局，不再浮动覆盖：

- 通过 topbar 上的按钮切换 `showConfig` 状态
- 显示/隐藏时，中心图区域自动伸缩
- 使用 Blueprint.js 的 `Tabs`, `Switch`, `Slider`, `HTMLSelect` 组件

### 3.3 图内部元素层级

在 `.sim-view__center` 内部（`position: relative`），使用绝对定位：

| 元素 | z-index | 位置 |
|------|---------|------|
| Cosmograph canvas | 0 | 填满容器 |
| Color legend | 5 | bottom-left, 在 timeline 之上 |
| Zoom controls | 5 | top-right |
| Timeline panel | 5 | bottom, 全宽 |
| Stats overlay | 10 | bottom-right |

---

## 4. ECharts 集成

### 4.1 安装

```bash
npm install echarts echarts-for-react
```

### 4.2 暗色主题适配

ECharts 选项中需要手动设置暗色风格以匹配 Blueprint.js dark theme：

```typescript
const chartOption = {
  tooltip: {
    backgroundColor: 'rgba(28,33,39,0.95)',
    borderColor: '#383e47',
    textStyle: { color: '#c5cbd3', fontSize: 11 },
  },
  xAxis: {
    axisLabel: { color: '#5f6b7c' },
    axisLine: { lineStyle: { color: '#2f343c' } },
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#1c2127' } },
  },
}
```

### 4.3 使用场景

| 图表 | 类型 | 位置 | 说明 |
|------|------|------|------|
| 情绪分布 | 横向条形图 | 左侧面板 | 7种情绪实时分布 |
| 活跃度趋势 | 面积折线图 | 左侧面板（迷你） | 最近N步活跃智能体数 |
| 活跃度态势 | 多系列组合图 | 底部面板 | 折线+虚线+柱状：活跃数/霍克斯强度/行为数 |

### 4.4 性能注意

- 使用 `useMemo` 缓存 ECharts option，避免每次渲染都重新创建
- 设置 `opts={{ renderer: 'canvas' }}` 使用 Canvas 渲染（比 SVG 快）
- 底部曲线图高度设为 90px，配合 `grid` 精确控制绘图区域

---

## 5. Glassmorphism 风格

```scss
.sim-glass {
  background: rgba(14, 17, 22, 0.72) !important;
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-color: rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 2px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
}
```

所有覆盖面板（topbar、left、right、bottom）均使用此类，配合 Blueprint.js dark theme 实现统一视觉风格。

---

## 6. 关键文件清单

| 文件 | 职责 |
|------|------|
| `components/graph/NetworkGraph.tsx` | Cosmograph 渲染、缩放控制、自定义时间轴、图例 |
| `components/graph/GraphConfigSidebar.tsx` | 图配置侧边栏（Blueprint.js Tabs/Switch/Slider） |
| `pages/simulation/SimulationView.tsx` | 主视图：数据生成、状态管理、ECharts、布局编排 |
| `stores/simulationStore.ts` | Zustand store（AgentNode 包含 `timestamp` 字段） |
| `styles/index.scss` | 所有样式：flex布局、glassmorphism、sidebar、timeline |
| `cosmograph/style.module.css` | Cosmograph licensing manager 所需的样式文件 |

---

## 7. 常见坑点

1. **CosmographTimeline "Empty or invalid"**：数据中时间戳全为0或缺失 → 使用自定义时间轴
2. **z-index 穿透**：父元素设了 `z-index: 0` 会创建新的 stacking context，子元素的高 z-index 无法超出 → 移除父级 z-index
3. **Cosmograph v2 回调签名**：与 v1 不同，`onPointClick` 第一个参数是 `index`（数字），不是点对象
4. **`pointClusterStrengthBy` 不存在**：v2 中应使用 `simulationClusterStrength`（数值）而非列名
5. **Vite CSS Module 导入**：Cosmograph 内部使用 `@/cosmograph/style.module.css`，需要在 `src/cosmograph/` 下创建对应文件
6. **seeded PRNG 状态**：`useState(() => mulberry32(42))` 确保 rng 函数在组件生命周期内保持状态连续性
7. **ECharts 在暗色主题下**：必须手动设置 tooltip/axis/splitLine 的颜色，不会自动继承 Blueprint dark theme
