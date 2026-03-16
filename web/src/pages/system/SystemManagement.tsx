import React, { useState } from 'react'
import { Button, Icon, Tag, Tabs, Tab, Card, Divider, Switch, FormGroup, InputGroup, HTMLSelect, ProgressBar } from '@blueprintjs/core'

// ── LLM Config Tab ──
const LLMConfig: React.FC = () => (
  <div className="sys-tab-content">
    <div className="sys-card">
      <div className="sys-card__header">
        <Icon icon="rocket-slant" size={16} /> <span>大模型配置</span>
        <Tag minimal intent="success" style={{ marginLeft: 'auto' }}>已连接</Tag>
      </div>
      <div className="sys-card__body">
        <FormGroup label="模型提供商"><HTMLSelect fill defaultValue="openai">
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="local">本地部署 (vLLM)</option>
          <option value="qwen">通义千问</option>
        </HTMLSelect></FormGroup>
        <FormGroup label="模型名称"><InputGroup defaultValue="gpt-4o" /></FormGroup>
        <FormGroup label="API 地址"><InputGroup defaultValue="https://api.openai.com/v1" /></FormGroup>
        <FormGroup label="API Key"><InputGroup defaultValue="sk-****" type="password" rightElement={<Button minimal icon="eye-open" />} /></FormGroup>
        <FormGroup label="最大Token"><InputGroup defaultValue="4096" type="number" /></FormGroup>
        <FormGroup label="Temperature"><InputGroup defaultValue="0.7" type="number" /></FormGroup>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button intent="primary" text="保存配置" icon="floppy-disk" />
          <Button text="测试连接" icon="refresh" />
        </div>
      </div>
    </div>
  </div>
)

// ── Resource Monitor Tab ──
const ResourceMonitor: React.FC = () => (
  <div className="sys-tab-content">
    <div className="sys-kpi-row">
      <div className="sys-kpi-card">
        <div className="sys-kpi-card__icon"><Icon icon="desktop" size={20} /></div>
        <div><div className="sys-kpi-card__label">CPU 使用率</div><div className="sys-kpi-card__value">34%</div></div>
        <ProgressBar value={0.34} intent="primary" stripes={false} />
      </div>
      <div className="sys-kpi-card">
        <div className="sys-kpi-card__icon"><Icon icon="oil-field" size={20} /></div>
        <div><div className="sys-kpi-card__label">内存</div><div className="sys-kpi-card__value">12.4 / 32 GB</div></div>
        <ProgressBar value={0.39} intent="success" stripes={false} />
      </div>
      <div className="sys-kpi-card">
        <div className="sys-kpi-card__icon"><Icon icon="database" size={20} /></div>
        <div><div className="sys-kpi-card__label">磁盘</div><div className="sys-kpi-card__value">256 / 512 GB</div></div>
        <ProgressBar value={0.5} intent="warning" stripes={false} />
      </div>
      <div className="sys-kpi-card">
        <div className="sys-kpi-card__icon"><Icon icon="flash" size={20} /></div>
        <div><div className="sys-kpi-card__label">GPU</div><div className="sys-kpi-card__value">67% (A100)</div></div>
        <ProgressBar value={0.67} intent="danger" stripes={false} />
      </div>
    </div>
    <Divider style={{ margin: '16px 0' }} />
    <div className="sys-card">
      <div className="sys-card__header"><Icon icon="timeline-line-chart" size={14} /> <span>运行中的服务</span></div>
      <div className="sys-card__body">
        {[
          { name: 'POSIM Web Server', status: 'running', port: 3000, uptime: '3d 14h' },
          { name: 'POSIM API Server', status: 'running', port: 8000, uptime: '3d 14h' },
          { name: 'vLLM Inference', status: 'running', port: 8080, uptime: '1d 6h' },
          { name: 'Redis Cache', status: 'running', port: 6379, uptime: '7d 2h' },
          { name: 'PostgreSQL', status: 'running', port: 5432, uptime: '7d 2h' },
        ].map((svc) => (
          <div key={svc.name} className="sys-service-row">
            <span className="sys-service-row__dot" />
            <span className="sys-service-row__name">{svc.name}</span>
            <Tag minimal round style={{ fontSize: 10 }}>:{svc.port}</Tag>
            <span className="sys-service-row__uptime">{svc.uptime}</span>
            <Button small minimal icon="refresh" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ── Database Tab ──
const DatabaseConfig: React.FC = () => (
  <div className="sys-tab-content">
    <div className="sys-card">
      <div className="sys-card__header"><Icon icon="database" size={14} /> <span>数据库连接</span>
        <Tag minimal intent="success" style={{ marginLeft: 'auto' }}>已连接</Tag></div>
      <div className="sys-card__body">
        <FormGroup label="数据库类型"><HTMLSelect fill defaultValue="postgresql">
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
        </HTMLSelect></FormGroup>
        <FormGroup label="主机"><InputGroup defaultValue="localhost" /></FormGroup>
        <FormGroup label="端口"><InputGroup defaultValue="5432" /></FormGroup>
        <FormGroup label="数据库名"><InputGroup defaultValue="posim" /></FormGroup>
        <FormGroup label="用户名"><InputGroup defaultValue="posim_admin" /></FormGroup>
        <FormGroup label="密码"><InputGroup defaultValue="****" type="password" /></FormGroup>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button intent="primary" text="保存" icon="floppy-disk" />
          <Button text="测试连接" icon="refresh" />
          <Button text="备份数据库" icon="export" />
        </div>
      </div>
    </div>
  </div>
)

// ── Logs Tab ──
const SystemLogs: React.FC = () => {
  const logs = [
    { time: '2025-06-10 10:30:15', level: 'INFO', msg: 'Simulation run #1042 started, 412 agents loaded' },
    { time: '2025-06-10 10:28:43', level: 'INFO', msg: 'User analyst_zhang logged in from 192.168.1.105' },
    { time: '2025-06-10 10:25:01', level: 'WARN', msg: 'vLLM inference queue depth reached 50, consider scaling' },
    { time: '2025-06-10 10:20:33', level: 'INFO', msg: 'Database backup completed: posim_backup_20250610.sql (2.3GB)' },
    { time: '2025-06-10 10:15:00', level: 'INFO', msg: 'Scheduled cleanup: removed 1,234 expired cache entries' },
    { time: '2025-06-10 10:10:22', level: 'ERROR', msg: 'Failed to connect to external API: timeout after 30s' },
    { time: '2025-06-10 10:05:11', level: 'INFO', msg: 'System health check passed: all services operational' },
    { time: '2025-06-10 09:55:00', level: 'INFO', msg: 'Knowledge base index updated: 15,432 entities, 89,201 relations' },
    { time: '2025-06-10 09:30:00', level: 'INFO', msg: 'User admin logged in from 192.168.1.100' },
  ]
  const levelColors: Record<string, string> = { INFO: '#3dcc91', WARN: '#f5c451', ERROR: '#e76a6e' }
  return (
    <div className="sys-tab-content">
      <div className="sys-card">
        <div className="sys-card__header"><Icon icon="history" size={14} /> <span>系统日志</span>
          <span style={{ flex: 1 }} />
          <Button small minimal icon="filter" text="筛选" />
          <Button small minimal icon="export" text="导出" />
          <Button small minimal icon="trash" text="清除" intent="danger" />
        </div>
        <div className="sys-card__body sys-card__body--logs">
          {logs.map((log, i) => (
            <div key={i} className="sys-log-row">
              <span className="sys-log-row__time">{log.time}</span>
              <Tag minimal style={{ fontSize: 10, background: `${levelColors[log.level]}20`, color: levelColors[log.level], minWidth: 40, textAlign: 'center' }}>
                {log.level}
              </Tag>
              <span className="sys-log-row__msg">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Settings Tab ──
const SystemSettings: React.FC = () => (
  <div className="sys-tab-content">
    <div className="sys-card">
      <div className="sys-card__header"><Icon icon="settings" size={14} /> <span>通用设置</span></div>
      <div className="sys-card__body">
        <FormGroup label="系统名称"><InputGroup defaultValue="POSIM 舆情仿真平台" /></FormGroup>
        <FormGroup label="默认语言"><HTMLSelect fill defaultValue="zh">
          <option value="zh">中文</option><option value="en">English</option>
        </HTMLSelect></FormGroup>
        <FormGroup label="会话超时 (分钟)"><InputGroup defaultValue="30" type="number" /></FormGroup>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8 }}>功能开关</div>
        <Switch label="启用 AI 助手" defaultChecked alignIndicator="right" />
        <Switch label="启用实时通知" defaultChecked alignIndicator="right" />
        <Switch label="启用操作审计日志" defaultChecked alignIndicator="right" />
        <Switch label="允许匿名访问 (只读)" alignIndicator="right" />
        <Divider style={{ margin: '12px 0' }} />
        <Button intent="primary" text="保存设置" icon="floppy-disk" />
      </div>
    </div>
  </div>
)

// ── About Tab ──
const AboutSystem: React.FC = () => (
  <div className="sys-tab-content">
    <div className="sys-card" style={{ maxWidth: 500 }}>
      <div className="sys-card__header"><Icon icon="info-sign" size={14} /> <span>关于系统</span></div>
      <div className="sys-card__body" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>POSIM</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Public Opinion Simulation Platform</div>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', textAlign: 'left', fontSize: 12, marginTop: 16 }}>
          <span style={{ color: 'var(--text-muted)' }}>版本</span><span>v1.0.0-beta</span>
          <span style={{ color: 'var(--text-muted)' }}>构建日期</span><span>2025-06-10</span>
          <span style={{ color: 'var(--text-muted)' }}>前端框架</span><span>React 18 + TypeScript</span>
          <span style={{ color: 'var(--text-muted)' }}>UI 组件库</span><span>Blueprint.js 5.x</span>
          <span style={{ color: 'var(--text-muted)' }}>状态管理</span><span>Zustand</span>
          <span style={{ color: 'var(--text-muted)' }}>可视化</span><span>Cosmograph 2.0 + ECharts</span>
          <span style={{ color: 'var(--text-muted)' }}>仿真引擎</span><span>EBDI Agent Framework</span>
          <span style={{ color: 'var(--text-muted)' }}>许可</span><span>MIT License</span>
        </div>
      </div>
    </div>
  </div>
)

// ── Main System Management Page ──
const SystemManagement: React.FC = () => {
  const [tab, setTab] = useState('llm')

  return (
    <div className="mgmt-page">
      <div className="mgmt-page__header">
        <div>
          <h2 className="mgmt-page__title"><Icon icon="cog" size={20} /> 系统管理</h2>
          <p className="mgmt-page__desc">配置系统参数、监控资源、管理日志</p>
        </div>
      </div>
      <Tabs id="sys-tabs" selectedTabId={tab} onChange={(id) => setTab(id as string)} renderActiveTabPanelOnly large>
        <Tab id="llm" title="大模型配置" icon="rocket-slant" panel={<LLMConfig />} />
        <Tab id="resources" title="资源监控" icon="dashboard" panel={<ResourceMonitor />} />
        <Tab id="database" title="数据库" icon="database" panel={<DatabaseConfig />} />
        <Tab id="logs" title="系统日志" icon="history" panel={<SystemLogs />} />
        <Tab id="settings" title="系统设置" icon="settings" panel={<SystemSettings />} />
        <Tab id="about" title="关于" icon="info-sign" panel={<AboutSystem />} />
      </Tabs>
    </div>
  )
}

export default SystemManagement
