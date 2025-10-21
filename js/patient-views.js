
// js/patient-views.js
// PatientViews: five modern list layouts (Expandable, Carousel, Kanban, SmartSummary, Timeline)
// Selectable from Settings via ThemeManager (setting key: patientListView)
// Minimal integration: in app.js call PatientViews.renderList() when mode != 'classic'

/*
Usage (integration guide):
1) Add to index.html after other modules:
   <script type="module" src="./patient-views.js"></script>

2) In themes.js: extend DEFAULT_SETTINGS with:
   patientListView: 'classic'   // 'classic' | 'expandable' | 'carousel' | 'kanban' | 'summary' | 'timeline'
   And add a <select> to Preferences UI to edit it (see patch snippet in README).

3) In app.js:
   import { PatientViews } from './patient-views.js';
   - Keep your current renderPatientsList() logic as renderPatientsListClassic().
   - Replace renderPatientsList() dispatcher to:
       const mode = (getPreferences().patientListView || 'classic');
       if (mode === 'classic') return renderPatientsListClassic();
       const items = getFilteredPatients();
       PatientViews.renderList({
         root: document.querySelector('#patients-list'),
         items,
         state: State,
         openDashboardFor,
         abnormalSummary,
         onOpenCalc: (type)=>{
           if (type==='ecog') Calculators.openECOG();
           if (type==='ppi')  Calculators.openPPI();
           if (type==='pps')  Calculators.openPPS();
         }
       }, mode);
*/

export const PatientViews = (()=>{
  const el = (tag, cls='', html='') => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  // --- Shared mini chips (ECOG/PPI/PPS) ---
  function miniChips(code, onOpenCalc){
    const wrap = el('div', 'mini-actions');
    function chip(lbl, type){
      const b = el('button', 'btn-chip');
      b.textContent = lbl;
      b.addEventListener('click', (e)=>{ e.stopPropagation(); onOpenCalc?.(type); });
      return b;
    }
    wrap.append(chip('ECOG','ecog'), chip('PPI','ppi'), chip('PPS','pps'));
    wrap.dataset.code = code;
    return wrap;
  }

  // =============== 1) Expandable Cards ===============
  function renderExpandable({ root, items, state, openDashboardFor, abnormalSummary, onOpenCalc }){
    root.innerHTML = '';
    if (!items.length){
      const d = el('div','empty small'); d.style.padding='16px'; d.textContent='No patients in this view.'; root.appendChild(d); return;
    }
    items.forEach(p => {
      const code = p['Patient Code'] || '';
      const upd  = p['Updated At'] || '';
      const head = el('div', 'row patient-card');
      head.style.cursor = 'pointer';
      head.setAttribute('data-code', code);

      const left = el('div');
      const header = el('div','row-header');
      const headLeft = el('div'); headLeft.style.display='flex'; headLeft.style.alignItems='center'; headLeft.style.gap='8px';

      const name = el('div', 'row-title linkish', esc(p['Patient Name'] || '(Unnamed)'));
      headLeft.appendChild(name);

      const badge = el('span','status '+(p['Done']?'done':'open'), p['Done']?'Done':'Open');
      header.append(headLeft, badge);

      const meta = el('div','row-sub', `${p['Patient Age']||'—'} yrs • Room ${p['Room']||'—'}${p['Diagnosis']?(' • '+p['Diagnosis']):''}`);

      const tags = el('div','row-tags');
      const sectionPill = el('span','row-tag', esc(p['Section'] || 'Default'));
      tags.appendChild(sectionPill);
      const labsAbn = p['Labs Abnormal'] || (state && state.labs && abnormalSummary ? abnormalSummary(
        (state.labs || []).find(r => r['Patient Code']===code) || {}
      ) : '');
      if (labsAbn){ const chip = el('span','row-chip abn'); chip.textContent = labsAbn; tags.appendChild(chip); }
      const symPrev = (()=>{
        const s=(p['Symptoms']||'').split(',').map(x=>x.trim()).filter(Boolean);
        return s.length? s.slice(0,3).join(', ')+(s.length>3?` (+${s.length-3})`:'') : '';
      })();
      if (symPrev){ const chip = el('span','row-chip sym'); chip.textContent=symPrev; tags.appendChild(chip); }

      left.append(header, meta, tags, miniChips(code, onOpenCalc));
      const right = el('div','', `<span class="mono muted">${esc(code)}</span>`);
      head.append(left, right);

      // Expand area
      const exp = el('div'); exp.style.display='none'; exp.style.padding='10px 12px 0 12px';
      exp.innerHTML = `
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="small muted">Updated: <span class="mono">${esc(upd)}</span></div>
          <div class="small muted">Provider: ${esc(p['Admitting Provider'] || '—')}</div>
          <div class="small">Comments: ${esc(p['Comments'] || '—')}</div>
          <div class="small">Diet / Isolation: ${esc(p['Diet'] || '—')} / ${esc(p['Isolation'] || '—')}</div>
        </div>
        <div style="height:10px"></div>
        <div><button class="btn" data-open>View Full Dashboard</button></div>
      `;
      const wrap = el('div','card'); wrap.style.display='grid'; wrap.style.gap='8px'; wrap.append(head, exp);
      head.addEventListener('click', ()=>{
        const on = exp.style.display==='none';
        exp.style.display = on ? '' : 'none';
      });
      exp.querySelector('[data-open]')?.addEventListener('click',(e)=>{ e.stopPropagation(); openDashboardFor?.(code, true); });

      root.appendChild(wrap);
    });
  }

  // =============== 2) Carousel ===============
  function renderCarousel({ root, items, state, openDashboardFor, abnormalSummary, onOpenCalc }){
    root.innerHTML = '';
    if (!items.length){
      const d = el('div','empty small'); d.style.padding='16px'; d.textContent='No patients in this view.'; root.appendChild(d); return;
    }
    // horizontal scroller
    const rail = el('div'); rail.style.display='flex'; rail.style.gap='12px'; rail.style.overflow='auto'; rail.style.scrollSnapType='x mandatory'; rail.style.padding='4px 2px';
    items.forEach(p => {
      const code = p['Patient Code']||'';
      const card = el('div','card');
      card.style.minWidth='320px'; card.style.scrollSnapAlign='start';
      card.style.display='grid'; card.style.gap='8px';
      card.innerHTML = `
        <div class="card-head">
          <div class="card-title">${esc(p['Patient Name']||'(Unnamed)')}</div>
          <div class="status ${p['Done']?'done':'open'}">${p['Done']?'Done':'Open'}</div>
        </div>
        <div class="small muted mono">${esc(code)} • Room ${esc(p['Room']||'—')}</div>
        <div class="chips">
          ${ p['Diagnosis'] ? `<span class="chip">${esc(p['Diagnosis'])}</span>` : '' }
          ${ p['Patient Age'] ? `<span class="chip">${esc(p['Patient Age'])} yrs</span>` : '' }
        </div>
      `;
      card.append(miniChips(code, onOpenCalc));
      const btn = el('button','btn'); btn.textContent='Open'; btn.addEventListener('click',()=>openDashboardFor?.(code, true));
      card.append(btn);
      rail.append(card);
    });
    const wrap = el('div','card'); wrap.style.padding='12px'; wrap.append(rail);
    root.appendChild(wrap);
  }

  // =============== 3) Kanban ===============
  function renderKanban({ root, items, state, openDashboardFor, abnormalSummary, onOpenCalc }){
    root.innerHTML='';
    // group by Section
    const bySec = new Map();
    items.forEach(p => {
      const sec = p.Section || 'Default';
      if (!bySec.has(sec)) bySec.set(sec, []);
      bySec.get(sec).push(p);
    });
    const board = el('div'); board.style.display='grid'; board.style.gridTemplateColumns='repeat(auto-fill, minmax(260px,1fr))'; board.style.gap='12px';
    bySec.forEach((list, sec) => {
      const col = el('div','card'); col.style.display='grid'; col.style.gap='8px'; col.style.minHeight='120px';
      const head = el('div','card-head'); head.innerHTML = `<div class="card-title">${esc(sec)}</div>`;
      col.append(head);
      list.forEach(p => {
        const code = p['Patient Code']||'';
        const item = el('div','row patient-card'); item.style.cursor='pointer';
        const left = el('div');
        const h = el('div','row-header');
        const nl = el('div','row-title', esc(p['Patient Name']||'(Unnamed)'));
        const badge = el('span','status '+(p['Done']?'done':'open'), p['Done']?'Done':'Open');
        h.append(el('div','', nl.outerHTML), badge);
        const meta = el('div','row-sub', `${p['Patient Age']||'—'} yrs • Room ${p['Room']||'—'}`);
        left.append(h, meta, miniChips(code, onOpenCalc));
        const right = el('div','', `<span class="mono muted">${esc(code)}</span>`);
        item.append(left, right);
        item.addEventListener('click', ()=>openDashboardFor?.(code, true));
        col.append(item);
      });
      board.append(col);
    });
    root.appendChild(board);
  }

  // =============== 4) Smart Summary Grid ===============
  function renderSummary({ root, items, state, openDashboardFor, onOpenCalc }){
    root.innerHTML='';
    if (!items.length){ const d=el('div','empty small'); d.style.padding='16px'; d.textContent='No patients in this view.'; root.appendChild(d); return; }
    // Use locally available short summary from summaries.js cache if present; otherwise show key fields.
    // We read window.Summaries?.getSummaryFor(code) if exposed; fallback to minimal body.
    const grid = el('div'); grid.style.display='grid'; grid.style.gridTemplateColumns='repeat(auto-fill, minmax(280px,1fr))'; grid.style.gap='12px';
    items.forEach(p => {
      const code = p['Patient Code']||'';
      const card = el('div','card'); card.style.display='grid'; card.style.gap='8px';
      const head = el('div','card-head');
      head.innerHTML = `<div class="card-title">${esc(p['Patient Name']||'(Unnamed)')}</div>
                        <div class="status ${p['Done']?'done':'open'}">${p['Done']?'Done':'Open'}</div>`;
      card.append(head);

      let body = '';
      try{
        const api = window.Summaries && typeof window.Summaries.ensureSummaryText === 'function'
          ? window.Summaries.ensureSummaryText(code, /*short*/ true)
          : null;
        body = api || '';
      }catch{ /* no-op */ }

      const pre = el('pre','mono small'); pre.style.whiteSpace='pre-wrap'; pre.style.lineHeight='1.3';
      pre.textContent = body || `Dx: ${p['Diagnosis']||'—'}\nAge ${p['Patient Age']||'—'} | Room ${p['Room']||'—'}\nProvider: ${p['Admitting Provider']||'—'}`;
      card.append(pre);
      card.append(miniChips(code, onOpenCalc));
      const row = el('div'); row.style.display='flex'; row.style.gap='8px';
      const openBtn = el('button','btn'); openBtn.textContent='Open'; openBtn.addEventListener('click',()=>openDashboardFor?.(code, true));
      const copyBtn = el('button','btn btn-ghost'); copyBtn.textContent='Copy Summary'; copyBtn.addEventListener('click', async ()=>{
        try{
          await navigator.clipboard.writeText(pre.textContent||'');
        }catch{}
      });
      row.append(openBtn, copyBtn);
      card.append(row);
      grid.append(card);
    });
    root.appendChild(grid);
  }

  // =============== 5) Timeline ===============
  function renderTimeline({ root, items, openDashboardFor, onOpenCalc }){
    root.innerHTML='';
    if (!items.length){ const d=el('div','empty small'); d.style.padding='16px'; d.textContent='No patients in this view.'; root.appendChild(d); return; }

    const sorted = items.slice().sort((a,b)=>{
      const ta = Date.parse(a['Updated At']||0)||0;
      const tb = Date.parse(b['Updated At']||0)||0;
      return tb - ta; // newest first
    });

    const line = el('div'); line.style.display='grid'; line.style.gap='12px';
    sorted.forEach(p => {
      const code = p['Patient Code']||'';
      const row = el('div','card'); row.style.display='grid'; row.style.gap='6px';
      row.innerHTML = `
        <div class="card-head">
          <div class="card-title">${esc(p['Patient Name']||'(Unnamed)')}</div>
          <div class="small muted mono">${esc(p['Updated At']||'—')}</div>
        </div>
        <div class="small muted">Room ${esc(p['Room']||'—')} • ${esc(p['Diagnosis']||'—')}</div>
      `;
      row.append(miniChips(code, onOpenCalc));
      const openBtn = el('button','btn'); openBtn.textContent='Open'; openBtn.addEventListener('click',()=>openDashboardFor?.(code, true));
      row.append(openBtn);
      line.append(row);
    });
    root.appendChild(line);
  }

  // Public API
  function renderList(ctx, mode){
    const m = (mode||'expandable').toLowerCase();
    const fn = (
      m==='expandable' ? renderExpandable :
      m==='carousel'   ? renderCarousel   :
      m==='kanban'     ? renderKanban     :
      m==='summary'    ? renderSummary    :
      m==='timeline'   ? renderTimeline   : renderExpandable
    );
    fn(ctx);
  }

  return { renderList };
})();
