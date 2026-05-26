const Ticket = require('../models/Ticket');

// Valid status transitions
const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'],      // forward + one step back
  resolved: ['closed', 'in_progress'],    // forward + one step back
  closed: [],                             // terminal
};

// SLA targets in minutes (same as model – kept here for stats)
const SLA_TARGETS = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

/**
 * Serialize a ticket document to include virtuals cleanly
 */
function serializeTicket(ticket) {
  const obj = ticket.toObject({ virtuals: true });
  // Remove mongoose internals
  delete obj.__v;
  delete obj.id; // duplicate of _id
  return obj;
}

// POST /tickets
async function createTicket(req, res) {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    const ticket = new Ticket({ subject, description, customerEmail, priority });
    await ticket.save();

    return res.status(201).json({
      success: true,
      data: serializeTicket(ticket),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: errors.join('; ') });
    }
    console.error('createTicket error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// GET /tickets
async function getTickets(req, res) {
  try {
    const { status, priority, breached } = req.query;
    const filter = {};

    // Validate and apply filters
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    const validPriorities = ['low', 'medium', 'high', 'urgent'];

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`,
        });
      }
      filter.status = status;
    }

    if (priority) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: `Invalid priority filter. Must be one of: ${validPriorities.join(', ')}`,
        });
      }
      filter.priority = priority;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    // Apply breached filter post-query (it's a computed virtual)
    let result = tickets.map(serializeTicket);

    if (breached === 'true') {
      result = result.filter((t) => t.slaBreached === true);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('getTickets error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// GET /tickets/stats
async function getStats(req, res) {
  try {
    const tickets = await Ticket.find();

    const statusCounts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    const priorityCounts = { low: 0, medium: 0, high: 0, urgent: 0 };
    let breachedCount = 0;

    for (const ticket of tickets) {
      statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1;
      priorityCounts[ticket.priority] = (priorityCounts[ticket.priority] || 0) + 1;

      // Count breached open tickets only
      if (
        (ticket.status === 'open' || ticket.status === 'in_progress') &&
        ticket.slaBreached
      ) {
        breachedCount++;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        byStatus: statusCounts,
        byPriority: priorityCounts,
        breachedOpenCount: breachedCount,
      },
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// PATCH /tickets/:id
async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ success: false, error: 'status field is required' });
    }

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    const currentStatus = ticket.status;

    if (currentStatus === newStatus) {
      return res.status(400).json({
        success: false,
        error: `Ticket is already in '${newStatus}' status`,
      });
    }

    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid transition: cannot move from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.length ? allowed.join(', ') : 'none (terminal state)'}`,
      });
    }

    // Handle resolvedAt logic
    if (newStatus === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (newStatus === 'in_progress' && currentStatus === 'resolved') {
      ticket.resolvedAt = null; // moved back from resolved → clear resolvedAt
    }

    ticket.status = newStatus;
    await ticket.save();

    return res.status(200).json({ success: true, data: serializeTicket(ticket) });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ticket ID' });
    }
    console.error('updateTicketStatus error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

// DELETE /tickets/:id
async function deleteTicket(req, res) {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ticket ID' });
    }
    console.error('deleteTicket error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

module.exports = {
  createTicket,
  getTickets,
  getStats,
  updateTicketStatus,
  deleteTicket,
};
