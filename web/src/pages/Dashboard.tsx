import React from 'react'
import { Card, Icon, Tag, Button, ProgressBar } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/appStore'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { openTab } = useAppStore()

  const stats = [
    { label: '舆情事件', value: '3', icon: 'timeline-events', color: 'var(--accent-blue)' },
    { label: '监测方案', value: '3', icon: 'eye-open', color: 'var(--accent-green)' },
    { label: '推演场景', value: '3', icon: 'predictive-analysis', color: 'var(--accent-orange)' },
    { label: '仿真运行', value: '5', icon: 'play', color: 'var(--accent-red)' },
    { label: '智能体总数', value: '1,247', icon: 'people', color: '#7c5cfc' },
    { label: 'LLM 调用', value: '24.5K', icon: 'rocket-slant', color: 'var(--accent-gold)' },
  ]

  const recentRuns = [
    { id: 1, name: '天价耳环事件 - EBDI基线', status: 'completed' as const, progress: 1, agents: 412, steps: '200/200', score: 0.896 },
    { id: 2, name: '武大图书馆事件 - EBDI基线', status: 'completed' as const, progress: 1, agents: 398, steps: '200/200', score: 0.858 },
    { id: 3, name: '西贝预制菜事件 - EBDI基线', status: 'running' as const, progress: 0.65, agents: 437, steps: '130/200', score: undefined },
    { id: 4, name: '天价耳环事件 - 消融(无EBDI)', status: 'pending' as const, progress: 0, agents: 412, steps: '0/200', score: undefined },
  ]

  const quickActions = [
    { label: '新建推演', icon: 'add', path: '/simulation/wizard', tabId: 'sim-wizard', tabLabel: '场景配置向导' },
    { label: '查看运行', icon: 'dashboard', path: '/simulation/runs', tabId: 'sim-runs', tabLabel: '仿真管理' },
    { label: '数据浏览', icon: 'search-template', path: '/data/browser', tabId: 'data-browser', tabLabel: '数据浏览器' },
    { label: '趋势分析', icon: 'trending-up', path: '/analysis/trends', tabId: 'analysis-trends', tabLabel: '趋势分析' },
    { label: 'AI 助手', icon: 'chat', path: '/ai/chat', tabId: 'ai-chat', tabLabel: '智能对话' },
    { label: '系统设置', icon: 'cog', path: '/system/config', tabId: 'sys-config', tabLabel: '系统配置' },
  ]

  const statusIntent = (s: string) => s === 'completed' ? 'success' as const : s === 'running' ? 'primary' as const : s === 'failed' ? 'danger' as const : 'none' as const
  const statusLabel = (s: string) => s === 'completed' ? '已完成' : s === 'running' ? '运行中' : s === 'failed' ? '失败' : '等待中'

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__title">{t('sidebar.dashboard_overview')}</div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon={s.icon as any} size={18} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Recent Simulation Runs */}
        <Card style={{ padding: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><Icon icon="history" size={14} style={{ marginRight: 8 }} />最近推演运行</span>
            <Button small minimal text="查看全部" rightIcon="arrow-right"
              onClick={() => openTab({ id: 'sim-runs', label: '仿真管理', icon: 'play', path: '/simulation/runs', closable: true })}
            />
          </div>
          <div style={{ padding: '8px 12px' }}>
            {recentRuns.map((run) => (
              <div key={run.id} className="run-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className={`status-dot status-dot--${run.status}`} />
                  <span style={{ fontWeight: 500, fontSize: 13, flex: 1 }}>{run.name}</span>
                  <Tag minimal intent={statusIntent(run.status)} style={{ fontSize: 10 }}>{statusLabel(run.status)}</Tag>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>智能体: {run.agents}</span>
                  <span>步骤: {run.steps}</span>
                  {run.score !== undefined && <span>综合评分: <strong style={{ color: 'var(--accent-green)' }}>{run.score.toFixed(3)}</strong></span>}
                </div>
                {run.status === 'running' && <ProgressBar value={run.progress} intent="primary" stripes animate style={{ height: 4 }} />}
                {run.status === 'completed' && <ProgressBar value={1} intent="success" style={{ height: 4 }} />}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card style={{ padding: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 14 }}>
            <Icon icon="lightning" size={14} style={{ marginRight: 8 }} />快捷操作
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {quickActions.map((a) => (
              <Card
                key={a.label}
                interactive
                style={{ padding: '20px 12px', textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => openTab({ id: a.tabId, label: a.tabLabel, icon: a.icon, path: a.path, closable: true })}
              >
                <Icon icon={a.icon as any} size={24} color="var(--accent-blue)" />
                <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500 }}>{a.label}</div>
              </Card>
            ))}
          </div>

          {/* System Status */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
              <Icon icon="dashboard" size={14} style={{ marginRight: 8 }} />系统状态
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>CPU</span>
                <span>23%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Memory</span>
                <span>6.2 / 16 GB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GPU</span>
                <span>45%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Disk</span>
                <span>128 / 512 GB</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <Card style={{ padding: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 14 }}>
          <Icon icon="notifications" size={14} style={{ marginRight: 8 }} />系统通知
          <Tag minimal round intent="warning" style={{ marginLeft: 8, fontSize: 10 }}>3</Tag>
        </div>
        <div style={{ padding: '8px 18px' }}>
          {[
            { time: '2分钟前', msg: '推演运行 "西贝预制菜-EBDI基线" 已完成第130步', intent: 'primary' as const },
            { time: '15分钟前', msg: 'LLM API 端点 qwen-72b-2 响应延迟超过阈值 (>5s)', intent: 'warning' as const },
            { time: '1小时前', msg: '数据导入任务 "天价耳环事件数据" 已成功完成', intent: 'success' as const },
          ].map((n, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon icon="dot" intent={n.intent} size={10} />
              <span style={{ flex: 1, fontSize: 13 }}>{n.msg}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
