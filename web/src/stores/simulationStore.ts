import { create } from 'zustand'

export interface AgentNode {
  user_id: string
  username: string
  agent_type: 'citizen' | 'kol' | 'media' | 'government'
  followers_count: number
  following_count: number
  posts_count: number
  is_active: boolean
  emotion_dominant: string
  emotion_intensity: number
  emotion_vector: number[]
  last_action_type?: string
  activation_count: number
  identity_description: string
  psychological_beliefs: Record<string, number>
  event_opinions: Record<string, string>
  timestamp?: number
}

export interface RelationLink {
  source: string
  target: string
  relation_type: 'follow' | 'repost' | 'comment'
  weight: number
}

export interface PostAction {
  id: string
  step: number
  time: string
  agent_id: string
  agent_name: string
  agent_type: string
  action_type: 'post' | 'repost' | 'comment' | 'like' | 'idle'
  content: string
  emotion: string
  stance: string
  target_post_id?: string
  target_author?: string
}

export interface StepSignal {
  step: number
  time: string
  active_count: number
  action_count: number
  hawkes_intensity: number
  emotion_distribution: Record<string, number>
  hot_topics: string[]
  active_agent_ids: string[]
  actions: PostAction[]
}

export interface SimulationRun {
  id: number
  scenario_id: number
  scenario_name: string
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed'
  current_step: number
  total_steps: number
  started_at?: string
  completed_at?: string
  agent_count: number
  error_message?: string
  config_label?: string
  model?: string
  stats: {
    total_actions: number
    behavior_score?: number
    content_score?: number
    topology_score?: number
    avg_score?: number
  }
}

export interface GraphSettings {
  colorBy: 'agent_type' | 'emotion' | 'activation'
  sizeBy: 'followers' | 'activity' | 'uniform'
  showLabels: boolean
  showLinks: boolean
  gravity: number
  repulsion: number
  linkSpring: number
  friction: number
}

interface SimulationState {
  // Current run
  currentRun: SimulationRun | null
  setCurrentRun: (run: SimulationRun | null) => void

  // All runs
  runs: SimulationRun[]
  setRuns: (runs: SimulationRun[]) => void

  // Agents & relations
  agents: AgentNode[]
  relations: RelationLink[]
  setAgents: (agents: AgentNode[]) => void
  setRelations: (links: RelationLink[]) => void

  // Real-time step data
  currentStep: number
  stepSignals: StepSignal[]
  activeAgentIds: Set<string>
  recentActions: PostAction[]
  addStepSignal: (signal: StepSignal) => void
  clearSignals: () => void

  // Graph settings
  graphSettings: GraphSettings
  setGraphSettings: (settings: Partial<GraphSettings>) => void

  // Time range selection
  timeRange: [number, number]
  setTimeRange: (range: [number, number]) => void

  // Selected agent
  selectedAgentId: string | null
  setSelectedAgentId: (id: string | null) => void
}

export const useSimulationStore = create<SimulationState>()((set, get) => ({
  currentRun: null,
  setCurrentRun: (run) => set({ currentRun: run }),

  runs: [],
  setRuns: (runs) => set({ runs }),

  agents: [],
  relations: [],
  setAgents: (agents) => set({ agents }),
  setRelations: (relations) => set({ relations }),

  currentStep: 0,
  stepSignals: [],
  activeAgentIds: new Set(),
  recentActions: [],
  addStepSignal: (signal) => {
    const { stepSignals, recentActions } = get()
    const newActions = [...signal.actions, ...recentActions].slice(0, 200)
    set({
      currentStep: signal.step,
      stepSignals: [...stepSignals, signal],
      activeAgentIds: new Set(signal.active_agent_ids),
      recentActions: newActions,
    })
  },
  clearSignals: () => set({ stepSignals: [], activeAgentIds: new Set(), recentActions: [], currentStep: 0 }),

  graphSettings: {
    colorBy: 'agent_type',
    sizeBy: 'followers',
    showLabels: true,
    showLinks: true,
    gravity: 0.25,
    repulsion: 1.0,
    linkSpring: 1.0,
    friction: 0.85,
  },
  setGraphSettings: (settings) => set((s) => ({ graphSettings: { ...s.graphSettings, ...settings } })),

  timeRange: [0, 200],
  setTimeRange: (range) => set({ timeRange: range }),

  selectedAgentId: null,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
}))
