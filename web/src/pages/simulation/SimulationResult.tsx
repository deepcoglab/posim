import React, { useState, useMemo } from 'react'
import { Button, Tag, Icon, Divider, Card, Tabs, Tab, Tooltip } from '@blueprintjs/core'
import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const AGENT_TYPE_COLORS: Record<string, string> = {
  citizen: '#4c90f0', kol: '#f5c451', media: '#ec9a3c', government: '#3dcc91',
}
const EMOTION_COLORS: Record<string, string> = {
  anger: '#e76a6e', sadness: '#6e8cba', fear: '#d4874d',
  surprise: '#e8c94a', joy: '#49c98b', disgust: '#9f7aea', neutral: '#8a9ba8',
}

// Seeded PRNG
function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// Generate mock time-series data
function generateTimeSeries(rng: () => number, steps: number, base: number, variance: number, trend: number = 0): number[] {
  const data: number[] = []
  let val = base
  for (let i = 0; i < steps; i++) {
    val = val + (rng() - 0.5) * variance + trend
    data.push(Math.max(0, parseFloat(val.toFixed(2))))
  }
  return data
}

const SimulationResult: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [activeSection, setActiveSection] = useState('overview')

  const rng = useMemo(() => mulberry32(parseInt(id || '1') * 7), [id])

  // Mock scenario data
  const scenario = useMemo(() => ({
    name: '天价耳环事件',
    config: 'EBDI基线',
    model: 'Qwen2.5-14B',
    totalSteps: 200,
    agentCount: 412,
    totalActions: 8456,
    duration: '3h 15m',
    startedAt: '2026-02-21 15:29:57',
    completedAt: '2026-02-21 18:45:12',
  }), [])

  const steps = Array.from({ length: 200 }, (_, i) => i + 1)

  // Time-series data
  const activeAgents = useMemo(() => generateTimeSeries(rng, 200, 80, 30, 0.2), [rng])
  const hawkesIntensity = useMemo(() => generateTimeSeries(rng, 200, 0.4, 0.15), [rng])
  const postCount = useMemo(() => steps.map(() => Math.floor(rng() * 40 + 5)), [rng, steps])
  const repostCount = useMemo(() => steps.map(() => Math.floor(rng() * 25 + 2)), [rng, steps])
  const commentCount = useMemo(() => steps.map(() => Math.floor(rng() * 20 + 1)), [rng, steps])

  // Emotion time-series
  const emotionSeries = useMemo(() => {
    const emotions = ['anger', 'sadness', 'fear', 'surprise', 'joy', 'neutral']
    const series: Record<string, number[]> = {}
    emotions.forEach((e) => {
      series[e] = generateTimeSeries(rng, 200, e === 'anger' ? 25 : e === 'neutral' ? 30 : 10, 8)
    })
    return series
  }, [rng])

  // Stance distribution over time
  const stanceSeries = useMemo(() => ({
    negative: generateTimeSeries(rng, 200, 35, 10, -0.05),
    neutral: generateTimeSeries(rng, 200, 40, 8),
    positive: generateTimeSeries(rng, 200, 25, 10, 0.05),
  }), [rng])

  // Agent type action distribution (pie)
  const agentTypeActions = useMemo(() => [
    { name: '普通用户', value: 5823, color: AGENT_TYPE_COLORS.citizen },
    { name: 'KOL', value: 1245, color: AGENT_TYPE_COLORS.kol },
    { name: '媒体', value: 876, color: AGENT_TYPE_COLORS.media },
    { name: '官方', value: 512, color: AGENT_TYPE_COLORS.government },
  ], [])

  // Behavior distribution
  const behaviorDist = useMemo(() => [
    { name: '发帖', value: 2134, color: '#4c90f0' },
    { name: '转发', value: 3256, color: '#3dcc91' },
    { name: '评论', value: 1876, color: '#ec9a3c' },
    { name: '点赞', value: 1190, color: '#e76a6e' },
  ], [])

  // Cascade metrics
  const cascadeData = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    depth: Math.floor(rng() * 8) + 1,
    size: Math.floor(Math.pow(rng(), 0.3) * 200) + 2,
    emotion: ['anger', 'neutral', 'joy', 'sadness', 'fear'][Math.floor(rng() * 5)],
  })), [rng])

  // Chart defaults
  const chartTooltip = { backgroundColor: 'rgba(28,33,39,0.95)', borderColor: '#383e47', textStyle: { color: '#c5cbd3', fontSize: 11 } }
  const chartGrid = { left: 48, right: 16, top: 32, bottom: 28, containLabel: false }
  const axisStyle = { axisLabel: { color: '#5f6b7c', fontSize: 10 }, axisLine: { lineStyle: { color: '#2f343c' } }, axisTick: { show: false } }
  const splitLineStyle = { splitLine: { lineStyle: { color: '#1c2127' } } }

  // ── Charts ──

  const activityChartOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'axis' },
    legend: { data: ['活跃智能体', '霍克斯强度'], textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 3 },
    grid: chartGrid,
    xAxis: { type: 'category', data: steps, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 19 } },
    yAxis: [
      { type: 'value', ...axisStyle, ...splitLineStyle },
      { type: 'value', ...axisStyle, splitLine: { show: false } },
    ],
    series: [
      { name: '活跃智能体', type: 'line', data: activeAgents, smooth: true, symbol: 'none', lineStyle: { color: '#4c90f0', width: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(76,144,240,0.3)' }, { offset: 1, color: 'rgba(76,144,240,0.02)' }] } } },
      { name: '霍克斯强度', type: 'line', yAxisIndex: 1, data: hawkesIntensity, smooth: true, symbol: 'none', lineStyle: { color: '#ec9a3c', width: 1.5, type: 'dashed' } },
    ],
  }), [activeAgents, hawkesIntensity, steps])

  const behaviorChartOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'axis' },
    legend: { data: ['发帖', '转发', '评论'], textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 3 },
    grid: chartGrid,
    xAxis: { type: 'category', data: steps, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 19 } },
    yAxis: { type: 'value', ...axisStyle, ...splitLineStyle },
    series: [
      { name: '发帖', type: 'bar', stack: 'total', data: postCount, barWidth: 3, itemStyle: { color: '#4c90f0' } },
      { name: '转发', type: 'bar', stack: 'total', data: repostCount, barWidth: 3, itemStyle: { color: '#3dcc91' } },
      { name: '评论', type: 'bar', stack: 'total', data: commentCount, barWidth: 3, itemStyle: { color: '#ec9a3c' } },
    ],
  }), [postCount, repostCount, commentCount, steps])

  const emotionChartOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'axis' },
    legend: { data: Object.keys(emotionSeries), textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 3 },
    grid: chartGrid,
    xAxis: { type: 'category', data: steps, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 19 } },
    yAxis: { type: 'value', ...axisStyle, ...splitLineStyle },
    series: Object.entries(emotionSeries).map(([emotion, data]) => ({
      name: emotion, type: 'line', stack: 'emotion', areaStyle: { opacity: 0.6 },
      data, smooth: true, symbol: 'none', lineStyle: { width: 0 },
      itemStyle: { color: EMOTION_COLORS[emotion] },
    })),
  }), [emotionSeries, steps])

  const stanceChartOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'axis' },
    legend: { data: ['负面', '中立', '正面'], textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 3 },
    grid: chartGrid,
    xAxis: { type: 'category', data: steps, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 19 } },
    yAxis: { type: 'value', ...axisStyle, ...splitLineStyle },
    series: [
      { name: '负面', type: 'line', stack: 'stance', areaStyle: { opacity: 0.5 }, data: stanceSeries.negative, smooth: true, symbol: 'none', lineStyle: { width: 0 }, itemStyle: { color: '#e76a6e' } },
      { name: '中立', type: 'line', stack: 'stance', areaStyle: { opacity: 0.5 }, data: stanceSeries.neutral, smooth: true, symbol: 'none', lineStyle: { width: 0 }, itemStyle: { color: '#8a9ba8' } },
      { name: '正面', type: 'line', stack: 'stance', areaStyle: { opacity: 0.5 }, data: stanceSeries.positive, smooth: true, symbol: 'none', lineStyle: { width: 0 }, itemStyle: { color: '#3dcc91' } },
    ],
  }), [stanceSeries, steps])

  const agentTypePieOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'],
      data: agentTypeActions.map((a) => ({ name: a.name, value: a.value, itemStyle: { color: a.color } })),
      label: { color: '#8a9ba8', fontSize: 10 },
      labelLine: { lineStyle: { color: '#5f6b7c' } },
    }],
  }), [agentTypeActions])

  const behaviorPieOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'],
      data: behaviorDist.map((b) => ({ name: b.name, value: b.value, itemStyle: { color: b.color } })),
      label: { color: '#8a9ba8', fontSize: 10 },
      labelLine: { lineStyle: { color: '#5f6b7c' } },
    }],
  }), [behaviorDist])

  const cascadeScatterOption = useMemo(() => ({
    tooltip: { ...chartTooltip, trigger: 'item', formatter: (p: any) => `深度: ${p.data[0]}<br/>规模: ${p.data[1]}<br/>情绪: ${p.data[2]}` },
    grid: chartGrid,
    xAxis: { type: 'value', name: '级联深度', nameTextStyle: { color: '#5f6b7c', fontSize: 10 }, ...axisStyle, ...splitLineStyle },
    yAxis: { type: 'value', name: '级联规模', nameTextStyle: { color: '#5f6b7c', fontSize: 10 }, ...axisStyle, ...splitLineStyle },
    series: [{
      type: 'scatter', symbolSize: (data: number[]) => Math.max(4, Math.sqrt(data[1]) * 2),
      data: cascadeData.map((c) => [c.depth, c.size, c.emotion]),
      itemStyle: { color: (p: any) => EMOTION_COLORS[p.data[2]] || '#8a9ba8', opacity: 0.7 },
    }],
  }), [cascadeData])

  // Hotness curve (mock comparison: real vs simulated)
  const hotnessCurveOption = useMemo(() => {
    const realHotness = generateTimeSeries(rng, 200, 500, 200, 1.5)
    const simHotness = realHotness.map((v) => v + (rng() - 0.5) * 100)
    return {
      tooltip: { ...chartTooltip, trigger: 'axis' },
      legend: { data: ['真实热度', '仿真热度'], textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 3 },
      grid: chartGrid,
      xAxis: { type: 'category', data: steps, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 19 } },
      yAxis: { type: 'value', ...axisStyle, ...splitLineStyle },
      series: [
        { name: '真实热度', type: 'line', data: realHotness, smooth: true, symbol: 'none', lineStyle: { color: '#f5c451', width: 2 } },
        { name: '仿真热度', type: 'line', data: simHotness, smooth: true, symbol: 'none', lineStyle: { color: '#4c90f0', width: 2, type: 'dashed' } },
      ],
    }
  }, [rng, steps])

  const sections = [
    { id: 'overview', label: '总览', icon: 'dashboard' },
    { id: 'behavior', label: '行为分析', icon: 'timeline-events' },
    { id: 'emotion', label: '情绪/立场', icon: 'heart' },
    { id: 'network', label: '网络/级联', icon: 'graph' },
    { id: 'hotness', label: '热度对比', icon: 'flame' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        <Icon icon="chart" size={16} style={{ color: 'var(--accent-blue)' }} />
        <span style={{ fontSize: 16, fontWeight: 600 }}>仿真结果分析</span>
        <Divider />
        <Tag intent="primary" minimal large>{scenario.name}</Tag>
        <Tag minimal>{scenario.config}</Tag>
        <Tag minimal>{scenario.model}</Tag>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {scenario.startedAt} ~ {scenario.completedAt}
        </span>
        <Tooltip content="导出报告">
          <Button small icon="export" text="导出" />
        </Tooltip>
      </div>

      {/* KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        {[
          { label: '总步数', value: scenario.totalSteps, color: 'var(--text-primary)', icon: 'walk' },
          { label: '智能体', value: scenario.agentCount, color: 'var(--accent-blue)', icon: 'people' },
          { label: '总行为', value: scenario.totalActions.toLocaleString(), color: 'var(--accent-green)', icon: 'flash' },
          { label: '运行耗时', value: scenario.duration, color: 'var(--accent-orange)', icon: 'time' },
          { label: '平均活跃', value: Math.round(activeAgents.reduce((a, b) => a + b, 0) / activeAgents.length), color: 'var(--accent-gold)', icon: 'pulse' },
          { label: '峰值活跃', value: Math.round(Math.max(...activeAgents)), color: 'var(--accent-red)', icon: 'trending-up' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Icon icon={kpi.icon as any} size={11} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Section navigation + content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left nav */}
        <div style={{ width: 160, borderRight: '1px solid var(--border-color)', padding: '12px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                background: activeSection === s.id ? 'rgba(76,144,240,0.12)' : 'transparent',
                border: 'none', color: activeSection === s.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 12, fontWeight: activeSection === s.id ? 600 : 400,
                borderLeft: activeSection === s.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon icon={s.icon as any} size={13} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {/* ── Overview ── */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="timeline-events" size={13} style={{ marginRight: 6 }} />活跃度与霍克斯强度
                  </div>
                  <ReactECharts option={activityChartOption} style={{ height: 220 }} opts={{ renderer: 'canvas' }} />
                </Card>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="flame" size={13} style={{ marginRight: 6 }} />热度曲线对比
                  </div>
                  <ReactECharts option={hotnessCurveOption} style={{ height: 220 }} opts={{ renderer: 'canvas' }} />
                </Card>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="people" size={13} style={{ marginRight: 6 }} />智能体行为分布
                  </div>
                  <ReactECharts option={agentTypePieOption} style={{ height: 180 }} opts={{ renderer: 'canvas' }} />
                </Card>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="flash" size={13} style={{ marginRight: 6 }} />行为类型分布
                  </div>
                  <ReactECharts option={behaviorPieOption} style={{ height: 180 }} opts={{ renderer: 'canvas' }} />
                </Card>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="key" size={13} style={{ marginRight: 6 }} />关键事件时间线
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {[
                      { step: 0, title: '事件曝光', color: '#e76a6e' },
                      { step: 30, title: '舆论发酵', color: '#ec9a3c' },
                      { step: 50, title: '媒体报道', color: '#f5c451' },
                      { step: 80, title: '商家回应', color: '#4c90f0' },
                      { step: 120, title: '官方介入', color: '#3dcc91' },
                      { step: 160, title: '处理结果', color: '#9f7aea' },
                    ].map((evt) => (
                      <div key={evt.step} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(56,62,71,0.3)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: evt.color, flexShrink: 0 }} />
                        <Tag minimal round style={{ fontSize: 9 }}>Step {evt.step}</Tag>
                        <span style={{ fontSize: 12 }}>{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── Behavior Analysis ── */}
          {activeSection === 'behavior' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="timeline-events" size={13} style={{ marginRight: 6 }} />行为时间序列（发帖/转发/评论）
                </div>
                <ReactECharts option={behaviorChartOption} style={{ height: 280 }} opts={{ renderer: 'canvas' }} />
              </Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="people" size={13} style={{ marginRight: 6 }} />各类型智能体行为占比
                  </div>
                  <ReactECharts option={agentTypePieOption} style={{ height: 220 }} opts={{ renderer: 'canvas' }} />
                </Card>
                <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <Icon icon="flash" size={13} style={{ marginRight: 6 }} />行为类型总量分布
                  </div>
                  <ReactECharts option={behaviorPieOption} style={{ height: 220 }} opts={{ renderer: 'canvas' }} />
                </Card>
              </div>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="pulse" size={13} style={{ marginRight: 6 }} />活跃度与霍克斯强度
                </div>
                <ReactECharts option={activityChartOption} style={{ height: 240 }} opts={{ renderer: 'canvas' }} />
              </Card>
            </div>
          )}

          {/* ── Emotion & Stance ── */}
          {activeSection === 'emotion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="heart" size={13} style={{ marginRight: 6 }} />情绪分布演化（堆叠面积图）
                </div>
                <ReactECharts option={emotionChartOption} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />
              </Card>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="exchange" size={13} style={{ marginRight: 6 }} />立场分布演化
                </div>
                <ReactECharts option={stanceChartOption} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />
              </Card>
              {/* Emotion summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {Object.entries(EMOTION_COLORS).map(([emotion, color]) => {
                  const labels: Record<string, string> = { anger: '愤怒', sadness: '悲伤', fear: '恐惧', surprise: '惊讶', joy: '喜悦', disgust: '厌恶', neutral: '中性' }
                  const series = emotionSeries[emotion]
                  const avg = series ? (series.reduce((a, b) => a + b, 0) / series.length).toFixed(1) : '-'
                  const peak = series ? Math.max(...series).toFixed(1) : '-'
                  return (
                    <Card key={emotion} style={{ padding: 12, background: 'var(--bg-secondary)', border: `1px solid ${color}30` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color }}>{labels[emotion] || emotion}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                        <span>均值: <strong style={{ color: 'var(--text-primary)' }}>{avg}</strong></span>
                        <span>峰值: <strong style={{ color: 'var(--text-primary)' }}>{peak}</strong></span>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Network & Cascade ── */}
          {activeSection === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="scatter-plot" size={13} style={{ marginRight: 6 }} />级联结构分布（深度 × 规模）
                </div>
                <ReactECharts option={cascadeScatterOption} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />
              </Card>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: '网络节点', value: scenario.agentCount, color: 'var(--accent-blue)' },
                  { label: '网络边数', value: '15,832', color: 'var(--accent-green)' },
                  { label: '级联数量', value: cascadeData.length, color: 'var(--accent-orange)' },
                  { label: '最大级联规模', value: Math.max(...cascadeData.map((c) => c.size)), color: 'var(--accent-red)' },
                ].map((m) => (
                  <Card key={m.label} style={{ padding: 14, textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{m.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{typeof m.value === 'number' ? m.value.toLocaleString() : m.value}</div>
                  </Card>
                ))}
              </div>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                  <Icon icon="graph" size={13} style={{ marginRight: 6 }} />网络拓扑概览
                </div>
                <div style={{ background: '#111518', borderRadius: 8, padding: 40, textAlign: 'center', color: 'var(--text-muted)', minHeight: 200 }}>
                  <Icon icon="graph" size={48} style={{ opacity: 0.3 }} />
                  <div style={{ marginTop: 12 }}>网络可视化区域</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>最终仿真网络拓扑结构（转发网络 / 评论网络）</div>
                </div>
              </Card>
            </div>
          )}

          {/* ── Hotness Comparison ── */}
          {activeSection === 'hotness' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="flame" size={13} style={{ marginRight: 6 }} />热度曲线对比（真实 vs 仿真）
                </div>
                <ReactECharts option={hotnessCurveOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} />
              </Card>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="heart" size={13} style={{ marginRight: 6 }} />情绪演化对比
                </div>
                <ReactECharts option={emotionChartOption} style={{ height: 280 }} opts={{ renderer: 'canvas' }} />
              </Card>
              <Card style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                  <Icon icon="exchange" size={13} style={{ marginRight: 6 }} />立场演化
                </div>
                <ReactECharts option={stanceChartOption} style={{ height: 280 }} opts={{ renderer: 'canvas' }} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimulationResult
