import React from 'react'
import { NonIdealState, Icon } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'

interface PlaceholderPageProps {
  title: string
  icon?: string
  description?: string
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon = 'build', description }) => {
  const { t } = useTranslation()

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <NonIdealState
        icon={icon as any}
        title={title}
        description={description || '该模块正在开发中，敬请期待...'}
        action={
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Module under development
          </span>
        }
      />
    </div>
  )
}

export default PlaceholderPage
