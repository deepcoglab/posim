import React, { useCallback } from 'react'
import { Tab, Tabs, Switch, Slider, HTMLSelect, Icon, Button } from '@blueprintjs/core'

export interface GraphSettings {
  // Points - Coloring
  pointColorColumn: string
  colorStrategy: string
  showColorLegend: boolean
  // Points - Sizing
  pointSizeColumn: string
  sizeStrategy: string
  pointSizeScale: number
  pointDefaultSize: number
  scalePointsOnZoom: boolean
  // Points - Labels
  pointLabelColumn: string
  showDynamicLabels: boolean
  labelLimit: number
  // Points - Appearance
  pointOpacity: number
  // Links
  renderLinks: boolean
  linkWidth: number
  linkOpacity: number
  curvedLinks: boolean
  linkArrows: boolean
  linkColorStrategy: string
  // Simulation
  enableSimulation: boolean
  simulationGravity: number
  simulationRepulsion: number
  simulationLinkSpring: number
  simulationDecay: number
  simulationFriction: number
  simulationCluster: number
}

export const DEFAULT_GRAPH_SETTINGS: GraphSettings = {
  pointColorColumn: 'agentType',
  colorStrategy: 'direct',
  showColorLegend: true,
  pointSizeColumn: 'size',
  sizeStrategy: 'direct',
  pointSizeScale: 1.5,
  pointDefaultSize: 4,
  scalePointsOnZoom: true,
  pointLabelColumn: 'label',
  showDynamicLabels: true,
  labelLimit: 30,
  pointOpacity: 0.85,
  renderLinks: true,
  linkWidth: 0.5,
  linkOpacity: 0.15,
  curvedLinks: false,
  linkArrows: false,
  linkColorStrategy: 'single',
  enableSimulation: true,
  simulationGravity: 0.25,
  simulationRepulsion: 1.0,
  simulationLinkSpring: 0.3,
  simulationDecay: 8000,
  simulationFriction: 0.85,
  simulationCluster: 1.0,
}

const COLOR_STRATEGIES = [
  { value: 'direct', label: 'direct' },
  { value: 'categorical', label: 'categorical' },
  { value: 'degree', label: 'degree' },
  { value: 'single', label: 'single' },
]

const SIZE_STRATEGIES = [
  { value: 'direct', label: 'direct' },
  { value: 'auto', label: 'auto' },
  { value: 'degree', label: 'degree' },
  { value: 'single', label: 'single' },
]

interface GraphConfigSidebarProps {
  settings: GraphSettings
  onSettingsChange: (settings: GraphSettings) => void
  onClose?: () => void
  pointColumns?: string[]
  numericColumns?: string[]
}

const GraphConfigSidebar: React.FC<GraphConfigSidebarProps> = ({
  settings,
  onSettingsChange,
  onClose,
  pointColumns,
  numericColumns,
}) => {
  const update = useCallback(
    (partial: Partial<GraphSettings>) => {
      onSettingsChange({ ...settings, ...partial })
    },
    [settings, onSettingsChange],
  )

  const allCols = pointColumns && pointColumns.length > 0
    ? pointColumns
    : ['id', 'label', 'agentType', 'size', 'active']
  const numCols = numericColumns && numericColumns.length > 0
    ? numericColumns
    : ['size', 'active', 'timestamp']

  const pointsPanel = (
    <div className="config-tab-body">
      {/* COLORING */}
      <div className="config-section">
        <div className="config-section-title">Coloring</div>

        <div className="config-row">
          <div className="config-row-label">
            point color data column
          </div>
          <HTMLSelect
            value={settings.pointColorColumn}
            onChange={(e) => update({ pointColorColumn: e.target.value })}
            options={[{ value: '', label: '(none)' }, ...allCols.map((c) => ({ value: c, label: c }))]}
            fill
            minimal
          />
        </div>

        <div className="config-row">
          <div className="config-row-label">
            coloring strategy <Icon icon="info-sign" size={10} />
          </div>
          <HTMLSelect
            value={settings.colorStrategy}
            onChange={(e) => update({ colorStrategy: e.target.value })}
            options={COLOR_STRATEGIES}
            fill
            minimal
          />
        </div>

        <div className="config-row-inline">
          <div className="config-row-label">
            show color legend <Icon icon="info-sign" size={10} />
          </div>
          <Switch
            checked={settings.showColorLegend}
            onChange={() => update({ showColorLegend: !settings.showColorLegend })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>
      </div>

      {/* SIZING */}
      <div className="config-section">
        <div className="config-section-title">Sizing</div>

        <div className="config-row">
          <div className="config-row-label">
            point size data column <Icon icon="info-sign" size={10} />
          </div>
          <HTMLSelect
            value={settings.pointSizeColumn}
            onChange={(e) => update({ pointSizeColumn: e.target.value })}
            options={[{ value: '', label: '(none)' }, ...numCols.map((c) => ({ value: c, label: c }))]}
            fill
            minimal
          />
        </div>

        <div className="config-row">
          <div className="config-row-label">
            strategy <Icon icon="info-sign" size={10} />
          </div>
          <HTMLSelect
            value={settings.sizeStrategy}
            onChange={(e) => update({ sizeStrategy: e.target.value })}
            options={SIZE_STRATEGIES}
            fill
            minimal
          />
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            point size scale <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0.1} max={5} stepSize={0.05}
            value={settings.pointSizeScale}
            onChange={(val) => update({ pointSizeScale: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.pointSizeScale.toFixed(2)}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">default size</div>
          <Slider
            min={1} max={20} stepSize={0.5}
            value={settings.pointDefaultSize}
            onChange={(val) => update({ pointDefaultSize: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.pointDefaultSize.toFixed(1)}</span>
        </div>

        <div className="config-row-inline">
          <div className="config-row-label">
            scale points on zoom <Icon icon="info-sign" size={10} />
          </div>
          <Switch
            checked={settings.scalePointsOnZoom}
            onChange={() => update({ scalePointsOnZoom: !settings.scalePointsOnZoom })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>
      </div>

      {/* APPEARANCE */}
      <div className="config-section">
        <div className="config-section-title">Appearance</div>

        <div className="config-slider-row">
          <div className="config-row-label">opacity</div>
          <Slider
            min={0} max={1} stepSize={0.01}
            value={settings.pointOpacity}
            onChange={(val) => update({ pointOpacity: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.pointOpacity.toFixed(2)}</span>
        </div>
      </div>

      {/* LABELS */}
      <div className="config-section">
        <div className="config-section-title">Labels</div>

        <div className="config-row">
          <div className="config-row-label">
            point label data column <Icon icon="info-sign" size={10} />
          </div>
          <HTMLSelect
            value={settings.pointLabelColumn}
            onChange={(e) => update({ pointLabelColumn: e.target.value })}
            options={[{ value: '', label: '(none)' }, ...allCols.map((c) => ({ value: c, label: c }))]}
            fill
            minimal
          />
        </div>

        <div className="config-row-inline">
          <div className="config-row-label">
            show dynamic labels <Icon icon="info-sign" size={10} />
          </div>
          <Switch
            checked={settings.showDynamicLabels}
            onChange={() => update({ showDynamicLabels: !settings.showDynamicLabels })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">label limit</div>
          <Slider
            min={0} max={200} stepSize={5}
            value={settings.labelLimit}
            onChange={(val) => update({ labelLimit: Math.round(val) })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.labelLimit}</span>
        </div>
      </div>
    </div>
  )

  const linksPanel = (
    <div className="config-tab-body">
      <div className="config-section">
        <div className="config-section-title">Appearance</div>

        <div className="config-row-inline">
          <div className="config-row-label">render links</div>
          <Switch
            checked={settings.renderLinks}
            onChange={() => update({ renderLinks: !settings.renderLinks })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">link width</div>
          <Slider
            min={0.1} max={5} stepSize={0.1}
            value={settings.linkWidth}
            onChange={(val) => update({ linkWidth: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.linkWidth.toFixed(1)}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">link opacity</div>
          <Slider
            min={0} max={1} stepSize={0.01}
            value={settings.linkOpacity}
            onChange={(val) => update({ linkOpacity: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.linkOpacity.toFixed(2)}</span>
        </div>

        <div className="config-row-inline">
          <div className="config-row-label">curved links</div>
          <Switch
            checked={settings.curvedLinks}
            onChange={() => update({ curvedLinks: !settings.curvedLinks })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>

        <div className="config-row-inline">
          <div className="config-row-label">link arrows</div>
          <Switch
            checked={settings.linkArrows}
            onChange={() => update({ linkArrows: !settings.linkArrows })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>
      </div>

      <div className="config-section">
        <div className="config-section-title">Coloring</div>

        <div className="config-row">
          <div className="config-row-label">link color strategy</div>
          <HTMLSelect
            value={settings.linkColorStrategy}
            onChange={(e) => update({ linkColorStrategy: e.target.value })}
            options={[
              { value: 'single', label: 'single' },
              { value: 'categorical', label: 'categorical' },
              { value: 'continuous', label: 'continuous' },
            ]}
            fill
            minimal
          />
        </div>
      </div>
    </div>
  )

  const simulationPanel = (
    <div className="config-tab-body">
      <div className="config-section">
        <div className="config-section-title">Forces</div>

        <div className="config-row-inline">
          <div className="config-row-label">enable simulation</div>
          <Switch
            checked={settings.enableSimulation}
            onChange={() => update({ enableSimulation: !settings.enableSimulation })}
            alignIndicator="right"
            innerLabel="off"
            innerLabelChecked="on"
          />
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            gravity <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0} max={2} stepSize={0.01}
            value={settings.simulationGravity}
            onChange={(val) => update({ simulationGravity: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationGravity.toFixed(2)}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            repulsion <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0} max={5} stepSize={0.01}
            value={settings.simulationRepulsion}
            onChange={(val) => update({ simulationRepulsion: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationRepulsion.toFixed(2)}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            link spring <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0} max={5} stepSize={0.01}
            value={settings.simulationLinkSpring}
            onChange={(val) => update({ simulationLinkSpring: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationLinkSpring.toFixed(2)}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            decay <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={100} max={50000} stepSize={100}
            value={settings.simulationDecay}
            onChange={(val) => update({ simulationDecay: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationDecay}</span>
        </div>

        <div className="config-slider-row">
          <div className="config-row-label">
            friction <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0} max={1} stepSize={0.01}
            value={settings.simulationFriction}
            onChange={(val) => update({ simulationFriction: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationFriction.toFixed(2)}</span>
        </div>
      </div>

      <div className="config-section">
        <div className="config-section-title">Clustering</div>

        <div className="config-slider-row">
          <div className="config-row-label">
            cluster strength <Icon icon="info-sign" size={10} />
          </div>
          <Slider
            min={0} max={3} stepSize={0.1}
            value={settings.simulationCluster}
            onChange={(val) => update({ simulationCluster: val })}
            labelRenderer={false}
          />
          <span className="slider-value">{settings.simulationCluster.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="graph-config-sidebar">
      <div className="graph-config-sidebar__header">
        <span>Graph Configuration</span>
        {onClose && <Button icon="cross" minimal small onClick={onClose} />}
      </div>
      <Tabs id="graph-config-tabs" defaultSelectedTabId="points" renderActiveTabPanelOnly>
        <Tab id="points" title="POINTS" panel={pointsPanel} />
        <Tab id="links" title="LINKS" panel={linksPanel} />
        <Tab id="simulation" title="SIMULATION" panel={simulationPanel} />
      </Tabs>
    </div>
  )
}

export default GraphConfigSidebar
