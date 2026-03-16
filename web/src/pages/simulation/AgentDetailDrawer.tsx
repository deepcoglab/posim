import React, { useState } from 'react'
import { Dialog, Tabs, Tab, Tag, Icon, Button, Divider, Card, TextArea, Tooltip } from '@blueprintjs/core'
import { AgentNode } from '../../stores/simulationStore'

const AGENT_TYPE_COLORS: Record<string, string> = {
  citizen: '#4c90f0', kol: '#f5c451', media: '#ec9a3c', government: '#3dcc91',
}
const EMOTION_COLORS: Record<string, string> = {
  anger: '#e76a6e', sadness: '#738091', fear: '#ec9a3c', surprise: '#f5c451',
  joy: '#3dcc91', disgust: '#9f7aea', neutral: '#abb3bf',
}
const TYPE_LABELS: Record<string, string> = {
  citizen: '普通公民', kol: '意见领袖', media: '媒体账号', government: '官方账号',
}

const PHASE_COLORS = {
  perception: '#4c90f0',
  belief: '#3dcc91',
  desire: '#ec9a3c',
  intention: '#e76a6e',
  action: '#f5c451',
}

interface AgentDetailDrawerProps {
  isOpen: boolean
  agent: AgentNode | null
  onClose: () => void
}

// SVG cognitive chain network visualization
const CognitiveNetworkDiagram: React.FC<{ step: any }> = ({ step }) => {
  const nodes = [
    { id: 'P', label: '感知', x: 80, y: 40, color: PHASE_COLORS.perception },
    { id: 'B', label: '信念', x: 220, y: 40, color: PHASE_COLORS.belief },
    { id: 'D', label: '欲望', x: 360, y: 40, color: PHASE_COLORS.desire },
    { id: 'I', label: '意图', x: 500, y: 40, color: PHASE_COLORS.intention },
    { id: 'A', label: '行为', x: 640, y: 40, color: PHASE_COLORS.action },
  ]
  const infoNodes = [
    { id: 'P1', label: step.perception.slice(0, 12) + '...', x: 80, y: 110, color: PHASE_COLORS.perception, parent: 'P' },
    { id: 'B1', label: step.belief.event.slice(0, 10) + '...', x: 190, y: 110, color: PHASE_COLORS.belief, parent: 'B' },
    { id: 'B2', label: `可信${(step.belief.credibility * 100).toFixed(0)}%`, x: 260, y: 110, color: PHASE_COLORS.belief, parent: 'B' },
    { id: 'D1', label: step.desire.slice(0, 10) + '...', x: 360, y: 110, color: PHASE_COLORS.desire, parent: 'D' },
    { id: 'I1', label: step.intention.slice(0, 10) + '...', x: 500, y: 110, color: PHASE_COLORS.intention, parent: 'I' },
    { id: 'A1', label: step.action.type, x: 640, y: 110, color: PHASE_COLORS.action, parent: 'A' },
  ]
  return (
    <svg width="100%" viewBox="0 0 720 140" style={{ background: 'rgba(14,17,22,0.4)', borderRadius: 8, marginTop: 8 }}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#5f6b7c" />
        </marker>
      </defs>
      {/* Main flow arrows */}
      {nodes.slice(0, -1).map((n, i) => (
        <line key={`arrow-${i}`} x1={n.x + 30} y1={n.y} x2={nodes[i + 1].x - 30} y2={nodes[i + 1].y}
          stroke="#5f6b7c" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
      ))}
      {/* Info node connections */}
      {infoNodes.map((in_) => {
        const parent = nodes.find((n) => n.id === in_.parent)!
        return <line key={`info-${in_.id}`} x1={parent.x} y1={parent.y + 18} x2={in_.x} y2={in_.y - 10}
          stroke={`${in_.color}40`} strokeWidth={1} strokeDasharray="3,3" />
      })}
      {/* Main phase nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={20} fill={`${n.color}20`} stroke={n.color} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize={11} fontWeight={600}>{n.label}</text>
        </g>
      ))}
      {/* Info nodes */}
      {infoNodes.map((n) => (
        <g key={n.id}>
          <rect x={n.x - 40} y={n.y - 10} width={80} height={20} rx={4} fill={`${n.color}15`} stroke={`${n.color}40`} strokeWidth={0.5} />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#abb3bf" fontSize={9}>{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({ isOpen, agent, onClose }) => {
  const [activeTab, setActiveTab] = useState('bdi')
  const [chatInput, setChatInput] = useState('')
  const [expandedStep, setExpandedStep] = useState<number | null>(0)

  if (!agent) return null

  const mockBDISteps = [
    {
      step: 142, perception: '感知到热搜话题 #天价耳环 持续升温，多个KOL发表评论，话题讨论量突破10万',
      belief: { event: '消费者权益受到侵害', credibility: 0.85, source_trust: 0.7, emotion_shift: '愤怒上升' },
      desire: '表达对不公平定价的不满，传播维权信息，号召更多人关注',
      intention: '发布一条评论帖子，转发相关维权信息，@相关监管部门',
      action: { type: 'post', content: '这件事太过分了，必须严查！消费者权益不容侵犯！@市场监管局 请介入调查！' },
      context: '该智能体在前序步骤中已积累了3条相关帖子的阅读记忆，情绪从中立逐渐转向愤怒',
    },
    {
      step: 138, perception: '接收到关注用户转发的事件详情帖，帖子中包含价格对比截图和消费者投诉截图',
      belief: { event: '事件信息基本属实但可能有夸大成分', credibility: 0.6, source_trust: 0.5, emotion_shift: '保持中立' },
      desire: '了解事件真相，等待更多信息，保持理性判断',
      intention: '转发帖子并添加理性评论，提醒他人不要轻信单方面信息',
      action: { type: 'repost', content: '转发扩散，希望能有更多调查结果。建议大家理性看待，等官方通报。' },
      context: '信息来源为弱关系链，该智能体的信息素养较高，倾向于多方求证',
    },
    {
      step: 130, perception: '推荐系统推送了官方媒体关于该事件的深度调查报道，报道态度较为客观',
      belief: { event: '事件有多方责任，不完全是商家单方面问题', credibility: 0.75, source_trust: 0.85, emotion_shift: '趋于理性' },
      desire: '传播权威信息源，帮助身边人了解事件全貌',
      intention: '转发官方报道，附上自己的简要分析',
      action: { type: 'repost', content: '官方调查报告出来了，情况比想象的复杂。建议大家看完再评论。#理性讨论' },
      context: '官方媒体报道信任度高，该智能体信念更新明显，从负面转向中立',
    },
    {
      step: 118, perception: '检测到社交圈中出现大量情绪化言论和未经证实的传闻，部分包含攻击性语言',
      belief: { event: '舆论环境正在恶化，谣言与事实混杂', credibility: 0.4, source_trust: 0.3, emotion_shift: '担忧上升' },
      desire: '抵制不实信息，维护理性讨论环境',
      intention: '发布一条呼吁理性的帖子，引用官方信息辟谣',
      action: { type: 'post', content: '请大家不要传播未经证实的信息！以官方公告为准。造谣是要承担法律责任的。' },
      context: '社交网络中虚假信息占比上升，该智能体的规范信念被激活',
    },
    {
      step: 105, perception: '收到好友私信讨论该事件，好友持激烈负面态度，要求一起声援',
      belief: { event: '朋友的情绪可以理解但过于极端', credibility: 0.55, source_trust: 0.8, emotion_shift: '共情但克制' },
      desire: '安抚朋友情绪的同时保持自己的理性立场',
      intention: '回复朋友消息，表示理解但建议冷静，不采取激进行为',
      action: { type: 'comment', content: '我理解你的心情，但现在信息还不完整，我们等等看官方怎么说。冲动发言对解决问题没有帮助。' },
      context: '强社交关系触发了情感共鸣，但该智能体理性认知占主导',
    },
    {
      step: 88, perception: '监管部门发布公告表示已介入调查，将在7个工作日内公布结果',
      belief: { event: '制度体系正在发挥作用，问题有望得到解决', credibility: 0.9, source_trust: 0.95, emotion_shift: '积极乐观' },
      desire: '肯定制度效能，传播正能量，等待最终结果',
      intention: '发布一条支持性帖子，表达对监管效率的认可',
      action: { type: 'post', content: '监管部门已经介入了！相信法律会给出公正的裁决。大家耐心等待调查结果。👍' },
      context: '权威机构介入大幅提升了信念可信度和情绪正面性',
    },
  ]

  const mockActivities = Array.from({ length: 30 }, (_, i) => ({
    step: 142 - i * 2,
    active: Math.random() > 0.35,
    action: ['post', 'repost', 'comment', 'like', 'idle'][Math.floor(Math.random() * 5)],
  }))

  const mockPosts = [
    { id: 'p1', step: 142, type: 'post', content: '这件事太过分了，必须严查！消费者权益不容侵犯！@市场监管局 请介入调查！', emotion: 'anger', stance: '负面', likes: 23, reposts: 8 },
    { id: 'p2', step: 138, type: 'repost', content: '转发扩散，希望能有更多调查结果。建议大家理性看待，等官方通报。', emotion: 'neutral', stance: '中立', likes: 5, reposts: 2 },
    { id: 'p3', step: 130, type: 'repost', content: '官方调查报告出来了，情况比想象的复杂。建议大家看完再评论。#理性讨论', emotion: 'neutral', stance: '中立', likes: 18, reposts: 6 },
    { id: 'p4', step: 118, type: 'post', content: '请大家不要传播未经证实的信息！以官方公告为准。造谣是要承担法律责任的。', emotion: 'fear', stance: '中立', likes: 45, reposts: 15 },
    { id: 'p5', step: 105, type: 'comment', content: '我理解你的心情，但现在信息还不完整，我们等等看官方怎么说。', emotion: 'neutral', stance: '中立', likes: 12, reposts: 0 },
    { id: 'p6', step: 88, type: 'post', content: '监管部门已经介入了！相信法律会给出公正的裁决。大家耐心等待调查结果。', emotion: 'joy', stance: '正面', likes: 67, reposts: 22 },
  ]

  const beliefs = [
    { category: '事件信念', items: [
      { key: '天价耳环事件', value: '消费者权益受侵害', confidence: 0.85 },
      { key: '商家回应', value: '回应缺乏诚意', confidence: 0.72 },
      { key: '监管介入', value: '制度正在发挥作用', confidence: 0.9 },
    ]},
    { category: '社会信念', items: [
      { key: '消费者保护', value: '监管体系有待完善', confidence: 0.78 },
      { key: '舆论环境', value: '网络维权有一定效果', confidence: 0.65 },
      { key: '信息质量', value: '谣言与事实混杂需辨别', confidence: 0.7 },
    ]},
    { category: '心理信念', items: [
      { key: '公平正义', value: '追求公平定价', confidence: 0.9 },
      { key: '信任度', value: '对商家信任降低', confidence: 0.55 },
      { key: '自我效能', value: '个人发声有价值', confidence: 0.68 },
    ]},
    { category: '规范信念', items: [
      { key: '社交规范', value: '应理性表达观点', confidence: 0.7 },
      { key: '法律意识', value: '支持依法维权', confidence: 0.82 },
      { key: '信息伦理', value: '不传播未证实信息', confidence: 0.88 },
    ]},
  ]

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      className="bp5-dark"
      canOutsideClickClose
      canEscapeKeyClose
      style={{
        width: '85vw',
        maxWidth: 1100,
        height: '80vh',
        maxHeight: 800,
        background: 'var(--bg-primary)',
        borderRadius: 12,
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div className="agent-drawer__header" style={{ borderRadius: '12px 12px 0 0' }}>
        <div className="agent-drawer__avatar-large" style={{ color: AGENT_TYPE_COLORS[agent.agent_type] }}>
          {agent.username.charAt(0)}
        </div>
        <div className="agent-drawer__meta">
          <div className="agent-drawer__name">{agent.username}</div>
          <div className="agent-drawer__stats">
            <span><Icon icon="people" size={10} /> {agent.followers_count.toLocaleString()} 粉丝</span>
            <span><Icon icon="following" size={10} /> {agent.following_count} 关注</span>
            <span><Icon icon="edit" size={10} /> {agent.posts_count} 帖子</span>
            <span><Icon icon="flash" size={10} /> {agent.activation_count} 次激活</span>
          </div>
          <div className="agent-drawer__tags">
            <Tag intent="primary" minimal style={{ background: `${AGENT_TYPE_COLORS[agent.agent_type]}30`, color: AGENT_TYPE_COLORS[agent.agent_type] }}>
              {TYPE_LABELS[agent.agent_type]}
            </Tag>
            <Tag minimal style={{ background: `${EMOTION_COLORS[agent.emotion_dominant] || '#abb3bf'}30`, color: EMOTION_COLORS[agent.emotion_dominant] }}>
              {agent.emotion_dominant} ({(agent.emotion_intensity * 100).toFixed(0)}%)
            </Tag>
            {agent.is_active && <Tag intent="success" minimal icon="dot">活跃</Tag>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{agent.identity_description}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Button small icon="locate" text="定位到图中" />
          <Button small icon="ban-circle" intent="danger" text="封禁" />
          <Button small icon="chat" text="对话" onClick={() => setActiveTab('chat')} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px', flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Tabs id="agent-tabs" selectedTabId={activeTab} onChange={(id) => setActiveTab(id as string)} large renderActiveTabPanelOnly>

          {/* Tab 1: BDI Chain - Enriched */}
          <Tab id="bdi" title="认知链路" icon="diagram-tree" panel={
            <div className="bdi-chain">
              {/* View mode toggle hint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                <Icon icon="info-sign" size={12} />
                <span>点击展开查看详细认知推理过程，包括文本描述和网络链路结构</span>
              </div>

              {mockBDISteps.map((s, idx) => {
                const isExpanded = expandedStep === idx
                return (
                  <div key={idx} className="bdi-chain__step" style={{ borderColor: isExpanded ? 'var(--accent-blue)' : undefined }}>
                    <div className="bdi-chain__step-header" onClick={() => setExpandedStep(isExpanded ? null : idx)}>
                      <Icon icon={isExpanded ? 'chevron-down' : 'chevron-right'} size={12} />
                      <Icon icon="time" size={12} />
                      <span>Step {s.step}</span>
                      <Tag minimal round style={{ fontSize: 9 }}>{s.action.type}</Tag>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {s.context.slice(0, 30)}...
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="bdi-chain__step-body">
                        {/* Cognitive network diagram */}
                        <CognitiveNetworkDiagram step={s} />

                        {/* Context note */}
                        <div style={{ background: 'rgba(76,144,240,0.08)', borderRadius: 6, padding: '8px 12px', margin: '10px 0', fontSize: 11, color: 'var(--accent-blue)', border: '1px solid rgba(76,144,240,0.15)' }}>
                          <Icon icon="lightbulb" size={11} style={{ marginRight: 6 }} />
                          {s.context}
                        </div>

                        {/* EBDI phases */}
                        <div className="bdi-chain__phase">
                          <div className="bdi-chain__phase-title">
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PHASE_COLORS.perception, marginRight: 6 }} />
                            感知 Perception
                          </div>
                          <div className="bdi-chain__phase-content">{s.perception}</div>
                        </div>
                        <div className="bdi-chain__phase bdi-chain__phase--belief">
                          <div className="bdi-chain__phase-title">
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PHASE_COLORS.belief, marginRight: 6 }} />
                            信念 Belief
                          </div>
                          <div className="bdi-chain__phase-content">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                              <div><span style={{ color: 'var(--text-muted)', fontSize: 11 }}>事件判断:</span> {s.belief.event}</div>
                              <div><span style={{ color: 'var(--text-muted)', fontSize: 11 }}>情绪变化:</span> {s.belief.emotion_shift}</div>
                              <div>可信度: <Tag minimal round intent={s.belief.credibility > 0.7 ? 'success' : 'warning'} style={{ fontSize: 9 }}>{(s.belief.credibility * 100).toFixed(0)}%</Tag></div>
                              <div>来源信任: <Tag minimal round intent={s.belief.source_trust > 0.7 ? 'success' : 'warning'} style={{ fontSize: 9 }}>{(s.belief.source_trust * 100).toFixed(0)}%</Tag></div>
                            </div>
                          </div>
                        </div>
                        <div className="bdi-chain__phase bdi-chain__phase--desire">
                          <div className="bdi-chain__phase-title">
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PHASE_COLORS.desire, marginRight: 6 }} />
                            欲望 Desire
                          </div>
                          <div className="bdi-chain__phase-content">{s.desire}</div>
                        </div>
                        <div className="bdi-chain__phase bdi-chain__phase--intention">
                          <div className="bdi-chain__phase-title">
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PHASE_COLORS.intention, marginRight: 6 }} />
                            意图 Intention
                          </div>
                          <div className="bdi-chain__phase-content">{s.intention}</div>
                        </div>
                        <div className="bdi-chain__phase bdi-chain__phase--action">
                          <div className="bdi-chain__phase-title">
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PHASE_COLORS.action, marginRight: 6 }} />
                            行为 Action ({s.action.type})
                          </div>
                          <div className="bdi-chain__phase-content" style={{ fontStyle: 'italic', background: 'rgba(245,196,81,0.06)', padding: '8px 12px', borderRadius: 6 }}>"{s.action.content}"</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          } />

          {/* Tab 2: Activity History */}
          <Tab id="activity" title="活跃历史" icon="timeline-events" panel={
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>活跃时间线</div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16, flexWrap: 'wrap' }}>
                {mockActivities.map((a, i) => (
                  <Tooltip key={i} content={`Step ${a.step}: ${a.action}`}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 2, cursor: 'pointer',
                      background: a.active ? (a.action === 'post' ? 'var(--accent-blue)' : a.action === 'repost' ? 'var(--accent-green)' :
                        a.action === 'comment' ? 'var(--accent-orange)' : a.action === 'like' ? 'var(--accent-red)' : 'var(--bg-hover)') : 'var(--bg-tertiary)',
                      opacity: a.active ? 0.9 : 0.3,
                    }} />
                  </Tooltip>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-blue)', borderRadius: 2, marginRight: 4 }}/>发帖</span>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-green)', borderRadius: 2, marginRight: 4 }}/>转发</span>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-orange)', borderRadius: 2, marginRight: 4 }}/>评论</span>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-red)', borderRadius: 2, marginRight: 4 }}/>点赞</span>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--bg-tertiary)', borderRadius: 2, marginRight: 4 }}/>空闲</span>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <Card style={{ padding: 12, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>总激活</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{agent.activation_count}</div>
                </Card>
                <Card style={{ padding: 12, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>发帖数</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-blue)' }}>{agent.posts_count}</div>
                </Card>
                <Card style={{ padding: 12, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>活跃率</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>{(Math.random() * 40 + 30).toFixed(0)}%</div>
                </Card>
                <Card style={{ padding: 12, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>影响力</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-gold)' }}>{(Math.random() * 0.8 + 0.1).toFixed(2)}</div>
                </Card>
              </div>
            </div>
          } />

          {/* Tab 3: Posts */}
          <Tab id="posts" title="发言记录" icon="edit" panel={
            <div style={{ padding: 16 }}>
              {mockPosts.map((post) => (
                <Card key={post.id} style={{ padding: 12, marginBottom: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Tag minimal round style={{ fontSize: 9 }}>{post.type}</Tag>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Step {post.step}</span>
                    <span style={{ flex: 1 }} />
                    <Tag minimal style={{ fontSize: 9, background: `${EMOTION_COLORS[post.emotion]}30`, color: EMOTION_COLORS[post.emotion] }}>{post.emotion}</Tag>
                    <Tag minimal style={{ fontSize: 9 }}>{post.stance}</Tag>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{post.content}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span><Icon icon="heart" size={10} /> {post.likes}</span>
                    <span><Icon icon="share" size={10} /> {post.reposts}</span>
                  </div>
                </Card>
              ))}
            </div>
          } />

          {/* Tab 4: Dynamic Charts */}
          <Tab id="charts" title="动态曲线" icon="chart" panel={
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>情绪/活跃度/行为/立场变化趋势</div>
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 8, padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                <Icon icon="chart" size={48} style={{ opacity: 0.3 }} />
                <div style={{ marginTop: 12 }}>ECharts 图表区域</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>情绪时序曲线 · 活跃度变化 · 行为类型分布 · 立场演变</div>
              </div>
            </div>
          } />

          {/* Tab 5: Ego Network */}
          <Tab id="network" title="社交网络" icon="graph" panel={
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Ego 网络子图</div>
              <div style={{ background: '#111518', borderRadius: 8, padding: 40, textAlign: 'center', color: 'var(--text-muted)', minHeight: 300 }}>
                <Icon icon="graph" size={48} style={{ opacity: 0.3 }} />
                <div style={{ marginTop: 12 }}>Cosmograph Ego 网络</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>展示该智能体的 1-hop 社交关系网络</div>
              </div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <Card style={{ padding: 10, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>粉丝</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{agent.followers_count.toLocaleString()}</div>
                </Card>
                <Card style={{ padding: 10, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>关注</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{agent.following_count}</div>
                </Card>
                <Card style={{ padding: 10, textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>互动</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{Math.floor(Math.random() * 50) + 10}</div>
                </Card>
              </div>
            </div>
          } />

          {/* Tab 6: Belief System */}
          <Tab id="beliefs" title="信念系统" icon="book" panel={
            <div style={{ padding: 16 }}>
              {beliefs.map((cat) => (
                <div key={cat.category} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--accent-blue)' }}>{cat.category}</div>
                  {cat.items.map((item) => (
                    <Card key={item.key} style={{ padding: '10px 14px', marginBottom: 6, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500, fontSize: 12, minWidth: 100 }}>{item.key}</span>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{item.value}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 60, height: 4, background: 'var(--bg-hover)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${item.confidence * 100}%`, height: '100%', background: item.confidence > 0.7 ? 'var(--accent-green)' : 'var(--accent-orange)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 30 }}>{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          } />

          {/* Tab 7: Memory */}
          <Tab id="memory" title="记忆系统" icon="history" panel={
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>记忆列表（按相关度排序）</div>
              {[
                { type: 'event', content: '#天价耳环 事件曝光，消费者投诉商家定价不合理', relevance: 0.95, step: 0 },
                { type: 'social', content: '关注的KOL发表了强烈谴责帖子', relevance: 0.82, step: 45 },
                { type: 'media', content: '主流媒体报道引起广泛关注', relevance: 0.78, step: 50 },
                { type: 'personal', content: '自己曾有类似消费纠纷经历', relevance: 0.7, step: -1 },
                { type: 'event', content: '商家发布道歉声明', relevance: 0.65, step: 100 },
                { type: 'official', content: '监管部门介入调查', relevance: 0.6, step: 120 },
                { type: 'social', content: '好友私信讨论该事件，表达强烈不满', relevance: 0.58, step: 105 },
                { type: 'media', content: '官方媒体发布深度调查报道', relevance: 0.55, step: 130 },
              ].map((mem, i) => (
                <Card key={i} style={{ padding: '10px 14px', marginBottom: 6, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag minimal style={{ fontSize: 9 }}>{mem.type}</Tag>
                    <span style={{ flex: 1, fontSize: 12 }}>{mem.content}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      相关度: {(mem.relevance * 100).toFixed(0)}%
                    </span>
                    {mem.step >= 0 && <Tag minimal round style={{ fontSize: 9 }}>Step {mem.step}</Tag>}
                  </div>
                </Card>
              ))}
            </div>
          } />

          {/* Tab 8: Chat as Agent */}
          <Tab id="chat" title="对话" icon="chat" panel={
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: 400 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>以 {agent.username} 的身份对话</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                系统将以该智能体的性格、信念和记忆为上下文，模拟其回应方式
              </div>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 8, padding: 16, overflowY: 'auto', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                  对话记录将显示在此处
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextArea
                  fill
                  growVertically={false}
                  style={{ minHeight: 40, maxHeight: 80, resize: 'none' }}
                  placeholder="输入消息..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button intent="primary" icon="send-message" text="发送" style={{ alignSelf: 'flex-end' }} />
              </div>
            </div>
          } />

        </Tabs>
      </div>
    </Dialog>
  )
}

export default AgentDetailDrawer
