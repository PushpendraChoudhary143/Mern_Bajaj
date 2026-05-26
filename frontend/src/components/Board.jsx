import React from 'react';
import Column from './Column';

export default function Board({ tickets, onUpdateStatus, onDelete }) {
  const columns = [
    { id: 'open', title: 'Open', color: 'border-blue-500' },
    { id: 'in_progress', title: 'In Progress', color: 'border-orange-500' },
    { id: 'resolved', title: 'Resolved', color: 'border-green-500' },
    { id: 'closed', title: 'Closed', color: 'border-slate-500' }
  ];

  return (
    <div className="h-full flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
      {columns.map(col => {
        const colTickets = tickets.filter(t => t.status === col.id);
        
        return (
          <Column 
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tickets={colTickets}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
