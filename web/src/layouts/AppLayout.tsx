import React from 'react'
import { useAppStore } from '../stores/appStore'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import StatusBar from './StatusBar'
import classNames from 'classnames'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="app-layout bp5-dark">
      <TabBar />
      <div className="app-layout__body">
        <div className={classNames('app-layout__sidebar', { 'app-layout__sidebar--collapsed': sidebarCollapsed })}>
          <Sidebar />
        </div>
        <div className="app-layout__content">
          {children}
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default AppLayout
