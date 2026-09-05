'use client'

import { useEffect, useState } from 'react'

type Stage = 'brief' | 'scan' | 'triage' | 'dispatch' | 'report'

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
  report: { label: 'MISSION OUTCOME · SAVE RESPONDER TIME', cue: 'Record the verified survivor, marked hazards, and the recommended access route.' },
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

export default function NexusCommandCenter() {
  const [stage, setStage] = useState<Stage>('brief')
  const [selectedDrone, setSelectedDrone] = useState(missions[0])
  const [now, setNow] = useState(new Date('2026-09-05T09:47:32Z'))

  useEffect(() => {
    const timer = window.setInterval(() => setNow((value) => new Date(value.getTime() + 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = now.toISOString().slice(11, 19)
  const stageIndex = stages.findIndex((item) => item.id === stage)
  const advance = () => setStage(stages[Math.min(stageIndex + 1, stages.length - 1)].id)
  const retreat = () => setStage(stages[Math.max(stageIndex - 1, 0)].id)
  const restart = () => setStage('brief')

  return <main className="nexus-app">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">N</span><div><strong>NEXUS-R</strong><small>EDGE RESPONSE NETWORK</small></div></div>
      <div className="topbar-status"><span className="live-dot" /> LIVE INCIDENT <i /> OFFLINE-FIRST AI <i /> 09:47:32 IST</div>
      <div className="operator"><span>AM</span><div><b>Ananya Menon</b><small>FLIGHT OPERATIONS LEAD</small></div></div>
    </header>

    <div className="app-body">
      <aside className="left-rail">
        <div className="incident-card"><span className="eyebrow">ACTIVE RESPONSE</span><strong>INC-2026-0905</strong><p>Urban flood and structural collapse<br />Bengaluru, Karnataka</p><span className="incident-status">● PRIORITY RESPONSE</span></div>
        <div className="rail-label">MISSION FLOW</div>
        <nav className="flow-nav">{stages.map((item, index) => <button key={item.id} disabled={index > stageIndex} className={stage === item.id ? 'flow-item active' : index < stageIndex ? 'flow-item done' : 'flow-item'} onClick={() => setStage(item.id)}><span>{index < stageIndex ? '✓' : item.label}</span><b>{item.title}</b>{stage === item.id && <i />}</button>)}</nav>
        <div className="rail-footer"><span className="eyebrow">EDGE SYSTEM</span><p><span className="health-dot" /> 3 drones connected</p><p><span className="health-dot" /> Mesh relay stable</p><small>Last sync 12 sec ago</small></div>
      </aside>

      <section className="workspace">
        <div className="workspace-head"><div><span className="eyebrow">NEXUS-R / AUTONOMOUS SEARCH AND RESCUE</span><h1>{stages[stageIndex].title}</h1><p>{stage === 'brief' ? 'Turn aerial intelligence into a rescue decision in under five minutes.' : stage === 'scan' ? 'Aquila-07 is building a live map while its onboard model searches for people and hazards.' : stage === 'triage' ? 'Review detections ranked by urgency before sending people into the incident zone.' : stage === 'dispatch' ? 'Send a precise handoff to the nearest response team with route risk included.' : 'A field-ready summary is assembled from verified drone evidence.'}</p></div><div className="incident-clock"><span>INCIDENT CLOCK</span><b>{time}</b><small>IST · CONNECTED VIA MESH</small></div></div>
        <div className="flow-progress">{stages.map((item, index) => <div key={item.id} className={index <= stageIndex ? 'progress-step reached' : 'progress-step'}><span>{index < stageIndex ? '✓' : item.label}</span><b>{item.title}</b></div>)}</div>

        <div className="demo-grid">
          <section className="map-card">
            <div className="card-head"><div><span className="eyebrow">LIVE GEO-TAGGED OPERATING PICTURE</span><h2>Ward 14 · Bengaluru</h2></div><button className="ghost-button">Satellite + street ▾</button></div>
            <div className="map-canvas"><div className="map-water water-one" /><div className="map-water water-two" /><div className="map-road map-road-one" /><div className="map-road map-road-two" /><div className="map-road map-road-three" /><div className="map-buildings buildings-one" /><div className="map-buildings buildings-two" /><div className="map-buildings buildings-three" /><div className="search-zone"><span>SEARCH ZONE · 1.8 ha</span></div><div className="flight-path"><span className="path-point one" /><span className="path-point two" /><span className="path-point three" /><span className="path-point four" /></div><MapMarker label="DR-042" className="drone-marker marker-one" /><MapMarker label="DR-041" className="drone-marker marker-two" muted /><MapMarker label="P1" className="survivor-marker survivor-one" /><MapMarker label="H1" className="hazard-marker hazard-one" /><div className="map-label label-lake">BELLANDUR LAKE</div><div className="map-label label-ward">WARD 14</div><div className="map-label label-road">OUTER RING ROAD</div><div className="map-legend"><span><i className="legend-drone" /> drone</span><span><i className="legend-survivor" /> survivor</span><span><i className="legend-hazard" /> hazard</span><span><i className="legend-zone" /> search zone</span></div></div>
            <div className="map-footer"><span>ON-DEVICE MAP · GPS + SLAM FUSION</span><span>UPDATED {time} · 1.2 m ACCURACY</span></div>
            <div className="map-reading"><div><span className="map-reading-icon survivor-read">P1</span><p><b>Survivor signal</b><small>Grid B-07 · 94% confidence</small></p></div><div><span className="map-reading-icon hazard-read">H1</span><p><b>Keep-out hazard</b><small>East facade · 35 m standoff</small></p></div><div><span className="map-reading-icon route-read">→</span><p><b>Recommended approach</b><small>Service lane · flood-safe</small></p></div></div>
          </section>

          <section className="control-card">
            {stage === 'brief' && <BriefPanel advance={advance} />}
            {stage === 'scan' && <ScanPanel drone={selectedDrone} advance={advance} />}
            {stage === 'triage' && <TriagePanel advance={advance} />}
            {stage === 'dispatch' && <DispatchPanel advance={advance} />}
            {stage === 'report' && <ReportPanel />}
          </section>
          <div className="demo-controls"><div><span>{stageGuides[stage].label}</span><p>{stageGuides[stage].cue}</p></div><div className="demo-buttons"><button className="secondary-action" onClick={retreat} disabled={stageIndex === 0}>← Back</button>{stageIndex < stages.length - 1 ? <button className="secondary-action continue-action" onClick={advance}>Continue →</button> : <button className="secondary-action continue-action" onClick={restart}>Replay demo ↻</button>}</div></div>
        </div>

        <section className="ai-console"><div className="card-head compact"><div><span className="eyebrow">ON-DEVICE INTELLIGENCE</span><h2>AI mission stack</h2></div><span className="ai-live"><i /> INFERENCE ACTIVE</span></div><div className="ai-feature-grid"><div className="ai-feature"><span className="ai-feature-icon">◎</span><div><b>Survivor detection</b><p>Thermal + RGB fusion finds people through low visibility.</p></div><strong>94%</strong></div><div className="ai-feature"><span className="ai-feature-icon warning-icon">△</span><div><b>Hazard classification</b><p>Flags collapse risk, floodwater, smoke, and unsafe access.</p></div><strong>89%</strong></div><div className="ai-feature"><span className="ai-feature-icon route-icon">⌁</span><div><b>Autonomous navigation</b><p>Visual SLAM holds the flight path when GPS drops.</p></div><strong>98%</strong></div><div className="ai-feature"><span className="ai-feature-icon mesh-icon">◌</span><div><b>Offline resilience</b><p>Evidence stays on-device and syncs over the mesh relay.</p></div><strong>ONLINE</strong></div></div></section>
        <section className="topology-card"><div className="topology-heading"><div><span className="eyebrow">LOW-LEVEL DESIGN · LIVE SYSTEM TOPOLOGY</span><h2>From sensor data to saved lives</h2></div><div className="topology-tags"><span>MODULAR</span><span>REAL-TIME</span><span>HARDWARE-AGNOSTIC</span></div></div><div className="topology-flow"><TopologyNode label="FIELD INPUT" title="RGB · thermal · IMU · GPS" tone="input" /><span className="topology-arrow">→</span><TopologyNode label="DEVICE SERVICE" title="Flight control + mesh" tone="device" /><span className="topology-arrow">→</span><TopologyNode label="AI PIPELINE" title="Fuse · detect · score" tone="ai" active /><span className="topology-arrow">→</span><TopologyNode label="RESPONSE API" title="Map · alert · dispatch" tone="response" /></div><div className="topology-bus"><span className="bus-pulse" /> EVENT BUS · LIVE TELEMETRY · EVIDENCE PACKETS <i /> WEATHER API · EMERGENCY NETWORKS · CONTROL ROOM</div></section>
        <div className="support-grid"><section className="telemetry-card"><div className="card-head compact"><div><span className="eyebrow">FLEET TELEMETRY</span><h2>Connected assets</h2></div><span className="count-badge">03 ONLINE</span></div>{missions.map((mission) => <button key={mission.id} className={selectedDrone.id === mission.id ? 'drone-row selected' : 'drone-row'} onClick={() => setSelectedDrone(mission)}><span className="drone-icon">✦</span><div><b>{mission.id} · {mission.title}</b><small>{mission.location}</small></div><span className="drone-state">{mission.status}</span><span className="drone-battery">{mission.battery}</span></button>)}</section><section className="activity-card"><div className="card-head compact"><div><span className="eyebrow">WHY NEXUS-R</span><h2>Decision trace</h2></div><span className="confidence">AI CONFIDENCE 94%</span></div><div className="trace-row"><b>01</b><span>RGB + thermal frames fused locally</span><time>09:47:14</time></div><div className="trace-row"><b>02</b><span>Survivor ranked above hazard alerts</span><time>09:47:09</time></div><div className="trace-row"><b>03</b><span>Safe route calculated for Team Kavya</span><time>09:46:52</time></div></section></div>
        <footer className="app-footer"><span>NEXUS-R · AUTONOMOUS AERIAL RESPONSE FOR DISASTER TEAMS</span><span>BUILD 1.1 · AUDIT TRAIL ENABLED</span></footer>
      </section>
    </div>
  </main>
}

function BriefPanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">01 / 05</span><h2>Start with the incident</h2><p className="panel-lede">A flash flood has isolated residents after a partial building collapse in Bengaluru's Ward 14.</p><div className="brief-facts"><div><span>DECLARED BY</span><b>Ravi Prakash</b><small>District Emergency Officer</small></div><div><span>RESPONSE AREA</span><b>Bellandur, Bengaluru</b><small>2.4 km² · 14,200 residents</small></div><div><span>CONNECTIVITY</span><b className="green-text">Intermittent</b><small>Mesh relay available</small></div><div><span>PRIMARY RISK</span><b className="red-text">Structural collapse</b><small>Entry requires standoff</small></div></div><div className="panel-callout"><span>WHY AUTONOMOUS?</span><b>Reach inaccessible areas before responders do.</b><p>NEXUS-R keeps inference on the drone, so the search continues when cellular networks fail.</p></div><button className="action-button" onClick={advance}>Launch autonomous scan <span>→</span></button></div> }

function ScanPanel({ drone, advance }: { drone: typeof missions[number]; advance: () => void }) { return <div className="panel-content"><span className="step-number">02 / 05</span><h2>Let the drone search</h2><p className="panel-lede">Aquila-07 is flying a lawnmower pattern over the red zone. No pilot input required.</p><div className="scan-status"><div className="radar"><span /><i /><b>SCANNING</b></div><div><strong>{drone.id} · {drone.status}</strong><p>Thermal + RGB cameras fused on-device</p><p>GPS fallback: visual SLAM locked</p></div></div><div className="scan-metrics"><div><span>AREA COVERED</span><b>68%</b></div><div><span>FRAMES PROCESSED</span><b>12,480</b></div><div><span>FLIGHT TIME</span><b>04:18</b></div></div><button className="action-button" onClick={advance}>Review AI detections <span>→</span></button></div> }

function TriagePanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">03 / 05</span><h2>Review AI detections</h2><p className="panel-lede">Three findings are ready for a human decision. Survivor signals always rise to the top.</p><div className="detection-list">{detections.map((detection) => <div className="detection-row" key={detection.title}><span className={`detection-icon ${detection.tone}`}>{detection.tone === 'critical' ? '!' : detection.tone === 'warning' ? '△' : '↗'}</span><div><span>{detection.type}</span><b>{detection.title}</b><small>{detection.location}</small></div><strong>{detection.confidence}</strong></div>)}</div><button className="action-button" onClick={advance}>Create rescue handoff <span>→</span></button></div> }

function DispatchPanel({ advance }: { advance: () => void }) { return <div className="panel-content"><span className="step-number">04 / 05</span><h2>Dispatch with confidence</h2><p className="panel-lede">The nearest team receives a verified location, access route, and hazard warning.</p><div className="dispatch-card"><div className="team-avatar">K</div><div><span>RECOMMENDED RESPONSE TEAM</span><b>Team Kavya · Bravo 2</b><small>ETA 06 min · 420 m from survivor signal</small></div><span className="green-text">READY</span></div><div className="route-note"><span>SAFE ACCESS ROUTE</span><b>Via 5th Main Road → service lane</b><p>Flooded road blocked. Maintain 35 m standoff from unstable facade.</p></div><button className="action-button" onClick={advance}>Send dispatch and generate report <span>→</span></button></div> }

function ReportPanel() { return <div className="panel-content"><span className="step-number">05 / 05</span><h2>Situation report ready</h2><p className="panel-lede">A concise, evidence-backed handoff is ready for the district control room.</p><div className="report-success"><span>✓</span><div><b>Mission complete: 1 survivor prioritized</b><p>Evidence packet, coordinates, hazard map, and recommended route included.</p></div></div><div className="report-facts"><div><span>SURVIVOR</span><b>94% confidence</b></div><div><span>HAZARD</span><b>2 zones marked</b></div><div><span>TIME SAVED</span><b>38 minutes</b></div></div><div className="report-actions"><button className="secondary-action">Preview report</button><button className="action-button">Export to control room <span>↓</span></button></div></div> }

function MapMarker({ label, className, muted = false }: { label: string; className: string; muted?: boolean }) { return <div className={`${className} ${muted ? 'muted-marker' : ''}`}><span>{label}</span></div> }
function TopologyNode({ label, title, tone, active = false }: { label: string; title: string; tone: string; active?: boolean }) { return <div className={`topology-node ${tone} ${active ? 'active' : ''}`}><span>{label}</span><b>{title}</b>{active && <i>LIVE</i>}</div> }
