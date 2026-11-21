(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  menuButton?.addEventListener('click', () => document.querySelector('.mobile-nav')?.classList.toggle('open'));

  const language = document.querySelector('#language');
  const translate = document.querySelector('[data-translate]');
  translate?.addEventListener('click', async () => {
    const code = language?.value || 'all';
    if (code === 'en') return;
    let copied = false;
    try { await navigator.clipboard.writeText(location.href); copied = true; } catch {
      const input = document.createElement('textarea');
      input.value = location.href;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed'; input.style.opacity = '0';
      document.body.appendChild(input); input.select(); copied = document.execCommand('copy'); input.remove();
    }
    const query = code === 'all' ? '?op=websites' : `?sl=en&tl=${encodeURIComponent(code)}&op=websites`;
    window.open(`https://translate.google.com/${query}`, '_blank', 'noopener,noreferrer');
    const status = document.querySelector('[data-translate-status]');
    if (status) status.textContent = copied ? 'Page link copied. Paste it in Google Translate, then choose your language.' : 'Copy this page address into Google Translate and choose your language.';
  });

  const calculator = document.querySelector('[data-rate-calculator]');
  if (calculator) {
    const inputs = [...calculator.querySelectorAll('input')];
    const result = calculator.querySelector('[data-rate-result]');
    const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const update = () => {
      const [goal, expenses, hours, share, visit, variable] = inputs.map(input => Number(input.value));
      const hoursPerMonth = hours * 52 / 12 * share / 100;
      const visits = hoursPerMonth / visit;
      if (![goal, expenses, hours, share, visit, variable].every(Number.isFinite) || goal < 0 || expenses < 0 || variable < 0 || hours <= 0 || share <= 0 || share > 100 || visit <= 0) {
        result.textContent = 'Enter positive work hours, billable share, and visit length.';
        return;
      }
      result.textContent = `${format.format((goal + expenses) / visits + variable)} per average visit`;
    };
    inputs.forEach(input => input.addEventListener('input', update));
    update();
  }
})();
