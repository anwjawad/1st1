// feature-ui-pack.js
// UI Enhancements Pack (standalone)
// - Snackbar / Toast notifications
// - Skeleton loader blocks
// - Animated buttons (auto-enhance)
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

/* Variants tied to theme */
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

/* Subtle ripple (perf-safe) */
.ui-anim-btn::after {
  content:""; position:absolute; width:14px; height:14px; border-radius:50%;
  background: currentColor; opacity:0; transform: scale(1);
  top: var(--ry, 50%); left: var(--rx, 50%); translate: -50% -50%;
}
.ui-anim-btn.ripple:active::after { animation: ui-ripple .5s ease; }
@keyframes ui-ripple {
  0% { opacity:.22; transform: scale(.8); }
  100% { opacity:0; transform: scale(9); }
}

/* Autostyle existing .btn if wanted */
.ui-autostyle-buttons .btn:not(.btn-primary):not(.btn-danger) {
  border-radius:12px; transition: transform .08s ease, box-shadow .16s ease;
}
.ui-autostyle-buttons .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
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
      const map = {
        success: 'check_circle',
        info: 'info',
        warn: 'warning',
        error: 'error'
      };
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
      const close = () => {
        card.style.animation = 'ui-toast-out .18s ease forwards';
        setTimeout(()=> card.remove(), 180);
      };
      card.querySelector('.close').addEventListener('click', close);
      host.appendChild(card);
      if (timeout > 0) setTimeout(close, timeout);
      return { close };
    }
    return { show };
  })();

  // Expose to window for app usage
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
      // Stretch to container
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.minHeight = Math.max(container.offsetHeight, 120) + 'px';
      // Ensure container positioning
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
    // 1) Explicit targets
    root.querySelectorAll('[data-anim-btn]').forEach(el=>{
      if (el._uiAnimApplied) return;
      el.classList.add('ui-anim-btn','glow','ripple','primary');
      el._uiAnimApplied = true;
      // track mouse for glow origin
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

    // 2) Optionally soften existing .btn (non-primary)
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

  // ---------- Convenience: auto-enhance some known buttons if present ----------
  // Example: enhance Print(custom) if it exists later
  document.addEventListener('DOMContentLoaded', ()=>{
    const idList = ['#btn-custom-print', '#open-summaries', '#save-btn'];
    idList.forEach(sel=>{
      const el = document.querySelector(sel);
      if (el) { el.setAttribute('data-anim-btn',''); }
    });
    enhanceButtonsIn(document);
  });

  // ---------- Optional: Demo helpers (you can remove) ----------
  // Provide simple global shortcuts for app to call:
  window.UIShowSaved = () => UIToast.show('تم الحفظ بنجاح ✓', {type:'success'});
  window.UIShowError = (msg='حدث خطأ غير متوقع') => UIToast.show(msg, {type:'error', timeout: 4200});

  // Example skeleton usage (call from existing flows when loading):
  //   const host = document.querySelector('#patients-table') || document.querySelector('#content');
  //   UISkeleton.show(host, 'patients');
  //   ... load ...
  //   UISkeleton.hide('patients');
})();
