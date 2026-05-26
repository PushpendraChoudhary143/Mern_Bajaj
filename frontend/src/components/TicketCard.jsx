import React from 'react';
import { formatAge, PRIORITY_COLORS } from '../utils';
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: []
};

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

export default function TicketCard({ ticket, onUpdateStatus, onDelete }) {
  const allowedNext = VALID_TRANSITIONS[ticket.status] || [];

  return (
    <div className={`bg-surface p-4 rounded-xl border shadow-sm group hover:shadow-md transition-shadow relative ${ticket.slaBreached ? 'border-red-300 bg-red-50/10' : 'border-border'}`}>
      
      {/* Header: Priority & Age */}
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${PRIORITY_COLORS[ticket.priority]}`}>
          {ticket.priority}
        </span>
        
        <div className="flex items-center gap-2">
          {ticket.slaBreached && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" /> SLA
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-textMuted font-medium">
            <Clock className="w-3 h-3" />
            {formatAge(ticket.ageMinutes)}
          </span>
        </div>
      </div>

      {/* Body: Subject */}
      <h4 className="font-semibold text-textMain text-sm mb-1 line-clamp-2">
        {ticket.subject}
      </h4>
      <p className="text-xs text-textMuted mb-4 truncate">
        {ticket.customerEmail}
      </p>

      {/* Footer: Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
        <div className="flex gap-1.5">
          {allowedNext.map(nextStatus => {
            // Determine if it's a forward or backward move (heuristic based on array order)
            const isBackward = 
              (ticket.status === 'in_progress' && nextStatus === 'open') ||
              (ticket.status === 'resolved' && nextStatus === 'in_progress');
            
            return (
              <button
                key={nextStatus}
                onClick={() => onUpdateStatus(ticket.id, nextStatus)}
                className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded transition-colors
                  ${isBackward 
                    ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700' 
                    : 'text-primary hover:bg-blue-50'}`}
                title={`Move to ${STATUS_LABELS[nextStatus]}`}
              >
                {isBackward ? <ArrowLeft className="w-3 h-3" /> : null}
                {STATUS_LABELS[nextStatus]}
                {!isBackward ? <ArrowRight className="w-3 h-3" /> : null}
              </button>
            )
          })}
        </div>
        
        <button 
          onClick={() => onDelete(ticket.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100"
          title="Delete ticket"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
