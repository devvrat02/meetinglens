type StatusIndicatorProps = {
  status: 'Listening' | 'Processing' | 'AI Ready' | 'AI Offline';
};

const statusMap = {
  Listening: { label: '● Listening', className: 'status listening' },
  Processing: { label: '● Processing', className: 'status processing' },
  'AI Ready': { label: '● AI Ready', className: 'status ready' },
  'AI Offline': { label: '⚠ AI Offline', className: 'status offline' }
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const current = statusMap[status];
  return <div className={current.className} aria-label={status}>{current.label}</div>;
}
