/* ==========================================================================
   Interacció i gràfics — Anàlisi del pressupost públic de Masquefa
   Amb suport multiidioma (ca, es, en, eu, gl)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Idioma ---------- */
  const SUPPORTED_LANGS = ['ca', 'es', 'en', 'eu', 'gl'];
  let currentLang = localStorage.getItem('lang');
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'ca';
  document.documentElement.lang = currentLang;

  function t(key){
    const entry = (typeof I18N_UI !== 'undefined') ? I18N_UI[key] : null;
    if (!entry) return key;
    return entry[currentLang] || entry.ca || key;
  }
  function trLabel(text){
    if (currentLang === 'ca') return text;
    const entry = (typeof I18N_LABELS !== 'undefined') ? I18N_LABELS[text] : null;
    return entry ? (entry[currentLang] || text) : text;
  }
  function decimalSep(){ return currentLang === 'en' ? '.' : ','; }

  function applyStaticTranslations(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-attr-content]').forEach(el => {
      el.setAttribute('content', t(el.dataset.i18nAttrContent));
    });
    document.querySelectorAll('[data-i18n-attr-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAttrAriaLabel));
    });
    document.title = t('meta_title');

    const transpSub = document.querySelector('#enquesta .sub strong.mono');
    if (transpSub){
      const avg = SURVEY.transparencyAvg.toFixed(2).replace('.', decimalSep());
      transpSub.textContent = `${avg} / 5`;
    }
  }
  applyStaticTranslations();

  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch){
    langSwitch.value = currentLang;
    langSwitch.addEventListener('change', () => {
      localStorage.setItem('lang', langSwitch.value);
      location.reload();
    });
  }

  /* ---------- Nav mòbil ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle){
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Reveal on scroll (observer reutilitzable) ---------- */
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 })
    : null;
  function observeReveals(root){
    const els = root.querySelectorAll ? root.querySelectorAll('.reveal') : [];
    els.forEach(el => io ? io.observe(el) : el.classList.add('in'));
  }
  observeReveals(document);

  const CSS_VAR = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const COLORS = {
    gold: CSS_VAR('--gold'), teal: CSS_VAR('--teal'), violet: CSS_VAR('--violet'),
    rose: CSS_VAR('--rose'), ink: CSS_VAR('--ink'), inkMuted: CSS_VAR('--ink-muted'),
    inkFaint: CSS_VAR('--ink-faint'), line: CSS_VAR('--line-soft')
  };
  const numberLocale = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', eu: 'eu-ES', gl: 'gl-ES' }[currentLang] || 'ca-ES';
  const eur = (v) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(v) + ' €';
  const eurShort = (v) => {
    if (Math.abs(v) >= 1000000) {
      let s = (v/1000000).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
      return s + ' M€';
    }
    if (Math.abs(v) >= 1000) return (v/1000).toFixed(0) + ' k€';
    return v + ' €';
  };

  /* ==========================================================================
     BLOC A — Contingut generat des de les dades (no depèn de cap llibreria
     externa). S'executa sempre, encara que Chart.js no s'hagi pogut carregar.
     ========================================================================== */

  function fillPillList(containerId, dataObj, color, maxOverride){
    const el = document.getElementById(containerId);
    if (!el) return;
    const max = maxOverride || Math.max(...Object.values(dataObj));
    el.innerHTML = Object.entries(dataObj).map(([label, val]) => `
      <div class="pill-row">
        <div class="label-row"><span>${trLabel(label)}</span><span class="n">${val}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${(val/max*100).toFixed(1)}%; background:${color}"></div></div>
      </div>`).join('');
  }
  fillPillList('list-channel', SURVEY.infoChannel, COLORS.gold);
  fillPillList('list-cut', SURVEY.leastPainfulToCut, COLORS.rose);
  fillPillList('list-urgent', SURVEY.urgentThemes, COLORS.teal);
  fillPillList('list-overfunded', SURVEY.overfundedTheme, COLORS.violet);

  const areasGrid = document.getElementById('areas-grid');
  if (areasGrid){
    areasGrid.innerHTML = Object.entries(BUDGET.areas).map(([key, a]) => {
      const growthClass = a.growth2426 >= 0 ? 'up' : 'down';
      const growthSign = a.growth2426 >= 0 ? '+' : '';
      return `
      <div class="area-card reveal">
        <div class="head">
          <h3>${trLabel(a.label)}</h3>
          <span class="growth ${growthClass}">${growthSign}${a.growth2426}% · 2024→2026</span>
        </div>
        <div class="figures">
          <div><span>2024</span><b>${eurShort(a.capitalSocial[2024])}</b></div>
          <div><span>2025</span><b>${eurShort(a.capitalSocial[2025])}</b></div>
          <div><span>2026</span><b>${eurShort(a.capitalSocial[2026])}</b></div>
        </div>
        <div class="tabs area-tabs" data-area="${key}">
          <button class="tab active" data-y="2024">2024</button>
          <button class="tab" data-y="2025">2025</button>
          <button class="tab" data-y="2026">2026</button>
        </div>
        <ul class="area-highlights" data-area-list="${key}">
          ${a.highlights[2024].map(h=>`<li>${trLabel(h)}</li>`).join('')}
        </ul>
      </div>`;
    }).join('');

    areasGrid.querySelectorAll('.area-tabs').forEach(tabset => {
      tabset.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
          tabset.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          const key = tabset.dataset.area;
          const year = btn.dataset.y;
          const list = areasGrid.querySelector(`[data-area-list="${key}"]`);
          list.innerHTML = BUDGET.areas[key].highlights[year].map(h=>`<li>${trLabel(h)}</li>`).join('');
        });
      });
    });
    observeReveals(areasGrid);
  }

  const compareGrid = document.getElementById('compare-grid');
  if (compareGrid){
    compareGrid.innerHTML = COMPARISON.map(c => `
      <div class="compare-item">
        <h4>${trLabel(c.label)}</h4>
        <div class="compare-row"><span class="tag">${t('cmp_row_want')}</span><span class="val gold">${c.wantMorePct}%</span></div>
        <div class="compare-row"><span class="tag">${t('cmp_row_perceived')}</span><span class="val violet">${c.perceivedNowPct}%</span></div>
        <div class="compare-row"><span class="tag">${t('cmp_row_growth')}</span><span class="val ${c.realGrowth>=0?'up':'down'}">${c.realGrowth>=0?'+':''}${c.realGrowth}%</span></div>
      </div>`).join('');
  }

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================================
     BLOC B — Gràfics amb Chart.js. Si la llibreria no s'ha carregat (per
     exemple sense connexió), no trenca la resta de la pàgina.
     ========================================================================== */

  if (typeof Chart === 'undefined'){
    console.warn('Chart.js no disponible: els gràfics no es mostraran.');
    document.querySelectorAll('.chart-box').forEach(box => {
      box.insertAdjacentHTML('beforeend', '<p style="color:var(--ink-faint); font-size:.82rem; padding-top:1rem;">No s\'ha pogut carregar la llibreria de gràfics.</p>');
    });
    return;
  }

  Chart.defaults.color = COLORS.inkMuted;
  Chart.defaults.font.family = "'Work Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.borderColor = COLORS.line;
  const PALETTE = [COLORS.gold, COLORS.teal, COLORS.violet, COLORS.rose, '#7FA6C9', '#C98F5C', '#8FBF6B', '#B98FD1', '#5CA0A8'];
  const gridOpt = { color: COLORS.line, drawTicks:false };

  /* 1. Ingressos per capítol (tabs per any) */
  let incomeChart;
  const incomeCanvas = document.getElementById('chart-income');
  const incomeShortTr = BUDGET.incomeChapters.short.map(trLabel);
  function renderIncome(year){
    const data = BUDGET.incomeChapters[year];
    if (incomeChart) incomeChart.destroy();
    incomeChart = new Chart(incomeCanvas.getContext('2d'), {
      type: 'bar',
      data: { labels: incomeShortTr, datasets: [{ data, backgroundColor: COLORS.gold, borderRadius: 5, maxBarThickness: 46 }] },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: (c)=> eur(c.raw) } } },
        scales:{ y:{ ticks:{ callback:(v)=>eurShort(v) }, grid:gridOpt }, x:{ grid:{ display:false }, ticks:{ autoSkip:false, maxRotation:38, minRotation:38, font:{size:10.5} } } }
      }
    });
  }

  /* 2. Despeses per capítol (tabs per any) */
  let expenseChart;
  const expenseCanvas = document.getElementById('chart-expense');
  const expenseShortTr = BUDGET.expenseChapters.short.map(trLabel);
  function renderExpense(year){
    const data = BUDGET.expenseChapters[year];
    if (expenseChart) expenseChart.destroy();
    expenseChart = new Chart(expenseCanvas.getContext('2d'), {
      type: 'bar',
      data: { labels: expenseShortTr, datasets: [{ data, backgroundColor: COLORS.teal, borderRadius: 5, maxBarThickness: 46 }] },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: (c)=> eur(c.raw) } } },
        scales:{ y:{ ticks:{ callback:(v)=>eurShort(v) }, grid:gridOpt }, x:{ grid:{ display:false }, ticks:{ autoSkip:false, maxRotation:38, minRotation:38, font:{size:10.5} } } }
      }
    });
  }

  document.querySelectorAll('[data-year-tabs="income"] .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-year-tabs="income"] .tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderIncome(btn.dataset.year);
    });
  });
  document.querySelectorAll('[data-year-tabs="expense"] .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-year-tabs="expense"] .tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderExpense(btn.dataset.year);
    });
  });
  if (incomeCanvas) renderIncome(2026);
  if (expenseCanvas) renderExpense(2026);

  /* 3. Evolució total ingressos vs despeses */
  const totalsCanvas = document.getElementById('chart-totals');
  if (totalsCanvas){
    new Chart(totalsCanvas.getContext('2d'), {
      type:'line',
      data:{ labels: BUDGET.years, datasets:[
        { label:t('chart_income_total'), data: BUDGET.years.map(y=>BUDGET.totalIncome[y]), borderColor: COLORS.gold, backgroundColor:'transparent', tension:.3, pointBackgroundColor:COLORS.gold, pointRadius:5, borderWidth:2.5 },
        { label:t('chart_expense_total'), data: BUDGET.years.map(y=>BUDGET.totalExpense[y]), borderColor: COLORS.teal, backgroundColor:'transparent', tension:.3, pointBackgroundColor:COLORS.teal, pointRadius:5, borderWidth:2.5, borderDash:[6,4] }
      ]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, boxHeight:10, usePointStyle:true, pointStyle:'circle' } }, tooltip:{ callbacks:{ label:(c)=> `${c.dataset.label}: ${eur(c.raw)}` } } },
        scales:{ y:{ ticks:{ callback:(v)=>eurShort(v) }, grid:gridOpt }, x:{ grid:{display:false} } }
      }
    });
  }

  /* 4. Distribució % despeses (doughnut, tabs) */
  let shareChart;
  const shareCanvas = document.getElementById('chart-share');
  const shareLabels = {
    personal: t('chart_share_personal'), bens: t('chart_share_bens'), financeres: t('chart_share_financeres'),
    transfCorrents: t('chart_share_transfcorrents'), inversions: t('chart_share_inversions'),
    transfCapital: t('chart_share_transfcapital'), actius: t('chart_share_actius'), passius: t('chart_share_passius')
  };
  function renderShare(year){
    const d = BUDGET.expenseSharePct[year];
    const labels = Object.keys(d).map(k=>shareLabels[k]);
    const data = Object.values(d);
    if (shareChart) shareChart.destroy();
    shareChart = new Chart(shareCanvas.getContext('2d'), {
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor: PALETTE, borderColor: CSS_VAR('--bg-card'), borderWidth:3 }] },
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'62%',
        plugins:{ legend:{ position:'right', labels:{ boxWidth:9, boxHeight:9, usePointStyle:true, pointStyle:'circle', font:{size:11} } }, tooltip:{ callbacks:{ label:(c)=> `${c.label}: ${c.raw}%` } } }
      }
    });
  }
  document.querySelectorAll('[data-year-tabs="share"] .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-year-tabs="share"] .tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderShare(btn.dataset.year);
    });
  });
  if (shareCanvas) renderShare(2026);

  /* 5. Àrees: creixement 2024 -> 2026 */
  const areaCanvas = document.getElementById('chart-areas');
  if (areaCanvas){
    const areas = Object.values(BUDGET.areas);
    new Chart(areaCanvas.getContext('2d'), {
      type:'bar',
      data:{ labels: areas.map(a=>trLabel(a.label)), datasets:[
        { label:'2024', data: areas.map(a=>a.capitalSocial[2024]), backgroundColor: COLORS.inkFaint, borderRadius:5, maxBarThickness:40 },
        { label:'2026', data: areas.map(a=>a.capitalSocial[2026]), backgroundColor: COLORS.gold, borderRadius:5, maxBarThickness:40 }
      ]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, boxHeight:10 } }, tooltip:{ callbacks:{ label:(c)=> `${c.dataset.label}: ${eur(c.raw)}` } } },
        scales:{ y:{ ticks:{ callback:(v)=>eurShort(v) }, grid:gridOpt }, x:{ grid:{display:false} } }
      }
    });
  }

  /* 6. Enquesta: percepció vs desig d'inversió */
  const perceptionCanvas = document.getElementById('chart-perception');
  if (perceptionCanvas){
    const areasOrder = Object.keys(SURVEY.desiredInvestment);
    const areasOrderTr = areasOrder.map(trLabel);
    const respostesWord = t('chart_respostes');
    new Chart(perceptionCanvas.getContext('2d'), {
      type:'bar',
      data:{ labels: areasOrderTr, datasets:[
        { label:t('sur_perception_legend_now'), data: areasOrder.map(a=>SURVEY.perceivedInvestment[a]||0), backgroundColor: COLORS.violet, borderRadius:5, maxBarThickness:22 },
        { label:t('sur_perception_legend_want'), data: areasOrder.map(a=>SURVEY.desiredInvestment[a]||0), backgroundColor: COLORS.gold, borderRadius:5, maxBarThickness:22 }
      ]},
      options:{
        indexAxis:'y', responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, boxHeight:10 } }, tooltip:{ callbacks:{ label:(c)=> `${c.dataset.label}: ${c.raw} ${respostesWord}` } } },
        scales:{ x:{ grid:gridOpt, ticks:{ stepSize:20 } }, y:{ grid:{display:false}, ticks:{ font:{size:11} } } }
      }
    });
  }

  /* 7. Transparència: distribució de notes */
  const transpCanvas = document.getElementById('chart-transparency');
  if (transpCanvas){
    const entries = Object.entries(SURVEY.transparencyScore);
    const notaWord = t('chart_nota');
    const respostesWord2 = t('chart_respostes');
    new Chart(transpCanvas.getContext('2d'), {
      type:'bar',
      data:{ labels: entries.map(e=>`${notaWord} ${e[0]}`), datasets:[{ data: entries.map(e=>e[1]), backgroundColor: entries.map((e)=> e[0] <= 2 ? COLORS.rose : (e[0]==3? COLORS.inkFaint : COLORS.teal)), borderRadius:6, maxBarThickness:52 }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(c)=> `${c.raw} ${respostesWord2}` } } },
        scales:{ y:{ grid:gridOpt, ticks:{ precision:0 } }, x:{ grid:{display:false} } }
      }
    });
  }

});
