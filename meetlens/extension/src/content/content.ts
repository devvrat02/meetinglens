const isMeetPage = () => window.location.hostname === 'meet.google.com';

if (isMeetPage()) {
  const existing = document.getElementById('meetlens-extension-root');
  if (!existing) {
    const root = document.createElement('div');
    root.id = 'meetlens-extension-root';
    root.style.position = 'fixed';
    root.style.right = '16px';
    root.style.bottom = '16px';
    root.style.zIndex = '99999';
    root.style.width = '340px';
    root.style.maxHeight = '70vh';
    root.style.overflow = 'auto';
    root.style.borderRadius = '18px';
    root.style.background = '#0f172a';
    root.style.border = '1px solid rgba(148, 163, 184, 0.3)';
    root.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.3)';
    root.style.color = '#e2e8f0';
    root.style.fontFamily = 'Inter, system-ui, sans-serif';
    root.style.padding = '12px';
    root.innerHTML = `
      <div style="font-size: 12px; color: #a5b4fc; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">MeetLens</div>
      <div style="font-weight: 700; font-size: 18px; margin-bottom: 10px;">AI Meeting Translator</div>
      <div style="color: #34d399; font-size: 13px; margin-bottom: 10px;">● Listening</div>
      <div style="font-size: 12px; color: #94a3b8;">Google Meet integration is lightweight for MVP. Use Demo Mode or browser speech recognition.</div>
    `;
    document.body.appendChild(root);
  }
}
