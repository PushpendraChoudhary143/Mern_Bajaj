import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import StatsStrip from './components/StatsStrip';
import Filters from './components/Filters';
import TicketForm from './components/TicketForm';
import Board from './components/Board';
import { LayoutDashboard } from 'lucide-react';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    priority: '',
    breached: false
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {};
      if (filters.priority) queryParams.priority = filters.priority;
      if (filters.breached) queryParams.breached = 'true';

      const [ticketsRes, statsRes] = await Promise.all([
        api.getTickets(queryParams),
        api.getStats()
      ]);

      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTicket = async (data) => {
    try {
      await api.createTicket(data);
      setIsFormOpen(false);
      fetchData(); // Refresh board and stats
    } catch (err) {
      throw err; // Let form handle the error display
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update could be added here, but for safety we fetch after
      await api.updateTicketStatus(id, newStatus);
      fetchData();
    } catch (err) {
      alert(`Error updating ticket: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await api.deleteTicket(id);
        fetchData();
      } catch (err) {
        alert(`Error deleting ticket: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-surface border-b border-border p-4 shrink-0 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <LayoutDashboard className="w-6 h-6" />
          <span>DeskFlow</span>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          + New Ticket
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <div className="px-6 py-4 shrink-0">
          <StatsStrip stats={stats} />
          
          <div className="mt-4 flex justify-between items-end">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Board Area */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          {loading && tickets.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Board 
              tickets={tickets} 
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Modal Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <TicketForm 
              onSubmit={handleCreateTicket} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
