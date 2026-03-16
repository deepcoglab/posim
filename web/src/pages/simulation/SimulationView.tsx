import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Button, Tag, Icon, Slider, Tooltip, Divider } from '@blueprintjs/core'
import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { useSimulationStore, AgentNode, PostAction } from '../../stores/simulationStore'
import AgentDetailDrawer from './AgentDetailDrawer'
import NetworkGraph, { GraphNode, GraphLink } from '../../components/graph/NetworkGraph'
import GraphConfigSidebar, { GraphSettings, DEFAULT_GRAPH_SETTINGS } from '../../components/graph/GraphConfigSidebar'
import PostStream from '../../components/post/PostStream'
import AgentTable from '../../components/agent/AgentTable'

const AGENT_TYPE_COLORS: Record<string, string> = {
  citizen: '#4c90f0', kol: '#f5c451', media: '#ec9a3c', government: '#3dcc91',
}

const EMOTION_COLORS: Record<string, string> = {
  anger: '#e76a6e', sadness: '#738091', fear: '#ec9a3c',
  surprise: '#f5c451', joy: '#3dcc91', disgust: '#9f7aea', neutral: '#abb3bf',
}

// ── Seeded PRNG for reproducible data ──
function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// ── Scale-free mock data generators ──
function generateMockAgents(count: number, rng: () => number): AgentNode[] {
  const emotions = ['anger', 'sadness', 'fear', 'surprise', 'joy', 'disgust', 'neutral']
  const agents: AgentNode[] = []

  // Type distribution: ~75% citizen, ~12% kol, ~8% media, ~5% government
  const typeWeights = [
    { type: 'citizen' as const, weight: 0.75 },
    { type: 'kol' as const, weight: 0.12 },
    { type: 'media' as const, weight: 0.08 },
    { type: 'government' as const, weight: 0.05 },
  ]

  for (let i = 0; i < count; i++) {
    let r = rng()
    let agentType: AgentNode['agent_type'] = 'citizen'
    let cumW = 0
    for (const tw of typeWeights) {
      cumW += tw.weight
      if (r < cumW) { agentType = tw.type; break }
    }

    // Power-law followers distribution
    const u = rng()
    let followers: number
    if (agentType === 'kol') {
      followers = Math.floor(Math.pow(1 / (1 - u), 3) * 500)
    } else if (agentType === 'media') {
      followers = Math.floor(Math.pow(1 / (1 - u), 2.5) * 1000)
    } else if (agentType === 'government') {
      followers = Math.floor(Math.pow(1 / (1 - u), 2) * 2000)
    } else {
      followers = Math.floor(Math.pow(1 / (1 - u), 1.8) * 5)
    }
    followers = Math.min(followers, 500000)

    agents.push({
      user_id: `user_${i}`,
      username: `用户${i}${agentType === 'kol' ? '_KOL' : agentType === 'media' ? '_媒体' : agentType === 'government' ? '_官方' : ''}`,
      agent_type: agentType,
      followers_count: followers,
      following_count: Math.floor(rng() * 500),
      posts_count: Math.floor(rng() * 100),
      is_active: rng() > 0.6,
      emotion_dominant: emotions[Math.floor(rng() * emotions.length)],
      emotion_intensity: rng(),
      emotion_vector: emotions.map(() => rng()),
      activation_count: Math.floor(rng() * 20),
      identity_description: `${agentType === 'kol' ? '社交媒体意见领袖' : agentType === 'media' ? '主流媒体账号' : agentType === 'government' ? '政府官方账号' : '普通公民'}，关注社会热点`,
      psychological_beliefs: { openness: rng(), neuroticism: rng(), agreeableness: rng() },
      event_opinions: { '天价耳环': rng() > 0.5 ? '负面' : '中立' },
      timestamp: Math.floor(rng() * 200),
    })
  }
  return agents
}

function generateMockActions(agents: AgentNode[], step: number): PostAction[] {
  const actionTypes: PostAction['action_type'][] = ['post', 'repost', 'comment', 'like', 'idle']
  const emotions = ['anger', 'sadness', 'neutral', 'joy', 'surprise']
  const stances = ['负面', '中立', '正面']
  const contents = [
    '这件事太过分了，必须严查！消费者权益不容侵犯！',
    '理性看待，等官方调查结果再说。不要轻信传言。',
    '希望能有一个公平公正的处理结果，还消费者一个公道',
    '转发扩散，让更多人看到这件事的真相！',
    '支持官方的处理决定，相信法律会给出公正的裁决',
    '又是一起消费者维权事件...什么时候才能杜绝这类问题',
    '建议相关部门加强监管，保护消费者合法权益',
    '冷静分析一下事情的来龙去脉，不要被情绪带节奏',
    '已经关注这件事很久了，终于有媒体报道了',
    '商家这种行为简直不可理喻，必须付出代价！',
  ]
  const count = Math.floor(Math.random() * 8) + 3
  const actions: PostAction[] = []
  for (let i = 0; i < count; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)]
    const aType = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    if (aType === 'idle') continue
    actions.push({
      id: `action_${step}_${i}`,
      step,
      time: `Step ${step}`,
      agent_id: agent.user_id,
      agent_name: agent.username,
      agent_type: agent.agent_type,
      action_type: aType,
      content: aType === 'like' ? '' : contents[Math.floor(Math.random() * contents.length)],
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      stance: stances[Math.floor(Math.random() * stances.length)],
    })
  }
  return actions
}

// ── Scale-free network: preferential attachment + community structure ──
function generateScaleFreeLinks(agents: AgentNode[], rng: () => number): GraphLink[] {
  const links: GraphLink[] = []
  const linkSet = new Set<string>()
  const n = agents.length

  // Build degree array for preferential attachment
  const degree = new Array(n).fill(0)

  // Group by type for community structure
  const typeGroups = new Map<string, number[]>()
  agents.forEach((a, i) => {
    const g = typeGroups.get(a.agent_type) || []
    g.push(i)
    typeGroups.set(a.agent_type, g)
  })

  // Identify hub nodes (kol, media, government)
  const hubIndices: number[] = []
  const citizenIndices: number[] = []
  agents.forEach((a, i) => {
    if (a.agent_type !== 'citizen') hubIndices.push(i)
    else citizenIndices.push(i)
  })

  // Phase 1: Preferential attachment from citizens to hubs
  // Each citizen follows 1-5 hubs based on followers_count (preferential)
  const hubWeights = hubIndices.map((i) => Math.log10(agents[i].followers_count + 10))
  const hubWeightSum = hubWeights.reduce((s, w) => s + w, 0)

  for (const ci of citizenIndices) {
    const numFollow = Math.floor(rng() * 4) + 1
    for (let j = 0; j < numFollow; j++) {
      // Weighted selection by followers
      let r = rng() * hubWeightSum
      let selected = hubIndices[0]
      for (let k = 0; k < hubIndices.length; k++) {
        r -= hubWeights[k]
        if (r <= 0) { selected = hubIndices[k]; break }
      }
      const key = `${ci}-${selected}`
      if (!linkSet.has(key) && ci !== selected) {
        linkSet.add(key)
        links.push({ source: agents[ci].user_id, target: agents[selected].user_id })
        degree[ci]++
        degree[selected]++
      }
    }
  }

  // Phase 2: Hub-to-hub connections (media <-> government, kol <-> kol)
  for (let i = 0; i < hubIndices.length; i++) {
    const numPeer = Math.floor(rng() * 3) + 1
    for (let j = 0; j < numPeer; j++) {
      const target = hubIndices[Math.floor(rng() * hubIndices.length)]
      const key = `${hubIndices[i]}-${target}`
      if (!linkSet.has(key) && hubIndices[i] !== target) {
        linkSet.add(key)
        links.push({ source: agents[hubIndices[i]].user_id, target: agents[target].user_id })
        degree[hubIndices[i]]++
        degree[target]++
      }
    }
  }

  // Phase 3: Citizen peer connections using preferential attachment
  // ~20% of citizens get peer links, biased toward high-degree nodes
  const peerLinkCount = Math.floor(citizenIndices.length * 0.3)
  for (let i = 0; i < peerLinkCount; i++) {
    const src = citizenIndices[Math.floor(rng() * citizenIndices.length)]
    // Preferential: pick target proportional to degree
    const totalDeg = degree.reduce((s, d) => s + d + 1, 0)
    let r = rng() * totalDeg
    let tgt = 0
    for (let k = 0; k < n; k++) {
      r -= (degree[k] + 1)
      if (r <= 0) { tgt = k; break }
    }
    const key = `${src}-${tgt}`
    if (!linkSet.has(key) && src !== tgt) {
      linkSet.add(key)
      links.push({ source: agents[src].user_id, target: agents[tgt].user_id })
      degree[src]++
      degree[tgt]++
    }
  }

  // Phase 4: Isolated citizens remain (~15% will have 0 links naturally)
  // Some additional sparse random links for small-world property
  const swLinks = Math.floor(n * 0.05)
  for (let i = 0; i < swLinks; i++) {
    const a = Math.floor(rng() * n)
    const b = Math.floor(rng() * n)
    const key = `${a}-${b}`
    if (!linkSet.has(key) && a !== b) {
      linkSet.add(key)
      links.push({ source: agents[a].user_id, target: agents[b].user_id })
    }
  }

  return links
}

// ── Main Component ──
const SimulationView: React.FC = () => {
  const { t } = useTranslation()
  const {
    recentActions, selectedAgentId, setSelectedAgentId, timeRange,
    addStepSignal,
  } = useSimulationStore()

  // Seeded data generation for reproducible scale-free network
  const [rng] = useState(() => mulberry32(42))
  const [agents] = useState<AgentNode[]>(() => generateMockAgents(12000, rng))
  const [mockLinks] = useState<GraphLink[]>(() => generateScaleFreeLinks(agents, rng))

  const [isRunning, setIsRunning] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [leftTab, setLeftTab] = useState<string>('overview')
  const [rightTab, setRightTab] = useState<string>('posts')
  const [showConfig, setShowConfig] = useState(true)
  const [graphSettings, setGraphSettings] = useState<GraphSettings>(DEFAULT_GRAPH_SETTINGS)
  const stepRef = useRef(0)

  // Stable metrics
  const [metrics, setMetrics] = useState({
    activeCount: 57, actionCount: 5, hawkesIntensity: 1.234,
    emotionDist: { anger: 22, sadness: 15, fear: 8, surprise: 12, joy: 18, disgust: 10, neutral: 15 },
  })

  // Activity history for ECharts
  const [activityHistory, setActivityHistory] = useState<{ step: number; active: number; actions: number; intensity: number }[]>([])

  // Simulate step ticking
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1
        if (next > 200) { setIsRunning(false); return prev }
        stepRef.current = next
        const actions = generateMockActions(agents, next)
        const emotions = ['anger', 'sadness', 'fear', 'surprise', 'joy', 'disgust', 'neutral']
        const emotionDist: Record<string, number> = {}
        emotions.forEach((e) => { emotionDist[e] = Math.random() })
        const activeCount = Math.floor(Math.random() * 80) + 30
        const hawkes = Math.random() * 2 + 0.5
        setMetrics({
          activeCount,
          actionCount: actions.length,
          hawkesIntensity: hawkes,
          emotionDist: {
            anger: Math.floor(Math.random() * 30 + 10),
            sadness: Math.floor(Math.random() * 20 + 5),
            fear: Math.floor(Math.random() * 15 + 3),
            surprise: Math.floor(Math.random() * 20 + 5),
            joy: Math.floor(Math.random() * 25 + 8),
            disgust: Math.floor(Math.random() * 15 + 3),
            neutral: Math.floor(Math.random() * 20 + 5),
          },
        })
        setActivityHistory((prev) => [...prev, { step: next, active: activeCount, actions: actions.length, intensity: hawkes }])
        addStepSignal({
          step: next, time: `Step ${next}`,
          active_count: activeCount, action_count: actions.length,
          hawkes_intensity: Math.random() * 2 + 0.5,
          emotion_distribution: emotionDist,
          hot_topics: ['#天价耳环', '#消费维权', '#市场监管', '#商家回应', '#后续进展'].slice(0, Math.floor(Math.random() * 3) + 2),
          active_agent_ids: agents.filter(() => Math.random() > 0.7).map((a) => a.user_id),
          actions,
        })
        return next
      })
    }, 2000 / speed)
    return () => clearInterval(interval)
  }, [isRunning, speed, agents, addStepSignal])

  const handleAgentClick = useCallback((agentId: string) => {
    if (!agentId) { setSelectedAgentId(null); return }
    setSelectedAgentId(agentId)
    setDrawerOpen(true)
  }, [setSelectedAgentId])

  const selectedAgent = useMemo(() =>
    agents.find((a) => a.user_id === selectedAgentId) || null,
    [agents, selectedAgentId],
  )

  const typeStats = useMemo(() => {
    const counts = { citizen: 0, kol: 0, media: 0, government: 0, total: agents.length }
    agents.forEach((a) => { counts[a.agent_type]++ })
    return counts
  }, [agents])

  const graphNodes: GraphNode[] = useMemo(() =>
    agents.map((a) => ({
      id: a.user_id, label: a.username, type: a.agent_type,
      active: a.is_active, data: { followers_count: a.followers_count, emotion_dominant: a.emotion_dominant, timestamp: a.timestamp || 0 },
    })),
    [agents],
  )

  // ── ECharts options ──
  const emotionChartOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, backgroundColor: 'rgba(28,33,39,0.95)', borderColor: '#383e47', textStyle: { color: '#c5cbd3', fontSize: 11 } },
    grid: { left: 50, right: 8, top: 4, bottom: 4, containLabel: false },
    xAxis: { type: 'value' as const, show: false },
    yAxis: {
      type: 'category' as const,
      data: Object.keys(EMOTION_COLORS).reverse(),
      axisLabel: { color: '#738091', fontSize: 10 },
      axisLine: { show: false }, axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: Object.keys(EMOTION_COLORS).reverse().map((e) => ({
        value: (metrics.emotionDist as any)[e] || 0,
        itemStyle: { color: EMOTION_COLORS[e] },
      })),
      barWidth: 10,
      label: { show: true, position: 'right' as const, color: '#c5cbd3', fontSize: 10, formatter: '{c}%' },
    }],
  }), [metrics.emotionDist])

  const activitySparkOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, backgroundColor: 'rgba(28,33,39,0.95)', borderColor: '#383e47', textStyle: { color: '#c5cbd3', fontSize: 10 } },
    grid: { left: 0, right: 0, top: 4, bottom: 0, containLabel: false },
    xAxis: { type: 'category' as const, show: false, data: activityHistory.map((h) => h.step) },
    yAxis: { type: 'value' as const, show: false },
    series: [{
      type: 'line',
      data: activityHistory.map((h) => h.active),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#4c90f0', width: 1.5 },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(76,144,240,0.4)' }, { offset: 1, color: 'rgba(76,144,240,0.02)' }] } },
    }],
  }), [activityHistory])

  const bottomChartOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis' as const, backgroundColor: 'rgba(28,33,39,0.95)',
      borderColor: '#383e47', textStyle: { color: '#c5cbd3', fontSize: 11 },
    },
    legend: {
      data: ['活跃智能体', '霍克斯强度', '行为数'],
      textStyle: { color: '#8a9ba8', fontSize: 10 }, top: 0, right: 0,
      icon: 'roundRect', itemWidth: 12, itemHeight: 3,
    },
    grid: { left: 36, right: 36, top: 28, bottom: 20, containLabel: false },
    xAxis: {
      type: 'category' as const,
      data: activityHistory.map((h) => `${h.step}`),
      axisLabel: { color: '#5f6b7c', fontSize: 10, interval: 'auto' as const },
      axisLine: { lineStyle: { color: '#2f343c' } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value' as const,
        axisLabel: { color: '#5f6b7c', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1c2127' } },
        axisLine: { show: false },
      },
      {
        type: 'value' as const,
        axisLabel: { color: '#5f6b7c', fontSize: 10 },
        splitLine: { show: false },
        axisLine: { show: false },
      },
    ],
    series: [
      {
        name: '活跃智能体', type: 'line', data: activityHistory.map((h) => h.active),
        smooth: true, symbol: 'none',
        lineStyle: { color: '#4c90f0', width: 2 },
        areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(76,144,240,0.3)' }, { offset: 1, color: 'rgba(76,144,240,0.02)' }] } },
      },
      {
        name: '霍克斯强度', type: 'line', yAxisIndex: 1,
        data: activityHistory.map((h) => parseFloat(h.intensity.toFixed(2))),
        smooth: true, symbol: 'none',
        lineStyle: { color: '#ec9a3c', width: 1.5, type: 'dashed' as const },
      },
      {
        name: '行为数', type: 'bar',
        data: activityHistory.map((h) => h.actions),
        barWidth: 3, itemStyle: { color: 'rgba(61,204,145,0.4)' },
      },
    ],
  }), [activityHistory])

  // Stable hot topics (avoid flicker from Math.random in render)
  const hotTopicHeats = useMemo(() =>
    ['#天价耳环', '#消费维权', '#市场监管', '#商家回应', '#后续进展'].map((t, i) => ({
      topic: t, heat: 1000 - i * 150 + Math.floor(step * (5 - i)),
    })),
    [step],
  )

  return (
    <div className="sim-view sim-view--immersive">
      {/* ── Top Bar ── */}
      <div className="sim-view__topbar sim-glass">
        <Tag intent="primary" large icon="predictive-analysis">天价耳环事件 - EBDI基线</Tag>
        <Divider />
        <span className="sim-view__topbar-stat">
          <Icon icon="walk" size={12} /> Step: <strong>{step}</strong>/200
        </span>
        <span className="sim-view__topbar-stat">
          <Icon icon="people" size={12} /> <strong>{metrics.activeCount}</strong>/{typeStats.total} 活跃
        </span>
        <Divider />
        <Button small icon={isRunning ? 'pause' : 'play'}
          intent={isRunning ? 'warning' : 'success'}
          text={isRunning ? t('simulation.pause') : t('simulation.resume')}
          onClick={() => setIsRunning(!isRunning)} />
        <Button small icon="stop" intent="danger" text={t('simulation.stop')} />
        <Divider />
        <span className="sim-view__topbar-speed">
          <Icon icon="fast-forward" size={10} />速度:
          <div style={{ width: 80 }}>
            <Slider min={0.5} max={5} stepSize={0.5} value={speed} onChange={setSpeed} labelRenderer={false} />
          </div>
          <span>{speed}x</span>
        </span>
        <span style={{ flex: 1 }} />
        <Tooltip content="图配置">
          <Button small minimal icon="settings" active={showConfig}
            onClick={() => setShowConfig(!showConfig)} />
        </Tooltip>
        <Tooltip content="全屏"><Button small minimal icon="fullscreen" /></Tooltip>
      </div>

      {/* ── Main area: left + config + graph + right ── */}
      <div className="sim-view__main">
        {/* Left Panel */}
        <div className="sim-view__left sim-glass">
          <div className="sim-glass__tabs">
            {[
              { id: 'overview', label: '实时态势', icon: 'dashboard' },
              { id: 'agents', label: '智能体', icon: 'people' },
              { id: 'intervene', label: '干预', icon: 'wrench' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`sim-glass__tab ${leftTab === tab.id ? 'sim-glass__tab--active' : ''}`}
                onClick={() => setLeftTab(tab.id)}
              >
                <Icon icon={tab.icon as any} size={12} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="sim-glass__content">
            {leftTab === 'overview' && (
              <div className="sim-left-panel">
                <div className="sim-kpi-grid">
                  <div className="sim-kpi">
                    <div className="sim-kpi__label">活跃智能体</div>
                    <div className="sim-kpi__value">{metrics.activeCount}<span>/{typeStats.total.toLocaleString()}</span></div>
                  </div>
                  <div className="sim-kpi">
                    <div className="sim-kpi__label">本步行为数</div>
                    <div className="sim-kpi__value" style={{ color: 'var(--accent-blue)' }}>{metrics.actionCount}</div>
                  </div>
                  <div className="sim-kpi">
                    <div className="sim-kpi__label">霍克斯强度</div>
                    <div className="sim-kpi__value" style={{ color: 'var(--accent-orange)' }}>{metrics.hawkesIntensity.toFixed(3)}</div>
                  </div>
                  <div className="sim-kpi">
                    <div className="sim-kpi__label">累计帖文</div>
                    <div className="sim-kpi__value" style={{ color: 'var(--accent-green)' }}>{recentActions.length}</div>
                  </div>
                </div>

                <Divider style={{ margin: '8px 0', opacity: 0.3 }} />

                {/* Agent Type Donut (ECharts) */}
                <div className="sim-section">
                  <div className="sim-section__title">智能体分布</div>
                  <div className="sim-chart-row">
                    <svg viewBox="0 0 100 100" className="sim-donut" width={90} height={90}>
                      {(() => {
                        const entries = Object.entries(typeStats).filter(([k]) => k !== 'total')
                        let cumAngle = 0
                        return entries.map(([type, count]) => {
                          const pct = count / typeStats.total
                          const startAngle = cumAngle * 2 * Math.PI
                          cumAngle += pct
                          const endAngle = cumAngle * 2 * Math.PI
                          const largeArc = pct > 0.5 ? 1 : 0
                          const x1 = 50 + 38 * Math.cos(startAngle - Math.PI / 2)
                          const y1 = 50 + 38 * Math.sin(startAngle - Math.PI / 2)
                          const x2 = 50 + 38 * Math.cos(endAngle - Math.PI / 2)
                          const y2 = 50 + 38 * Math.sin(endAngle - Math.PI / 2)
                          return (
                            <path key={type}
                              d={`M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={AGENT_TYPE_COLORS[type]} opacity={0.85} />
                          )
                        })
                      })()}
                      <circle cx={50} cy={50} r={22} fill="#0e1116" opacity={0.8} />
                      <text x={50} y={48} textAnchor="middle" fill="#c5cbd3" fontSize={11} fontWeight={600}>{typeStats.total.toLocaleString()}</text>
                      <text x={50} y={60} textAnchor="middle" fill="#738091" fontSize={7}>总计</text>
                    </svg>
                    <div className="sim-donut-legend">
                      {Object.entries(typeStats).filter(([k]) => k !== 'total').map(([type, count]) => (
                        <div key={type} className="sim-type-row">
                          <span className="sim-type-row__dot" style={{ background: AGENT_TYPE_COLORS[type] }} />
                          <span className="sim-type-row__label">{type}</span>
                          <span className="sim-type-row__count">{count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Divider style={{ margin: '8px 0', opacity: 0.3 }} />

                {/* Emotion Distribution (ECharts) */}
                <div className="sim-section">
                  <div className="sim-section__title">情绪分布</div>
                  <ReactECharts option={emotionChartOption} style={{ height: 130 }} opts={{ renderer: 'canvas' }} />
                </div>

                <Divider style={{ margin: '8px 0', opacity: 0.3 }} />

                {/* Activity Sparkline (ECharts) */}
                <div className="sim-section">
                  <div className="sim-section__title">活跃度趋势</div>
                  <ReactECharts option={activitySparkOption} style={{ height: 60 }} opts={{ renderer: 'canvas' }} />
                </div>

                <Divider style={{ margin: '8px 0', opacity: 0.3 }} />

                <div className="sim-section">
                  <div className="sim-section__title">热搜 Top5</div>
                  {hotTopicHeats.map((item, i) => (
                    <div key={item.topic} className="sim-topic-row">
                      <Tag minimal round className="sim-topic-row__rank">{i + 1}</Tag>
                      <span>{item.topic}</span>
                      <span className="sim-topic-row__heat">{item.heat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leftTab === 'agents' && (
              <AgentTable
                agents={agents}
                onAgentClick={handleAgentClick}
                selectedAgentId={selectedAgentId}
              />
            )}

            {leftTab === 'intervene' && (
              <div style={{ padding: 12 }}>
                <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>实时干预操作</div>
                <Button small fill icon="blocked-person" text="封禁用户" style={{ marginBottom: 6 }} />
                <Button small fill icon="new-object" text="注入事件" style={{ marginBottom: 6 }} />
                <Button small fill icon="trash" text="删除帖子" style={{ marginBottom: 6 }} />
                <Button small fill icon="edit" text="修改参数" style={{ marginBottom: 6 }} />
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>干预历史</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center' }}>暂无干预记录</div>
              </div>
            )}
          </div>
        </div>

        {/* Config Sidebar (in flex flow, not floating) */}
        {showConfig && (
          <GraphConfigSidebar
            settings={graphSettings}
            onSettingsChange={setGraphSettings}
            onClose={() => setShowConfig(false)}
          />
        )}

        {/* Center: Graph */}
        <div className="sim-view__center">
          <NetworkGraph
            nodes={graphNodes}
            links={mockLinks}
            typeColors={AGENT_TYPE_COLORS}
            onNodeClick={handleAgentClick}
            selectedNodeId={selectedAgentId}
            settings={graphSettings}
          />
        </div>

        {/* Right Panel */}
        <div className="sim-view__right sim-glass">
          <div className="sim-glass__tabs">
            {[
              { id: 'posts', label: '博文流', icon: 'comment' },
              { id: 'events', label: '事件', icon: 'timeline-events' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`sim-glass__tab ${rightTab === tab.id ? 'sim-glass__tab--active' : ''}`}
                onClick={() => setRightTab(tab.id)}
              >
                <Icon icon={tab.icon as any} size={12} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="sim-glass__content">
            {rightTab === 'posts' && (
              <PostStream posts={recentActions} currentStep={step} onAgentClick={handleAgentClick} />
            )}

            {rightTab === 'events' && (
              <div style={{ padding: 12, fontSize: 12 }}>
                <Tag intent="warning" minimal icon="warning-sign" style={{ marginBottom: 8 }}>外部事件时间线</Tag>
                {[
                  { step: 0, title: '事件曝光', desc: '天价耳环事件初始帖子发布，引发关注' },
                  { step: 30, title: '舆论发酵', desc: 'KOL开始转发讨论，话题热度上升' },
                  { step: 50, title: '媒体报道', desc: '主流媒体介入报道，事件上热搜' },
                  { step: 80, title: '商家回应', desc: '涉事商家发布声明，引发二次讨论' },
                  { step: 120, title: '官方回应', desc: '监管部门发布调查声明' },
                  { step: 160, title: '处理结果', desc: '最终处罚结果公布' },
                ].map((evt) => (
                  <div key={evt.step} className="sim-event-item" style={{ opacity: evt.step <= step ? 1 : 0.4 }}>
                    <div className="sim-event-item__dot" style={{ background: evt.step <= step ? 'var(--accent-blue)' : 'var(--bg-hover)' }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>Step {evt.step}: {evt.title}</div>
                      <div style={{ color: 'var(--text-muted)', marginTop: 2, fontSize: 11 }}>{evt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Activity Curve (ECharts) ── */}
      <div className="sim-view__bottom sim-glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
          <Icon icon="timeline-events" size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>活跃度态势变化</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Step {step}/200 | 当前活跃: {metrics.activeCount} | 霍克斯: {metrics.hawkesIntensity.toFixed(2)}
          </span>
        </div>
        <ReactECharts option={bottomChartOption} style={{ height: 90 }} opts={{ renderer: 'canvas' }} />
      </div>

      {/* Agent Detail Drawer */}
      <AgentDetailDrawer
        isOpen={drawerOpen}
        agent={selectedAgent}
        onClose={() => { setDrawerOpen(false); setSelectedAgentId(null) }}
      />
    </div>
  )
}

export default SimulationView
