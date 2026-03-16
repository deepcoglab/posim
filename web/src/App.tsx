import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Spinner } from '@blueprintjs/core'
import AppLayout from './layouts/AppLayout'
import { useAppStore } from './stores/appStore'

// Lazy loaded pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const SimulationRuns = React.lazy(() => import('./pages/simulation/SimulationRuns'))
const SimulationView = React.lazy(() => import('./pages/simulation/SimulationView'))
const SimulationResult = React.lazy(() => import('./pages/simulation/SimulationResult'))
const PlaceholderPage = React.lazy(() => import('./pages/PlaceholderPage'))
const UserManagement = React.lazy(() => import('./pages/users/UserManagement'))
const SystemManagement = React.lazy(() => import('./pages/system/SystemManagement'))

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Spinner size={40} />
  </div>
)

const App: React.FC = () => {
  const navigate = useNavigate()
  const { activeTabId, tabs } = useAppStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)
  const activePath = activeTab?.path || '/dashboard'

  // Navigate browser when active tab changes
  useEffect(() => {
    navigate(activePath, { replace: true })
  }, [activeTabId, activePath, navigate])

  return (
    <AppLayout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* Simulation Module - Core */}
          <Route path="/simulation/runs" element={<SimulationRuns />} />
          <Route path="/simulation/live/:id" element={<SimulationView />} />
          <Route path="/simulation/detail/:id" element={<SimulationView />} />
          <Route path="/simulation/result/:id" element={<SimulationResult />} />
          <Route path="/simulation/scenarios" element={<PlaceholderPage title="推演场景管理" icon="applications" />} />
          <Route path="/simulation/wizard" element={<PlaceholderPage title="场景配置向导" icon="form" />} />
          <Route path="/simulation/adapt" element={<PlaceholderPage title="POSIM 适配器" icon="exchange" />} />
          <Route path="/simulation/compare" element={<PlaceholderPage title="推演结果对比" icon="comparison" />} />
          <Route path="/simulation/intervene" element={<PlaceholderPage title="干预策略管理" icon="hand" />} />
          <Route path="/simulation/evaluation" element={<PlaceholderPage title="推演评估中心" icon="tick-circle" />} />
          <Route path="/simulation/templates" element={<PlaceholderPage title="场景模板库" icon="duplicate" />} />

          {/* Data Center */}
          <Route path="/data/events" element={<PlaceholderPage title="舆情事件管理" icon="timeline-events" />} />
          <Route path="/data/browser" element={<PlaceholderPage title="数据浏览器" icon="search-template" />} />
          <Route path="/data/crawl/*" element={<PlaceholderPage title="数据采集管理" icon="cloud-download" />} />
          <Route path="/data/import" element={<PlaceholderPage title="数据导入" icon="import" />} />
          <Route path="/data/cleaning" element={<PlaceholderPage title="数据清洗" icon="clean" />} />
          <Route path="/data/quality" element={<PlaceholderPage title="数据质量分析" icon="diagnosis" />} />

          {/* Analysis */}
          <Route path="/analysis/monitors" element={<PlaceholderPage title="舆情监测方案" icon="eye-open" />} />
          <Route path="/analysis/realtime" element={<PlaceholderPage title="实时舆情大屏" icon="pulse" />} />
          <Route path="/analysis/data" element={<PlaceholderPage title="舆情数据表" icon="th" />} />
          <Route path="/analysis/trends" element={<PlaceholderPage title="趋势分析" icon="trending-up" />} />
          <Route path="/analysis/distribution" element={<PlaceholderPage title="分布分析" icon="pie-chart" />} />
          <Route path="/analysis/propagation" element={<PlaceholderPage title="传播路径分析" icon="share" />} />
          <Route path="/analysis/network" element={<PlaceholderPage title="舆论网络分析" icon="graph" />} />
          <Route path="/analysis/events" element={<PlaceholderPage title="事件检测" icon="warning-sign" />} />
          <Route path="/analysis/topics" element={<PlaceholderPage title="话题聚类" icon="tag" />} />
          <Route path="/analysis/sentiment" element={<PlaceholderPage title="情感分析" icon="heart" />} />
          <Route path="/analysis/opinion" element={<PlaceholderPage title="观点挖掘" icon="comment" />} />
          <Route path="/analysis/influence" element={<PlaceholderPage title="影响力分析" icon="star" />} />
          <Route path="/analysis/report" element={<PlaceholderPage title="舆情报告" icon="document" />} />

          {/* Knowledge Base */}
          <Route path="/knowledge/graph" element={<PlaceholderPage title="知识图谱" icon="layout-auto" />} />
          <Route path="/knowledge/profiles" element={<PlaceholderPage title="用户画像" icon="person" />} />
          <Route path="/knowledge/topics" element={<PlaceholderPage title="话题知识" icon="tag" />} />
          <Route path="/knowledge/sentiment" element={<PlaceholderPage title="情感词典" icon="emoji" />} />
          <Route path="/knowledge/models" element={<PlaceholderPage title="模型管理" icon="cube" />} />

          {/* AI Assistant */}
          <Route path="/ai/chat" element={<PlaceholderPage title="智能对话" icon="chat" />} />
          <Route path="/ai/query" element={<PlaceholderPage title="智能查询" icon="search" />} />
          <Route path="/ai/report" element={<PlaceholderPage title="AI 报告生成" icon="manually-entered-data" />} />
          <Route path="/ai/advisor" element={<PlaceholderPage title="舆情研判" icon="lightbulb" />} />
          <Route path="/ai/skills" element={<PlaceholderPage title="技能配置" icon="code-block" />} />

          {/* Toolkit */}
          <Route path="/toolkit/graph" element={<PlaceholderPage title="图分析工具" icon="graph" />} />
          <Route path="/toolkit/text" element={<PlaceholderPage title="文本分析工具" icon="font" />} />
          <Route path="/toolkit/convert" element={<PlaceholderPage title="数据转换" icon="refresh" />} />
          <Route path="/toolkit/tasks" element={<PlaceholderPage title="批处理任务" icon="list-detail-view" />} />
          <Route path="/toolkit/api" element={<PlaceholderPage title="API 调试" icon="console" />} />

          {/* User Management (separate section) */}
          <Route path="/users/list" element={<UserManagement />} />
          <Route path="/users/roles" element={<UserManagement />} />
          <Route path="/users/audit" element={<UserManagement />} />

          {/* System Management */}
          <Route path="/system/llm" element={<SystemManagement />} />
          <Route path="/system/resources" element={<SystemManagement />} />
          <Route path="/system/database" element={<SystemManagement />} />
          <Route path="/system/logs" element={<SystemManagement />} />
          <Route path="/system/config" element={<SystemManagement />} />
          <Route path="/system/about" element={<SystemManagement />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}

export default App
