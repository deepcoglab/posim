import React, { useState, useMemo, useCallback, useRef } from 'react'
import { InputGroup, Tag, HTMLSelect, Icon } from '@blueprintjs/core'
import { AgentNode } from '../../stores/simulationStore'
import classNames from 'classnames'

const AGENT_TYPE_COLORS: Record<string, string> = {
  citizen: '#4c90f0', kol: '#f5c451', media: '#ec9a3c', government: '#3dcc91',
}
const AGENT_TYPE_LABELS: Record<string, string> = {
  citizen: '普通', kol: 'KOL', media: '媒体', government: '官方',
}

interface AgentTableProps {
  agents: AgentNode[]
  onAgentClick?: (agentId: string) => void
  selectedAgentId?: string | null
  className?: string
}

type SortKey = 'username' | 'agent_type' | 'followers_count' | 'activation_count' | 'emotion_dominant'

const AgentTable: React.FC<AgentTableProps> = ({ agents, onAgentClick, selectedAgentId, className }) => {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('followers_count')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const listRef = useRef<HTMLDivElement>(null)

  const ROW_HEIGHT = 36
  const [scrollTop, setScrollTop] = useState(0)

  const filtered = useMemo(() => {
    let result = [...agents]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((a) => a.username.toLowerCase().includes(q) || a.user_id.toLowerCase().includes(q))
    }
    if (typeFilter !== 'all') result = result.filter((a) => a.agent_type === typeFilter)
    if (activeFilter === 'active') result = result.filter((a) => a.is_active)
    if (activeFilter === 'inactive') result = result.filter((a) => !a.is_active)

    result.sort((a, b) => {
      let va: any = (a as any)[sortKey]
      let vb: any = (b as any)[sortKey]
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase() }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [agents, search, typeFilter, activeFilter, sortKey, sortDir])

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }, [sortKey])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop)
  }, [])

  // Virtual scroll calculations
  const containerHeight = listRef.current?.clientHeight || 400
  const totalHeight = filtered.length * ROW_HEIGHT
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 5)
  const endIdx = Math.min(filtered.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + 5)
  const visibleAgents = filtered.slice(startIdx, endIdx)

  const stats = useMemo(() => {
    const active = agents.filter((a) => a.is_active).length
    return { total: agents.length, active, inactive: agents.length - active }
  }, [agents])

  return (
    <div className={classNames('agent-table', className)}>
      {/* Stats bar */}
      <div className="agent-table__stats">
        <span><strong>{stats.total}</strong> 总计</span>
        <span style={{ color: 'var(--accent-green)' }}><strong>{stats.active}</strong> 活跃</span>
        <span style={{ color: 'var(--text-muted)' }}><strong>{stats.inactive}</strong> 空闲</span>
      </div>

      {/* Filters */}
      <div className="agent-table__filters">
        <InputGroup
          leftIcon="search" placeholder="搜索智能体..."
          small value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <HTMLSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} iconName="caret-down">
          <option value="all">全部类型</option>
          <option value="citizen">普通用户</option>
          <option value="kol">KOL</option>
          <option value="media">媒体</option>
          <option value="government">官方</option>
        </HTMLSelect>
        <HTMLSelect value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} iconName="caret-down">
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="inactive">空闲</option>
        </HTMLSelect>
      </div>

      {/* Table header */}
      <div className="agent-table__header">
        <div className="agent-table__col agent-table__col--name" onClick={() => handleSort('username')}>
          名称 {sortKey === 'username' && <Icon icon={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} />}
        </div>
        <div className="agent-table__col agent-table__col--type" onClick={() => handleSort('agent_type')}>
          类型 {sortKey === 'agent_type' && <Icon icon={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} />}
        </div>
        <div className="agent-table__col agent-table__col--followers" onClick={() => handleSort('followers_count')}>
          粉丝 {sortKey === 'followers_count' && <Icon icon={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} />}
        </div>
        <div className="agent-table__col agent-table__col--activations" onClick={() => handleSort('activation_count')}>
          激活 {sortKey === 'activation_count' && <Icon icon={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} />}
        </div>
        <div className="agent-table__col agent-table__col--emotion" onClick={() => handleSort('emotion_dominant')}>
          情绪 {sortKey === 'emotion_dominant' && <Icon icon={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={10} />}
        </div>
      </div>

      {/* Virtual scroll body */}
      <div className="agent-table__body" ref={listRef} onScroll={handleScroll}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleAgents.map((agent, i) => {
            const idx = startIdx + i
            return (
              <div
                key={agent.user_id}
                className={classNames('agent-table__row', {
                  'agent-table__row--selected': agent.user_id === selectedAgentId,
                  'agent-table__row--active': agent.is_active,
                })}
                style={{ position: 'absolute', top: idx * ROW_HEIGHT, height: ROW_HEIGHT, left: 0, right: 0 }}
                onClick={() => onAgentClick?.(agent.user_id)}
              >
                <div className="agent-table__col agent-table__col--name">
                  <div className="agent-table__avatar" style={{ borderColor: AGENT_TYPE_COLORS[agent.agent_type] }}>
                    {agent.username.charAt(0)}
                  </div>
                  <span className="agent-table__username">{agent.username}</span>
                  {agent.is_active && <span className="agent-table__active-dot" />}
                </div>
                <div className="agent-table__col agent-table__col--type">
                  <Tag minimal round style={{
                    fontSize: 10, background: `${AGENT_TYPE_COLORS[agent.agent_type]}20`,
                    color: AGENT_TYPE_COLORS[agent.agent_type],
                  }}>
                    {AGENT_TYPE_LABELS[agent.agent_type]}
                  </Tag>
                </div>
                <div className="agent-table__col agent-table__col--followers">
                  {agent.followers_count >= 1000 ? `${(agent.followers_count / 1000).toFixed(1)}k` : agent.followers_count}
                </div>
                <div className="agent-table__col agent-table__col--activations">
                  {agent.activation_count}
                </div>
                <div className="agent-table__col agent-table__col--emotion">
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.emotion_dominant}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="agent-table__footer">
        显示 {filtered.length} / {agents.length} 智能体
      </div>
    </div>
  )
}

export default AgentTable
