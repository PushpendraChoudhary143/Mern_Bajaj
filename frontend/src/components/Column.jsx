import React from 'react';
import TicketCard from './TicketCard';

export default function Column({ id, title, color, tickets, onUpdateStatus, onDelete }) {
  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px] bg-slate-50/50 rounded-xl border border-border overflow-hidden h-full">
      {/* Column Header */}
      <div className={`p-4 border-b border-border bg-surface flex justify-between items-center border-t-4 ${color}`}>
        <h3 className="font-bold text-textMain">{title}</h3>
        <div className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
          {tickets.length}
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
        {tickets.map(ticket => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}
        {tickets.length === 0 && (
          <div className="text-center text-textMuted text-sm mt-8 border-2 border-dashed border-border rounded-xl p-6">
            No tickets
          </div>
        )}
      </div>
    </div>
  );
}
