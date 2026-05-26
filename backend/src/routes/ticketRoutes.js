const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getStats,
  updateTicketStatus,
  deleteTicket,
} = require('../controllers/ticketController');

// IMPORTANT: /stats must come before /:id to avoid Express treating "stats" as an id param
router.get('/stats', getStats);

router.post('/', createTicket);
router.get('/', getTickets);
router.patch('/:id', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;
