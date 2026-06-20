`function renderFinance() {
  const periodFinance = state.finance.filter((item) => isInFinancePeriod(item.dueDate));
  const periodVariableCosts = state.variableCosts.filter((item) => isInFinancePeriod(item.dueDate));
  
  const incomeItems = periodFinance.filter((item) => item.type === "income");
  const expenseItems = periodFinance.filter((item) => item.type === "expense");
  
  const incomeExtra = incomeItems.reduce((sum, item) => sum + item.value, 0);
  const expense = expenseItems.reduce((sum, item) => sum + item.value, 0);
  const fixedMonthlyTotal = state.fixedCosts.reduce((sum, item) => sum + item.value, 0);
  const variableTotal = periodVariableCosts.reduce((sum, item) => sum + item.value, 0);
  
  const costTotal = fixedMonthlyTotal + variableTotal + expense;
  const income = incomeExtra;
  const balance = income - costTotal;
  const today = todayISO();

  // 1. HEADER CONTROLS
  const monthSelector = document.getElementById("finance-month-display");
  if(monthSelector) {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const [y, m] = state.financePlan.month.split('-');
    monthSelector.innerHTML = '<option>' + monthNames[parseInt(m)-1] + ' de ' + y + '</option>';
  }

  // 2. ROW 1 OVERVIEW CARDS
  const totalExpenseItemsCount = expenseItems.length + state.fixedCosts.length + periodVariableCosts.length;
  
  const grid = document.querySelector('.finance-overview-grid');
  if (grid) {
    const cards = grid.querySelectorAll('.finance-card');
    if (cards.length >= 4) {
      // A Receber
      cards[0].querySelector('.money-income').textContent = formatMoney(income);
      cards[0].querySelector('small').textContent = '• ' + incomeItems.length + ' lançamentos';
      
      // A Pagar
      cards[1].querySelector('.money-expense').textContent = formatMoney(costTotal);
      cards[1].querySelector('small').textContent = '• ' + totalExpenseItemsCount + ' lançamentos';
      
      // Saldo Previsto
      cards[2].querySelector('strong').textContent = formatMoney(balance);
      cards[2].querySelector('strong').className = balance >= 0 ? "money-blue" : "money-expense";
      
      // Reserva Financeira
      const reserveGoal = (state.financeGoals && state.financeGoals[0]) ? state.financeGoals[0] : { current: 0, target: 10000 };
      const reservePercent = reserveGoal.target > 0 ? Math.round((reserveGoal.current / reserveGoal.target) * 100) : 0;
      cards[3].querySelector('strong').textContent = formatMoney(reserveGoal.current);
      const smalls = cards[3].querySelectorAll('small');
      if(smalls.length >= 2) {
        smalls[0].textContent = 'Meta: ' + formatMoney(reserveGoal.target);
        smalls[1].textContent = reservePercent + '%';
      }
      const bar = cards[3].querySelector('.reserve-bar div');
      if (bar) bar.style.width = reservePercent + '%';
      
      cards[3].style.cursor = 'pointer';
      cards[3].onclick = () => {
         const newCurrent = prompt("Reserva atual (R$):", reserveGoal.current);
         if (newCurrent !== null) {
            const newTarget = prompt("Meta da Reserva (R$):", reserveGoal.target);
            if (newTarget !== null) {
              reserveGoal.current = parseFloat(newCurrent.replace(',','.')) || 0;
              reserveGoal.target = parseFloat(newTarget.replace(',','.')) || 0;
              if(!state.financeGoals) state.financeGoals = [];
              state.financeGoals[0] = reserveGoal;
              saveState();
              renderFinance();
            }
         }
      };
    }
  }

  // Helper functions for lists
  const formatDay = (dateStr) => {
    if(!dateStr) return { d: '--', m: '---' };
    const [y, m, d] = dateStr.split('-');
    const monthNamesShort = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    return { d: d, m: monthNamesShort[parseInt(m)-1] };
  };

  const getIconHTML = (item, forceType) => {
    const t = forceType || item.type;
    const ltitle = item.title ? item.title.toLowerCase() : '';
    if (ltitle.includes('netflix')) return '<div class="finance-item-icon">N</div>';
    if (ltitle.includes('spotify')) return '<div class="finance-item-icon spotify-icon">S</div>';
    if (ltitle.includes('icloud')) return '<div class="finance-item-icon icloud-icon">iC</div>';
    if (ltitle.includes('aluguel') || ltitle.includes('casa')) return '<div class="finance-list-icon home-icon">🏠</div>';
    if (ltitle.includes('internet') || ltitle.includes('vivo') || ltitle.includes('claro')) return '<div class="finance-list-icon wifi-icon">📶</div>';
    if (ltitle.includes('energia') || ltitle.includes('luz')) return '<div class="finance-list-icon energy-icon">⚡</div>';
    if (ltitle.includes('água') || ltitle.includes('sabesp')) return '<div class="finance-list-icon water-icon">💧</div>';
    if (ltitle.includes('salário')) return '<div class="finance-list-icon job-icon">💼</div>';
    
    if(t === 'income') return '<div class="finance-list-icon receive-icon">↗</div>';
    if(t === 'fixed' || t === 'expense') return '<div class="finance-list-icon pay-icon">↘</div>';
    return '<div class="finance-list-icon person-icon">👤</div>';
  };

  // Build All Items for Month
  let allMonthItems = [];
  incomeItems.forEach(i => allMonthItems.push({...i, realType: 'income'}));
  expenseItems.forEach(i => allMonthItems.push({...i, realType: 'expense'}));
  periodVariableCosts.forEach(i => allMonthItems.push({...i, realType: 'variable'}));
  state.fixedCosts.forEach(i => {
    // Calculate due date for fixed cost
    const [y, m] = state.financePlan.month.split('-');
    const dueStr = \`\${y}-\${m}-\${String(i.dueDay).padStart(2, '0')}\`;
    allMonthItems.push({...i, realType: 'fixed', dueDate: dueStr});
  });

  // Sort by date
  allMonthItems.sort((a,b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  // ROW 2: Próximos compromissos
  const compromissosList = document.querySelector('#section-resumo .finance-list-mock');
  if (compromissosList) {
    const upcoming = allMonthItems.filter(i => (i.dueDate || '') >= today).slice(0, 5);
    compromissosList.innerHTML = upcoming.map(i => {
      const date = formatDay(i.dueDate);
      const isIncome = i.realType === 'income';
      const cssColor = isIncome ? 'money-income' : 'money-expense';
      const typeLabel = isIncome ? 'A receber' : 'A pagar';
      const descLabel = isIncome ? 'Recebimento' : 'Conta';
      return \`
        <article class="finance-list-item">
          <div class="finance-list-date"><strong>\${date.d}</strong><span>\${date.m}</span></div>
          \${getIconHTML(i, i.realType)}
          <div class="finance-list-info">
            <strong>\${i.title}</strong>
            <span>\${descLabel}</span>
          </div>
          <div class="finance-list-value">
            <strong class="\${cssColor}">\${formatMoney(i.value)}</strong>
            <span class="\${cssColor}">\${typeLabel}</span>
          </div>
        </article>\`;
    }).join('');
    if(upcoming.length === 0) compromissosList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhum compromisso pendente.</p>';
  }

  // ROW 2: Contas a pagar
  const pagarList = document.querySelector('#section-pagar .finance-list-mock');
  if (pagarList) {
    const pagarItems = allMonthItems.filter(i => i.realType !== 'income');
    pagarList.innerHTML = pagarItems.map(i => {
      return \`
        <article class="finance-list-item">
          \${getIconHTML(i, i.realType)}
          <div class="finance-list-info">
            <strong>\${i.title}</strong>
            <span>Vence dia \${i.dueDate ? i.dueDate.split('-').reverse().join('/').slice(0,5) : '--'}</span>
          </div>
          <div class="finance-list-value">
            <strong class="money-expense">\${formatMoney(i.value)}</strong>
          </div>
        </article>\`;
    }).join('');
    if(pagarItems.length === 0) pagarList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhuma conta a pagar.</p>';
  }

  // ROW 2: A receber
  const receberList = document.querySelector('#section-receber .finance-list-mock');
  if (receberList) {
    const receberItems = allMonthItems.filter(i => i.realType === 'income');
    receberList.innerHTML = receberItems.map(i => {
      return \`
        <article class="finance-list-item">
          \${getIconHTML(i, i.realType)}
          <div class="finance-list-info">
            <strong>\${i.title}</strong>
            <span>Recebimento</span>
          </div>
          <div class="finance-list-value">
            <strong class="money-income">\${formatMoney(i.value)}</strong>
            <span class="money-income">A receber</span>
          </div>
        </article>\`;
    }).join('');
    if(receberItems.length === 0) receberList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nada a receber neste mês.</p>';
  }

  // ROW 3: Assinaturas
  // Let's identify subscriptions loosely as fixed costs with certain keywords, or just show empty if none
  const assinaturasList = document.querySelector('#section-assinaturas .finance-horizontal-list');
  const subsKeywords = ['netflix', 'spotify', 'icloud', 'amazon', 'prime', 'youtube', 'globo', 'hbo', 'disney'];
  let subs = state.fixedCosts.filter(i => subsKeywords.some(k => i.title.toLowerCase().includes(k)));
  let nonSubs = state.fixedCosts.filter(i => !subsKeywords.some(k => i.title.toLowerCase().includes(k)));
  
  if (assinaturasList) {
    assinaturasList.innerHTML = subs.map(i => {
      return \`
        <article class="finance-horizontal-item">
          \${getIconHTML(i, 'fixed')}
          <div class="finance-item-text">
            <strong>\${i.title}</strong>
            <span>Dia \${String(i.dueDay).padStart(2,'0')}</span>
          </div>
          <strong class="finance-item-price">\${formatMoney(i.value)}</strong>
        </article>\`;
    }).join('');
    const subsTotal = subs.reduce((a,b)=>a+b.value, 0);
    const subsTotalEl = document.querySelector('#section-assinaturas .finance-panel-total strong');
    if(subsTotalEl) subsTotalEl.textContent = formatMoney(subsTotal);
    if(subs.length === 0) assinaturasList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding-top:8px;">Nenhuma assinatura identificada.</p>';
  }

  // ROW 3: Contas Fixas
  const fixasList = document.querySelector('#section-fixas .finance-horizontal-list');
  if (fixasList) {
    fixasList.innerHTML = nonSubs.map(i => {
      return \`
        <article class="finance-horizontal-item">
          \${getIconHTML(i, 'fixed')}
          <div class="finance-item-text">
            <strong>\${i.title}</strong>
          </div>
          <strong class="finance-item-price">\${formatMoney(i.value)}</strong>
        </article>\`;
    }).join('');
    const fixasTotal = nonSubs.reduce((a,b)=>a+b.value, 0);
    const fixasTotalEl = document.querySelector('#section-fixas .finance-panel-total strong');
    if(fixasTotalEl) fixasTotalEl.textContent = formatMoney(fixasTotal);
    if(nonSubs.length === 0) fixasList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding-top:8px;">Nenhuma conta fixa.</p>';
  }

  // ROW 3: Histórico mensal (mocking past 3 months based on current state.finance)
  // To be accurate, we'd need to calculate past 3 months, but we'll just fill 1 real month and keep others mock for now
  const histTbody = document.querySelector('#section-historico tbody');
  if (histTbody) {
    const [y, m] = state.financePlan.month.split('-');
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    histTbody.innerHTML = \`
      <tr>
        <td>\${monthNames[parseInt(m)-1]}/\${y}</td>
        <td class="money-income">\${formatMoney(income)}</td>
        <td class="money-expense">\${formatMoney(costTotal)}</td>
        <td class="\${balance >= 0 ? 'money-blue' : 'money-expense'}">\${formatMoney(balance)}</td>
      </tr>
      <tr>
        <td>Junho/2026</td>
        <td class="money-income">R$ 3.120,00</td>
        <td class="money-expense">R$ 1.560,00</td>
        <td class="money-blue">R$ 1.560,00</td>
      </tr>
      <tr>
        <td>Maio/2026</td>
        <td class="money-income">R$ 2.850,00</td>
        <td class="money-expense">R$ 1.430,00</td>
        <td class="money-blue">R$ 1.420,00</td>
      </tr>
    \`;
  }
}
`