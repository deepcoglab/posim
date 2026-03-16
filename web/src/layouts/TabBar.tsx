import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Icon, Button, Menu, MenuItem, MenuDivider } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/appStore'
import classNames from 'classnames'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  tabId: string
}

const TabBar: React.FC = () => {
  const { t } = useTranslation()
  const {
    tabs, activeTabId, setActiveTab, closeTab,
    closeOtherTabs, closeAllTabs, closeTabsToLeft, closeTabsToRight,
    toggleSidebar, sidebarCollapsed,
  } = useAppStore()
  const [ctx, setCtx] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, tabId: '' })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setCtx({ visible: true, x: e.clientX, y: e.clientY, tabId })
  }, [])

  const closeMenu = useCallback(() => setCtx((p) => ({ ...p, visible: false })), [])

  useEffect(() => {
    if (!ctx.visible) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ctx.visible, closeMenu])

  const ctxTab = tabs.find((t) => t.id === ctx.tabId)
  const ctxIdx = tabs.findIndex((t) => t.id === ctx.tabId)
  const hasLeft = ctxIdx > 0 && tabs.slice(0, ctxIdx).some((t) => t.closable !== false)
  const hasRight = ctxIdx < tabs.length - 1 && tabs.slice(ctxIdx + 1).some((t) => t.closable !== false)
  const hasOthers = tabs.filter((t) => t.id !== ctx.tabId && t.closable !== false).length > 0

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = e.currentTarget as HTMLDivElement
    el.scrollLeft += e.deltaY
  }, [])

  return (
    <div className="app-layout__tabbar" onWheel={handleWheel}>
      <Button
        minimal small icon={sidebarCollapsed ? 'menu-open' : 'menu-closed'}
        onClick={toggleSidebar} style={{ marginRight: 4, flexShrink: 0 }}
      />
      <div className="tabbar__tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={classNames('tab-item', { 'tab-item--active': tab.id === activeTabId })}
            onClick={() => setActiveTab(tab.id)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          >
            {tab.icon && <Icon icon={tab.icon as any} size={12} />}
            <span className="tab-item__label">{t(tab.label, tab.label)}</span>
            {tab.closable !== false && (
              <span
                className="tab-item__close"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); closeTab(tab.id) }}
              >
                <Icon icon="small-cross" size={12} />
              </span>
            )}
          </div>
        ))}
      </div>
      {tabs.filter((t) => t.closable !== false).length > 0 && (
        <Button
          minimal small icon="more" style={{ flexShrink: 0, marginLeft: 2 }}
          onClick={(e: React.MouseEvent) => {
            setCtx({ visible: true, x: e.clientX, y: e.clientY, tabId: activeTabId })
          }}
        />
      )}

      {/* Context Menu */}
      {ctx.visible && (
        <div
          ref={menuRef}
          className="tab-context-menu"
          style={{ position: 'fixed', left: ctx.x, top: ctx.y, zIndex: 100 }}
        >
          <Menu className="bp5-dark">
            <MenuItem icon="cross" text="关闭"
              disabled={ctxTab?.closable === false}
              onClick={() => { closeTab(ctx.tabId); closeMenu() }}
            />
            <MenuItem icon="th-disconnect" text="关闭其他标签"
              disabled={!hasOthers}
              onClick={() => { closeOtherTabs(ctx.tabId); closeMenu() }}
            />
            <MenuDivider />
            <MenuItem icon="chevron-left" text="关闭左侧标签"
              disabled={!hasLeft}
              onClick={() => { closeTabsToLeft(ctx.tabId); closeMenu() }}
            />
            <MenuItem icon="chevron-right" text="关闭右侧标签"
              disabled={!hasRight}
              onClick={() => { closeTabsToRight(ctx.tabId); closeMenu() }}
            />
            <MenuDivider />
            <MenuItem icon="delete" text="关闭所有标签" intent="danger"
              onClick={() => { closeAllTabs(); closeMenu() }}
            />
          </Menu>
        </div>
      )}
    </div>
  )
}

export default TabBar
