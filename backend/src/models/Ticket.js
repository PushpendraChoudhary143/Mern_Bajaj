const mongoose = require('mongoose');
const validator = require('validator');

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Invalid email address',
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent',
      },
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed',
      },
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// SLA targets in minutes
const SLA_TARGETS = {
  urgent: 60,       // 1 hour
  high: 240,        // 4 hours
  medium: 1440,     // 24 hours
  low: 4320,        // 72 hours
};

// Virtual: ageMinutes
ticketSchema.virtual('ageMinutes').get(function () {
  const end = this.resolvedAt ? new Date(this.resolvedAt) : new Date();
  const start = new Date(this.createdAt);
  return Math.floor((end - start) / 60000);
});

// Virtual: slaBreached
ticketSchema.virtual('slaBreached').get(function () {
  const target = SLA_TARGETS[this.priority];
  if (!target) return false;

  // If still open/in_progress: check if current time exceeds SLA
  if (this.status === 'open' || this.status === 'in_progress') {
    const minutesSinceCreated = Math.floor(
      (new Date() - new Date(this.createdAt)) / 60000
    );
    return minutesSinceCreated > target;
  }

  // If resolved or closed: check if resolvedAt exceeded SLA target
  if (this.resolvedAt) {
    const minutesToResolution = Math.floor(
      (new Date(this.resolvedAt) - new Date(this.createdAt)) / 60000
    );
    return minutesToResolution > target;
  }

  return false;
});

module.exports = mongoose.model('Ticket', ticketSchema);
