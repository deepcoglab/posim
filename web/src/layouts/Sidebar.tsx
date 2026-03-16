import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { Tree, TreeNodeInfo, InputGroup, Icon, Tag, Tooltip, Button, Menu, MenuItem, Popover } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'
import { useAppStore, TabItem } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import classNames from 'classnames'

type NodeId = string

interface NavGroup {
  id: string
  label: string
  icon: string
  badge?: string
  badgeIntent?: 'primary' | 'warning' | 'danger' | 'success'
  children: NavChild[]
}

interface NavChild {
  id: string
  label: string
  icon: string
  path: string
  badge?: string
  badgeIntent?: 'primary' | 'warning' | 'danger' | 'success'
}

const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const { openTab, activeTabId, sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const { user, logout } = useAuthStore()
  const [expandedIds, setExpandedIds] = useState<Set<NodeId>>(new Set(['simulation']))
  const [searchQuery, setSearchQuery] = useState('')
  const [flyoutGroup, setFlyoutGroup] = useState<string | null>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)

  // Navigation structure (used by both expanded tree and collapsed flyout)
  const navGroups: NavGroup[] = useMemo(() => [
    {
      id: 'dashboard', label: t('sidebar.dashboard'), icon: 'dashboard',
      children: [
        { id: 'dashboard-overview', label: t('sidebar.dashboard_overview'), icon: 'chart', path: '/dashboard' },
        { id: 'dashboard-quick', label: t('sidebar.dashboard_quick'), icon: 'lightning', path: '/dashboard/quick' },
        { id: 'dashboard-notifications', label: t('sidebar.dashboard_notifications'), icon: 'notifications', path: '/dashboard/notifications', badge: '3', badgeIntent: 'warning' },
      ],
    },
    {
      id: 'data-center', label: t('sidebar.data_center'), icon: 'database',
      children: [
        { id: 'data-events', label: t('sidebar.data_events'), icon: 'timeline-events', path: '/data/events' },
        { id: 'data-browser', label: t('sidebar.data_browser'), icon: 'search-template', path: '/data/browser' },
        { id: 'data-import', label: t('sidebar.data_import'), icon: 'import', path: '/data/import' },
        { id: 'data-cleaning', label: t('sidebar.data_cleaning'), icon: 'clean', path: '/data/cleaning' },
        { id: 'data-quality', label: t('sidebar.data_quality'), icon: 'diagnosis', path: '/data/quality' },
      ],
    },
    {
      id: 'analysis', label: t('sidebar.analysis'), icon: 'chart',
      children: [
        { id: 'analysis-monitors', label: t('sidebar.analysis_monitors'), icon: 'eye-open', path: '/analysis/monitors' },
        { id: 'analysis-realtime', label: t('sidebar.analysis_realtime'), icon: 'pulse', path: '/analysis/realtime' },
        { id: 'analysis-trends', label: t('sidebar.analysis_trends'), icon: 'trending-up', path: '/analysis/trends' },
        { id: 'analysis-propagation', label: t('sidebar.analysis_propagation'), icon: 'share', path: '/analysis/propagation' },
        { id: 'analysis-network', label: t('sidebar.analysis_network'), icon: 'graph', path: '/analysis/network' },
        { id: 'analysis-sentiment', label: t('sidebar.analysis_sentiment'), icon: 'heart', path: '/analysis/sentiment' },
        { id: 'analysis-report', label: t('sidebar.analysis_report'), icon: 'document', path: '/analysis/report' },
      ],
    },
    {
      id: 'simulation', label: t('sidebar.simulation'), icon: 'predictive-analysis', badge: 'CORE', badgeIntent: 'primary',
      children: [
        { id: 'sim-scenarios', label: t('sidebar.sim_scenarios'), icon: 'applications', path: '/simulation/scenarios' },
        { id: 'sim-wizard', label: t('sidebar.sim_wizard'), icon: 'form', path: '/simulation/wizard' },
        { id: 'sim-adapt', label: t('sidebar.sim_adapt'), icon: 'exchange', path: '/simulation/adapt' },
        { id: 'sim-runs', label: t('sidebar.sim_runs'), icon: 'play', path: '/simulation/runs', badge: '2', badgeIntent: 'primary' },
        { id: 'sim-compare', label: t('sidebar.sim_compare'), icon: 'comparison', path: '/simulation/compare' },
        { id: 'sim-intervene', label: t('sidebar.sim_intervene'), icon: 'hand', path: '/simulation/intervene' },
        { id: 'sim-evaluation', label: t('sidebar.sim_evaluation'), icon: 'tick-circle', path: '/simulation/evaluation' },
        { id: 'sim-templates', label: t('sidebar.sim_templates'), icon: 'duplicate', path: '/simulation/templates' },
      ],
    },
    {
      id: 'knowledge', label: t('sidebar.knowledge'), icon: 'book',
      children: [
        { id: 'kb-graph', label: t('sidebar.kb_graph'), icon: 'layout-auto', path: '/knowledge/graph' },
        { id: 'kb-profiles', label: t('sidebar.kb_profiles'), icon: 'person', path: '/knowledge/profiles' },
        { id: 'kb-models', label: t('sidebar.kb_models'), icon: 'cube', path: '/knowledge/models' },
      ],
    },
    {
      id: 'ai-assistant', label: t('sidebar.ai_assistant'), icon: 'chat',
      children: [
        { id: 'ai-chat', label: t('sidebar.ai_chat'), icon: 'comment', path: '/ai/chat' },
        { id: 'ai-query', label: t('sidebar.ai_query'), icon: 'search', path: '/ai/query' },
        { id: 'ai-report', label: t('sidebar.ai_report'), icon: 'manually-entered-data', path: '/ai/report' },
        { id: 'ai-advisor', label: t('sidebar.ai_advisor'), icon: 'lightbulb', path: '/ai/advisor' },
      ],
    },
    {
      id: 'toolkit', label: t('sidebar.toolkit'), icon: 'wrench',
      children: [
        { id: 'tool-graph', label: t('sidebar.tool_graph'), icon: 'graph', path: '/toolkit/graph' },
        { id: 'tool-text', label: t('sidebar.tool_text'), icon: 'font', path: '/toolkit/text' },
        { id: 'tool-api', label: t('sidebar.tool_api'), icon: 'console', path: '/toolkit/api' },
      ],
    },
    {
      id: 'users', label: '用户管理', icon: 'people',
      children: [
        { id: 'user-list', label: '用户列表', icon: 'person', path: '/users/list' },
        { id: 'user-roles', label: '角色权限', icon: 'shield', path: '/users/roles' },
        { id: 'user-audit', label: '操作审计', icon: 'history', path: '/users/audit' },
      ],
    },
    {
      id: 'system', label: t('sidebar.system'), icon: 'cog',
      children: [
        { id: 'sys-llm', label: t('sidebar.sys_llm'), icon: 'rocket-slant', path: '/system/llm' },
        { id: 'sys-resources', label: t('sidebar.sys_resources'), icon: 'dashboard', path: '/system/resources' },
        { id: 'sys-database', label: t('sidebar.sys_database'), icon: 'database', path: '/system/database' },
        { id: 'sys-logs', label: t('sidebar.sys_logs'), icon: 'history', path: '/system/logs' },
        { id: 'sys-config', label: t('sidebar.sys_config'), icon: 'settings', path: '/system/config' },
        { id: 'sys-about', label: t('sidebar.sys_about'), icon: 'info-sign', path: '/system/about' },
      ],
    },
  ], [t])

  const handleNavClick = useCallback((child: NavChild) => {
    const tab: TabItem = {
      id: child.id,
      label: child.label,
      icon: child.icon,
      path: child.path,
      closable: child.id !== 'dashboard-overview',
    }
    openTab(tab)
    setFlyoutGroup(null)
  }, [openTab])

  // Close flyout on outside click
  useEffect(() => {
    if (!flyoutGroup) return
    const handler = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setFlyoutGroup(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [flyoutGroup])

  // Build tree from navGroups for expanded mode
  const sidebarTree: TreeNodeInfo<{ path: string }>[] = useMemo(() => {
    return navGroups.map((g) => ({
      id: g.id,
      label: g.label,
      icon: g.icon as any,
      isExpanded: expandedIds.has(g.id),
      secondaryLabel: g.badge ? React.createElement(Tag, { minimal: true, intent: g.badgeIntent || 'none', style: { fontSize: 9 } }, g.badge) : undefined,
      childNodes: g.children.map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon as any,
        nodeData: { path: c.path },
        secondaryLabel: c.badge ? React.createElement(Tag, { minimal: true, round: true, intent: c.badgeIntent || 'none', style: { fontSize: 10 } }, c.badge) : undefined,
      })),
    }))
  }, [navGroups, expandedIds])

  const handleNodeClick = useCallback((node: TreeNodeInfo<{ path: string }>) => {
    if (node.nodeData?.path) {
      const tab: TabItem = {
        id: node.id as string,
        label: node.label as string,
        icon: node.icon as string,
        path: node.nodeData.path,
        closable: node.id !== 'dashboard-overview',
      }
      openTab(tab)
    }
  }, [openTab])

  const handleNodeExpand = useCallback((node: TreeNodeInfo) => {
    setExpandedIds((prev) => new Set([...prev, node.id as string]))
  }, [])

  const handleNodeCollapse = useCallback((node: TreeNodeInfo) => {
    setExpandedIds((prev) => { const next = new Set(prev); next.delete(node.id as string); return next })
  }, [])

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return sidebarTree
    const q = searchQuery.toLowerCase()
    const filterNodes = (nodes: TreeNodeInfo<{ path: string }>[]): TreeNodeInfo<{ path: string }>[] => {
      return nodes.reduce<TreeNodeInfo<{ path: string }>[]>((acc, node) => {
        const labelMatch = (node.label as string).toLowerCase().includes(q)
        const filteredChildren = node.childNodes ? filterNodes(node.childNodes as TreeNodeInfo<{ path: string }>[]) : []
        if (labelMatch || filteredChildren.length > 0) {
          acc.push({ ...node, childNodes: filteredChildren.length > 0 ? filteredChildren : node.childNodes, isExpanded: true })
        }
        return acc
      }, [])
    }
    return filterNodes(sidebarTree)
  }, [sidebarTree, searchQuery])

  const markedTree = useMemo(() => {
    const markActive = (nodes: TreeNodeInfo<{ path: string }>[]): TreeNodeInfo<{ path: string }>[] => {
      return nodes.map((node) => ({
        ...node,
        isSelected: node.id === activeTabId,
        childNodes: node.childNodes ? markActive(node.childNodes as TreeNodeInfo<{ path: string }>[]) : undefined,
      }))
    }
    return markActive(filteredTree)
  }, [filteredTree, activeTabId])

  // ─── Collapsed mode: icon rail with flyout popover ───
  if (sidebarCollapsed) {
    return (
      <div className="sidebar sidebar--collapsed">
        <div className="sidebar__rail-header">
          <div className="sidebar__header-logo" style={{ width: 24, height: 24, fontSize: 11 }}>P</div>
        </div>
        <div className="sidebar__rail-icons">
          {navGroups.map((group) => {
            const isActive = group.children.some((c) => c.id === activeTabId)
            return (
              <Popover
                key={group.id}
                isOpen={flyoutGroup === group.id}
                onClose={() => setFlyoutGroup(null)}
                placement="right-start"
                minimal
                content={
                  <Menu className="bp5-dark sidebar__flyout-menu">
                    <li className="bp5-menu-header"><h6 className="bp5-heading">{group.label}</h6></li>
                    {group.children.map((child) => (
                      <MenuItem
                        key={child.id}
                        icon={child.icon as any}
                        text={child.label}
                        active={child.id === activeTabId}
                        labelElement={child.badge ? <Tag minimal round intent={child.badgeIntent}>{child.badge}</Tag> : undefined}
                        onClick={() => handleNavClick(child)}
                      />
                    ))}
                  </Menu>
                }
              >
                <Tooltip content={group.label} position="right" disabled={flyoutGroup === group.id}>
                  <div
                    className={classNames('sidebar__rail-btn', { 'sidebar__rail-btn--active': isActive })}
                    onClick={() => setFlyoutGroup(flyoutGroup === group.id ? null : group.id)}
                  >
                    <Icon icon={group.icon as any} size={16} />
                    {group.badge && <span className="sidebar__rail-badge" />}
                  </div>
                </Tooltip>
              </Popover>
            )
          })}
        </div>
        <div className="sidebar__rail-footer">
          <Tooltip content={user?.username || 'admin'} position="right">
            <div className="sidebar__rail-btn" onClick={() => setSidebarCollapsed(false)}>
              <Icon icon="chevron-right" size={14} />
            </div>
          </Tooltip>
        </div>
      </div>
    )
  }

  // ─── Expanded mode: full sidebar with tree ───
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-logo">P</div>
        <div className="sidebar__header-title">{t('app.name')}</div>
        <Button minimal small icon="chevron-left" onClick={() => setSidebarCollapsed(true)}
          style={{ marginLeft: 'auto', opacity: 0.6 }} />
      </div>

      <div className="sidebar__search">
        <InputGroup
          leftIcon="search" placeholder={t('common.search')} small
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="sidebar__tree">
        <Tree
          contents={markedTree}
          onNodeClick={handleNodeClick}
          onNodeExpand={handleNodeExpand}
          onNodeCollapse={handleNodeCollapse}
        />
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__footer-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="sidebar__footer-info">
          <div className="sidebar__footer-name">{user?.username || 'admin'}</div>
          <div className="sidebar__footer-role">{user?.role || 'admin'}</div>
        </div>
        <Tooltip content={t('auth.logout')}>
          <Button minimal small icon="log-out" onClick={logout} />
        </Tooltip>
      </div>
    </div>
  )
}

export default Sidebar
