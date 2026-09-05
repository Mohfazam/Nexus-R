'use client'

import { useEffect, useState } from 'react'
import { Crosshair, Radio, Route, Satellite, Send, ShieldAlert } from 'lucide-react'

type Stage = 'brief' | 'scan' | 'triage' | 'dispatch' | 'report'
type MapMode = 'all' | 'signals' | 'routes' | 'comms' | 'risk'

const stages: { id: Stage; label: string; title: string }[] = [
  { id: 'brief', label: '01', title: 'Incident brief' },
  { id: 'scan', label: '02', title: 'Autonomous scan' },
  { id: 'triage', label: '03', title: 'AI triage' },
  { id: 'dispatch', label: '04', title: 'Rescue dispatch' },
  { id: 'report', label: '05', title: 'Situation report' },
]

const stageGuides: Record<Stage, { label: string; cue: string }> = {
  brief: { label: 'MISSION OBJECTIVE · DEFINE THE PROBLEM', cue: 'Establish the search area and keep responders out of an unverified danger zone.' },
  scan: { label: 'MISSION OBJECTIVE · SEARCH WITHOUT A PILOT', cue: 'Maintain autonomous coverage when GPS and cellular connectivity are unreliable.' },
  triage: { label: 'MISSION OBJECTIVE · TURN PIXELS INTO PRIORITY', cue: 'Rank the survivor signal ahead of hazard and route findings for immediate review.' },
  dispatch: { label: 'MISSION OBJECTIVE · MAKE THE HANDOFF ACTIONABLE', cue: 'Send coordinates, a safe route, and the hazard warning in one responder handoff.' },
  report: { label: 'MISSION OUTCOME · INTELLIGENCE PACKET', cue: 'A detailed after-action report for commanders: evidence, comms path, hardware independence, and recommended next action.' },
}

const missions = [
  { id: 'DR-042', title: 'North sector survivor sweep', location: 'Bengaluru · Ward 14', status: 'IN FLIGHT', battery: '78%', signal: '98%', altitude: '42 m' },
  { id: 'DR-041', title: 'Flood corridor scan', location: 'Bengaluru · Bellandur Lake', status: 'STAGED', battery: '96%', signal: '100%', altitude: '0 m' },
  { id: 'DR-039', title: 'Access route survey', location: 'Bengaluru · HSR Layout', status: 'MAPPING', battery: '61%', signal: '88%', altitude: '31 m' },
]

const detections = [
  { type: 'SURVIVOR', title: 'Person detected', location: 'Grid B-07 · rooftop', confidence: '94%', tone: 'critical' },
  { type: 'HAZARD', title: 'Unstable structure', location: 'Grid B-08 · east facade', confidence: '89%', tone: 'warning' },
  { type: 'ROUTE', title: 'Flooded access road', location: 'Grid C-02 · 180 m stretch', confidence: '97%', tone: 'info' },
]

const evidenceRows = [
  { channel: 'RGB', reading: 'Human-shaped silhouette on rooftop, Grid B-07', weight: 'Primary visual', status: 'SUPPORTING' },
  { channel: 'Thermal', reading: 'Heat signature consistent with a living person', weight: 'Primary thermal', status: 'SUPPORTING' },
  { channel: 'Movement', reading: 'Minor displacement across 3 frames', weight: 'Behavioral', status: 'SUPPORTING' },
  { channel: 'Audio', reading: 'No distress call isolated above flood noise', weight: 'Acoustic', status: 'ABSENT' },
  { channel: 'Location', reading: '12.9351° N, 77.6842° E · 1.2 m fused accuracy', weight: 'Geotag', status: 'LOCKED' },
  { channel: 'Device', reading: '1 BLE ping nearby · not counted as a person', weight: 'Supporting only', status: 'CORROBORATING' },
]

const workspaceCopy: Record<Stage, string> = {
  brief: 'Turn aerial intelligence into a rescue decision in under five minutes.',
  scan: 'Aquila-07 is building a live map while its onboard model searches for people and hazards.',
  triage: 'Review detections ranked by urgency before sending people into the incident zone.',
  dispatch: 'Send a precise handoff to the nearest response team with route risk included.',
  report: 'A commander-ready intelligence packet: mission outcome, fused evidence, comms path, and why this stack is reusable across hardware.',
}

export default function NexusCommandCenter() {
  const [stage, setStage] = useState<Stage>('brief')
  const [selectedDrone, setSelectedDrone] = useState(missions[0])
  const [now, setNow] = useState(new Date('2026-09-05T09:47:32Z'))
  const [exported, setExported] = useState(false)
  const [mapMode, setMapMode] = useState<MapMode>('all')
  const [activeAction, setActiveAction] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow((value) => new Date(value.getTime() + 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = now.toISOString().slice(11, 19)
  const stageIndex = stages.findIndex((item) => item.id === stage)
  const advance = () => setStage(stages[Math.min(stageIndex + 1, stages.length - 1)].id)
  const retreat = () => setStage(stages[Math.max(stageIndex - 1, 0)].id)
  const restart = () => {
    setExported(false)
    setStage('brief')
  }

  const exportReport = () => {
    setExported(true)
    window.print()
  }

  return <main className="nexus-app">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">N</span><div><strong>NEXUS-R</strong><small>DISASTER RESPONSE INTELLIGENCE LAYER</small></div></div>
      <div className="topbar-status"><span className="live-dot" /> LIVE INCIDENT <i /> OFFLINE-FIRST AI <i /> 09:47:32 IST</div>
      <div className="operator"><span>SA</span><div><b>Sarwar</b><small>FLIGHT OPERATIONS LEAD</small></div></div>
    </header>

    <div className="app-body">
      <aside className="left-rail">
        <div className="incident-card"><span className="eyebrow">ACTIVE RESPONSE</span><strong>INC-2026-0905</strong><p>Urban flood and structural collapse<br />Bengaluru, Karnataka</p><span className="incident-status">● PRIORITY RESPONSE</span></div>
        <div className="rail-label">MISSION FLOW</div>
        <nav className="flow-nav">{stages.map((item, index) => <button key={item.id} disabled={index > stageIndex} className={stage === item.id ? 'flow-item active' : index < stageIndex ? 'flow-item done' : 'flow-item'} onClick={() => setStage(item.id)}><span>{index < stageIndex ? '✓' : item.label}</span><b>{item.title}</b>{stage === item.id && <i />}</button>)}</nav>
        <div className="rail-footer"><span className="eyebrow">EDGE SYSTEM</span><p><span className="health-dot" /> 3 drones connected</p><p><span className="health-dot" /> Mesh relay stable</p><small>Last sync 12 sec ago</small></div>
      </aside>

      <section className="workspace">
        <div className="workspace-head"><div><span className="eyebrow">NEXUS-R / UNIFIED DISASTER RESPONSE NETWORK</span><h1>{stages[stageIndex].title}</h1><p>{workspaceCopy[stage]}</p></div><div className="incident-clock"><span>INCIDENT CLOCK</span><b>{time}</b><small>IST · CONNECTED VIA MESH</small></div></div>
        <section className="positioning-strip" aria-label="NEXUS-R operating principles">
          <div><span>ONE RESCUE LAYER</span><b>Drones, robots, sensors</b><small>Join through the hardware abstraction layer</small></div>
          <div><span>NO SINGLE NETWORK</span><b>Terrestrial · mesh · satellite</b><small>Keep the command picture connected</small></div>
          <div><span>HUMAN DECISION</span><b>Evidence, not assumptions</b><small>AI prioritizes; trained responders decide</small></div>
        </section>
        <div className="flow-progress">{stages.map((item, index) => <div key={item.id} className={index <= stageIndex ? 'progress-step reached' : 'progress-step'}><span>{index < stageIndex ? '✓' : item.label}</span><b>{item.title}</b></div>)}</div>

        <div className={stage === 'report' ? 'demo-grid report-mode' : 'demo-grid'}>
          {stage !== 'report' && <>
            <section className={`map-card map-${mapMode}`}>
              <MapControlBar mapMode={mapMode} setMapMode={setMapMode} activeAction={activeAction} setActiveAction={setActiveAction} />
              <div className="card-head"><div><span className="eyebrow">LIVE GEO-TAGGED OPERATING PICTURE</span><h2>Ward 14 · Bengaluru</h2></div><button className="ghost-button">Layers · 04 active</button></div>
              <div className="map-canvas"><div className="map-hud"><span>LIVE SEARCH GRID</span><b>WARD 14 / 2.4 KM²</b><small>UPDATED {time} · GPS + SLAM FUSION</small></div><div className="map-tools" aria-label="Map tools"><button type="button">+</button><button type="button">−</button><button type="button">⌖</button></div><div className="map-compass">N</div><div className="map-water water-one" /><div className="map-water water-two" /><div className="map-road map-road-one" /><div className="map-road map-road-two" /><div className="map-road map-road-three" /><div className="map-buildings buildings-one" /><div className="map-buildings buildings-two" /><div className="map-buildings buildings-three" /><div className="search-zone"><span>SEARCH ZONE · 1.8 ha</span></div><div className="flight-path"><span className="path-point one" /><span className="path-point two" /><span className="path-point three" /><span className="path-point four" /></div><div className="mesh-link mesh-link-one" /><div className="mesh-link mesh-link-two" /><div className="confidence-ring"><span>94% FUSED</span></div><div className="keepout-zone"><span>35 m KEEP-OUT</span></div><div className="coverage-cone"><span>FAILOVER COVERAGE</span></div><MapMarker label="DR-042" className="drone-marker marker-one" /><MapMarker label="DR-041" className="drone-marker marker-two" muted /><MapMarker label="P1" className="survivor-marker survivor-one" /><MapMarker label="H1" className="hazard-marker hazard-one" /><div className="map-feature-stack"><span><i className="feature-signal" /> multimodal signal</span><span><i className="feature-mesh" /> aerial relay</span><span><i className="feature-route" /> safe route</span></div><div className="map-label label-lake">BELLANDUR LAKE</div><div className="map-label label-ward">WARD 14</div><div className="map-label label-road">OUTER RING ROAD</div><div className="map-legend"><span><i className="legend-drone" /> drone</span><span><i className="legend-survivor" /> survivor</span><span><i className="legend-hazard" /> hazard</span><span><i className="legend-zone" /> search zone</span></div></div>
              <div className="map-footer"><span>ON-DEVICE MAP · GPS + SLAM FUSION</span><span>UPDATED {time} · 1.2 m ACCURACY</span></div>
              <div className="map-reading"><div><span className="map-reading-icon survivor-read">P1</span><p><b>Fused survivor signal</b><small>RGB + thermal + movement · 94%</small></p></div><div><span className="map-reading-icon hazard-read">H1</span><p><b>Keep-out hazard</b><small>East facade · 35 m standoff</small></p></div><div><span className="map-reading-icon route-read">→</span><p><b>Recommended approach</b><small>Service lane · flood-safe</small></p></div><div><span className="map-reading-icon relay-read">⌁</span><p><b>Failover ready</b><small>DR-041 can inherit this mission</small></p></div></div>
            </section>
            <section className="control-card">
              {stage === 'brief' && <BriefPanel advance={advance} />}
              {stage === 'scan' && <ScanPanel drone={selectedDrone} advance={advance} />}
              {stage === 'triage' && <TriagePanel advance={advance} />}
              {stage === 'dispatch' && <DispatchPanel advance={advance} />}
            </section>
          </>}
          {stage === 'report' && <ReportDocument time={time} exported={exported} onExport={exportReport} />}
          <div className="demo-controls"><div><span>{stageGuides[stage].label}</span><p>{stageGuides[stage].cue}</p></div><div className="demo-buttons"><button className="secondary-action" onClick={retreat} disabled={stageIndex === 0}>← Back</button>{stageIndex < stages.length - 1 ? <button className="secondary-action continue-action" onClick={advance}>Continue →</button> : <button className="secondary-action continue-action" onClick={restart}>Replay demo ↻</button>}</div></div>
        </div>

        {stage !== 'report' && <>
          <section className="ai-console"><div className="card-head compact"><div><span className="eyebrow">EDGE + CENTRAL INTELLIGENCE</span><h2>Evidence fusion and coordination</h2></div><span className="ai-live"><i /> INFERENCE ACTIVE</span></div><div className="ai-feature-grid"><div className="ai-feature"><span className="ai-feature-icon">◎</span><div><b>Multimodal evidence</b><p>RGB, thermal, audio, movement, location, and device signals combine into a score.</p></div><strong>94%</strong></div><div className="ai-feature"><span className="ai-feature-icon warning-icon">△</span><div><b>Risk-aware triage</b><p>A signal is supporting evidence, not a confirmed survivor count.</p></div><strong>89%</strong></div><div className="ai-feature"><span className="ai-feature-icon route-icon">⌁</span><div><b>Hardware-independent missions</b><p>Compatible drones or robots can take over without rebuilding rescue logic.</p></div><strong>HAL</strong></div><div className="ai-feature"><span className="ai-feature-icon mesh-icon">◌</span><div><b>Resilient communications</b><p>Terrestrial, aerial mesh, and satellite paths keep evidence moving.</p></div><strong>ONLINE</strong></div></div></section>
          <section className="topology-card"><div className="topology-heading"><div><span className="eyebrow">LOW-LEVEL DESIGN · LIVE SYSTEM TOPOLOGY</span><h2>From sensor data to saved lives</h2></div><div className="topology-tags"><span>MODULAR</span><span>REAL-TIME</span><span>HARDWARE-AGNOSTIC</span></div></div><div className="topology-flow"><TopologyNode label="FIELD INPUT" title="RGB · thermal · IMU · GPS" tone="input" /><span className="topology-arrow">→</span><TopologyNode label="DEVICE SERVICE" title="Flight control + mesh" tone="device" /><span className="topology-arrow">→</span><TopologyNode label="AI PIPELINE" title="Fuse · detect · score" tone="ai" active /><span className="topology-arrow">→</span><TopologyNode label="RESPONSE API" title="Map · alert · dispatch" tone="response" /></div><div className="topology-bus"><span className="bus-pulse" /> EVENT BUS · LIVE TELEMETRY · EVIDENCE PACKETS <i /> WEATHER API · EMERGENCY NETWORKS · CONTROL ROOM</div></section>
          <div className="support-grid"><section className="telemetry-card"><div className="card-head compact"><div><span className="eyebrow">FLEET TELEMETRY</span><h2>Connected assets</h2></div><span className="count-badge">03 ONLINE</span></div>{missions.map((mission) => <button key={mission.id} className={selectedDrone.id === mission.id ? 'drone-row selected' : 'drone-row'} onClick={() => setSelectedDrone(mission)}><span className="drone-icon">✦</span><div><b>{mission.id} · {mission.title}</b><small>{mission.location}</small></div><span className="drone-state">{mission.status}</span><span className="drone-battery">{mission.battery}</span></button>)}</section><section className="activity-card"><div className="card-head compact"><div><span className="eyebrow">WHY NEXUS-R</span><h2>Decision trace</h2></div><span className="confidence">AI CONFIDENCE 94%</span></div><div className="trace-row"><b>01</b><span>RGB + thermal frames fused locally</span><time>09:47:14</time></div><div className="trace-row"><b>02</b><span>Survivor ranked above hazard alerts</span><time>09:47:09</time></div><div className="trace-row"><b>03</b><span>Safe route calculated for Team Kavya</span><time>09:46:52</time></div></section></div>
        </>}
        <footer className="app-footer"><span>NEXUS-R · HARDWARE-AGNOSTIC INTELLIGENCE FOR DISASTER TEAMS</span><span>BUILD 1.1 · AUDIT TRAIL ENABLED</span></footer>
      </section>
    </div>
  </main>
}

function BriefPanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">01 / 05</span><h2>Start with the incident</h2><p className="panel-lede">A flash flood has isolated residents after a partial building collapse in Bengaluru's Ward 14.</p><div className="brief-facts"><div><span>DECLARED BY</span><b>Ravi Prakash</b><small>District Emergency Officer</small></div><div><span>RESPONSE AREA</span><b>Bellandur, Bengaluru</b><small>2.4 km² · 14,200 residents</small></div><div><span>CONNECTIVITY</span><b className="green-text">Intermittent</b><small>Mesh relay available</small></div><div><span>PRIMARY RISK</span><b className="red-text">Structural collapse</b><small>Entry requires standoff</small></div></div><div className="panel-callout"><span>WHY AUTONOMOUS?</span><b>Reach inaccessible areas before responders do.</b><p>NEXUS-R keeps inference on the drone, so the search continues when cellular networks fail.</p></div><button className="action-button" onClick={advance}>Launch autonomous scan <span>→</span></button></div> }

function ScanPanel({ drone, advance }: { drone: typeof missions[number]; advance: () => void }) { return <div className="panel-content"><span className="step-number">02 / 05</span><h2>Let the drone search</h2><p className="panel-lede">Aquila-07 is flying a lawnmower pattern over the red zone. No pilot input required.</p><div className="scan-status"><div className="radar"><span /><i /><b>SCANNING</b></div><div><strong>{drone.id} · {drone.status}</strong><p>Thermal + RGB cameras fused on-device</p><p>GPS fallback: visual SLAM locked</p></div></div><div className="scan-metrics"><div><span>AREA COVERED</span><b>68%</b></div><div><span>FRAMES PROCESSED</span><b>12,480</b></div><div><span>FLIGHT TIME</span><b>04:18</b></div></div><button className="action-button" onClick={advance}>Review AI detections <span>→</span></button></div> }

function TriagePanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">03 / 05</span><h2>Review AI detections</h2><p className="panel-lede">Three findings are ready for a human decision. Survivor signals always rise to the top.</p><div className="detection-list">{detections.map((detection) => <div className="detection-row" key={detection.title}><span className={`detection-icon ${detection.tone}`}>{detection.tone === 'critical' ? '!' : detection.tone === 'warning' ? '△' : '↗'}</span><div><span>{detection.type}</span><b>{detection.title}</b><small>{detection.location}</small></div><strong>{detection.confidence}</strong></div>)}</div><button className="action-button" onClick={advance}>Create rescue handoff <span>→</span></button></div> }

function DispatchPanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">04 / 05</span><h2>Dispatch with confidence</h2><p className="panel-lede">The nearest team receives a verified location, access route, and hazard warning.</p><div className="dispatch-card"><div className="team-avatar">K</div><div><span>RECOMMENDED RESPONSE TEAM</span><b>Team Kavya · Bravo 2</b><small>ETA 06 min · 420 m from survivor signal</small></div><span className="green-text">READY</span></div><div className="route-note"><span>SAFE ACCESS ROUTE</span><b>Via 5th Main Road → service lane</b><p>Flooded road blocked. Maintain 35 m standoff from unstable facade.</p></div><button className="action-button" onClick={advance}>Send dispatch and generate report <span>→</span></button></div> }

function ReportDocument({ time, exported, onExport }: { time: string; exported: boolean; onExport: () => void }) {
  return <article className="intel-report">
    <header className="report-masthead">
      <div>
        <span className="eyebrow">NEXUS-R INTELLIGENCE PACKET · INC-2026-0905</span>
        <h2>After-action situation report</h2>
        <p>Urban flood and structural collapse · Ward 14, Bengaluru · generated {time} IST</p>
      </div>
      <div className="report-actions">
        <button className="secondary-action" type="button" onClick={onExport}>Export to control room <span>↓</span></button>
        {exported && <small className="export-note">Packet marked for district control room.</small>}
      </div>
    </header>

    <div className="report-banner">
      <span>✓</span>
      <div>
        <b>COMMANDER ACTION: Review P1 and dispatch Team Kavya via the flood-safe service lane.</b>
        <p>One high-priority survivor signal is recommended from fused evidence. Final confirmation and rescue decisions remain with trained responders.</p>
      </div>
    </div>

    <div className="report-kpis">
      <div><span>FUSED CONFIDENCE</span><b>94%</b><small>RGB + thermal + movement + geotag</small></div>
      <div><span>HAZARD ZONES</span><b>02</b><small>Collapse facade · flooded road</small></div>
      <div><span>TIME SAVED</span><b>38 min</b><small>vs unaided ground search</small></div>
      <div><span>ASSETS USED</span><b>DR-042</b><small>DR-041 staged as failover</small></div>
    </div>

    <section className="report-section">
      <span className="eyebrow">01 · OPERATIONAL OUTCOME</span>
      <h3>What the field needs to know now</h3>
      <div className="report-split">
        <div className="report-block">
          <span>PRIORITY TARGET P1</span>
          <b>Possible survivor, rooftop Grid B-07</b>
          <p>Visual and thermal evidence agree. Device ping nearby is corroborating only — one phone does not equal one person. Buried-survivor logic is the same: if RGB fails, thermal, acoustic, and device signals can still raise priority without claiming a confirmed count.</p>
        </div>
        <div className="report-block">
          <span>RECOMMENDED HANDOFF</span>
          <b>Team Kavya · Bravo 2 · ETA 06 min</b>
          <p>Approach via 5th Main Road into the service lane. Flooded access on Grid C-02 is blocked. Maintain 35 m standoff from the unstable east facade. Commanders may override this recommendation at any time.</p>
        </div>
      </div>
    </section>

    <section className="report-section">
      <span className="eyebrow">02 · EVIDENCE FUSION</span>
      <h3>A single detection is never a confirmed survivor</h3>
      <p className="report-copy">AI combines RGB, thermal, audio, movement, location, and device signals into a confidence and priority score. Device signals support the case; they do not tally headcount, because devices can be abandoned, shared, or absent.</p>
      <div className="evidence-table">
        <div className="evidence-head"><span>CHANNEL</span><span>FIELD READING</span><span>ROLE</span><span>STATUS</span></div>
        {evidenceRows.map((row) => (
          <div className="evidence-row" key={row.channel}>
            <b>{row.channel}</b>
            <span>{row.reading}</span>
            <span>{row.weight}</span>
            <em className={row.status === 'ABSENT' ? 'muted-status' : ''}>{row.status}</em>
          </div>
        ))}
      </div>
    </section>

    <section className="report-section">
      <span className="eyebrow">03 · COMMUNICATION PATH</span>
      <h3>No single-network dependency</h3>
      <div className="comms-grid">
        <div><span>01 TERRESTRIAL</span><b>Unavailable in Ward 14</b><p>Cellular backhaul dropped after flooding. The stack did not wait on restoration.</p></div>
        <div><span>02 AERIAL MESH</span><b>Active · DR-042 relay</b><p>Drones formed an aerial relay so evidence packets still reached the command picture.</p></div>
        <div><span>03 SATELLITE BACKHAUL</span><b>Ground gateway ready</b><p>If the mesh saturates, a ground gateway can use satellite connectivity to keep the control room in the loop.</p></div>
      </div>
    </section>

    <section className="report-section">
      <span className="eyebrow">04 · HARDWARE ABSTRACTION</span>
      <h3>The aircraft can change. The rescue intelligence stays.</h3>
      <p className="report-copy">NEXUS-R is a hardware-agnostic disaster-response intelligence layer. An expensive enterprise drone, a lower-cost Indian airframe, or a future ground robot can join the same rescue ecosystem through a hardware abstraction layer — without rebuilding the software stack. This mission flew DR-042; DR-041 was staged to take over because missions and intelligence are not tied to a single aircraft.</p>
      <div className="stack-pills">
        <span>ROS 2</span><span>MAVLink</span><span>PX4</span><span>ArduPilot</span><span>Vendor SDKs</span><span>Auterion-class platforms</span>
      </div>
      <p className="report-copy subtle">We are not competing with robotics operating systems. We build on those standards and place NEXUS-R above them as the disaster-response intelligence layer.</p>
    </section>

    <section className="report-section">
      <span className="eyebrow">05 · COMPUTE SPLIT</span>
      <h3>Time-critical AI at the edge. Coordination in the center.</h3>
      <div className="report-split">
        <div className="report-block">
          <span>EDGE</span>
          <b>Detection, fusion, geotag, local cache</b>
          <p>On-device inference kept running when the tower failed. Evidence packets queued locally and synced over mesh.</p>
        </div>
        <div className="report-block">
          <span>CENTRAL</span>
          <b>Fleet coordination, history, heavier analytics</b>
          <p>The shared dashboard ranked P1, assigned Bravo 2, and retained the audit trail for the district control room.</p>
        </div>
      </div>
    </section>

    <section className="report-section">
      <span className="eyebrow">06 · SYSTEM BOUNDARY AND ROADMAP</span>
      <h3>Integration is the operational advantage</h3>
      <p className="report-copy">NEXUS-R combines existing technologies into one disaster-response intelligence layer. Its value is the shared evidence model, rescue workflow, mission coordination, and hardware independence across drones, robots, sensors, and communication paths.</p>
      <div className="claim-grid">
        <div>
          <span>MVP · AVAILABLE NOW</span>
          <ul>
            <li>Live data from the drone</li>
            <li>AI detection of potential survivors and hazards</li>
            <li>Geotagging and priority scoring</li>
            <li>Shared dashboard for rescue teams</li>
          </ul>
        </div>
        <div>
          <span>ROADMAP · NEXT CAPABILITIES</span>
          <ul>
            <li>Aerial network relay at district scale</li>
            <li>Device-based survivor estimation</li>
            <li>Victim communication channels</li>
            <li>Broader robot support beyond airframes</li>
          </ul>
        </div>
      </div>
      <div className="report-moat">
        <span>CORE VALUE</span>
        <b>One coordinated rescue network across heterogeneous hardware.</b>
        <p>NEXUS-R does not replace rescue commanders or robotics operating systems. It makes their existing tools work together, keeps intelligence reusable when hardware changes, and reduces the information burden during a time-critical response.</p>
      </div>
    </section>
  </article>
}

function MapMarker({ label, className, muted = false }: { label: string; className: string; muted?: boolean }) { return <div className={`${className} ${muted ? 'muted-marker' : ''}`}><span>{label}</span></div> }
function TopologyNode({ label, title, tone, active = false }: { label: string; title: string; tone: string; active?: boolean }) { return <div className={`topology-node ${tone} ${active ? 'active' : ''}`}><span>{label}</span><b>{title}</b>{active && <i>LIVE</i>}</div> }

function MapControlBar({ mapMode, setMapMode, activeAction, setActiveAction }: { mapMode: MapMode; setMapMode: (mode: MapMode) => void; activeAction: string; setActiveAction: (action: string) => void }) {
  return <div className="map-control-bar">
    <div className="map-mode-tools" aria-label="Map focus modes">
      <button type="button" className={mapMode === 'all' ? 'selected' : ''} onClick={() => setMapMode('all')} title="All layers" aria-label="Show all map layers"><Crosshair size={15} /></button>
      <button type="button" className={mapMode === 'signals' ? 'selected' : ''} onClick={() => setMapMode('signals')} title="Evidence signals" aria-label="Show evidence signals"><Radio size={15} /></button>
      <button type="button" className={mapMode === 'routes' ? 'selected' : ''} onClick={() => setMapMode('routes')} title="Safe routes" aria-label="Show safe routes"><Route size={15} /></button>
      <button type="button" className={mapMode === 'comms' ? 'selected' : ''} onClick={() => setMapMode('comms')} title="Communication links" aria-label="Show communication links"><Satellite size={15} /></button>
      <button type="button" className={mapMode === 'risk' ? 'selected' : ''} onClick={() => setMapMode('risk')} title="Hazard zones" aria-label="Show hazard zones"><ShieldAlert size={15} /></button>
    </div>
    <div className="map-action-tools" aria-label="Response actions">
      <button type="button" className={activeAction === 'broadcast' ? 'selected' : ''} onClick={() => setActiveAction('broadcast')} title="Broadcast responder alert" aria-label="Broadcast responder alert"><Send size={15} /></button>
      <button type="button" className={activeAction === 'relay' ? 'selected' : ''} onClick={() => setActiveAction('relay')} title="Activate satellite fallback" aria-label="Activate satellite fallback"><Satellite size={15} /></button>
      <button type="button" className={activeAction === 'hazard' ? 'selected' : ''} onClick={() => setActiveAction('hazard')} title="Mark hazard" aria-label="Mark hazard"><ShieldAlert size={15} /></button>
    </div>
  </div>
}
