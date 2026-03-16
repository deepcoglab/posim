import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Cosmograph, CosmographConfig, prepareCosmographData, CosmographDataPrepConfig,
} from '@cosmograph/react'
import { Button, Icon, RangeSlider } from '@blueprintjs/core'
import classNames from 'classnames'
import type { GraphSettings } from './GraphConfigSidebar'

// Emotion-based color palette for richer visualization
const EMOTION_COLOR_MAP: Record<string, string> = {
  anger: '#e76a6e', sadness: '#6e8cba', fear: '#d4874d',
  surprise: '#e8c94a', joy: '#49c98b', disgust: '#9f7aea', neutral: '#8a9ba8',
}

// Blend two hex colors
function blendColors(c1: string, c2: string, ratio: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parse(c1)
  const [r2, g2, b2] = parse(c2)
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Brighten a hex color
function brightenColor(hex: string, factor: number): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * factor))
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * factor))
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * factor))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export interface GraphNode {
  id: string
  label: string
  type: string
  size?: number
  color?: string
  active?: boolean
  data?: Record<string, any>
}

export interface GraphLink {
  source: string
  target: string
  weight?: number
  type?: string
}

interface NetworkGraphProps {
  nodes: GraphNode[]
  links: GraphLink[]
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string | null
  typeColors: Record<string, string>
  className?: string
  settings: GraphSettings
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes, links, onNodeClick, selectedNodeId, typeColors, className, settings,
}) => {
  const [cosmographConfig, setCosmographConfig] = useState<CosmographConfig>({})
  const [dataReady, setDataReady] = useState(false)
  const cosmographRef = useRef<any>(null)
  const cosmoInstanceRef = useRef<any>(null)

  // Timeline state
  const [timelineOpen, setTimelineOpen] = useState(true)
  const [stepRange, setStepRange] = useState<[number, number]>([0, 200])
  const [highlightedCount, setHighlightedCount] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const rawPoints = useMemo(() =>
    nodes.map((n) => {
      // Rich color: blend type color with emotion color (60% type, 40% emotion)
      const typeColor = typeColors[n.type] || '#738091'
      const emotionColor = EMOTION_COLOR_MAP[n.data?.emotion_dominant] || '#8a9ba8'
      let baseColor = blendColors(typeColor, emotionColor, 0.4)

      // Active nodes get brighter colors
      if (n.active) {
        baseColor = brightenColor(baseColor, 1.25)
      } else {
        baseColor = blendColors(baseColor, '#2f343c', 0.3)
      }

      // Size: stronger differentiation based on followers + type role
      const baseTypeSize = n.type === 'kol' ? 6 : n.type === 'media' ? 7 : n.type === 'government' ? 8 : 2
      const followersSize = n.data?.followers_count
        ? Math.log10(n.data.followers_count + 1) * 2.2
        : 0
      const activityBoost = n.active ? 1.5 : 0
      const size = Math.max(1.5, Math.min(18, baseTypeSize + followersSize + activityBoost))

      return {
        id: n.id,
        label: n.label,
        agentType: n.type,
        emotion: n.data?.emotion_dominant || 'neutral',
        color: baseColor,
        size,
        active: n.active ? 1 : 0,
        timestamp: n.data?.timestamp ?? 0,
      }
    }),
    [nodes, typeColors],
  )

  const rawLinks = useMemo(() =>
    links.map((l) => ({ source: l.source, target: l.target })),
    [links],
  )

  const dataConfig: CosmographDataPrepConfig = useMemo(() => ({
    points: { pointIdBy: 'id' },
    links: { linkSourceBy: 'source', linkTargetsBy: ['target'] },
  }), [])

  const onNodeClickRef = useRef(onNodeClick)
  onNodeClickRef.current = onNodeClick
  const rawPointsRef = useRef(rawPoints)
  rawPointsRef.current = rawPoints

  useEffect(() => {
    if (rawPoints.length === 0) return
    let cancelled = false
    const loadData = async () => {
      try {
        const result = await prepareCosmographData(dataConfig, rawPoints, rawLinks)
        if (result && !cancelled) {
          const { points, links: preparedLinks, cosmographConfig: preparedConfig } = result
          setCosmographConfig({
            points, links: preparedLinks, ...preparedConfig,
            backgroundColor: '#0e1116',
            pointColorBy: 'color', pointColorStrategy: 'direct',
            pointSizeBy: 'size', pointSizeStrategy: 'direct',
            pointSizeRange: [1.5, 18],
            pointLabelBy: 'label',
            pointLabelColor: '#d4dae0',
            pointLabelFontSize: 11,
            showHoveredPointLabel: true,
            showDynamicLabels: true,
            showDynamicLabelsLimit: 20,
            showTopLabels: true,
            showTopLabelsLimit: 15,
            renderHoveredPointRing: true, hoveredPointRingColor: '#ffffff',
            hoveredPointCursor: 'pointer', focusedPointRingColor: '#4c90f0',
            pointGreyoutOpacity: 0.15,
            enableSimulation: true,
            pointClusterBy: 'agentType',
            simulationCluster: 0.6,
            simulationGravity: 0.15,
            simulationRepulsion: 1.2,
            simulationLinkSpring: 0.8,
            simulationFriction: 0.85,
            simulationDecay: 8000,
            spaceSize: 8192,
            fitViewOnInit: true, fitViewDelay: 500,
            selectPointOnClick: true,
            linkDefaultColor: 'rgba(76, 144, 240, 0.08)',
            linkOpacity: 0.4,
            linkDefaultWidth: 0.5,
            curvedLinks: true,
            linkVisibilityDistanceRange: [50, 250] as [number, number],
            linkVisibilityMinTransparency: 0.05,
            onPointClick: (index: number, _pos: [number, number], _evt: MouseEvent) => {
              if (onNodeClickRef.current && rawPointsRef.current[index]) {
                onNodeClickRef.current(rawPointsRef.current[index].id)
              }
            },
            onBackgroundClick: (_evt: MouseEvent) => {
              if (onNodeClickRef.current) onNodeClickRef.current('')
            },
          })
          setDataReady(true)
        }
      } catch (err) {
        console.warn('Cosmograph data prep error:', err)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [rawPoints, rawLinks, dataConfig])

  // Merge settings into live config
  const liveConfig = useMemo(() => {
    const base = { ...cosmographConfig }
    base.pointOpacity = settings.pointOpacity
    base.pointSizeScale = settings.pointSizeScale
    base.pointDefaultSize = settings.pointDefaultSize
    base.showDynamicLabels = settings.showDynamicLabels
    base.showDynamicLabelsLimit = settings.labelLimit
    base.pointLabelFontSize = 11
    base.pointLabelColor = '#c5cbd3'
    base.scalePointsOnZoom = settings.scalePointsOnZoom
    base.renderLinks = settings.renderLinks
    base.linkOpacity = settings.linkOpacity
    base.linkDefaultWidth = settings.linkWidth
    base.linkDefaultColor = '#1c2127'
    base.curvedLinks = settings.curvedLinks
    base.linkArrows = settings.linkArrows
    base.simulationGravity = settings.simulationGravity
    base.simulationRepulsion = settings.simulationRepulsion
    base.simulationLinkSpring = settings.simulationLinkSpring
    base.simulationFriction = settings.simulationFriction
    base.simulationDecay = settings.simulationDecay
    base.simulationCluster = settings.simulationCluster
    base.enableDrag = true
    if (selectedNodeId) {
      const idx = rawPoints.findIndex((p) => p.id === selectedNodeId)
      if (idx >= 0) base.focusedPointIndex = idx
    }
    return base
  }, [cosmographConfig, settings, selectedNodeId, rawPoints])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    nodes.forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1 })
    return counts
  }, [nodes])

  // Histogram data for timeline
  const histogramData = useMemo(() => {
    const buckets = new Map<number, number>()
    rawPoints.forEach((p) => {
      const step = Math.floor(p.timestamp / 10) * 10
      buckets.set(step, (buckets.get(step) || 0) + 1)
    })
    const entries = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0])
    const maxCount = Math.max(...entries.map((e) => e[1]), 1)
    return entries.map(([step, count]) => ({
      step,
      count,
      height: Math.max(2, (count / maxCount) * 30),
    }))
  }, [rawPoints])

  // Timeline highlight
  const highlightStepRange = (range: [number, number]) => {
    const cosmo = cosmoInstanceRef.current
    if (!cosmo) return
    const isFullRange = range[0] <= 0 && range[1] >= 200
    if (isFullRange) {
      cosmo.unselectPoints()
      setHighlightedCount(null)
    } else {
      const indices: number[] = []
      rawPointsRef.current.forEach((p, i) => {
        if (p.timestamp >= range[0] && p.timestamp <= range[1]) indices.push(i)
      })
      cosmo.selectPoints(indices)
      setHighlightedCount(indices.length)
    }
  }

  const handleRangeChange = (range: [number, number]) => setStepRange(range)
  const handleRangeRelease = (range: [number, number]) => highlightStepRange(range)

  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      let current = stepRange[0]
      playIntervalRef.current = setInterval(() => {
        current += 5
        if (current > 200) {
          if (playIntervalRef.current) clearInterval(playIntervalRef.current)
          setIsPlaying(false)
          return
        }
        const newRange: [number, number] = [stepRange[0], current]
        setStepRange(newRange)
        highlightStepRange(newRange)
      }, 200)
    }
  }

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
  }, [])

  const handleCosmographMount = (cosmo: any) => {
    cosmoInstanceRef.current = cosmo
  }

  return (
    <div className={classNames('network-graph', className)}>
      {/* Cosmograph Canvas */}
      <div className="network-graph__canvas-wrap">
        {dataReady ? (
          <Cosmograph ref={cosmographRef} onMount={handleCosmographMount} {...liveConfig} />
        ) : (
          <div className="network-graph__loading">
            <div className="network-graph__loading-spinner" />
            <span>初始化网络图引擎...</span>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      {dataReady && (
        <div className="network-graph__zoom-controls">
          <Button icon="zoom-to-fit" minimal small title="Fit view"
            onClick={() => cosmoInstanceRef.current?.fitView()} />
          <Button icon="zoom-in" minimal small title="Zoom in"
            onClick={() => cosmoInstanceRef.current?.zoomIn()} />
          <Button icon="zoom-out" minimal small title="Zoom out"
            onClick={() => cosmoInstanceRef.current?.zoomOut()} />
        </div>
      )}

      {/* Color legend */}
      {settings.showColorLegend && (
        <div className="network-graph__legend">
          <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4, fontWeight: 600 }}>智能体类型</div>
          {Object.entries(typeColors).map(([type, color]) => {
            const labels: Record<string, string> = { citizen: '普通用户', kol: 'KOL', media: '媒体', government: '官方' }
            return (
              <div key={type} className="network-graph__legend-item">
                <span className="network-graph__legend-dot" style={{ background: color, boxShadow: `0 0 4px ${color}60` }} />
                <span>{labels[type] || type}</span>
                <span className="network-graph__legend-count">{typeCounts[type]?.toLocaleString() || 0}</span>
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '6px 0 4px', paddingTop: 6, fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>情绪</div>
          {Object.entries(EMOTION_COLOR_MAP).slice(0, 5).map(([emotion, color]) => {
            const labels: Record<string, string> = { anger: '愤怒', sadness: '悲伤', fear: '恐惧', surprise: '惊讶', joy: '喜悦' }
            return (
              <div key={emotion} className="network-graph__legend-item">
                <span className="network-graph__legend-dot" style={{ background: color, width: 6, height: 6 }} />
                <span style={{ fontSize: 10 }}>{labels[emotion] || emotion}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats overlay */}
      <div className="network-graph__stats">
        <span>{nodes.length.toLocaleString()} nodes</span>
        <span>{links.length.toLocaleString()} links</span>
      </div>

      {/* Timeline panel (inside graph, at bottom) */}
      <div className={`timeline-panel ${timelineOpen ? 'open' : 'collapsed'}`}>
        <div className="timeline-header" onClick={() => setTimelineOpen(!timelineOpen)}>
          <Icon icon="timeline-events" size={14} />
          <span>Timeline — Simulation Step</span>
          {highlightedCount !== null && (
            <span className="timeline-count">{highlightedCount.toLocaleString()} highlighted</span>
          )}
          <Icon icon={timelineOpen ? 'chevron-down' : 'chevron-up'} size={14} />
        </div>
        {timelineOpen && (
          <div className="timeline-body">
            <div className="timeline-controls">
              <Button
                icon={isPlaying ? 'pause' : 'play'}
                minimal small
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play timeline'}
              />
              <span className="timeline-range-label">
                Step {stepRange[0]} — {stepRange[1]}
              </span>
              <Button
                icon="reset" minimal small
                onClick={() => {
                  const full: [number, number] = [0, 200]
                  setStepRange(full)
                  highlightStepRange(full)
                }}
                title="Reset to full range"
              />
            </div>
            <div className="timeline-slider">
              <RangeSlider
                min={0} max={200} stepSize={1}
                value={stepRange}
                onChange={handleRangeChange}
                onRelease={handleRangeRelease}
                labelStepSize={40}
                labelRenderer={(val: number) => `${val}`}
              />
            </div>
            <div className="timeline-histogram">
              {histogramData.map(({ step: s, count, height }) => {
                const inRange = s >= stepRange[0] && s <= stepRange[1]
                return (
                  <div
                    key={s}
                    className="histogram-bar"
                    style={{
                      height: `${height}px`,
                      backgroundColor: inRange ? '#4c90f0' : '#383e47',
                      opacity: inRange ? 0.8 : 0.3,
                    }}
                    title={`Step ${s}: ${count} agents`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkGraph
