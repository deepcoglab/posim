import React, { useState } from 'react'
import { Button, Tag, Icon, InputGroup, ProgressBar, Card, HTMLSelect, Tooltip, Divider } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../stores/appStore'
import { useSimulationStore, SimulationRun } from '../../stores/simulationStore'

const MOCK_RUNS: SimulationRun[] = [
  {
    id: 1, scenario_id: 1, scenario_name: '天价耳环事件', status: 'completed',
    current_step: 200, total_steps: 200, started_at: '2026-02-21 15:29:57', completed_at: '2026-02-21 18:45:12',
    agent_count: 412, stats: { total_actions: 8456 },
    config_label: 'EBDI基线', model: 'Qwen2.5-14B',
  },
  {
    id: 2, scenario_id: 2, scenario_name: '武大图书馆事件', status: 'completed',
    current_step: 200, total_steps: 200, started_at: '2026-02-21 02:14:03', completed_at: '2026-02-21 05:30:18',
    agent_count: 398, stats: { total_actions: 7823 },
    config_label: 'EBDI基线', model: 'Qwen2.5-14B',
  },
  {
    id: 3, scenario_id: 3, scenario_name: '西贝预制菜事件', status: 'completed',
    current_step: 200, total_steps: 200, started_at: '2026-02-23 14:54:42', completed_at: '2026-02-23 17:22:05',
    agent_count: 437, stats: { total_actions: 9102 },
    config_label: 'EBDI基线', model: 'Qwen2.5-14B',
  },
  {
    id: 4, scenario_id: 1, scenario_name: '天价耳环事件', status: 'completed',
    current_step: 200, total_steps: 200, started_at: '2026-03-02 22:29:29', completed_at: '2026-03-03 01:15:44',
    agent_count: 412, stats: { total_actions: 6234 },
    config_label: '消融实验(无EBDI)', model: 'Qwen2.5-14B',
  },
  {
    id: 5, scenario_id: 1, scenario_name: '天价耳环事件', status: 'running',
    current_step: 142, total_steps: 200, started_at: '2026-03-15 19:00:00',
    agent_count: 412, stats: { total_actions: 5891 },
    config_label: '消融实验(CoT)', model: 'Qwen2.5-14B',
  },
  {
    id: 6, scenario_id: 2, scenario_name: '武大图书馆事件', status: 'completed',
    current_step: 200, total_steps: 200, started_at: '2026-03-03 21:25:21', completed_at: '2026-03-04 00:10:33',
    agent_count: 398, stats: { total_actions: 5102 },
    config_label: '消融实验(无EBDI)', model: 'Qwen2.5-14B',
  },
]

const statusIntent = (s: string) => s === 'completed' ? 'success' as const : s === 'running' ? 'primary' as const : s === 'failed' ? 'danger' as const : s === 'paused' ? 'warning' as const : 'none' as const
const statusLabel = (s: string) => s === 'completed' ? '已完成' : s === 'running' ? '运行中' : s === 'failed' ? '失败' : s === 'paused' ? '已暂停' : '等待中'
const statusIcon = (s: string) => s === 'completed' ? 'tick-circle' : s === 'running' ? 'pulse' : s === 'failed' ? 'error' : s === 'paused' ? 'pause' : 'time'

function formatDuration(start?: string, end?: string): string {
  if (!start) return '-'
  const s = new Date(start).getTime()
  const e = end ? new Date(end).getTime() : Date.now()
  const diff = Math.floor((e - s) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const SimulationRuns: React.FC = () => {
  const { t } = useTranslation()
  const { openTab } = useAppStore()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredRuns = MOCK_RUNS.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.scenario_name.toLowerCase().includes(search.toLowerCase()) &&
        !(r as any).config_label?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleViewResult = (run: SimulationRun) => {
    openTab({
      id: `sim-result-${run.id}`,
      label: `仿真结果 - ${run.scenario_name}`,
      icon: 'chart',
      path: `/simulation/result/${run.id}`,
      closable: true,
    })
  }

  const handleViewLive = (run: SimulationRun) => {
    openTab({
      id: `sim-live-${run.id}`,
      label: `推演实况 #${run.id}`,
      icon: 'pulse',
      path: `/simulation/live/${run.id}`,
      closable: true,
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__title">
          <Icon icon="play" style={{ marginRight: 8 }} />{t('sidebar.sim_runs')}
        </div>
        <div className="page-header__actions">
          <Button intent="primary" icon="add" text={t('simulation.newRun')} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <InputGroup
          leftIcon="search"
          placeholder="搜索仿真场景..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
        <HTMLSelect value={filter} onChange={(e) => setFilter(e.target.value)} minimal>
          <option value="all">全部状态</option>
          <option value="running">运行中</option>
          <option value="completed">已完成</option>
          <option value="failed">失败</option>
          <option value="pending">等待中</option>
          <option value="paused">已暂停</option>
        </HTMLSelect>
        <span style={{ flex: 1 }} />
        <Tag minimal>{filteredRuns.length} 条记录</Tag>
        <Button minimal icon="refresh" text={t('common.refresh')} />
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {filteredRuns.map((run) => {
          const progress = run.current_step / run.total_steps
          const isRunning = run.status === 'running'
          const isCompleted = run.status === 'completed'
          return (
            <Card
              key={run.id}
              interactive={isCompleted}
              onClick={isCompleted ? () => handleViewResult(run) : undefined}
              style={{
                padding: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: isCompleted ? 'pointer' : 'default',
              }}
              className="sim-run-card"
            >
              {/* Color accent top bar */}
              <div style={{
                height: 3,
                background: isRunning
                  ? 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))'
                  : isCompleted
                    ? 'var(--accent-green)'
                    : run.status === 'failed' ? 'var(--accent-red)' : 'var(--bg-hover)',
              }} />

              <div style={{ padding: '14px 18px' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon icon={statusIcon(run.status) as any} size={14}
                    style={{ color: isCompleted ? 'var(--accent-green)' : isRunning ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 15, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {run.scenario_name}
                  </span>
                  <Tag intent={statusIntent(run.status)} minimal round style={{ fontSize: 10 }}>{statusLabel(run.status)}</Tag>
                </div>

                {/* Config label */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  {(run as any).config_label && (
                    <Tag minimal round style={{ fontSize: 10, background: 'rgba(76,144,240,0.12)', color: 'var(--accent-blue)' }}>
                      {(run as any).config_label}
                    </Tag>
                  )}
                  {(run as any).model && (
                    <Tag minimal round style={{ fontSize: 10 }}>{(run as any).model}</Tag>
                  )}
                  <Tag minimal round style={{ fontSize: 10 }}>#{run.id}</Tag>
                </div>

                {/* Key metrics grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.3px' }}>智能体</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)' }}>{run.agent_count}</div>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.3px' }}>总行为</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-green)' }}>{run.stats.total_actions.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.3px' }}>耗时</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)' }}>{formatDuration(run.started_at, run.completed_at)}</div>
                  </div>
                </div>

                {/* Progress bar for running */}
                {isRunning && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-muted)' }}>
                      <span>Step {run.current_step}/{run.total_steps}</span>
                      <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <ProgressBar value={progress} intent="primary" stripes animate style={{ height: 4 }} />
                  </div>
                )}

                {/* Step progress for completed */}
                {isCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                    <Icon icon="walk" size={10} />
                    <span>{run.current_step}/{run.total_steps} 步完成</span>
                    <span style={{ marginLeft: 'auto' }}>
                      <Icon icon="time" size={10} style={{ marginRight: 4 }} />{run.started_at?.slice(5, 16)}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <Divider style={{ margin: '8px 0', opacity: 0.4 }} />
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isRunning && (
                    <>
                      <Button small intent="primary" icon="pulse" text="实时查看" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleViewLive(run) }} />
                      <Button small icon="pause" text="暂停" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                      <Button small intent="danger" icon="stop" text="停止" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                    </>
                  )}
                  {isCompleted && (
                    <>
                      <Button small intent="primary" icon="chart" text="查看结果" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleViewResult(run) }} />
                      <Button small icon="pulse" text="回放" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleViewLive(run) }} />
                      <Button small icon="comparison" text="对比" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                    </>
                  )}
                  {run.status === 'pending' && (
                    <>
                      <Button small intent="primary" icon="play" text="开始" />
                      <Button small icon="edit" text="编辑" />
                    </>
                  )}
                  <span style={{ flex: 1 }} />
                  <Tooltip content="导出">
                    <Button small minimal icon="export" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                  </Tooltip>
                  <Tooltip content="复制配置">
                    <Button small minimal icon="duplicate" onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                  </Tooltip>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default SimulationRuns
