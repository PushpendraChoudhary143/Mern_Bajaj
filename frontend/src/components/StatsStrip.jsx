import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Inbox, PlayCircle } from 'lucide-react';

export default function StatsStrip({ stats }) {
  if (!stats) return <div className="h-20 animate-pulse bg-slate-100 rounded-xl"></div>;

  const { byStatus, breachedOpenCount } = stats;
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  const items = [
    { label: 'Total', value: total, icon: Inbox, color: 'text-slate-600' },
    { label: 'Open', value: byStatus.open || 0, icon: Clock, color: 'text-blue-600' },
    { label: 'In Progress', value: byStatus.in_progress || 0, icon: PlayCircle, color: 'text-orange-600' },
    { label: 'Resolved', value: byStatus.resolved || 0, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Breached (Open)', value: breachedOpenCount || 0, icon: AlertCircle, color: 'text-red-600' },
  ];

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-4 flex flex-wrap gap-4 justify-between items-center">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-50 ${item.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-textMuted uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-bold text-textMain">{item.value}</p>
            </div>
            {idx < items.length - 1 && (
              <div className="hidden md:block w-px h-8 bg-border ml-4"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
