import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TabItem {
  id: string
  label: string
  icon?: string
  path: string
  closable?: boolean
}

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  
  activeTabId: string
  tabs: TabItem[]
  openTab: (tab: TabItem) => void
  closeTab: (id: string) => void
  closeOtherTabs: (id: string) => void
  closeAllTabs: () => void
  closeTabsToLeft: (id: string) => void
  closeTabsToRight: (id: string) => void
  setActiveTab: (id: string) => void

  language: string
  setLanguage: (lang: string) => void

  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      activeTabId: 'dashboard',
      tabs: [
        { id: 'dashboard', label: 'sidebar.dashboard_overview', icon: 'dashboard', path: '/dashboard', closable: false },
      ],
      openTab: (tab) => {
        const { tabs } = get()
        if (!tabs.find((t) => t.id === tab.id)) {
          set({ tabs: [...tabs, tab], activeTabId: tab.id })
        } else {
          set({ activeTabId: tab.id })
        }
      },
      closeTab: (id) => {
        const { tabs, activeTabId } = get()
        const filtered = tabs.filter((t) => t.id !== id)
        if (activeTabId === id && filtered.length > 0) {
          const idx = tabs.findIndex((t) => t.id === id)
          const next = filtered[Math.min(idx, filtered.length - 1)]
          set({ tabs: filtered, activeTabId: next.id })
        } else {
          set({ tabs: filtered })
        }
      },
      closeOtherTabs: (id) => {
        const { tabs } = get()
        const keep = tabs.filter((t) => t.id === id || t.closable === false)
        set({ tabs: keep, activeTabId: id })
      },
      closeAllTabs: () => {
        const { tabs } = get()
        const keep = tabs.filter((t) => t.closable === false)
        set({ tabs: keep, activeTabId: keep.length > 0 ? keep[0].id : 'dashboard' })
      },
      closeTabsToLeft: (id) => {
        const { tabs } = get()
        const idx = tabs.findIndex((t) => t.id === id)
        const keep = tabs.filter((t, i) => i >= idx || t.closable === false)
        set({ tabs: keep, activeTabId: id })
      },
      closeTabsToRight: (id) => {
        const { tabs } = get()
        const idx = tabs.findIndex((t) => t.id === id)
        const keep = tabs.filter((t, i) => i <= idx || t.closable === false)
        set({ tabs: keep, activeTabId: id })
      },
      setActiveTab: (id) => set({ activeTabId: id }),

      language: 'zh',
      setLanguage: (lang) => {
        localStorage.setItem('posim-lang', lang)
        set({ language: lang })
      },

      theme: 'dark',
      setTheme: (t) => set({ theme: t }),
    }),
    { name: 'posim-app-store', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, language: s.language, theme: s.theme }) }
  )
)
