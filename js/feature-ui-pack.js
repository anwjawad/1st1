// feature-ui-pack.js
// UI Enhancements Pack (standalone)
// - Snackbar / Toast notifications
// - Skeleton loader blocks
// - Animated buttons (auto-enhance)
// - Inline loader & top progress bar
// - Cards & data blocks
// - Floating inputs & Switches
// - Tooltips & lightweight Modal
// - Table polish + optional expandable rows
// - Theme transition + micro animations helpers
// No core edits. Safe to drop-in. Theme-aware via [data-theme].

(function(){
  // ---------- CSS Injection ----------
  if (!document.getElementById('ui-pack-style')) {
    const css = `
/* ===== Snackbar / Toast ===== */
#ui-toast-wrap { position: fixed; inset: auto 0 20px 0; display: grid; place-items: center; gap: 10px; z-index: 9998; pointer-events:none; }
.ui-toast {
  pointer-events: auto;
  min-width: 220px; max-width: min(92vw, 520px);
  padding: 10px 14px; border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,.25);
  backdrop-filter: blur(6px) saturate(120%);
  border: 1px solid var(--border, #e3e6ea);
  display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center;
  transform: translateY(16px) scale(.98);
  opacity: 0; animation: ui-toast-in .24s ease forwards;
  font-size: 14px;
}
.ui-toast.success { background: color-mix(in srgb, #21c27a 16%, white); color: #0e6b45; }
.ui-toast.info    { background: color-mix(in srgb, #3b82f6 16%, white); color: #1e40af; }
.ui-toast.warn    { background: color-mix(in srgb, #f59e0b 18%, white); color: #7a3c00; }
.ui-toast.error   { background: color-mix(in srgb, #ef4444 16%, white); color: #7f1d1d; }
.ui-toast .icon   { opacity: .9 }
.ui-toast .msg    { line-height: 1.35 }
.ui-toast .close  { background: transparent; border: 0; cursor: pointer; opacity: .7 }
@keyframes ui-toast-in { to { transform: translateY(0) scale(1); opacity: 1; } }
@keyframes ui-toast-out { to { transform: translateY(8px) scale(.98); opacity: 0; } }

/* Theme tweaks */
[data-theme="ocean"] .ui-toast.success { background: color-mix(in srgb, #0ea5e9 16%, white); color:#0b4c69 }
[data-theme="rose"]  .ui-toast.success { background: color-mix(in srgb, #f472b6 16%, white); color:#7a104e }

/* ===== Skeleton Loader ===== */
.ui-skeleton { position: relative; overflow: hidden; border-radius: 10px; background: var(--skeleton-base, #eee); min-height: 60px; }
.ui-skeleton::after {
  content:""; position:absolute; inset:0;
  background: linear-gradient(90deg,
    transparent 0%, color-mix(in srgb, var(--skeleton-shine, #fff), transparent 60%) 50%, transparent 100%);
  transform: translateX(-100%); animation: ui-skel 1.2s infinite;
}
@keyframes ui-skel { to { transform: translateX(100%); } }
.ui-skel-row { height: 12px; border-radius: 6px; background: color-mix(in srgb, #bbb, white 60%); margin: 10px 0; }
.ui-skel-row.w50 { width: 50% } .ui-skel-row.w70 { width: 70% } .ui-skel-row.w90 { width: 90% }

/* Theme-aware skeleton hues */
:root, [data-theme] {
  --skeleton-base: color-mix(in srgb, var(--surface, #f6f7f9), #dfe3e9 40%);
  --skeleton-shine: #fff;
}

/* ===== Animated Buttons (Uiverse-inspired, accessible) ===== */
.ui-anim-btn {
  position: relative; overflow: hidden; border: 1px solid var(--border, #e3e6ea);
  padding: 9px 14px; border-radius: 12px; cursor: pointer; background: var(--btn-bg, #fff);
  transition: transform .08s ease, box-shadow .16s ease, border-color .2s ease, background .2s ease;
  will-change: transform;
}
.ui-anim-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,.10); }
.ui-anim-btn:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.ui-anim-btn .mi { vertical-align: -2px; }
.ui-anim-btn.primary {
  --btn-bg: color-mix(in srgb, var(--primary, #2563eb) 10%, #fff);
  color: color-mix(in srgb, var(--primary-ink, #0b2a72), #000 12%);
  border-color: color-mix(in srgb, var(--primary, #2563eb), #000 80%);
}
.ui-anim-btn.glow::before {
  content:""; position:absolute; inset:-2px; border-radius:14px;
  background: radial-gradient(120px 60px at var(--mx,50%) var(--my,0%), color-mix(in srgb, var(--primary, #2563eb) 35%, transparent), transparent 56%);
  opacity:.28; transition: opacity .2s ease;
}
.ui-anim-btn:hover.glow::before { opacity:.5 }
/* Subtle ripple */
.ui-anim-btn::after { content:""; position:absolute; width:14px; height:14px; border-radius:50%;
  background: currentColor; opacity:0; transform: scale(1); top: var(--ry, 50%); left: var(--rx, 50%); translate: -50% -50%; }
.ui-anim-btn.ripple:active::after { animation: ui-ripple .5s ease; }
@keyframes ui-ripple { 0% { opacity:.22; transform: scale(.8); } 100% { opacity:0; transform: scale(9); } }
/* Autostyle existing .btn */
.ui-autostyle-buttons .btn:not(.btn-primary):not(.btn-danger) {
  border-radius:12px; transition: transform .08s ease, box-shadow .16s ease;
}
.ui-autostyle-buttons .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }

/* ===== 1) Inline Loader (spinner) ===== */
.ui-inline-loader {
  --size: 18px; --thick: 2px; --track: color-mix(in srgb, var(--border, #d9dee6), #fff 40%);
  width: var(--size); height: var(--size); border-radius: 50%;
  border: var(--thick) solid var(--track);
  border-top-color: var(--primary, #2563eb);
  animation: ui-spin .8s linear infinite;
  display:inline-block; vertical-align: middle;
}
@keyframes ui-spin { to { transform: rotate(360deg); } }

/* ===== 2) Top Progress Bar (NProgress-like) ===== */
#ui-topbar {
  position: fixed; left:0; top:0; height:3px; width:0%;
  background: linear-gradient(90deg, var(--primary,#2563eb), color-mix(in srgb, var(--primary,#2563eb), #fff 40%));
  box-shadow: 0 0 10px color-mix(in srgb, var(--primary,#2563eb), transparent 60%);
  z-index: 9999; transition: width .2s ease, opacity .2s ease;
}

/* ===== 3) Cards & Data Blocks ===== */
.ui-card {
  background: var(--card, #fff); border: 1px solid var(--border, #e3e6ea);
  border-radius: 14px; padding: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.06);
}
.ui-card.hover:hover { box-shadow: 0 12px 28px rgba(0,0,0,.10); transform: translateY(-1px); transition: .16s ease; }

/* ===== 4) Floating Inputs & Switches ===== */
.ui-field { position: relative; }
.ui-field input[type="text"], .ui-field input[type="number"], .ui-field input[type="email"], .ui-field input[type="password"], .ui-field textarea {
  width:100%; padding: 12px 12px; border-radius: 10px; border:1px solid var(--border,#dfe3ea); background:#fff; outline: none;
}
.ui-field label {
  position: absolute; left: 12px; top: 12px; padding:0 6px; background: #fff; color:#6b7280;
  pointer-events:none; transition: .18s ease;
}
.ui-field:has(input:focus), .ui-field:has(textarea:focus) {}
.ui-field input:focus, .ui-field textarea:focus { border-color: color-mix(in srgb, var(--primary,#2563eb), #000 70%); }
.ui-field input:not(:placeholder-shown) + label,
.ui-field textarea:not(:placeholder-shown) + label,
.ui-field input:focus + label,
.ui-field textarea:focus + label { transform: translateY(-16px) scale(.88); color: color-mix(in srgb, var(--primary,#2563eb), #000 60%); }

/* Switch */
.ui-switch { --w: 44px; --h: 24px; --dot: 18px;
  position: relative; width: var(--w); height: var(--h); border-radius: 999px; background: #e5e7eb; cursor: pointer; transition: background .2s ease;
  border:1px solid var(--border,#dcdfe6);
}
.ui-switch::after { content:""; position:absolute; width: var(--dot); height: var(--dot); border-radius:50%; top: 50%; left: 3px; translate: 0 -50%;
  background:#fff; box-shadow: 0 2px 10px rgba(0,0,0,.15); transition: left .2s ease;
}
.ui-switch[data-on="true"] { background: color-mix(in srgb, var(--primary,#2563eb) 60%, #fff); }
.ui-switch[data-on="true"]::after { left: calc(var(--w) - var(--dot) - 3px); }

/* ===== 5) Tooltips (data-tip) ===== */
[data-tip] { position: relative; }
[data-tip]:hover::after, [data-tip]:focus-visible::after {
  content: attr(data-tip); position: absolute; left: 50%; bottom: calc(100% + 8px); translate: -50% 0;
  background: #111827; color:#fff; border-radius:8px; padding:6px 8px; font-size:12px; white-space: nowrap; z-index: 50;
  box-shadow: 0 8px 20px rgba(0,0,0,.25);
}
[data-tip]:hover::before, [data-tip]:focus-visible::before {
  content:""; position:absolute; left:50%; bottom: calc(100% + 4px); translate:-50% 0; border:6px solid transparent; border-top-color:#111827;
}

/* ===== 6) Lightweight Modal ===== */
.ui-modal { position: fixed; inset:0; display:none; place-items: center; z-index: 9998; }
.ui-modal.active { display:grid; }
.ui-modal .backdrop { position:absolute; inset:0; background: rgba(8,10,18,.32); backdrop-filter: blur(6px) saturate(120%); }
.ui-modal .panel { position:relative; background:#fff; border-radius:16px; border:1px solid var(--border,#e3e6ea); width:min(92vw,720px); max-height:80vh; overflow:auto;
  box-shadow: 0 20px 50px rgba(0,0,0,.25); transform: translateY(10px); opacity:0; animation: ui-modal-in .18s ease forwards; }
.ui-modal .panel .head { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--border,#e3e6ea); }
.ui-modal .panel .body { padding:14px; }
@keyframes ui-modal-in { to { transform: translateY(0); opacity:1; } }

/* ===== 7) Tables & Lists polish ===== */
.ui-table { width:100%; border-collapse: collapse; }
.ui-table th, .ui-table td { border:1px solid var(--border,#e4e7ec); padding:8px 10px; }
.ui-table thead th { background: color-mix(in srgb, #e5e7eb, #fff 20%); text-align:start; }
.ui-table tbody tr:hover { background: color-mix(in srgb, #f3f4f6, #fff 60%); }
.ui-row-details { display: none; }
tr[aria-expanded="true"] + .ui-row-details { display: table-row; background: color-mix(in srgb, #f9fafb, #fff 40%); }

/* ===== 8) Theme transition + micro animations ===== */
.ui-theme-animate * { transition: background-color .25s ease, color .25s ease, border-color .25s ease; }
.ui-fade-in { animation: ui-fade .24s ease both; } @keyframes ui-fade { from { opacity:0 } to { opacity:1 } }
.ui-slide-up { animation: ui-slide-up .26s ease both; } @keyframes ui-slide-up { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
    `.trim();
    const style = document.createElement('style');
    style.id = 'ui-pack-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- Toast API ----------
  const Toast = (function(){
    let wrap;
    function ensureWrap(){
      if (!wrap){
        wrap = document.createElement('div');
        wrap.id = 'ui-toast-wrap';
        document.body.appendChild(wrap);
      }
      return wrap;
    }
    function iconFor(type){
      const map = { success: 'check_circle', info: 'info', warn: 'warning', error: 'error' };
      return map[type] || 'info';
    }
    function show(message, {type='info', timeout=2600} = {}){
      const host = ensureWrap();
      const card = document.createElement('div');
      card.className = `ui-toast ${type}`;
      card.innerHTML = `
        <span class="icon mi md">${iconFor(type)}</span>
        <div class="msg">${message}</div>
        <button class="close" aria-label="Dismiss"><span class="mi md">close</span></button>
      `;
      const close = () => { card.style.animation = 'ui-toast-out .18s ease forwards'; setTimeout(()=> card.remove(), 180); };
      card.querySelector('.close').addEventListener('click', close);
      host.appendChild(card);
      if (timeout > 0) setTimeout(close, timeout);
      return { close };
    }
    return { show };
  })();
  window.UIToast = Toast;

  // ---------- Skeleton Helper ----------
  const Skeleton = (function(){
    const registry = new Map(); // key -> {container, overlay}
    function buildBlock(){
      const block = document.createElement('div');
      block.className = 'ui-skeleton';
      block.innerHTML = `
        <div style="padding:14px 16px">
          <div class="ui-skel-row w70"></div>
          <div class="ui-skel-row w90"></div>
          <div class="ui-skel-row w50"></div>
        </div>
      `;
      return block;
    }
    function show(container, key='default'){
      if (!container) return;
      hide(key);
      const overlay = buildBlock();
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.minHeight = Math.max(container.offsetHeight, 120) + 'px';
      const prevPos = getComputedStyle(container).position;
      if (prevPos === 'static') container.style.position = 'relative';
      container.appendChild(overlay);
      registry.set(key, { container, overlay, prevPos: (prevPos === 'static') ? 'static' : null });
    }
    function hide(key='default'){
      const rec = registry.get(key);
      if (!rec) return;
      rec.overlay.remove();
      if (rec.prevPos === 'static') rec.container.style.position = '';
      registry.delete(key);
    }
    return { show, hide };
  })();
  window.UISkeleton = Skeleton;

  // ---------- Animated Buttons: auto-enhance ----------
  function enhanceButtonsIn(root=document){
    // Explicit targets
    root.querySelectorAll('[data-anim-btn]').forEach(el=>{
      if (el._uiAnimApplied) return;
      el.classList.add('ui-anim-btn','glow','ripple','primary');
      el._uiAnimApplied = true;
      el.addEventListener('pointermove', e=>{
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top)  + 'px');
      });
      el.addEventListener('pointerdown', e=>{
        const r = el.getBoundingClientRect();
        el.style.setProperty('--rx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--ry', (e.clientY - r.top)  + 'px');
      });
    });
    // Soften existing .btn
    document.body.classList.add('ui-autostyle-buttons');
  }

  // Run once and observe future DOM (modals etc.)
  enhanceButtonsIn(document);
  const mo = new MutationObserver(muts=>{
    for (const m of muts) {
      if (m.type === 'childList' && (m.addedNodes?.length || m.removedNodes?.length)) {
        enhanceButtonsIn(document);
      }
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });

  document.addEventListener('DOMContentLoaded', ()=>{
    const idList = ['#btn-custom-print', '#open-summaries', '#save-btn'];
    idList.forEach(sel=>{ const el = document.querySelector(sel); if (el) el.setAttribute('data-anim-btn',''); });
    enhanceButtonsIn(document);
    // Nice theme transitions
    document.body.classList.add('ui-theme-animate');
  });

  // ---------- 1) Inline Loader API ----------
  const InlineLoader = {
    mount(target){
      const el = (typeof target === 'string') ? document.querySelector(target) : target;
      if (!el) return null;
      const sp = document.createElement('span');
      sp.className = 'ui-inline-loader';
      el.appendChild(sp);
      return { remove(){ sp.remove(); } };
    }
  };
  window.UIInline = InlineLoader;

  // ---------- 2) Top Progress Bar API ----------
  const Topbar = (function(){
    let bar; let active = 0; let trickleTimer;
    function ensure(){
      if (!bar){
        bar = document.createElement('div'); bar.id = 'ui-topbar'; document.body.appendChild(bar);
      }
      return bar;
    }
    function start(){
      active++; const b = ensure();
      b.style.opacity = '1'; b.style.width = '10%';
      clearInterval(trickleTimer);
      trickleTimer = setInterval(()=> advance(Math.random()*8+2), 350);
    }
    function advance(n=5){
      const b = ensure();
      const cur = parseFloat(b.style.width||'0'); const next = Math.min(cur + n, 94);
      b.style.width = next + '%';
    }
    function done(){
      active = Math.max(0, active-1);
      if (active>0) return;
      clearInterval(trickleTimer);
      const b = ensure(); b.style.width = '100%';
      setTimeout(()=>{ b.style.opacity='0'; b.style.width='0%'; }, 200);
    }
    return { start, advance, done };
  })();
  window.UITopbar = Topbar;

  // ---------- 3) Cards: helper (optional) ----------
  window.UICard = {
    apply(selector='.card'){ document.querySelectorAll(selector).forEach(c=> c.classList.add('ui-card')); }
  };

  // ---------- 4) Floating Inputs & Switches: helpers ----------
  const Inputs = {
    makeFloating(wrapper){
      // Expected HTML:
      // <div class="ui-field"><input placeholder=" " /><label>Label</label></div>
      if (!wrapper || wrapper._uiFloating) return;
      const inp = wrapper.querySelector('input,textarea'); const lab = wrapper.querySelector('label');
      if (!inp || !lab) return;
      if (!inp.hasAttribute('placeholder')) inp.setAttribute('placeholder',' ');
      wrapper._uiFloating = true;
    },
    makeSwitch(el, initial=false){
      if (!el) return;
      el.classList.add('ui-switch');
      el.setAttribute('role','switch');
      el.tabIndex = 0;
      el.dataset.on = (!!initial) + '';
      const toggle = ()=> el.dataset.on = (el.dataset.on!=='true') + '';
      el.addEventListener('click', toggle);
      el.addEventListener('keydown', (e)=>{ if (e.key===' '||e.key==='Enter'){ e.preventDefault(); toggle(); } });
      return { get value(){ return el.dataset.on==='true'; }, set value(v){ el.dataset.on = (!!v)+''; } };
    }
  };
  window.UIInputs = Inputs;

  // ---------- 5) Tooltips: no-JS (data-tip) ----------
  // Already CSS-based. Nothing to init.

  // ---------- 6) Lightweight Modal ----------
  const Modal = (function(){
    let host;
    function ensure(){
      if (host) return host;
      host = document.createElement('div');
      host.className = 'ui-modal';
      host.innerHTML = `
        <div class="backdrop" data-ui-close></div>
        <div class="panel">
          <div class="head">
            <div class="title">Info</div>
            <button class="icon-btn" data-ui-close><span class="mi md">close</span></button>
          </div>
          <div class="body"></div>
        </div>`;
      document.body.appendChild(host);
      host.addEventListener('click', (e)=>{ if (e.target.closest('[data-ui-close]')) close(); });
      return host;
    }
    function open({ title='Info', html='' }={}){
      const h = ensure();
      h.querySelector('.title').textContent = title;
      h.querySelector('.body').innerHTML = html;
      h.classList.add('active');
      document.documentElement.style.overflow='hidden';
    }
    function close(){
      if (!host) return;
      host.classList.remove('active');
      document.documentElement.style.overflow='';
    }
    return { open, close };
  })();
  window.UIModal = Modal;

  // ---------- 7) Tables: polish + expandable rows ----------
  const Tables = {
    makeExpandable(table){
      if (!table || table._uiExp) return;
      table._uiExp = true;
      table.addEventListener('click', (e)=>{
        const tr = e.target.closest('tbody tr');
        if (!tr || tr.classList.contains('ui-row-details')) return;
        const next = tr.nextElementSibling;
        if (next && next.classList.contains('ui-row-details')){
          const state = tr.getAttribute('aria-expanded')==='true';
          tr.setAttribute('aria-expanded', !state);
        }
      });
    }
  };
  window.UITables = Tables;

  // ---------- 8) Micro animations helper ----------
  const Anim = {
    revealOnScroll(selector='.ui-reveal', cls='ui-slide-up'){
      const els = Array.from(document.querySelectorAll(selector));
      if (!els.length) return;
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(en=>{
          if (en.isIntersecting){ en.target.classList.add(cls); io.unobserve(en.target); }
        });
      }, { threshold: .12 });
      els.forEach(el=> io.observe(el));
    }
  };
  window.UIAnim = Anim;

  // ---------- Convenience: demo helpers ----------
  window.UIShowSaved = () => UIToast.show('تم الحفظ بنجاح ✓', {type:'success'});
  window.UIShowError = (msg='حدث خطأ غير متوقع') => UIToast.show(msg, {type:'error', timeout: 4200});

  // Optional quick-autos: enable reveal on elements marked
  document.addEventListener('DOMContentLoaded', ()=> {
    UIAnim.revealOnScroll('[data-reveal]');
  });
})();
