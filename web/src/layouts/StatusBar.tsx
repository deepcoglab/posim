import React from 'react'
import { Icon, Tag } from '@blueprintjs/core'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../stores/appStore'

const StatusBar: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useAppStore()

  return (
    <div className="app-layout__statusbar">
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon icon="dot" size={8} intent="success" />
        System Online
      </span>
      <span>PostgreSQL <Tag minimal intent="success" style={{ fontSize: 10 }}>OK</Tag></span>
      <span>Redis <Tag minimal intent="success" style={{ fontSize: 10 }}>OK</Tag></span>
      <span>ES <Tag minimal intent="success" style={{ fontSize: 10 }}>OK</Tag></span>
      <span>LLM Pool <Tag minimal intent="primary" style={{ fontSize: 10 }}>3/5</Tag></span>
      <span style={{ flex: 1 }} />
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          const next = language === 'zh' ? 'en' : 'zh'
          setLanguage(next)
          i18n.changeLanguage(next)
        }}
      >
        {language === 'zh' ? '中文' : 'EN'} <Icon icon="translate" size={10} />
      </span>
      <span>v0.1.0</span>
    </div>
  )
}

export default StatusBar
