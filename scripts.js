/* ==========================================================================
   LA VENTAJA - MOTOR DE INTERACTIVIDAD SIMPLIFICADO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initToast();
  initCounters();
  initLegalAgeStrip();
  initCountrySystem();
  if (typeof initBlogFilters === 'function') {
    initBlogFilters();
  }
  if (typeof initAccordions === 'function') {
    initAccordions();
  }
  // Render history if the elements exist on the page
  renderHistory();
});


/* ==========================================================================
   TOAST FLOATING NOTIFICATIONS
   ========================================================================== */
let toastContainer;

function initToast() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

window.showToast = function(message, type = 'success') {
  if (!toastContainer) initToast();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
  
  let icon = '✅';
  if (type === 'error') icon = '❌';
  else if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span style="font-size:1.1rem; margin-right:0.25rem;">${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

/* ==========================================================================
   LEGAL AGE STRIP COMPONENT (Injected dynamically)
   ========================================================================== */
function initLegalAgeStrip() {
  // Find main or insert right after header
  const header = document.getElementById('header') || document.querySelector('.main-header');
  if (header && !document.querySelector('.legal-age-strip')) {
    const strip = document.createElement('div');
    strip.className = 'legal-age-strip';
    strip.innerHTML = `
      <div class="container">
        <span>⚠️ Este sitio contiene información sobre mercados de predicción deportiva. Debes tener edad legal para participar en apuestas en tu país.</span>
      </div>
    `;
    // Insert just after the fixed header
    header.insertAdjacentElement('afterend', strip);
  }
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Highlight active link based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}


/* ==========================================================================
   LIVE COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-count');
  if (counters.length === 0) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let current = 0;
    const increment = Math.ceil(target / 100);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString('es-CO');
        clearInterval(interval);
      } else {
        counter.textContent = current.toLocaleString('es-CO');
      }
    }, 20);
  });
}

/* ==========================================================================
   TESTIMONIALS CAROUSEL
   ========================================================================== */
window.initCarousel = function() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dotsNav = document.querySelector('.carousel-indicator');
  
  if (!track || slides.length === 0) return;

  const dots = [];
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
    dotsNav.appendChild(dot);
    dots.push(dot);

    dot.addEventListener('click', () => {
      moveToSlide(index);
    });
  });

  let currentIndex = 0;
  function moveToSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
    if (dots[index]) dots[index].classList.add('active');
    currentIndex = index;
  }

  setInterval(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    moveToSlide(nextIndex);
  }, 5000);
};

/* ==========================================================================
   HELPERS & MATH UTILS
   ========================================================================== */
function parseNumber(id) {
  const el = document.getElementById(id);
  return el ? parseFloat(el.value) : NaN;
}

function formatCOP(value) {
  if (isNaN(value)) return '$0';
  
  const country = window.getUserCountry() || 'DEFAULT';
  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  
  // Decide how many decimal places to show
  let decimals = 0;
  if (country === 'ES' || country === 'MX' || country === 'PE' || country === 'DEFAULT') {
    decimals = 2;
  }
  
  // Decide currency symbol and formatting style
  let symbol = '$';
  let formatLocale = 'es-CO';
  
  if (country === 'ES') {
    symbol = '€';
    formatLocale = 'es-ES';
  } else if (country === 'MX') {
    symbol = '$';
    formatLocale = 'es-MX';
  } else if (country === 'PE') {
    symbol = 'S/';
    formatLocale = 'es-PE';
  } else if (country === 'DEFAULT') {
    symbol = '$';
    formatLocale = 'en-US';
  }
  
  // Format the number
  let formattedValue = '';
  if (decimals === 0) {
    formattedValue = Math.round(value).toLocaleString(formatLocale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else {
    formattedValue = value.toLocaleString(formatLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Placement of symbol
  if (country === 'ES') {
    return formattedValue + ' ' + symbol;
  } else if (country === 'PE') {
    return symbol + ' ' + formattedValue;
  } else {
    return symbol + formattedValue;
  }
}

function formatPercent(value) {
  if (isNaN(value)) return '0.0%';
  return value.toFixed(1) + '%';
}

function validateOdds(odds) {
  return !isNaN(odds) && odds > 1.01;
}

function getDigeribleFraction(percent) {
  if (isNaN(percent) || percent <= 0) return "nunca (0 de cada 10 veces)";
  if (percent < 10) return "menos de 1 de cada 10 veces";
  if (percent < 15) return "1 de cada 8 veces";
  if (percent < 22) return "1 de cada 5 veces";
  if (percent < 28) return "1 de cada 4 veces";
  if (percent < 38) return "1 de cada 3 veces";
  if (percent < 45) return "2 de cada 5 veces";
  if (percent < 55) return "la mitad de las veces (1 de cada 2)";
  if (percent < 65) return "3 de cada 5 veces";
  if (percent < 73) return "2 de cada 3 veces";
  if (percent < 78) return "3 de cada 4 veces";
  if (percent < 86) return "4 de cada 5 veces";
  if (percent < 93) return "9 de cada 10 veces";
  return "casi siempre (más de 9 de cada 10 veces)";
}

/* ==========================================================================
   LOCALSTORAGE HISTORY LOGIC
   ========================================================================== */
function saveCalculation(type, inputs, results) {
  try {
    let history = JSON.parse(localStorage.getItem('vb_calc_history')) || [];
    const record = {
      type: type,
      date: new Date().toLocaleString('es-CO'),
      inputs: inputs,
      results: results
    };
    history.unshift(record); // Prepend
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    localStorage.setItem('vb_calc_history', JSON.stringify(history));
    renderHistory();
  } catch (e) {
    console.error("No se pudo guardar el historial local", e);
  }
}

function renderHistory() {
  const historyBoxes = document.querySelectorAll('.calc-history-list');
  if (historyBoxes.length === 0) return;

  const history = JSON.parse(localStorage.getItem('vb_calc_history')) || [];
  historyBoxes.forEach(box => {
    if (history.length === 0) {
      box.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); text-align:center;">No tienes historial de cálculos aún.</p>`;
      return;
    }

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
        <h4 style="font-size:0.95rem;">Tus últimos cálculos</h4>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="exportCalculationHistoryCSV()" style="font-size:0.75rem; padding:0.25rem 0.5rem;">CSV</button>
          <button class="btn btn-secondary btn-sm" onclick="clearCalculationHistory()" style="font-size:0.75rem; padding:0.25rem 0.5rem; border-color:var(--danger); color:var(--danger);">Borrar</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.6rem; max-height:300px; overflow-y:auto; padding-right:4px;">
    `;

    history.forEach(item => {
      html += `
        <div style="background-color:rgba(11,15,25,0.4); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.8rem; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
            <strong style="color:var(--primary);">${item.type}</strong>
            <span style="color:var(--text-muted); font-size:0.72rem;">${item.date}</span>
          </div>
          <div style="color:var(--text-secondary); margin-bottom:0.25rem;">
            ${Object.entries(item.inputs).map(([k, v]) => `${k}: <strong>${v}</strong>`).join(' | ')}
          </div>
          <div style="color:var(--text-primary);">
            Resultado: <strong>${item.results}</strong>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    box.innerHTML = html;
  });
}

window.clearCalculationHistory = function() {
  localStorage.removeItem('vb_calc_history');
  renderHistory();
  window.showToast('Historial borrado');
};

window.exportCalculationHistoryCSV = function() {
  const history = JSON.parse(localStorage.getItem('vb_calc_history')) || [];
  if (history.length === 0) {
    window.showToast('No hay datos para exportar', 'warning');
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Tipo de Calculo,Fecha,Inputs,Resultado\r\n";
  history.forEach(item => {
    const inputsStr = Object.entries(item.inputs).map(([k, v]) => `${k}: ${v}`).join('; ');
    const row = `"${item.type}","${item.date}","${inputsStr}","${item.results.replace(/"/g, '""')}"`;
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "historial_ventajabets.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.showToast('CSV descargado');
};

/* ==========================================================================
   CALCULATORS (HERRAMIENTAS) - UPDATED & EXPANDED
   ========================================================================== */

// 1. ¿CONVIENE O NO? (Valor Esperado - EV)
window.calculateConvenience = function() {
  const odds = parseNumber('ev-odds');
  const stake = parseNumber('ev-stake');
  const confidence = parseNumber('ev-confidence');
  const resultsBox = document.getElementById('ev-results');

  if (!resultsBox) return;

  if (!validateOdds(odds)) {
    window.showToast('Ingresa una cuota válida mayor a 1.01 (ej: 2.15)', 'error');
    return;
  }
  if (isNaN(stake) || stake <= 0) {
    window.showToast('Ingresa un monto de apuesta real (mayor a $0)', 'error');
    return;
  }
  if (isNaN(confidence) || confidence < 0 || confidence > 100) {
    window.showToast('La probabilidad debe estar entre 0% y 100%', 'error');
    return;
  }

  const p = confidence / 100;
  const evPercent = (odds * p - 1) * 100;
  const evMoney = stake * (odds * p - 1);
  const breakEven = (1 / odds) * 100;
  const implied = (1 / odds) * 100;
  const diff = confidence - implied;

  let verdict = '';
  let verdictClass = '';
  let explanation = '';

  if (evPercent > 5.0) {
    verdict = 'SÍ CONVIENE ✅';
    verdictClass = 'big-verdict-positive';
    explanation = `Esta jugada tiene valor matemático positivo. En promedio ganarías <strong>${formatCOP(evMoney)}</strong> por cada jugada de este tamaño.`;
  } else if (evPercent < -5.0) {
    verdict = 'NO CONVIENE ❌';
    verdictClass = 'big-verdict-negative';
    explanation = `Jugada con expectativa negativa. Estás regalando dinero al operador. Perderías en promedio <strong>${formatCOP(Math.abs(evMoney))}</strong> por jugada.`;
  } else {
    verdict = '⚠️ CASI';
    verdictClass = 'big-verdict-warning';
    explanation = `El valor esperado está muy al límite. Podrías ganar o perder una cifra muy leve en el largo plazo (expectativa cercana a cero).`;
  }

  resultsBox.innerHTML = `
    <div class="big-verdict-box ${verdictClass}">${verdict}</div>
    <p class="explanation-text">${explanation}</p>
    <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.4rem; border-top:1px solid var(--border-color); padding-top:0.8rem; margin-top:0.8rem;">
      <div style="display:flex; justify-content:space-between;">
        <span>Expectativa Retorno (%):</span>
        <strong style="color:${evPercent >= 0 ? 'var(--primary)' : 'var(--danger)'};">${formatPercent(evPercent)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Retorno Esperado ($):</span>
        <strong style="color:${evMoney >= 0 ? 'var(--primary)' : 'var(--danger)'};">${formatCOP(evMoney)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Para salir a mano necesitas ganar:</span>
        <strong>${formatPercent(breakEven)} de las veces</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Cuota implícita de la casa:</span>
        <strong>${formatPercent(implied)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Diferencia de ventaja:</span>
        <strong style="color:${diff >= 0 ? 'var(--primary)' : 'var(--danger)'};">${formatPercent(diff)}</strong>
      </div>
    </div>
    <p style="font-size:0.75rem; color:var(--text-muted); margin-top: 1rem; line-height: 1.3;">
      “Para no regalar la plata y salir a mano, necesitas ganar al menos ${getDigeribleFraction(breakEven)}. Tú dices que ganas ${getDigeribleFraction(confidence)}. Si tienes razón, ahí está tu ventaja.”
    </p>
  `;

  saveCalculation('Valor Esperado', { Cuota: odds, Apuesta: stake, Confianza: confidence + '%' }, verdict);
  window.showToast('Valor Esperado calculado');
};

// 2. ¿CUÁNTO ME TOCA APOSTAR? (Stake simple / Kelly Pro)
window.calculateStakeSize = function() {
  const capital = parseNumber('sz-capital');
  const resultsBox = document.getElementById('sz-results');
  
  // Detect if pro mode is active
  const proMode = document.getElementById('sz-pro-mode') && document.getElementById('sz-pro-mode').checked;

  if (!resultsBox) return;
  if (isNaN(capital) || capital <= 0) {
    window.showToast('Por favor, ingresa tu saldo total disponible.', 'error');
    return;
  }

  let pct = 0;
  let recommendedBet = 0;
  let summaryText = '';
  let warningBox = '';

  if (!proMode) {
    // Simple Mode
    const security = document.getElementById('sz-security').value;
    if (security === 'poco_seguro') pct = 0.01;
    else if (security === 'seguro') pct = 0.03;
    else if (security === 'muy_seguro') pct = 0.05;

    recommendedBet = Math.round(capital * pct);
    summaryText = `Jugando el modo estándar (${formatPercent(pct * 100)} del bankroll).`;
    warningBox = `<div class="big-verdict-box big-verdict-warning" style="font-size: 0.95rem; padding: 0.8rem; line-height: 1.4;">
      ⚠️ No excedas este tamaño de stake. El sobreapilamiento lleva a la quiebra en rachas negativas.
    </div>`;
  } else {
    // Kelly Pro Mode
    const odds = parseNumber('sz-odds');
    const confidence = parseNumber('sz-confidence');
    const kellyType = document.getElementById('sz-kelly-type').value;

    if (!validateOdds(odds)) {
      window.showToast('Ingresa una cuota válida en el Modo Pro (ej: 1.80)', 'error');
      return;
    }
    if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
      window.showToast('Ingresa tu confianza estimada (1% al 99%)', 'error');
      return;
    }

    const b = odds - 1;
    const p = confidence / 100;
    const q = 1 - p;
    const kellyFraction = (odds * p - 1) / (odds - 1);

    if (kellyFraction <= 0) {
      recommendedBet = 0;
      summaryText = `Criterio de Kelly indica expectativa negativa (0.0%).`;
      warningBox = `<div class="big-verdict-box big-verdict-negative" style="font-size: 0.95rem; padding: 0.8rem; line-height: 1.4;">
        ❌ NO METAS UN PESO. Con esa cuota y probabilidad vas a perder plata.
      </div>`;
    } else {
      let multiplier = 1.0;
      if (kellyType === 'medio') multiplier = 0.5;
      else if (kellyType === 'cuarto') multiplier = 0.25;
      else if (kellyType === 'conservador') {
        multiplier = 0.25;
      }

      let adjustedFraction = kellyFraction * multiplier;
      if (kellyType === 'conservador') {
        adjustedFraction = Math.min(adjustedFraction, 0.02);
      }

      pct = adjustedFraction;
      recommendedBet = Math.round(capital * pct);
      summaryText = `Cálculo por Kelly (${kellyType}) - Fracción recomendada: ${formatPercent(pct * 100)}.`;

      if (pct > 0.05) {
        warningBox = `<div class="big-verdict-box big-verdict-warning" style="font-size: 0.95rem; padding: 0.8rem; line-height: 1.4; border-color:var(--danger); color:var(--danger);">
          ⚠️ Ojo: esto supera el 5% de tu caja. Ya es una jugada pesada. Si te equivocas en tu confianza, te puede doler mucho.
        </div>`;
      } else {
        warningBox = `<div class="big-verdict-box big-verdict-positive" style="font-size: 0.95rem; padding: 0.8rem; line-height: 1.4;">
          ✅ Stake seguro y estructurado según Kelly.
        </div>`;
      }
    }
  }

  resultsBox.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.2rem;">
      <span class="stat-lbl" style="text-transform: uppercase;">Apuesta recomendada</span>
      <strong style="font-size: 2.4rem; color: var(--primary); font-family: var(--font-heading); display: block; margin: 0.4rem 0;">${formatCOP(recommendedBet)}</strong>
    </div>
    ${warningBox}
    <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.8rem;">
      ${summaryText}
    </p>
  `;

  saveCalculation('Gestión Stake', { Capital: formatCOP(capital), Modo: proMode ? 'Kelly Pro' : 'Simple' }, formatCOP(recommendedBet));
  window.showToast('Stake óptimo calculado');
};

// 3. APUESTA SEGURA (Surebet / Arbitraje)
window.calculateSurebet = function() {
  const outcomes = document.getElementById('arb-outcomes').value;
  const totalStake = parseNumber('arb-stake');
  const resultsBox = document.getElementById('arb-results');

  if (!resultsBox) return;

  if (isNaN(totalStake) || totalStake <= 0) {
    window.showToast('Ingresa un presupuesto total válido (mayor a $0)', 'error');
    return;
  }

  if (outcomes === '2') {
    const oddsA = parseNumber('arb-odds-a');
    const oddsB = parseNumber('arb-odds-b');

    if (!validateOdds(oddsA) || !validateOdds(oddsB)) {
      window.showToast('Ingresa cuotas válidas para los 2 resultados.', 'error');
      return;
    }

    const marginA = 1 / oddsA;
    const marginB = 1 / oddsB;
    const impliedSum = marginA + marginB;
    const isArb = impliedSum < 1.0;

    if (!isArb) {
      resultsBox.innerHTML = `
        <div class="big-verdict-box big-verdict-negative" style="font-size:1.1rem; padding:1rem;">
          No es apuesta segura ❌
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;">
          El margen total es ${formatPercent(impliedSum * 100)}. Para asegurar ganancia, la suma de las probabilidades inversas debe ser menor al 100%.
        </p>
      `;
      window.showToast('No es una apuesta segura.', 'warning');
      return;
    }

    const roi = (1 / impliedSum - 1) * 100;
    const stakeA = (totalStake * marginA) / impliedSum;
    const stakeB = (totalStake * marginB) / impliedSum;
    
    // Exact profit calculated to avoid rounding leaks
    const returnA = stakeA * oddsA;
    const returnB = stakeB * oddsB;
    const profit = Math.min(returnA, returnB) - totalStake;
    const finalRoi = (profit / totalStake) * 100;

    resultsBox.innerHTML = `
      <div class="big-verdict-box big-verdict-positive" style="font-size:1.1rem; padding:1rem;">
        ¡APUESTA SEGURA ENCONTRADA! 🎉
      </div>
      <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; margin-bottom: 1rem;">
        <div style="display:flex; justify-content:space-between;">
          <span>Apuesta Opción A (Cuota ${oddsA.toFixed(2)}):</span>
          <strong>${formatCOP(stakeA)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Apuesta Opción B (Cuota ${oddsB.toFixed(2)}):</span>
          <strong>${formatCOP(stakeB)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.4rem; margin-top:0.4rem;">
          <span>Ganancia Mínima Segura:</span>
          <strong style="color:var(--primary);">${formatCOP(profit)} (${formatPercent(finalRoi)})</strong>
        </div>
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted);">
        * Las cuotas cambian rápido. Si una casa mueve la cuota antes de que metas la segunda jugada, se daña el negocio.
      </p>
      ${totalStake < 20000 ? '<p style="color:var(--secondary); font-size:0.75rem;">Nota: Con montos muy pequeños, el redondeo puede comerse la ganancia.</p>' : ''}
    `;
    saveCalculation('Surebet 2R', { Total: formatCOP(totalStake), Cuotas: `${oddsA}/${oddsB}` }, `+${formatPercent(finalRoi)}`);
  } else {
    // 3 Outcomes (1X2 Football)
    const oddsL = parseNumber('arb-odds-l');
    const oddsE = parseNumber('arb-odds-e');
    const oddsV = parseNumber('arb-odds-v');

    if (!validateOdds(oddsL) || !validateOdds(oddsE) || !validateOdds(oddsV)) {
      window.showToast('Ingresa cuotas válidas para los 3 resultados.', 'error');
      return;
    }

    const marginL = 1 / oddsL;
    const marginE = 1 / oddsE;
    const marginV = 1 / oddsV;
    const impliedSum = marginL + marginE + marginV;
    const isArb = impliedSum < 1.0;

    if (!isArb) {
      resultsBox.innerHTML = `
        <div class="big-verdict-box big-verdict-negative" style="font-size:1.1rem; padding:1rem;">
          No es apuesta segura ❌
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem;">
          El margen total es ${formatPercent(impliedSum * 100)}. La suma de las probabilidades inversas debe ser menor al 100% para arbitraje.
        </p>
      `;
      window.showToast('No es una apuesta segura.', 'warning');
      return;
    }

    const stakeL = (totalStake * marginL) / impliedSum;
    const stakeE = (totalStake * marginE) / impliedSum;
    const stakeV = (totalStake * marginV) / impliedSum;
    
    const returnL = stakeL * oddsL;
    const returnE = stakeE * oddsE;
    const returnV = stakeV * oddsV;
    const profit = Math.min(returnL, returnE, returnV) - totalStake;
    const finalRoi = (profit / totalStake) * 100;

    resultsBox.innerHTML = `
      <div class="big-verdict-box big-verdict-positive" style="font-size:1.1rem; padding:1rem;">
        ¡APUESTA SEGURA ENCONTRADA (3R)! 🎉
      </div>
      <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; margin-bottom: 1rem;">
        <div style="display:flex; justify-content:space-between;">
          <span>Apuesta Local (Cuota ${oddsL.toFixed(2)}):</span>
          <strong>${formatCOP(stakeL)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Apuesta Empate (Cuota ${oddsE.toFixed(2)}):</span>
          <strong>${formatCOP(stakeE)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Apuesta Visitante (Cuota ${oddsV.toFixed(2)}):</span>
          <strong>${formatCOP(stakeV)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:0.4rem; margin-top:0.4rem;">
          <span>Ganancia Mínima Segura:</span>
          <strong style="color:var(--primary);">${formatCOP(profit)} (${formatPercent(finalRoi)})</strong>
        </div>
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted);">
        * Las cuotas cambian rápido. Si una casa mueve la cuota antes de que metas las tres jugadas, se daña el negocio.
      </p>
      ${totalStake < 20000 ? '<p style="color:var(--secondary); font-size:0.75rem;">Nota: Con montos muy pequeños, el redondeo puede comerse la ganancia.</p>' : ''}
    `;
    saveCalculation('Surebet 3R', { Total: formatCOP(totalStake), Cuotas: `${oddsL}/${oddsE}/${oddsV}` }, `+${formatPercent(finalRoi)}`);
  }

  window.showToast('Cálculo de arbitraje listo');
};

// 4. ¿EL BONO ES BUENO? (Rollover Avanzado)
window.calculateBonusRating = function() {
  const bonus = parseNumber('roll-bonus');
  const deposit = parseNumber('roll-deposit') || 0;
  const rollover = parseNumber('roll-rollover');
  const baseType = document.getElementById('roll-base').value;
  const houseEdge = parseFloat(document.getElementById('roll-edge').value);
  const contribution = parseFloat(document.getElementById('roll-contrib').value) / 100;
  const days = parseNumber('roll-days') || 30;

  const resultsBox = document.getElementById('roll-results');
  if (!resultsBox) return;

  if (isNaN(bonus) || bonus <= 0 || isNaN(rollover) || rollover < 0) {
    window.showToast('Por favor, ingresa los datos mínimos del bono.', 'error');
    return;
  }

  const base = baseType === 'solo_bono' ? bonus : (bonus + deposit);
  const rawVolume = base * rollover;
  const adjustedVolume = rawVolume / contribution;
  const estimatedLoss = adjustedVolume * houseEdge;
  const realBonusValue = bonus - estimatedLoss;
  const dailyRequiredVolume = adjustedVolume / days;

  let verdict = '';
  let verdictClass = '';
  let recommendation = '';

  if (realBonusValue > bonus * 0.30) {
    verdict = 'BONO JUGOSO ✅';
    verdictClass = 'big-verdict-positive';
    recommendation = `Este bono tiene valor real estimado de <strong>${formatCOP(realBonusValue)}</strong>. Las condiciones son bastante limpiables.`;
  } else if (realBonusValue >= 0) {
    verdict = 'BONO DURO ⚠️';
    verdictClass = 'big-verdict-warning';
    recommendation = `Valor real estimado de <strong>${formatCOP(realBonusValue)}</strong>. Vas a tener que sudarla para retirar algo de ganancias.`;
  } else {
    verdict = 'BONO TRAMPA ❌';
    verdictClass = 'big-verdict-negative';
    recommendation = `Expectativa neta de <strong>${formatCOP(realBonusValue)}</strong>. Es una trampa matemática para obligarte a perder tu capital depositado.`;
  }

  resultsBox.innerHTML = `
    <div class="big-verdict-box ${verdictClass}" style="font-size:1.15rem; padding:1.25rem;">
      ${verdict}
    </div>
    <p class="explanation-text" style="font-size:0.9rem; text-align:center;">${recommendation}</p>
    <div style="font-size:0.8rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:0.75rem; margin-top:0.75rem; display:flex; flex-direction:column; gap:0.4rem;">
      <div style="display:flex; justify-content:space-between;">
        <span>Volumen total a apostar:</span>
        <strong>${formatCOP(adjustedVolume)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Pérdida esperada matemática:</span>
        <strong style="color:var(--danger);">${formatCOP(estimatedLoss)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Volumen diario sugerido:</span>
        <strong>${formatCOP(dailyRequiredVolume)}/día (${days} días)</strong>
      </div>
    </div>
  `;

  saveCalculation('Rollover Bono', { Bono: formatCOP(bonus), Rollover: rollover }, verdict);
  window.showToast('Análisis de rollover finalizado');
};

/* ==========================================================================
   4 NEW CALCULATORS
   ========================================================================== */

// 5. Probabilidad Implícita
window.calculateImplicitProbability = function() {
  const odds = parseNumber('implied-odds');
  const resultsBox = document.getElementById('implied-results');

  if (!resultsBox) return;

  if (!validateOdds(odds)) {
    window.showToast('Ingresa una cuota decimal válida (mayor a 1.01).', 'error');
    return;
  }

  const probability = (1 / odds) * 100;
  const returnOn100k = 100000 * odds;

  resultsBox.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.2rem;">
      <span class="stat-lbl">Probabilidad Implícita</span>
      <strong style="font-size: 2.6rem; color: var(--primary); font-family: var(--font-heading); display: block; margin: 0.4rem 0;">${formatPercent(probability)}</strong>
    </div>
    <p class="explanation-text" style="font-size:0.9rem; text-align:center;">
      Si la cuota es <strong>${odds.toFixed(2)}</strong>, la casa dice que esto va a pasar aproximadamente <strong>${getDigeribleFraction(probability)}</strong>.
    </p>
    <div style="font-size:0.8rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem;">
      <span>Retorno bruto por cada $100.000 COP apostados:</span>
      <strong style="display:block; font-size:1.15rem; color:var(--primary); margin-top:0.25rem;">${formatCOP(returnOn100k)}</strong>
    </div>
  `;

  saveCalculation('Probabilidad Implícita', { Cuota: odds }, formatPercent(probability));
  window.showToast('Cálculo implícito listo');
};

// 6. Margen de la Casa (Overround)
window.calculateHouseMargin = function() {
  const outcomes = document.getElementById('margin-outcomes').value;
  const resultsBox = document.getElementById('margin-results');

  if (!resultsBox) return;

  let impliedSum = 0;

  if (outcomes === '2') {
    const oddsA = parseNumber('margin-odds-a');
    const oddsB = parseNumber('margin-odds-b');

    if (!validateOdds(oddsA) || !validateOdds(oddsB)) {
      window.showToast('Ingresa cuotas válidas.', 'error');
      return;
    }
    impliedSum = (1 / oddsA) + (1 / oddsB);
  } else {
    const oddsL = parseNumber('margin-odds-l');
    const oddsE = parseNumber('margin-odds-e');
    const oddsV = parseNumber('margin-odds-v');

    if (!validateOdds(oddsL) || !validateOdds(oddsE) || !validateOdds(oddsV)) {
      window.showToast('Ingresa cuotas válidas.', 'error');
      return;
    }
    impliedSum = (1 / oddsL) + (1 / oddsE) + (1 / oddsV);
  }

  const overround = (impliedSum - 1) * 100;
  let verdict = '';
  let verdictClass = '';

  if (overround < 3.0) {
    verdict = 'Cuotas finas ✅';
    verdictClass = 'big-verdict-positive';
  } else if (overround <= 7.0) {
    verdict = 'Margen normal ⚠️';
    verdictClass = 'big-verdict-warning';
  } else {
    verdict = 'La casa cobra duro ❌';
    verdictClass = 'big-verdict-negative';
  }

  resultsBox.innerHTML = `
    <div class="big-verdict-box ${verdictClass}" style="font-size:1.15rem; padding:1rem;">
      ${verdict} (Margen: ${formatPercent(overround)})
    </div>
    <p class="explanation-text" style="font-size:0.85rem; text-align:center;">
      La suma de probabilidades implícitas es <strong>${formatPercent(impliedSum * 100)}</strong>. El excedente sobre el 100% es la tajada oculta que el operador se queda.
    </p>
  `;

  saveCalculation('Margen Casa', { Resultados: outcomes + 'R' }, formatPercent(overround));
  window.showToast('Margen de casa calculado');
};

// 7. Combinada / Parley
let parleyOddsList = [2.00, 1.80];

window.addParleyOddInput = function() {
  if (parleyOddsList.length >= 10) {
    window.showToast('Máximo 10 cuotas para una combinada.', 'warning');
    return;
  }
  parleyOddsList.push(1.80);
  renderParleyList();
};

window.removeParleyOddInput = function(index) {
  if (parleyOddsList.length <= 2) {
    window.showToast('Necesitas al menos 2 cuotas para una combinada.', 'warning');
    return;
  }
  parleyOddsList.splice(index, 1);
  renderParleyList();
};

function renderParleyList() {
  const container = document.getElementById('parley-odds-container');
  if (!container) return;

  container.innerHTML = parleyOddsList.map((odd, idx) => `
    <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.5rem;">
      <span style="font-size:0.85rem; color:var(--text-secondary); width:80px;">Partido ${idx+1}:</span>
      <input type="number" step="0.01" value="${odd}" class="form-control parley-odd-input" data-index="${idx}" style="flex:1;" onchange="updateParleyOddValue(${idx}, this.value)">
      <button class="btn btn-secondary btn-sm" onclick="removeParleyOddInput(${idx})" style="border-color:var(--danger); color:var(--danger); padding:0.4rem 0.6rem;">✕</button>
    </div>
  `).join('');
}

window.updateParleyOddValue = function(index, value) {
  const val = parseFloat(value);
  if (!isNaN(val)) {
    parleyOddsList[index] = val;
  }
};

window.calculateParley = function() {
  const stake = parseNumber('parley-stake');
  const resultsBox = document.getElementById('parley-results');

  if (!resultsBox) return;

  if (isNaN(stake) || stake <= 0) {
    window.showToast('Ingresa un monto de apuesta válido.', 'error');
    return;
  }

  // Read inputs from DOM to ensure sync
  const inputs = document.querySelectorAll('.parley-odd-input');
  let totalOdds = 1.0;
  let valid = true;

  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!validateOdds(val)) {
      valid = false;
    } else {
      totalOdds *= val;
    }
  });

  if (!valid) {
    window.showToast('Una o más cuotas de la combinada son inválidas.', 'error');
    return;
  }

  const returnVal = stake * totalOdds;
  const netProfit = returnVal - stake;
  const impliedProb = (1 / totalOdds) * 100;

  resultsBox.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.2rem;">
      <span class="stat-lbl">Cuota Total Combinada</span>
      <strong style="font-size: 2.2rem; color: var(--secondary); font-family: var(--font-heading); display: block; margin: 0.4rem 0;">${totalOdds.toFixed(2)}</strong>
    </div>
    <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.4rem; border-top:1px solid var(--border-color); padding-top:0.6rem;">
      <div style="display:flex; justify-content:space-between;">
        <span>Retorno Bruto:</span>
        <strong style="color:var(--primary);">${formatCOP(returnVal)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Ganancia Neta:</span>
        <strong style="color:var(--primary);">${formatCOP(netProfit)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Chances reales de coronar:</span>
        <strong style="color:var(--danger);">${getDigeribleFraction(impliedProb)}</strong>
      </div>
    </div>
    <div class="big-verdict-box big-verdict-warning" style="font-size:0.85rem; padding:0.8rem; margin-top:1rem; line-height:1.4;">
      ⚠️ Entre más partidos metas, más bonita se ve la ganancia y más fácil te revientan el parley por un solo equipo. Tus chances de ganar son de apenas <strong>${getDigeribleFraction(impliedProb)}</strong>.
    </div>
  `;

  saveCalculation('Combinada Parley', { Partidos: inputs.length, Stake: formatCOP(stake) }, totalOdds.toFixed(2));
  window.showToast('Combinada calculada');
};

// Initialize parley if elements are present
setTimeout(() => {
  renderParleyList();
}, 200);

// 8. Conversor de Cuotas
window.convertOddsProb = function() {
  const valDecimal = parseNumber('conv-decimal');
  const valProb = parseNumber('conv-prob');
  const decimalOutput = document.getElementById('conv-decimal-result');
  const probOutput = document.getElementById('conv-prob-result');

  if (document.activeElement.id === 'conv-decimal') {
    if (!validateOdds(valDecimal)) {
      if (decimalOutput) decimalOutput.textContent = 'Ingrese cuota > 1.01';
      return;
    }
    const prob = (1 / valDecimal) * 100;
    if (decimalOutput) decimalOutput.textContent = `Equivale a: ${formatPercent(prob)} (aprox. ${getDigeribleFraction(prob)})`;
  } else if (document.activeElement.id === 'conv-prob') {
    if (isNaN(valProb) || valProb <= 0 || valProb >= 100) {
      if (probOutput) probOutput.textContent = 'Ingrese probabilidad entre 0.1% y 99.9%';
      return;
    }
    const decimal = 100 / valProb;
    if (probOutput) probOutput.textContent = `Cuota justa equivalente: ${decimal.toFixed(2)}`;
  }
};

/* ==========================================================================
   4 NEW SIMULATORS
   ========================================================================== */

// A. Simulador de Falacia del Apostador
window.runGamblersFallacy = function() {
  const prob = parseNumber('gf-prob') || 50;
  const trials = parseInt(document.getElementById('gf-trials').value) || 5;
  const resultsBox = document.getElementById('gf-results');

  if (!resultsBox) return;

  let seq = '';
  for (let i = 0; i < trials; i++) {
    seq += '❌ '; // All losses simulate the "bad streak"
  }

  resultsBox.innerHTML = `
    <h4 style="font-size:1rem; margin-bottom:0.6rem;">Simulación de Racha:</h4>
    <div style="background-color:rgba(11,15,25,0.4); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem; font-size:1.1rem; margin-bottom:1rem;">
      Racha previa: ${seq}
    </div>
    <div class="big-verdict-box big-verdict-warning" style="font-size:1.05rem; padding:1rem; line-height:1.4;">
      Chances de ganar el siguiente tiro: <strong>${getDigeribleFraction(prob)}</strong> (o sea, ${formatPercent(prob)})
    </div>
    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.8rem; line-height:1.4; text-align:center;">
      La moneda no tiene memoria. El siguiente partido no sabe que vienes perdiendo ${trials} veces seguidas. La probabilidad de ganar sigue siendo exactamente la misma.
    </p>
  `;
};

// B. Simulador Kelly vs Apuesta Fija (Monte Carlo)
window.runKellyVsFixed = function() {
  const capital = parseNumber('kvf-capital') || 100000;
  const odds = parseNumber('kvf-odds') || 2.00;
  const confidence = parseNumber('kvf-confidence') || 55;
  const fixedPct = parseNumber('kvf-fixed') || 5;
  const kellyType = document.getElementById('kvf-kelly-type').value;

  const resultsBox = document.getElementById('kvf-results');
  if (!resultsBox) return;

  if (!validateOdds(odds)) {
    window.showToast('Ingresa una cuota válida para el simulador.', 'error');
    return;
  }

  const p = confidence / 100;
  const b = odds - 1;
  const kellyFraction = (odds * p - 1) / (odds - 1);

  let kMultiplier = 1.0;
  if (kellyType === 'medio') kMultiplier = 0.5;
  else if (kellyType === 'cuarto') kMultiplier = 0.25;

  const adjustedKelly = Math.max(0, kellyFraction * kMultiplier);

  // Monte Carlo simulation: 200 paths, 50 trials
  const pathsCount = 200;
  const trialsCount = 50;

  let fixedRuin = 0;
  let kellyRuin = 0;
  let fixedFinalSum = 0;
  let kellyFinalSum = 0;

  for (let path = 0; path < pathsCount; path++) {
    let fixedCap = capital;
    let kellyCap = capital;

    for (let step = 0; step < trialsCount; step++) {
      const win = Math.random() < p;

      // Fixed step
      if (fixedCap > 0) {
        const stakeFixed = capital * (fixedPct / 100);
        const bet = Math.min(stakeFixed, fixedCap);
        if (win) fixedCap += bet * b;
        else fixedCap -= bet;
        if (fixedCap <= 1) fixedCap = 0;
      }

      // Kelly step
      if (kellyCap > 0) {
        const stakeKelly = kellyCap * adjustedKelly;
        const bet = Math.min(stakeKelly, kellyCap);
        if (win) kellyCap += bet * b;
        else kellyCap -= bet;
        if (kellyCap <= 1) kellyCap = 0;
      }
    }

    if (fixedCap === 0) fixedRuin++;
    if (kellyCap === 0) kellyRuin++;
    fixedFinalSum += fixedCap;
    kellyFinalSum += kellyCap;
  }

  const fixedRuinPct = (fixedRuin / pathsCount) * 100;
  const kellyRuinPct = (kellyRuin / pathsCount) * 100;
  const fixedAvg = fixedFinalSum / pathsCount;
  const kellyAvg = kellyFinalSum / pathsCount;

  resultsBox.innerHTML = `
    <h4 style="font-size:1rem; margin-bottom:0.75rem; border-bottom:1px solid var(--border-color); padding-bottom:0.4rem;">Simulaciones Monte Carlo (200 caminos, 50 jugadas):</h4>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.85rem;">
      <div style="background-color:rgba(11,15,25,0.4); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.8rem;">
        <strong style="color:var(--secondary); display:block; margin-bottom:0.35rem;">Apuesta Fija (${fixedPct}%)</strong>
        Caja final prom: <strong>${formatCOP(fixedAvg)}</strong><br>
        Riesgo de quedar limpio: <strong style="color:var(--danger);">${getDigeribleFraction(fixedRuinPct)}</strong>
      </div>
      <div style="background-color:rgba(11,15,25,0.4); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.8rem;">
        <strong style="color:var(--primary); display:block; margin-bottom:0.35rem;">Kelly Pro (${formatPercent(adjustedKelly*100)})</strong>
        Caja final prom: <strong>${formatCOP(kellyAvg)}</strong><br>
        Riesgo de quedar limpio: <strong style="color:${kellyRuinPct > 0 ? 'var(--danger)' : 'var(--primary)'};">${getDigeribleFraction(kellyRuinPct)}</strong>
      </div>
    </div>
    <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.8rem; text-align:center; line-height:1.3;">
      Apostar siempre el ${fixedPct}% de forma rígida te puede quebrar en cualquier mala racha. Kelly Pro se ajusta de acuerdo a tu saldo para proteger tu capital de juego.
    </p>
  `;
};

// C. Simulador de Rollover
window.runRolloverSimulation = function() {
  const bonus = parseNumber('sim-roll-bonus') || 100000;
  const rollover = parseNumber('sim-roll-rollover') || 10;
  const houseEdge = parseFloat(document.getElementById('sim-roll-edge').value) || 0.05;

  const resultsBox = document.getElementById('sim-roll-results');
  if (!resultsBox) return;

  const totalVolume = bonus * rollover;
  const betSize = bonus * 0.10; // bet sizes of 10% of bonus
  const steps = Math.ceil(totalVolume / betSize);

  // We simulate 200 paths of this rollover process
  const pathsCount = 200;
  let successCount = 0;
  let finalSum = 0;

  // Assuming average odds 1.80, implied win probability (accounting for edge):
  // 1 / 1.80 = 55.5% - (house edge effect) => ~52%
  const winProb = (1 - houseEdge) / 1.80;

  for (let path = 0; path < pathsCount; path++) {
    let balance = bonus;
    for (let step = 0; step < steps; step++) {
      if (balance <= 0) {
        balance = 0;
        break;
      }
      const bet = Math.min(betSize, balance);
      const win = Math.random() < winProb;
      if (win) {
        balance += bet * 0.80; // profit is bet * (odds - 1) i.e. bet * 0.80
      } else {
        balance -= bet;
      }
    }
    if (balance > 0) {
      successCount++;
      finalSum += balance;
    }
  }

  const successPct = (successCount / pathsCount) * 100;
  const avgFinal = successCount > 0 ? (finalSum / successCount) : 0;

  resultsBox.innerHTML = `
    <h4 style="font-size:1.05rem; margin-bottom:0.6rem;">Resultado de la Varianza en 200 carreras:</h4>
    <div class="big-verdict-box ${successPct > 20 ? 'big-verdict-warning' : 'big-verdict-negative'}" style="font-size:1.15rem; padding:1rem;">
      Chances de salvar algo de plata: <strong>${getDigeribleFraction(successPct)}</strong>
    </div>
    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.6rem; text-align:center;">
      De 200 apostadores simulados, solo <strong>${successCount}</strong> lograron salvar su saldo tras jugar un volumen total de ${formatCOP(totalVolume)}. El saldo promedio de los que se salvaron fue de <strong>${formatCOP(avgFinal)}</strong>.
    </p>
  `;
};

// D. Simulador de Favorito Peligroso
window.runDangerousFavorite = function() {
  const odds = parseNumber('df-odds') || 1.20;
  const confidence = parseNumber('df-confidence') || 80;
  const stake = parseNumber('df-stake') || 100000;

  const resultsBox = document.getElementById('df-results');
  if (!resultsBox) return;

  if (odds <= 1.01) {
    window.showToast('Ingresa una cuota de favorito real.', 'error');
    return;
  }

  const p = confidence / 100;
  const evPercent = (odds * p - 1) * 100;
  const winsNeeded = 1 / (odds - 1);

  resultsBox.innerHTML = `
    <div class="big-verdict-box ${evPercent > 0 ? 'big-verdict-warning' : 'big-verdict-negative'}" style="font-size:1.1rem; padding:1rem;">
      Expectativa: ${evPercent > 0 ? 'Con ventaja' : 'Perdiendo plata'}
    </div>
    <p class="explanation-text" style="font-size:0.85rem; text-align:center; margin-top:0.6rem;">
      Si juegas a esta cuota de <strong>${odds.toFixed(2)}</strong>, necesitas ganar <strong>${Math.ceil(winsNeeded)} partidos seguidos</strong> iguales solo para recuperar lo que pierdes cuando falles una sola vez. Con una sola caída te quedas limpio.
    </p>
    <div style="font-size:0.8rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; text-align:left;">
      Si fallas pierdes completo: <strong style="color:var(--danger);">${formatCOP(stake)}</strong><br>
      Si ganas te dan de ganancia neta: <strong style="color:var(--primary);">${formatCOP(stake * (odds - 1))}</strong>
    </div>
  `;
};

/* ==========================================================================
   FORM SUBMISSIONS (RECURSOS / CONTACTO)
   ========================================================================== */
window.handleAlertsForm = function(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector('input[type="email"]');
  const btn = e.target.querySelector('button');
  
  if (!emailInput || !emailInput.value) return;

  const originalText = btn.innerHTML;
  btn.innerHTML = 'Procesando...';
  btn.disabled = true;

  setTimeout(() => {
    window.showToast('✓ Solicitud de acceso enviada. Recibirás tu confirmación pronto.');
    btn.innerHTML = originalText;
    btn.disabled = false;
    emailInput.value = '';
  }, 1000);
};

window.handleGeneralContact = function(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value;
  const email = document.getElementById('c-email').value;
  const msg = document.getElementById('c-msg').value;

  if (!name || !email || !msg) {
    window.showToast('Llena todos los campos.', 'error');
    return;
  }

  const btn = e.target.querySelector('button');
  btn.innerHTML = 'Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    window.showToast('✓ Mensaje recibido. Te responderemos al correo.');
    btn.innerHTML = 'Enviar Mensaje';
    btn.disabled = false;
    e.target.reset();
  }, 1000);
};

/* ==========================================================================
   SISTEMA MULTI-PAÍS INTELIGENTE
   ========================================================================== */

// Configuración por defecto
const DEFAULT_COUNTRY = 'CO';

window.getUserCountry = function() {
  let country = localStorage.getItem('vb_country');
  
  // Si hay un query parameter ?country=XX, lo forzamos y lo guardamos
  const urlParams = new URLSearchParams(window.location.search);
  const qCountry = urlParams.get('country');
  if (qCountry && window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[qCountry.toUpperCase()]) {
    country = qCountry.toUpperCase();
    localStorage.setItem('vb_country', country);
  }
  
  return country || null;
};

window.setUserCountry = function(country) {
  if (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country.toUpperCase()]) {
    localStorage.setItem('vb_country', country.toUpperCase());
    // Recargar la página para aplicar los cambios en todo el sitio
    window.location.reload();
  }
};

window.initCountrySystem = function() {
  const currentCountry = window.getUserCountry();
  if (currentCountry) {
    window.renderCountryContent(currentCountry);
  } else {
    // Si no hay país definido, llamamos a la API de geolocalización
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        let countryCode = data.country_code ? data.country_code.toUpperCase() : DEFAULT_COUNTRY;
        // Validar si el país está soportado, de lo contrario usar DEFAULT
        if (window.COUNTRY_CONFIG && !window.COUNTRY_CONFIG[countryCode]) {
          countryCode = 'DEFAULT';
        }
        localStorage.setItem('vb_country', countryCode);
        window.renderCountryContent(countryCode);
      })
      .catch(err => {
        console.warn('Fallo en geolocalización de ipapi.co. Usando DEFAULT.');
        localStorage.setItem('vb_country', 'DEFAULT');
        window.renderCountryContent('DEFAULT');
      });
  }
};

window.renderCountryContent = function(country) {
  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  if (!config) return;

  // 1. Data binding simple en elementos HTML
  document.querySelectorAll('[data-bind]').forEach(el => {
    const key = el.getAttribute('data-bind');
    switch (key) {
      case 'country-league':
        el.textContent = config.league;
        break;
      case 'country-name':
        el.textContent = config.name;
        break;
      case 'country-flag':
        el.textContent = config.flag;
        break;
      case 'country-currency':
        el.textContent = config.currency;
        break;
      case 'country-currency-label':
        if (country === 'DEFAULT') {
          el.textContent = '($)';
        } else {
          el.textContent = `(${config.currency})`;
        }
        break;
      case 'country-payments':
        el.textContent = config.paymentMethods;
        break;
      case 'country-legal':
        el.textContent = config.legal;
        break;
      case 'country-warning':
        el.textContent = config.warning;
        break;
      case 'country-regulator-link':
        el.textContent = config.regulatorName || 'Regulación Local';
        el.setAttribute('href', config.regulatorUrl || '#');
        break;
      case 'country-example-match':
        el.textContent = config.examples.match;
        break;
      case 'country-example-odds':
        el.textContent = config.examples.odds.toFixed(2);
        break;
      case 'country-example-bookie':
        el.textContent = config.examples.bookie;
        break;
    }
  });

  // 2. Pre-cargar ejemplos locales en las calculadoras si existen
  const matchInput = document.getElementById('ev-match-name') || document.getElementById('df-match-name') || document.getElementById('mc-match-name');
  if (matchInput && config.examples.match) {
    matchInput.placeholder = `Ej: ${config.examples.match}`;
    if (matchInput.value === '' || matchInput.value.includes('vs')) {
      matchInput.value = config.examples.match;
    }
  }

  // 3. Renderizar el selector de país en el Header
  window.renderCountrySelector(country);

  // 4. Modificar dinámicamente SEO / Metadatos (Metatags de título y descripción)
  window.updateSEOAndMetadata(config);

  // 5. Filtrar partners locales si estamos en la página partners.html
  if (window.location.pathname.includes('partners.html')) {
    window.renderPartnerCards(country);
  }

  // 6. Inyectar dinámicamente partners de calculadoras si el contenedor existe
  if (document.getElementById('calculator-partners-container')) {
    window.renderCalculatorPartners(country);
  }

  // 7. Inyectar dinámicamente partners en la página principal si el contenedor existe
  if (document.getElementById('home-partners-container')) {
    window.renderHomePartners(country);
  }

  // 8. Inyectar dinámicamente partners en la página del método si el contenedor existe
  if (document.getElementById('method-partners-container')) {
    window.renderMethodPartners(country);
  }
};

window.renderCountrySelector = function(country) {
  // Buscar o insertar el contenedor del selector en el header
  const headerContainer = document.querySelector('.header-container');
  if (!headerContainer) return;
  
  let selectorWrapper = document.getElementById('country-selector-wrapper');
  if (!selectorWrapper) {
    selectorWrapper = document.createElement('div');
    selectorWrapper.id = 'country-selector-wrapper';
    selectorWrapper.style.cssText = 'position: relative; display: flex; align-items: center; margin-left: 0.5rem;';
    
    // Insertarlo antes de las acciones del header o al final del nav
    const actions = document.querySelector('.header-actions');
    if (actions) {
      actions.parentNode.insertBefore(selectorWrapper, actions);
    } else {
      headerContainer.appendChild(selectorWrapper);
    }
  }

  const currentConfig = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  
  // Renderizar desplegable de banderas
  selectorWrapper.innerHTML = `
    <button id="btn-country-select" style="font-size: 1.25rem; cursor: pointer; padding: 0.25rem 0.5rem; display: flex; align-items: center; gap: 0.25rem;" title="Cambiar País: ${currentConfig.name}">
      <span>${currentConfig.flag}</span>
      <span style="font-size: 0.75rem; color: var(--text-secondary);">▼</span>
    </button>
    <div id="country-dropdown-list" style="display: none; position: absolute; top: 100%; right: 0; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-md); z-index: 1200; width: 160px; padding: 0.5rem 0; margin-top: 0.5rem;">
      <a href="#" onclick="event.preventDefault(); window.setUserCountry('CO');" onmouseover="this.style.backgroundColor='var(--bg-card-hover)'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; font-size: 0.9rem; color: var(--text-primary); transition: var(--transition);">🇨🇴 Colombia</a>
      <a href="#" onclick="event.preventDefault(); window.setUserCountry('MX');" onmouseover="this.style.backgroundColor='var(--bg-card-hover)'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; font-size: 0.9rem; color: var(--text-primary); transition: var(--transition);">🇲🇽 México</a>
      <a href="#" onclick="event.preventDefault(); window.setUserCountry('ES');" onmouseover="this.style.backgroundColor='var(--bg-card-hover)'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; font-size: 0.9rem; color: var(--text-primary); transition: var(--transition);">🇪🇸 España</a>
      <a href="#" onclick="event.preventDefault(); window.setUserCountry('PE');" onmouseover="this.style.backgroundColor='var(--bg-card-hover)'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; font-size: 0.9rem; color: var(--text-primary); transition: var(--transition);">🇵🇪 Perú</a>
      <a href="#" onclick="event.preventDefault(); window.setUserCountry('DEFAULT');" onmouseover="this.style.backgroundColor='var(--bg-card-hover)'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; font-size: 0.9rem; color: var(--text-primary); transition: var(--transition);">🌐 Internacional</a>
    </div>
  `;

  // Toggle dropdown logic
  const btn = document.getElementById('btn-country-select');
  const dropdown = document.getElementById('country-dropdown-list');
  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  }
};

window.updateSEOAndMetadata = function(config) {
  // Actualizar Título
  const defaultTitle = document.title;
  if (defaultTitle && !defaultTitle.includes(config.league)) {
    if (defaultTitle.includes('|')) {
      const parts = defaultTitle.split('|');
      if (parts[0].includes('Apuestas')) {
        parts[0] = `Calculadora Apuestas ${config.league} `;
      }
      document.title = parts.join('|');
    }
  }

  // Actualizar Meta Descripción
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    let desc = metaDesc.getAttribute('content');
    if (desc) {
      desc = desc.replace(/Colombia/g, config.name);
      desc = desc.replace(/Liga BetPlay/g, config.league);
      metaDesc.setAttribute('content', desc);
    }
  }
};

window.renderPartnerCards = function(country) {
  const container = document.getElementById('partners-list-container');
  if (!container) return;

  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  
  if (!config || !config.partners || config.partners.length === 0) {
    container.innerHTML = `
      <div class="card card-glow-yellow" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <span style="font-size: 2.5rem;">⏳</span>
        <h4 style="margin-top: 1rem; font-size: 1.25rem;">Activando partners para ${config.name}</h4>
        <p style="color: var(--text-secondary); margin-top: 0.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">
          Todavía estamos negociando bonos exclusivos y licencias de afiliación para tu país. Mientras tanto, utiliza todas las calculadoras y simuladores de forma 100% gratuita para cuidar tu plata.
        </p>
      </div>
    `;
    return;
  }

  // Renderizar las tarjetas de partners activos para el país
  container.innerHTML = config.partners.map(partner => `
    <div class="card card-glow-green" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <h3 style="color: var(--primary); font-size: 1.3rem; margin-bottom: 0.5rem;">${partner.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Casa de apuestas recomendada con licencia autorizada en tu país. Regístrate usando nuestro enlace de partner para apoyar el mantenimiento de la suite gratuita y activar promociones especiales.
        </p>
      </div>
      <a href="${partner.url}" target="_blank" rel="sponsored nofollow noopener" class="btn btn-primary btn-block partner-affiliate-link" data-partner-name="${partner.name}" style="font-size: 0.9rem;">
        ${partner.label}
      </a>
    </div>
  `).join('');
};

window.renderCalculatorPartners = function(country) {
  const container = document.getElementById('calculator-partners-container');
  if (!container) return;

  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  if (!config || !config.partners || config.partners.length === 0) return;

  container.innerHTML = config.partners.map(partner => `
    <div class="card card-glow-green" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; text-align: left;">
      <div>
        <h4 style="color: var(--primary); font-size: 1.15rem; margin-bottom: 0.25rem;">${partner.name}</h4>
        <p style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 1rem;">
          Regístrate con nuestro enlace oficial y reclama tu bono: <strong>${partner.label.split('|')[0]}</strong>.
        </p>
      </div>
      <a href="${partner.url}" target="_blank" rel="sponsored nofollow noopener" class="btn btn-primary btn-block partner-affiliate-link" data-partner-name="${partner.name}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; text-align: center;">
        Regístrame en ${partner.name} y Probar
      </a>
    </div>
  `).join('');
};

window.renderHomePartners = function(country) {
  const container = document.getElementById('home-partners-container');
  if (!container) return;

  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  if (!config || !config.partners || config.partners.length === 0) return;

  container.innerHTML = config.partners.map(partner => `
    <div class="card card-glow-green" style="display: flex; flex-direction: column; justify-content: space-between; padding: 2rem;">
      <div>
        <h3 style="color: var(--primary); font-size: 1.4rem; margin-bottom: 0.5rem;">${partner.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Opera con licencia y garantía regulada. Regístrate mediante nuestro enlace especial de recomendación y reclama: <strong>${partner.label.split('|')[0]}</strong>.
        </p>
      </div>
      <a href="${partner.url}" target="_blank" rel="sponsored nofollow noopener" class="btn btn-primary btn-block partner-affiliate-link" data-partner-name="${partner.name}">
        Registrarme en ${partner.name}
      </a>
    </div>
  `).join('');
};

window.renderMethodPartners = function(country) {
  const container = document.getElementById('method-partners-container');
  if (!container) return;

  const config = (window.COUNTRY_CONFIG && window.COUNTRY_CONFIG[country]) ? window.COUNTRY_CONFIG[country] : window.COUNTRY_CONFIG['DEFAULT'];
  if (!config || !config.partners || config.partners.length === 0) return;

  container.innerHTML = config.partners.map(partner => `
    <div class="card card-glow-green" style="display: flex; flex-direction: column; justify-content: space-between; padding: 2rem;">
      <div>
        <h3 style="color: var(--primary); font-size: 1.4rem; margin-bottom: 0.5rem;">${partner.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
          Recomendado para aplicar el método de ventaja matemática. Abre tu cuenta hoy y activa tu bono exclusivo: <strong>${partner.label.split('|')[0]}</strong>.
        </p>
      </div>
      <a href="${partner.url}" target="_blank" rel="sponsored nofollow noopener" class="btn btn-primary btn-block partner-affiliate-link" data-partner-name="${partner.name}">
        Obtener Cuenta en ${partner.name}
      </a>
    </div>
  `).join('');
};

// Tracking automático de clics a enlaces patrocinados / afiliados en GA4
document.addEventListener('click', (e) => {
  const sponsoredLink = e.target.closest('a[rel*="sponsored"]') || e.target.closest('.partner-affiliate-link');
  if (sponsoredLink) {
    const partnerName = sponsoredLink.getAttribute('data-partner-name') || sponsoredLink.innerText || 'Unknown';
    const partnerUrl = sponsoredLink.getAttribute('href');
    
    // Enviar evento de conversión a GA4
    if (typeof gtag === 'function') {
      gtag('event', 'click_afiliado', {
        'event_category': 'Afiliados',
        'event_label': partnerName.trim(),
        'partner_url': partnerUrl
      });
    }
    console.log(`[Analytics] Tracked Affiliate Click: ${partnerName.trim()} -> ${partnerUrl}`);
  }
});

/* ==========================================================================
   BLOG HUB DYNAMIC COUNTRY & SEARCH FILTERS
   ========================================================================== */
window.initBlogFilters = function() {
  const categoryTabs = document.getElementById('category-tabs');
  const searchInput = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-card');
  const activeCountry = window.getUserCountry() || 'DEFAULT';

  if (blogCards.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const filterCards = () => {
    blogCards.forEach(card => {
      // 1. Country Target Filter
      const countryTarget = card.getAttribute('data-country-target');
      let countryMatches = true;
      if (countryTarget) {
        const allowedCountries = countryTarget.split(',').map(c => c.trim().toUpperCase());
        if (!allowedCountries.includes(activeCountry.toUpperCase())) {
          countryMatches = false;
        }
      }

      // 2. Category Tab Filter
      const cardCategory = card.getAttribute('data-category') || 'all';
      let categoryMatches = true;
      if (activeCategory !== 'all' && cardCategory !== activeCategory) {
        categoryMatches = false;
      }

      // 3. Search Query Filter
      let searchMatches = true;
      if (searchQuery) {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const paragraph = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
        const textToSearch = title + ' ' + paragraph;
        if (!textToSearch.includes(searchQuery.toLowerCase())) {
          searchMatches = false;
        }
      }

      // Set card visibility
      if (countryMatches && categoryMatches && searchMatches) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Add click listeners to category filter buttons
  if (categoryTabs) {
    const buttons = categoryTabs.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        filterCards();
      });
    });
  }

  // Add input listener to search field
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterCards();
    });
  }

  // Run the initial filter check
  filterCards();
};

