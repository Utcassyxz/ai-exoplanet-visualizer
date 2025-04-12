function renderMetrics() {
  let html = '<table><tr><th>Model</th><th>F1 Score</th><th>ROC-AUC</th><th>Time</th></tr>';
  metricsData.forEach(d => {
    html += `<tr><td>${d.Model}</td><td>${d.F1}</td><td>${d.ROC}</td><td>${d.Time}</td></tr>`;
  });
  html += '</table>';
  document.getElementById('metrics-panel').innerHTML = html;
}

function renderDataTable() {
  const data = transit ? posMean : negMean;
  let html = '<table><tr><th>Time</th><th>Flux</th></tr>';
  data.forEach((v, i) => html += `<tr><td>${i}</td><td>${v.toFixed(4)}</td></tr>`);
  html += '</table>';
  document.getElementById('data-table').innerHTML = html;
}

// Show correct page content
const tabs = document.querySelectorAll('#tabs button');
tabs.forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(btn.dataset.page + '-page').classList.add('active');
  if (btn.dataset.page === 'data') renderDataTable();
  if (btn.dataset.page === 'metrics') renderMetrics();
}));
