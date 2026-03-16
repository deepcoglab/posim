import React, { useState, useMemo } from 'react'
import { Button, Icon, InputGroup, Tag, HTMLSelect, Dialog, FormGroup, Switch, Divider } from '@blueprintjs/core'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  status: 'active' | 'disabled'
  lastLogin: string
  created: string
}

const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', email: 'admin@posim.org', role: 'admin', status: 'active', lastLogin: '2025-06-10 09:30', created: '2025-01-01' },
  { id: '2', username: 'analyst_zhang', email: 'zhang@posim.org', role: 'analyst', status: 'active', lastLogin: '2025-06-10 08:15', created: '2025-02-15' },
  { id: '3', username: 'viewer_li', email: 'li@posim.org', role: 'viewer', status: 'active', lastLogin: '2025-06-09 14:22', created: '2025-03-20' },
  { id: '4', username: 'analyst_wang', email: 'wang@posim.org', role: 'analyst', status: 'active', lastLogin: '2025-06-08 16:45', created: '2025-03-25' },
  { id: '5', username: 'viewer_chen', email: 'chen@posim.org', role: 'viewer', status: 'disabled', lastLogin: '2025-05-20 10:00', created: '2025-04-10' },
  { id: '6', username: 'analyst_liu', email: 'liu@posim.org', role: 'analyst', status: 'active', lastLogin: '2025-06-10 07:50', created: '2025-04-15' },
]

const ROLE_COLORS: Record<string, string> = { admin: '#e76a6e', analyst: '#4c90f0', viewer: '#3dcc91' }
const ROLE_LABELS: Record<string, string> = { admin: '管理员', analyst: '分析师', viewer: '访客' }

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = MOCK_USERS
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    }
    if (roleFilter !== 'all') result = result.filter((u) => u.role === roleFilter)
    return result
  }, [search, roleFilter])

  return (
    <div className="mgmt-page">
      <div className="mgmt-page__header">
        <div>
          <h2 className="mgmt-page__title"><Icon icon="people" size={20} /> 用户管理</h2>
          <p className="mgmt-page__desc">管理系统用户、分配角色和权限</p>
        </div>
        <Button intent="primary" icon="add" text="新建用户" onClick={() => setDialogOpen(true)} />
      </div>

      <div className="mgmt-page__toolbar">
        <InputGroup leftIcon="search" placeholder="搜索用户名或邮箱..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        <HTMLSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">全部角色</option>
          <option value="admin">管理员</option>
          <option value="analyst">分析师</option>
          <option value="viewer">访客</option>
        </HTMLSelect>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} 用户</span>
      </div>

      <div className="mgmt-table">
        <div className="mgmt-table__head">
          <div className="mgmt-table__col" style={{ flex: 2 }}>用户名</div>
          <div className="mgmt-table__col" style={{ flex: 2 }}>邮箱</div>
          <div className="mgmt-table__col" style={{ flex: 1 }}>角色</div>
          <div className="mgmt-table__col" style={{ flex: 1 }}>状态</div>
          <div className="mgmt-table__col" style={{ flex: 1.5 }}>最后登录</div>
          <div className="mgmt-table__col" style={{ flex: 1 }}>操作</div>
        </div>
        {filtered.map((user) => (
          <div key={user.id} className="mgmt-table__row">
            <div className="mgmt-table__col" style={{ flex: 2, fontWeight: 500 }}>
              <div className="mgmt-table__avatar" style={{ borderColor: ROLE_COLORS[user.role] }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              {user.username}
            </div>
            <div className="mgmt-table__col" style={{ flex: 2, color: 'var(--text-muted)' }}>{user.email}</div>
            <div className="mgmt-table__col" style={{ flex: 1 }}>
              <Tag minimal round style={{ background: `${ROLE_COLORS[user.role]}20`, color: ROLE_COLORS[user.role], fontSize: 11 }}>
                {ROLE_LABELS[user.role]}
              </Tag>
            </div>
            <div className="mgmt-table__col" style={{ flex: 1 }}>
              <Tag minimal round intent={user.status === 'active' ? 'success' : 'none'} style={{ fontSize: 11 }}>
                {user.status === 'active' ? '启用' : '禁用'}
              </Tag>
            </div>
            <div className="mgmt-table__col" style={{ flex: 1.5, fontSize: 11, color: 'var(--text-muted)' }}>{user.lastLogin}</div>
            <div className="mgmt-table__col" style={{ flex: 1, gap: 4, display: 'flex' }}>
              <Button small minimal icon="edit" />
              <Button small minimal icon="key" />
              <Button small minimal icon="trash" intent="danger" />
            </div>
          </div>
        ))}
      </div>

      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="新建用户" className="bp5-dark">
        <div className="bp5-dialog-body" style={{ padding: 20 }}>
          <FormGroup label="用户名" labelFor="username"><InputGroup id="username" placeholder="输入用户名" /></FormGroup>
          <FormGroup label="邮箱" labelFor="email"><InputGroup id="email" placeholder="输入邮箱" type="email" /></FormGroup>
          <FormGroup label="角色">
            <HTMLSelect fill>
              <option value="viewer">访客</option>
              <option value="analyst">分析师</option>
              <option value="admin">管理员</option>
            </HTMLSelect>
          </FormGroup>
          <FormGroup label="初始密码" labelFor="password"><InputGroup id="password" placeholder="输入密码" type="password" /></FormGroup>
        </div>
        <div className="bp5-dialog-footer">
          <div className="bp5-dialog-footer-actions">
            <Button text="取消" onClick={() => setDialogOpen(false)} />
            <Button intent="primary" text="创建" onClick={() => setDialogOpen(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default UserManagement
