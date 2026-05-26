const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

export const api = {
  getTickets: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const url = `${API_URL}/tickets${query ? `?${query}` : ''}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },

  getStats: async () => {
    const res = await fetchWithTimeout(`${API_URL}/tickets/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  createTicket: async (data) => {
    const res = await fetchWithTimeout(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create ticket');
    return json;
  },

  updateTicketStatus: async (id, status) => {
    const res = await fetchWithTimeout(`${API_URL}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update ticket');
    return json;
  },

  deleteTicket: async (id) => {
    const res = await fetchWithTimeout(`${API_URL}/tickets/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete ticket');
    return res.json();
  }
};
