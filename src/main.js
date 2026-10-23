import './styles.css';
import './agents.css';
import './vendor.css';
import './fit-controls.css';
import {profiles, storageProducts} from './storage-data.js';
import {rankProducts} from './scoring.js';

const icons = {
  grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  pulse: '<svg viewBox="0 0 24 24"><path d="M3 12h4l2.2-6 4.1 12 2.3-6H21"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>',
  bot: '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M9 3h6M12 3v4M8 12h.01M16 12h.01M8 16h8"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 8h8M8 12h6"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>'
};

const incidents = [
  { sev:'Critical', domain:'Storage', title:'Write latency above SLO', asset:'flash-prod-01 · IBM FlashSystem 9500', age:'8m', confidence:94, impact:'Payments API', metric:'18.4 ms', delta:'+212%', root:'SAN path congestion on fc-sw-02 is forcing 71% of writes through a single path.', action:'Rebalance host paths', color:'#ff6259' },
  { sev:'High', domain:'Application', title:'Checkout error rate elevated', asset:'checkout-api · Kubernetes', age:'11m', confidence:89, impact:'Checkout flow', metric:'4.8%', delta:'+3.9%', root:'Database calls are breaching the 800 ms timeout as storage write latency propagates upstream.', action:'Open investigation', color:'#ff9e57' },
  { sev:'High', domain:'Network', title:'FC port saturation detected', asset:'fc-sw-02 · Brocade G720', age:'14m', confidence:91, impact:'12 hosts', metric:'92%', delta:'+34%', root:'Port 18 is carrying imbalanced traffic following a path failover at 10:24.', action:'Validate failover', color:'#ff9e57' },
  { sev:'Medium', domain:'Compute', title:'Memory pressure trending up', asset:'esx-prd-07 · VMware ESXi', age:'27m', confidence:78, impact:'6 VMs', metric:'86%', delta:'+11%', root:'Two analytics VMs exceeded their normal working-set baseline after a scheduled job.', action:'Review workload', color:'#e7c34f' },
  { sev:'Medium', domain:'Storage', title:'Capacity exhaustion forecast', asset:'unity-dr-02 · Dell Unity XT', age:'1h', confidence:97, impact:'DR readiness', metric:'19 days', delta:'-8 days', root:'Snapshot retention growth is 2.4× the 30-day baseline.', action:'Review snapshots', color:'#e7c34f' }
];

const spark = (values, color='#7c6cff') => {
  const max=Math.max(...values), min=Math.min(...values); const pts=values.map((v,i)=>`${i*(120/(values.length-1))},${32-((v-min)/(max-min||1))*26}`).join(' ');
  return `<svg class="spark" viewBox="0 0 120 36" preserveAspectRatio="none"><polyline points="${pts}" style="stroke:${color}"/></svg>`;
};

document.querySelector('#app').innerHTML = `
<div class="shell">
  <aside class="sidebar">
    <div class="brand"><div class="brandmark"><span></span><span></span><span></span></div><div>OpsPilot <b>AI</b></div></div>
    <div class="workspace"><span class="workspace-icon">NP</span><div><small>WORKSPACE</small><strong>Northstar Production</strong></div><span class="chev">⌄</span></div>
    <nav>
      <p>OPERATE</p>
      <a class="active" data-view="Command Center">${icons.grid}<span>Command Center</span></a>
      <a data-view="Infrastructure">${icons.layers}<span>Infrastructure</span><em>128</em></a>
      <a data-view="Incidents">${icons.pulse}<span>Incidents</span><em class="hot">5</em></a>
      <p>INTELLIGENCE</p>
      <a data-view="Agent Mission Control">${icons.bot}<span>Agent Mission Control</span><i>New</i></a>
      <a data-view="StorageFit Agent">${icons.layers}<span>StorageFit Agent</span><i>Lab</i></a>
      <a data-view="Runbooks">${icons.book}<span>Runbooks</span></a>
      <p>MANAGE</p>
      <a data-view="Integrations">${icons.settings}<span>Integrations</span></a>
    </nav>
    <div class="side-bottom"><div class="uptime"><span></span><div><strong>All collectors online</strong><small>Last sync 42 sec ago</small></div></div><div class="profile"><div class="avatar">MS</div><div><strong>Manmeet Singh</strong><small>Platform Administrator</small></div><button>•••</button></div></div>
  </aside>
  <main>
    <header><div class="crumb">Operations <span>/</span> <b>Command Center</b></div><div class="header-actions"><button class="search" id="searchBtn">${icons.search}<span>Search anything...</span><kbd>⌘ K</kbd></button><button class="icon-btn">${icons.bell}<i></i></button><button class="time-btn"><span class="live-dot"></span>Live <b>⌄</b></button></div></header>
    <div class="content">
      <section class="welcome"><div><p class="eyebrow">WEDNESDAY, 14 OCTOBER</p><h1>Good evening, Manmeet.</h1><p>Your environment needs attention. <b>One critical service</b> is currently at risk.</p></div><button class="ai-btn" id="investigateBtn"><span>✦</span> Ask OpsPilot AI</button></section>
      <section class="agent-console">
        <div class="agent-hero"><div><p class="eyebrow">AGENTIC OPERATIONS FABRIC</p><h2>Give the outcome. Agents do the investigation.</h2><p>OpsPilot works through the tools already deployed in your environment—one coordinated mission across every infrastructure domain.</p></div><button id="newMission"><span>✦</span> Launch a mission</button></div>
        <div class="mission-grid"><article class="mission-card"><div class="mission-kicker"><span class="live-dot"></span>MISSION RUNNING <b>OP-4821</b></div><h3>Restore checkout SLO without customer impact</h3><p class="mission-intent">Target: error rate &lt; 1% and p95 &lt; 800 ms. No production writes without approval.</p><div class="agent-chain">
          <div class="agent-node done"><i>▰</i><b>Storage agent</b><small>Path imbalance found</small></div><em></em><div class="agent-node done"><i>⌁</i><b>Network agent</b><small>Port 18 verified</small></div><em></em><div class="agent-node running"><i>▦</i><b>Compute agent</b><small>Testing hypothesis…</small></div><em></em><div class="agent-node queued"><i>◇</i><b>App agent</b><small>Awaiting evidence</small></div>
        </div><div class="mission-foot"><span><b>18</b> evidence items</span><span><b>4</b> tools used</span><span><b>0</b> changes made</span><button id="openMission">Open live mission ${icons.arrow}</button></div></article>
        <article class="trust-card"><div class="trust-head"><div><span>TRUST & AUTONOMY</span><h3>Policy boundary</h3></div><b>Level 2</b></div><div class="autonomy-scale"><span class="on">Observe</span><i></i><span class="on">Investigate</span><i></i><span class="on">Recommend</span><i></i><span>Execute</span></div>${[['Read-only investigation','Autonomous across approved tools'],['Production changes','Human approval + rollback required'],['Secrets and evidence','Stay inside customer boundary']].map(x=>`<div class="policy-row"><span>✓</span><p><b>${x[0]}</b><small>${x[1]}</small></p></div>`).join('')}</article></div>
        <div class="agent-workbench card"><div class="card-head"><div><h2>Specialist agent mesh</h2><p>Scoped tools, identity, memory and measurable responsibilities—not just chat prompts</p></div><span class="mesh-status"><i></i> 6 agents ready</span></div><div class="agent-columns">${[
          ['▰','Storage SRE','IBM · Dell · NetApp','Capacity, latency, replication, paths','8 tools','#8b7dff'],['⌁','Fabric & Network','Brocade · Cisco · Arista','Ports, zoning, congestion, routes','6 tools','#50b8e8'],['▦','Compute & Cloud','VMware · Redfish · AWS','Hosts, VMs, firmware, cost','9 tools','#44bd83'],['◇','Application SRE','K8s · Prometheus · OTel','SLOs, deploys, dependencies','11 tools','#e89b58'],['⌾','Change Guardian','ServiceNow · Git · Ansible','Risk, approvals, rollback, audit','7 tools','#e66d6a'],['✦','Incident Commander','Topology · Runbooks · Memory','Delegation, debate, final decision','12 tools','#6e5ce7']
        ].map(a=>`<div class="agent-tile"><div class="agent-avatar" style="color:${a[5]};background:${a[5]}14">${a[0]}<i></i></div><div><b>${a[1]}</b><span>${a[2]}</span><p>${a[3]}</p></div><small>${a[4]}</small></div>`).join('')}</div></div>
        <div class="differentiator"><div><span>01</span><b>Use what customers own</b><p>Agents call existing vendor, ITSM and automation APIs instead of replacing them.</p></div><div><span>02</span><b>Prove before acting</b><p>Independent agents challenge the root cause with read-only evidence.</p></div><div><span>03</span><b>Own the outcome</b><p>A mission closes only after SLO recovery, validation and an audit record.</p></div></div>
      </section>
      <section class="vendor-console">
        <div class="vendor-hero"><div><p class="eyebrow">MULTI-VENDOR DECISION INTELLIGENCE</p><h2>StorageFit Agent</h2><p>Turn workload evidence and vendor claims into a defensible storage shortlist.</p></div><div class="source-health"><span>●</span><div><b>36 sources verified</b><small>Official specifications · refreshed 23 Oct 2026</small></div></div></div>
        <div class="profile-tabs">${Object.entries(profiles).map(([id,p],i)=>`<button data-profile="${id}" class="${i===0?'active':''}">${p.name}</button>`).join('')}</div>
        <div class="requirement-card card"><div class="requirement-copy"><span>ACTIVE EVALUATION · RFQ-1042</span><h3 id="profileName">Mission-critical payment platform refresh</h3><p id="profileDescription">${profiles.tier0.description}</p></div><div class="requirement-metrics"><div><small>PEAK IOPS</small><b id="reqIops">1.8M</b><span>70/30 R/W · 16K</span></div><div><small>P95 LATENCY</small><b id="reqLatency">&lt; 1 ms</b><span>under peak load</span></div><div><small>USABLE CAPACITY</small><b id="reqCapacity">1.2 PB</b><span>+35% design headroom</span></div><div><small>EVIDENCE POLICY</small><b>Strict</b><span>uncertainty is penalized</span></div></div><button id="refineFit">Run agent analysis</button></div>
        <div class="fit-layout"><div class="fit-results card"><div class="card-head"><div><h2>Agent-generated shortlist</h2><p>Fit is workload-specific—not a universal product ranking</p></div><div class="evidence-toggle"><button class="active" data-fit="fit">Fit score</button><button data-fit="evidence">Evidence</button></div></div><div class="product-head"><span>PLATFORM</span><span>WORKLOAD FIT</span><span>PUBLISHED POSITION</span><span>AGENT VERDICT</span></div><div id="productRows"></div></div>
          <aside class="decision-trace card"><div class="trace-title"><span>✦</span><div><b>Decision trace</b><small>Explainable · evidence linked</small></div></div><div class="trace-step done"><i>1</i><div><b>Normalized 6 product lines</b><p>Separated raw, usable and effective capacity. Flagged assumed reduction ratios.</p></div></div><div class="trace-step done"><i>2</i><div><b>Challenged performance claims</b><p>Compared I/O size, read/write mix, cache-hit assumptions and scale-out scope.</p></div></div><div class="trace-step active"><i>3</i><div><b>Checking ecosystem fit</b><p>Validating Oracle, VMware, FC, replication and migration requirements.</p></div></div><div class="trace-step"><i>4</i><div><b>Design proof-of-concept</b><p>Create identical test plan and acceptance criteria for shortlisted vendors.</p></div></div><div class="claim-warning"><b>Why this matters</b><p>Vendor maximums are rarely directly comparable. StorageFit keeps the claim, conditions, source date and confidence together.</p></div></aside>
        </div>
        <div class="vendor-agents"><div><span>01</span><b>Requirement agent</b><p>Translates business SLOs into workload and resilience constraints.</p></div><div><span>02</span><b>Evidence agent</b><p>Extracts specifications, guarantees, support matrices and source conditions.</p></div><div><span>03</span><b>Benchmark critic</b><p>Rejects misleading comparisons across cache hits, block sizes and cluster scope.</p></div><div><span>04</span><b>Architecture agent</b><p>Models ports, fabrics, hosts, replication, growth and failure domains.</p></div><div><span>05</span><b>Commercial agent</b><p>Normalizes licensing, support, power, rack space and five-year TCO.</p></div><div><span>06</span><b>Validation agent</b><p>Creates a vendor-neutral proof-of-concept and scores observed results.</p></div></div>
      </section>
      <section class="status-strip"><div class="status-copy"><span class="status-orb">!</span><div><b>Production health degraded</b><p>Cross-domain anomaly detected at 10:24 IST</p></div></div><div class="status-flow"><div><span class="node storage">▰</span><small>STORAGE</small><b>Latency</b></div><i></i><div><span class="node network">⌁</span><small>NETWORK</small><b>Congestion</b></div><i></i><div><span class="node app">◇</span><small>APPLICATION</small><b>Error rate</b></div></div><button id="viewIncident">View incident ${icons.arrow}</button></section>
      <section class="metrics">
        <article><div class="metric-top"><span>OVERALL HEALTH</span><span class="trend down">↓ 6%</span></div><div class="metric-main"><strong>82</strong><small>/100</small>${spark([91,91,90,91,89,88,86,87,82],'#ff756c')}</div><p><i class="red"></i>3 services need attention</p></article>
        <article><div class="metric-top"><span>ACTIVE INCIDENTS</span><span class="trend up">↑ 2</span></div><div class="metric-main"><strong>5</strong>${spark([1,1,2,1,3,2,2,3,5],'#ff9e57')}</div><p><i class="orange"></i>1 critical · 2 high · 2 medium</p></article>
        <article><div class="metric-top"><span>ASSETS MONITORED</span><span class="trend good">100%</span></div><div class="metric-main"><strong>128</strong>${spark([114,114,116,116,120,120,124,128,128],'#39c58a')}</div><p><i class="green"></i>All collectors reporting</p></article>
        <article><div class="metric-top"><span>MTTR · 30 DAYS</span><span class="trend good">↓ 31%</span></div><div class="metric-main"><strong>23</strong><small>min</small>${spark([47,44,42,39,41,34,32,27,23],'#7c6cff')}</div><p><i class="purple"></i>9 min saved by automation</p></article>
      </section>
      <section class="grid-2">
        <article class="card health-card"><div class="card-head"><div><h2>Service health</h2><p>Live status across infrastructure domains</p></div><button>View topology ${icons.arrow}</button></div><div class="domain-list">
          ${[
            ['Storage','32 assets','Degraded','89%','IBM · Dell EMC · NetApp','#8b7dff'],
            ['Network','24 assets','Warning','92%','Brocade · Cisco · Arista','#52b7ec'],
            ['Compute','48 assets','Healthy','96%','VMware · Red Hat · AWS','#57c796'],
            ['Applications','24 services','Degraded','91%','Kubernetes · PostgreSQL','#f1a45d']
          ].map((d,i)=>`<div class="domain-row"><div class="domain-icon d${i}">${['▰','⌁','▦','◇'][i]}</div><div class="domain-name"><strong>${d[0]}</strong><small>${d[1]}</small></div><div class="domain-meta"><span>${d[4]}</span><div class="bar"><i style="width:${d[3]};background:${d[5]}"></i></div></div><div class="domain-score"><strong>${d[3]}</strong><span class="${d[2].toLowerCase()}">${d[2]}</span></div><b class="row-arrow">›</b></div>`).join('')}
        </div></article>
        <article class="card ai-card"><div class="card-head"><div><h2><span class="ai-star">✦</span> AI investigator</h2><p>Correlating 1,284 signals across 4 domains</p></div><span class="analyzing"><i></i>Analyzing</span></div><div class="ai-finding"><div class="finding-top"><span>HIGH CONFIDENCE · 94%</span><small>Updated 42 sec ago</small></div><h3>Probable root cause identified</h3><p>Multipath imbalance on <code>fc-sw-02:port18</code> is saturating the primary path to <code>flash-prod-01</code>, increasing write latency for the Payments cluster.</p><div class="chain"><span>Path failover</span><i>→</i><span>FC saturation</span><i>→</i><span>Write latency</span><i>→</i><span>API errors</span></div></div><div class="recommend"><span>${icons.check}</span><div><b>Recommended next action</b><p>Validate alternate path health, then rebalance I/O across both fabrics. Estimated recovery: <strong>6–10 min</strong>.</p></div></div><div class="ai-actions"><button class="primary" id="reviewPlan">Review remediation plan</button><button id="evidenceBtn">View evidence</button></div></article>
      </section>
      <section class="card incidents-card"><div class="card-head"><div><h2>Active incidents</h2><p>Prioritized by service impact and confidence</p></div><div class="filters"><button class="active" data-filter="All">All <b>5</b></button><button data-filter="Critical">Critical <b>1</b></button><button data-filter="Storage">Storage <b>2</b></button></div></div><div class="incident-table"><div class="table-head"><span>SEVERITY</span><span>INCIDENT</span><span>IMPACT</span><span>SIGNAL</span><span>AGE</span><span></span></div><div id="incidentRows"></div></div></section>
      <footer><span>OpsPilot AI · Demo environment</span><span>Telemetry is simulated for portfolio demonstration</span></footer>
    </div>
  </main>
</div>
<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer"><div class="drawer-head"><div><span class="drawer-label">INC-24018 · CRITICAL</span><h2>Payment service degradation</h2></div><button id="closeDrawer">${icons.x}</button></div><div class="drawer-body"><div class="summary-banner"><span>✦</span><div><b>OpsPilot analysis complete</b><p>One probable root cause, 4 correlated signals, and a validated remediation path.</p></div></div><h3>Incident timeline</h3><div class="timeline"><div><i></i><span>10:24:08</span><p>Path failover detected on <b>esx-prd-07</b></p></div><div><i></i><span>10:24:31</span><p>FC port 18 utilization crossed 90%</p></div><div><i></i><span>10:25:12</span><p>Storage write latency breached 15 ms SLO</p></div><div><i></i><span>10:26:40</span><p>Checkout API error budget burn accelerated</p></div></div><h3>Safe remediation plan</h3><div class="steps"><div><b>1</b><p><strong>Verify</strong> the alternate fabric path is online and error-free.</p><span>Read only</span></div><div><b>2</b><p><strong>Drain</strong> affected host I/O from the saturated port.</p><span>Approval required</span></div><div><b>3</b><p><strong>Rebalance</strong> multipath policy and confirm latency recovery.</p><span>Automated checks</span></div></div><div class="risk"><b>Risk control</b><p>No changes will run automatically. The plan creates a change record, captures pre-check evidence, and pauses for human approval.</p></div></div><div class="drawer-foot"><button class="secondary" id="copyPlan">Copy plan</button><button class="primary" id="runPrecheck">Run safe pre-checks</button></div></aside>
<div class="command" id="command"><div class="command-box"><div class="command-input">${icons.search}<input id="commandInput" placeholder="Search assets, incidents, or ask OpsPilot AI…"/><kbd>ESC</kbd></div><p>QUICK ACTIONS</p><button data-query="Investigate payment latency"><span>✦</span><div><b>Investigate payment latency</b><small>Correlate signals across all domains</small></div><kbd>↵</kbd></button><button data-query="Show storage at risk"><span>▰</span><div><b>Show storage at risk</b><small>Capacity, performance, and resilience</small></div></button><button data-query="Generate executive report"><span>↗</span><div><b>Generate executive report</b><small>Summarize health, risk, and savings</small></div></button></div></div>
<div class="toast" id="toast"><span>${icons.check}</span><div><b>Pre-check started</b><p>Collecting read-only evidence across 4 systems.</p></div></div>`;

function renderIncidents(filter='All'){
  const rows=incidents.filter(x=>filter==='All'||x.sev===filter||x.domain===filter);
  document.querySelector('#incidentRows').innerHTML=rows.map((x,i)=>`<button class="incident-row" data-index="${incidents.indexOf(x)}"><span><i style="background:${x.color}"></i>${x.sev}</span><span><b>${x.title}</b><small>${x.asset}</small></span><span><b>${x.impact}</b><small>${x.confidence}% confidence</small></span><span><b>${x.metric}</b><small class="bad">${x.delta}</small></span><span>${x.age}</span><span>›</span></button>`).join('');
  document.querySelectorAll('.incident-row').forEach(el=>el.onclick=()=>openDrawer());
}
renderIncidents();

const overlay=document.querySelector('#overlay'), drawer=document.querySelector('#drawer'), command=document.querySelector('#command');
function openDrawer(){drawer.classList.add('open');overlay.classList.add('show')}
function closeAll(){drawer.classList.remove('open');overlay.classList.remove('show');command.classList.remove('show')}
document.querySelector('#viewIncident').onclick=openDrawer;
document.querySelector('#reviewPlan').onclick=openDrawer;
document.querySelector('#closeDrawer').onclick=closeAll;
overlay.onclick=closeAll;
function openCommand(){command.classList.add('show');document.querySelector('#commandInput').focus()}
document.querySelector('#searchBtn').onclick=openCommand;
document.querySelector('#investigateBtn').onclick=openCommand;
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openCommand()} if(e.key==='Escape')closeAll()});
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderIncidents(b.dataset.filter)});
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active');document.querySelector('.crumb b').textContent=a.dataset.view;const agents=a.dataset.view==='Agent Mission Control',vendor=a.dataset.view==='StorageFit Agent';document.body.classList.toggle('agents-mode',agents);document.body.classList.toggle('vendor-mode',vendor);document.querySelector('.welcome h1').textContent=agents?'Agent Mission Control':vendor?'Multi-vendor StorageFit':'Good evening, Manmeet.';document.querySelector('.welcome>div>p:last-child').innerHTML=agents?'Coordinate autonomous investigation across your existing infrastructure stack.':vendor?'Compare products using workload evidence, normalized claims and proof-of-concept validation.':'Your environment needs attention. <b>One critical service</b> is currently at risk.'});
document.querySelectorAll('.command-box button').forEach(b=>b.onclick=()=>{document.querySelector('#commandInput').value=b.dataset.query;setTimeout(()=>{closeAll();openDrawer()},250)});
document.querySelector('#commandInput').addEventListener('keydown',e=>{if(e.key==='Enter'){closeAll();openDrawer()}});
function showToast(title='Pre-check started',body='Collecting read-only evidence across 4 systems.'){const t=document.querySelector('#toast');t.querySelector('b').textContent=title;t.querySelector('p').textContent=body;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)}
document.querySelector('#runPrecheck').onclick=()=>{closeAll();showToast()};
document.querySelector('#copyPlan').onclick=()=>showToast('Plan copied','Remediation steps copied to clipboard.');
document.querySelector('#evidenceBtn').onclick=()=>showToast('Evidence bundle ready','4 signals · 18 metrics · 2 related changes.');
document.querySelector('#newMission').onclick=openCommand;
document.querySelector('#openMission').onclick=openDrawer;

let activeProfile='tier0',fitMode='fit',rankedProducts=[];
const dimensionLabel=x=>x.charAt(0).toUpperCase()+x.slice(1);
function productReason(p){return `${dimensionLabel(p.topDimensions[0])} and ${p.topDimensions[1]} lead for this workload. ${p.evidenceConfidence<75?'Evidence gaps require POC validation.':'Evidence quality is comparatively strong.'}`}
function renderProducts(mode=fitMode){fitMode=mode;rankedProducts=rankProducts(storageProducts,profiles[activeProfile]);document.querySelector('#productRows').innerHTML=rankedProducts.map(p=>`<button class="product-row" data-product="${p.id}"><span class="product-name"><i style="background:${p.tone}">${p.vendor.slice(0,1)}</i><span><b>#${p.rank} · ${p.vendor}</b><small>${p.model}</small></span></span><span class="fit-score"><b>${mode==='fit'?p.score:p.evidenceConfidence}${mode==='fit'?'<small>/100</small>':'<small>%</small>'}</b><i><em style="width:${mode==='fit'?p.score:p.evidenceConfidence}%;background:${p.tone}"></em></i></span><span><b>${p.position}</b><small>${p.source.scope}</small></span><span class="verdict">${productReason(p)}</span></button>`).join('');document.querySelectorAll('.product-row').forEach(r=>r.onclick=()=>openProduct(r.dataset.product))}
function renderProfile(){const p=profiles[activeProfile];document.querySelector('#profileDescription').textContent=p.description;document.querySelector('#reqIops').textContent=`${p.iops}M`;document.querySelector('#reqLatency').textContent=`< ${p.latency} ms`;document.querySelector('#reqCapacity').textContent=`${p.capacity} PB`;renderProducts()}
renderProducts();
document.querySelectorAll('.evidence-toggle button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.evidence-toggle button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.fit)});
document.querySelectorAll('.profile-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.profile-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeProfile=b.dataset.profile;renderProfile();showToast('Evaluation recalculated',`${profiles[activeProfile].name} weights applied with evidence penalties.`)});
function openProduct(id){const p=rankedProducts.find(x=>x.id===id);document.querySelector('.drawer-label').textContent=`RANK #${p.rank} · ${p.evidenceConfidence}% EVIDENCE CONFIDENCE`;document.querySelector('.drawer-head h2').textContent=`${p.vendor} ${p.model}`;document.querySelector('.summary-banner b').textContent=`Workload fit: ${p.score}/100`;document.querySelector('.summary-banner p').textContent=productReason(p);document.querySelector('.drawer-body>h3').textContent='Evidence-aware assessment';document.querySelector('.timeline').innerHTML=`<div><i></i><span>SOURCE</span><p><b>${p.source.title}</b> · ${p.source.date}</p></div><div><i></i><span>SCOPE</span><p>${p.source.scope}</p></div><div><i></i><span>STRENGTH</span><p>${p.strengths.join(' · ')}</p></div><div><i></i><span>GAPS</span><p>${p.gaps.join(' · ')}</p></div>`;document.querySelector('.drawer-body>h3:nth-of-type(2)').textContent='Score penalties';document.querySelector('.steps').innerHTML=`<div><b>${p.penalties.uncertainty}</b><p><strong>Evidence uncertainty</strong> penalty</p><span>Automatic</span></div><div><b>${p.penalties.capacity}</b><p><strong>Capacity headroom</strong> penalty</p><span>Requirement</span></div><div><b>${p.penalties.latency}</b><p><strong>Latency mismatch</strong> penalty</p><span>Requirement</span></div>`;openDrawer()}
document.querySelector('#refineFit').onclick=()=>{document.querySelectorAll('.trace-step').forEach(x=>x.classList.remove('active'));const steps=document.querySelectorAll('.trace-step');let i=0;showToast('Agent analysis started','Normalizing evidence and challenging vendor claims.');const timer=setInterval(()=>{if(i)steps[i-1]?.classList.add('done');if(i<steps.length){steps[i].classList.add('active');i++}else{clearInterval(timer);renderProducts();showToast('Analysis complete',`${rankedProducts[0].vendor} ${rankedProducts[0].model} leads this workload profile.`)}},450)};
