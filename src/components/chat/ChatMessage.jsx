import React from 'react';
import { User, Bot, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StreamingText from './StreamingText';
import SQLBlock from './SQLBlock';
import MetricCard from '../visualizations/MetricCard';

// ─── HTML Template ────────────────────────────────────────────────────────────
const CHART_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"><\/script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"><\/script>
<script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"><\/script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"><\/script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"><\/script>
<style>
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0; padding: 12px; background: transparent;
  /* FIX: prevent body itself from creating horizontal scroll */
  overflow-x: hidden;
}
.chart-container {
  background: white; padding: 14px; border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 12px;
  position: relative;
}
.chart-container h3 { margin: 0 0 10px 0; color: #333; font-size: 15px; }
.chart-caption { color: #888; font-size: 11px; margin-top: 6px; }

/* FIX: table-container must scroll horizontally, not clip */
#table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 7px 8px; text-align: left; border-bottom: 1px solid #eee; white-space: nowrap; }
th { background: #f8f9fa; font-weight: 600; position: sticky; top: 0; z-index: 1; }
tr:hover td { background: #f8f9fa; }

.toolbar {
  background: white; padding: 10px 14px; border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 12px;
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
}
.pills { display: flex; gap: 4px; flex-wrap: wrap; }
.pill {
  padding: 4px 11px; border: 1px solid #ddd; border-radius: 16px;
  background: white; color: #666; font-size: 11px; cursor: pointer;
  font-family: inherit; transition: all 0.15s;
}
.pill:hover { border-color: #7B61FF; color: #7B61FF; }
.pill.active { background: #7B61FF; color: white; border-color: #7B61FF; }
.col-select { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #666; }
.col-select select {
  padding: 3px 6px; border: 1px solid #ddd; border-radius: 4px;
  font-size: 11px; font-family: inherit; max-width: 130px;
}
#z-select-group { display: none; }
.chart-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 4px; }
.chart-action-btn {
  background: none; border: none; padding: 5px; color: #999;
  cursor: pointer; display: flex; align-items: center;
}
.axis-toggle {
  font-size: 10px; font-weight: 600; font-family: inherit;
  min-width: 18px; height: 18px; line-height: 18px;
  text-align: center; border-radius: 3px;
}
.axis-toggle.on { color: #333; background: #e9ecef; }

/* DataTables overrides */
.dataTables_wrapper { font-family: inherit; font-size: 12px; }
/* FIX: DataTables internal scroll wrapper must also allow overflow */
.dataTables_wrapper .dataTables_scroll,
.dataTables_scrollBody { overflow-x: auto !important; }
.dataTables_filter input { border: 1px solid #ddd; border-radius: 4px; padding: 3px 7px; }
.dataTables_length select { border: 1px solid #ddd; border-radius: 4px; padding: 2px 5px; }
table.dataTable thead th { background: #f8f9fa; font-weight: 600; border-bottom: 2px solid #ddd; white-space: nowrap; }
table.dataTable tbody td { white-space: nowrap; }
table.dataTable tbody tr:hover { background: #f8f9fa !important; }
.dataTables_info, .dataTables_paginate { margin-top: 8px; }
<\/style>
</head>
<body>
<div class="toolbar">
  <div class="pills">
    <button type="button" class="pill active" onclick="selectChart(this,'table')">Table<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'bar')">Bar<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'horizontal_bar')">H-Bar<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'grouped_bar')">Grouped<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'pie')">Donut<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'line')">Line<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'scatter')">Scatter<\/button>
    <button type="button" class="pill" onclick="selectChart(this,'heatmap')">Heatmap<\/button>
  <\/div>
  <div class="col-select"><label>X:<\/label><select id="x-select" onchange="render(currentType())"><\/select><\/div>
  <div class="col-select"><label>Y:<\/label><select id="y-select" onchange="render(currentType())"><\/select><\/div>
  <div class="col-select" id="z-select-group"><label>Z:<\/label><select id="z-select" onchange="render(currentType())"><\/select><\/div>
<\/div>
<div class="chart-container">
  <h3 id="chart-title">Query Results<\/h3>
  <div class="chart-actions" style="display:none">
    <button id="toggle-x" class="chart-action-btn axis-toggle on" title="Toggle X" onclick="toggleAxis('x')">X<\/button>
    <button id="toggle-y" class="chart-action-btn axis-toggle on" title="Toggle Y" onclick="toggleAxis('y')">Y<\/button>
  <\/div>
  <div id="chart" style="display:none"><\/div>
  <div id="table-container" style="display:block"><\/div>
  <p class="chart-caption" id="caption"><\/p>
<\/div>
<script>
const DATA = __DATA__;
const COLUMNS = __COLUMNS__;
const BAR_COLORS = ["#1a1a2e","#7B61FF","#2a9d8f","#5a45cc","#9580FF","#e76f51","#264653","#e9c46a","#f4a261","#606c38"];
const PIE_COLORS = ["#7B61FF","#5a45cc","#9580FF","#b8a9ff","#2a9d8f","#a8d5e5","#d4a8e5","#e5d4a8","#e5a8b8","#b8e5a8","#a8b8e5","#e5e5a8","#d4e5a8","#a8e5d4","#e5a8a8","#a8a8e5"];
const BRAND = { primary:'#7B61FF', primaryDark:'#5a45cc', primaryLight:'#9580FF', navy:'#1a1a2e', teal:'#2a9d8f' };
const MARGINS = { standard:{t:30,b:40,l:40,r:20}, horizontal_bar:{t:20,b:40,l:200,r:50} };
const PLOTLY_CFG = { responsive:true, displayModeBar:false, scrollZoom:false };
let _currentType='table', _showXLabel=true, _showYLabel=true, _lastXAxisLabel='', _lastYAxisLabel='';

function initSelects() {
  ['x-select','y-select','z-select'].forEach(id => {
    const sel = document.getElementById(id);
    COLUMNS.forEach(col => sel.add(new Option(col, col)));
  });
  if (COLUMNS.length > 1) document.getElementById('y-select').selectedIndex = 1;
}
function toggleAxis(axis) {
  if (axis==='x') { _showXLabel=!_showXLabel; document.getElementById('toggle-x').classList.toggle('on',_showXLabel); Plotly.relayout('chart',{'xaxis.title':_showXLabel?_lastXAxisLabel:''}); }
  else { _showYLabel=!_showYLabel; document.getElementById('toggle-y').classList.toggle('on',_showYLabel); Plotly.relayout('chart',{'yaxis.title':_showYLabel?_lastYAxisLabel:''}); }
}
function currentType() { return _currentType; }
function getX() { return document.getElementById('x-select').value||COLUMNS[0]; }
function getY() { return document.getElementById('y-select').value||COLUMNS[0]; }
function getNumericCols(excludeX) {
  if (!DATA.length) return [];
  const x=excludeX?getX():null;
  return COLUMNS.filter(c=>c!==x&&typeof DATA[0][c]==='number');
}
function selectChart(btn, chartType) {
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  _currentType=chartType;
  document.getElementById('z-select-group').style.display=chartType==='heatmap'?'flex':'none';
  render(chartType);
}
function prettyLabel(col) {
  return col.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}
function render(chartType) {
  const chartDiv=document.getElementById('chart'), tableDiv=document.getElementById('table-container'), caption=document.getElementById('caption');
  const actionsDiv=document.querySelector('.chart-actions');
  if (chartType==='table') { chartDiv.style.display='none'; tableDiv.style.display='block'; if(actionsDiv)actionsDiv.style.display='none'; renderTable(); caption.textContent=DATA.length+' rows'; return; }
  if (actionsDiv) actionsDiv.style.display='flex';
  chartDiv.style.display='block'; tableDiv.style.display='none';
  const x=getX(); _lastXAxisLabel=prettyLabel(x);
  const xLabel=_showXLabel?_lastXAxisLabel:'';
  const labels=DATA.map(r=>r[x]??'');
  const maxLabelLen=Math.max(...labels.map(l=>String(l).length),0);
  const needsRotation=DATA.length>6||maxLabelLen>12;
  const tickAngle=needsRotation?-45:0;
  const bMargin=tickAngle?Math.max(80,Math.min(300,maxLabelLen*6)):40;
  if (chartType==='grouped_bar') {
    const yCols=getNumericCols(true);
    if (yCols.length<2){renderSingleBar(labels,tickAngle,bMargin);return;}
    const traces=yCols.map((col,i)=>({type:'bar',name:col,x:labels,y:DATA.map(r=>r[col]||0),marker:{color:BAR_COLORS[i%BAR_COLORS.length]},text:DATA.map(r=>r[col]||0),textposition:'outside'}));
    Plotly.newPlot(chartDiv,traces,{barmode:'group',margin:{...MARGINS.standard,b:bMargin},xaxis:{title:xLabel,tickangle:tickAngle,automargin:true},yaxis:{automargin:true},autosize:true,dragmode:false},PLOTLY_CFG);
    caption.textContent=DATA.length+' items'; return;
  }
  if (chartType==='heatmap'){renderHeatmap(labels,x);return;}
  const yCol=getY(); _lastYAxisLabel=prettyLabel(yCol);
  const yLabel=_showYLabel?_lastYAxisLabel:'';
  const values=DATA.map(r=>r[yCol]||0);
  document.getElementById('chart-title').textContent=yLabel+' by '+xLabel;
  if (chartType==='bar') renderSingleBar(labels,tickAngle,bMargin,xLabel,yLabel);
  else if (chartType==='horizontal_bar') {
    const height=Math.max(DATA.length*32+80,400);
    Plotly.newPlot(chartDiv,[{type:'bar',y:labels,x:values,orientation:'h',marker:{color:BRAND.primary},text:values,textposition:'outside',cliponaxis:false}],{margin:MARGINS.horizontal_bar,xaxis:{title:yLabel,automargin:true},yaxis:{title:xLabel,automargin:true},height,autosize:true,dragmode:false},PLOTLY_CFG);
  } else if (chartType==='pie') {
    const total=values.reduce((a,b)=>a+(typeof b==='number'?b:0),0);
    Plotly.newPlot(chartDiv,[{type:'pie',labels,values,hole:0.5,textposition:'outside',textfont:{size:10},marker:{colors:PIE_COLORS.slice(0,DATA.length)},sort:false}],{margin:{t:50,b:50,l:50,r:50},height:500,autosize:true,showlegend:true,annotations:[{text:total.toLocaleString(),x:0.5,y:0.5,font:{size:20,color:BRAND.navy,weight:'bold'},showarrow:false}]},PLOTLY_CFG);
  } else if (chartType==='scatter') {
    Plotly.newPlot(chartDiv,[{type:'scatter',x:labels,y:values,mode:'markers',marker:{color:BRAND.primary,size:10}}],{margin:MARGINS.standard,xaxis:{title:xLabel,automargin:true},yaxis:{title:yLabel,automargin:true},autosize:true,dragmode:false},PLOTLY_CFG);
  } else if (chartType==='line') {
    Plotly.newPlot(chartDiv,[{type:'scatter',x:labels,y:values,mode:'lines+markers',line:{color:BRAND.primary},marker:{size:6}}],{margin:MARGINS.standard,xaxis:{title:xLabel,automargin:true},yaxis:{title:yLabel,automargin:true},autosize:true,dragmode:false},PLOTLY_CFG);
  }
  caption.textContent=DATA.length+' items';
}
function renderSingleBar(labels,tickAngle,bMargin,xLabel,yLabel) {
  const yCol=getY(), values=DATA.map(r=>r[yCol]||0);
  Plotly.newPlot('chart',[{type:'bar',x:labels,y:values,marker:{color:BRAND.primaryDark},text:values,textposition:'outside'}],{margin:{...MARGINS.standard,b:bMargin},xaxis:{title:xLabel||prettyLabel(getX()),tickangle:tickAngle,automargin:true},yaxis:{title:yLabel||prettyLabel(yCol),automargin:true},autosize:true,dragmode:false},PLOTLY_CFG);
}
function renderHeatmap(labels,xCol) {
  const yCol=document.getElementById('y-select').value, zCol=document.getElementById('z-select').value||yCol;
  const xCats=[...new Map(DATA.map(r=>[r[xCol],true])).keys()];
  const yCats=[...new Map(DATA.map(r=>[r[yCol],true])).keys()];
  const lookup={};
  DATA.forEach(r=>{lookup[r[yCol]+'||'+r[xCol]]=parseFloat(r[zCol])||0;});
  const zMatrix=yCats.map(yc=>xCats.map(xc=>lookup[yc+'||'+xc]||0));
  Plotly.newPlot('chart',[{type:'heatmap',z:zMatrix,x:xCats,y:yCats,colorscale:[[0,'#f8f7fc'],[0.5,BRAND.primaryLight],[1,BRAND.primaryDark]],showscale:true,hoverongaps:false}],{margin:{t:30,b:180,l:20,r:20},xaxis:{tickangle:-45,automargin:true},yaxis:{automargin:true},height:Math.max(yCats.length*32+200,520),autosize:true,dragmode:false},PLOTLY_CFG);
  document.getElementById('caption').textContent=xCats.length+' x '+yCats.length+' matrix';
}
function renderTable() {
  const container=document.getElementById('table-container');
  if ($.fn.DataTable.isDataTable('#data-table')){$('#data-table').DataTable().destroy();}
  const table=document.createElement('table');
  table.id='data-table'; table.className='display'; table.style.width='100%';
  const thead=table.createTHead(), headerRow=thead.insertRow();
  COLUMNS.forEach(c=>{const th=document.createElement('th');th.textContent=c;headerRow.appendChild(th);});
  const tbody=table.createTBody();
  DATA.forEach(row=>{const tr=tbody.insertRow();COLUMNS.forEach(c=>{const td=tr.insertCell();td.textContent=String(row[c]??'');});});
  container.replaceChildren(table);
  $('#data-table').DataTable({dom:'frtip',pageLength:20,order:[],scrollX:true});
  // notify parent of updated height
  setTimeout(notifyHeight, 100);
}

/* postMessage height sync — lets the React iframe auto-resize */
function notifyHeight() {
  try {
    window.parent.postMessage({ type: '__viz_height__', height: document.body.scrollHeight }, '*');
  } catch(_) {}
}
// re-notify whenever DOM changes (chart switches, pagination, search)
new MutationObserver(notifyHeight).observe(document.body, { childList:true, subtree:true, attributes:true });
window.addEventListener('resize', notifyHeight);

initSelects();
render('table');
<\/script>
</body>
</html>`;

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildVisualizationHtml(data, title) {
  if (!data || !data.length) return null;
  const columns = Object.keys(data[0]);
  return CHART_TEMPLATE
    .replace('__DATA__', JSON.stringify(data))
    .replace('__COLUMNS__', JSON.stringify(columns))
    .replace('Query Results', title || 'Query Results');
}

// ─── Inline Visualization iframe ─────────────────────────────────────────────
function InlineVisualization({ data, title }) {
  const [iframeHeight, setIframeHeight] = React.useState(520);

  React.useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === '__viz_height__' && e.data.height > 100) {
        setIframeHeight(e.data.height + 16);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!data || !data.length) return null;

  return (
    // FIX: no overflow-hidden here — that clips the scrollable iframe content
    <div className="w-full rounded-xl border border-border/50 shadow-sm bg-white overflow-hidden">
      <iframe
        srcDoc={buildVisualizationHtml(data, title)}
        title={title || 'Query Results'}
        className="w-full border-0 block"
        style={{ height: `${iframeHeight}px` }}
        sandbox="allow-scripts allow-same-origin"
        // FIX: scrolling="auto" so the iframe itself can scroll if needed
        scrolling="auto"
      />
    </div>
  );
}

// ─── ChatMessage ──────────────────────────────────────────────────────────────
export default function ChatMessage({ message, isLatest }) {
  const isUser = message.role === 'user';
  const isRejected = message.status === 'rejected';

  const showVisualization =
    !isUser &&
    message.result_data &&
    Array.isArray(message.result_data) &&
    message.result_data.length > 0 &&
    message.visualization_type !== 'metric';

  const showMetric =
    !isUser &&
    message.result_data &&
    message.visualization_type === 'metric';

  return (
    <div className={cn("animate-fade-in", isUser ? "flex justify-end" : "flex justify-start")}>
      <div className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse max-w-[90%] md:max-w-[85%]" : "max-w-[90%] md:max-w-[85%]",
        // FIX: widen the bot message container when a visualization is present
        showVisualization && !isUser && "md:max-w-[95%] max-w-[98%]",
      )}>
        {/* Avatar */}
        <div className={cn(
          "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-1",
          isUser
            ? "bg-primary text-primary-foreground"
            : isRejected
              ? "bg-destructive/10 text-destructive"
              : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
        )}>
          {isUser ? <User className="h-4 w-4" /> : isRejected ? <AlertTriangle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className={cn("space-y-3 flex-1 min-w-0", isUser && "flex flex-col items-end")}>
          {/* Text bubble */}
          {message.content && (
            <div className={cn(
              "rounded-2xl px-4 py-3 max-w-full",
              isUser
                ? "bg-primary text-primary-foreground"
                : isRejected
                  ? "bg-destructive/5 border border-destructive/20 text-foreground"
                  : "bg-card border border-border/50 text-foreground shadow-sm"
            )}>
              {isUser ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : isLatest && !isRejected ? (
                <StreamingText text={message.content} speed={8} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {/* SQL Block */}
          {/* {!isUser && message.sql && <SQLBlock sql={message.sql} />} */}

          {/* Visualization */}
          {showVisualization && (
            // FIX: min-w-0 prevents flex child from overflowing; no overflow-hidden
            <div className="w-full min-w-0">
              <InlineVisualization
                data={message.result_data}
                title={message.chart_config?.title || 'Query Results'}
              />
            </div>
          )}

          {/* Metric card */}
          {showMetric && (
            <div className="w-full max-w-full overflow-hidden">
              <MetricCard
                data={message.result_data}
                title={message.chart_config?.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}