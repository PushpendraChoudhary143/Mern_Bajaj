import React from 'react';
import { Filter } from 'lucide-react';

export default function Filters({ filters, setFilters }) {
  const handlePriorityChange = (e) => {
    setFilters(prev => ({ ...prev, priority: e.target.value }));
  };

  const handleBreachedChange = (e) => {
    setFilters(prev => ({ ...prev, breached: e.target.checked }));
  };

  return (
    <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-lg border border-border shadow-sm">
      <div className="flex items-center gap-2 text-textMuted font-medium text-sm">
        <Filter className="w-4 h-4" />
        Filters:
      </div>
      
      <select 
        value={filters.priority} 
        onChange={handlePriorityChange}
        className="text-sm border-none bg-slate-50 rounded px-2 py-1 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <div className="w-px h-4 bg-border"></div>

      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input 
          type="checkbox" 
          checked={filters.breached}
          onChange={handleBreachedChange}
          className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
        />
        <span className={`${filters.breached ? 'text-red-600 font-medium' : 'text-textMain'}`}>
          SLA Breached Only
        </span>
      </label>
    </div>
  );
}
