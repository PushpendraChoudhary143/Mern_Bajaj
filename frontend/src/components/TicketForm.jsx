import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TicketForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-textMain">Create New Ticket</h2>
        <button onClick={onCancel} className="text-textMuted hover:text-textMain transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMain mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            required
            minLength={3}
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Brief summary of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textMain mb-1">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            required
            value={formData.customerEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textMain mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
          >
            <option value="low">Low (72h SLA)</option>
            <option value="medium">Medium (24h SLA)</option>
            <option value="high">High (4h SLA)</option>
            <option value="urgent">Urgent (1h SLA)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-textMain mb-1">Description</label>
          <textarea
            name="description"
            required
            minLength={10}
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none custom-scrollbar"
            placeholder="Detailed description of the problem..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-textMain bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primaryHover rounded-md transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
