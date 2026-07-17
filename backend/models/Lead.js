import mongoose from 'mongoose';

/**
 * Lead schema definition for MongoDB
 */
const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters'],
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid source',
      },
      default: 'Website',
    },
    value: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required'],
    },
    // Timestamps for lifecycle (Phase 10 aggregations)
    contactedAt: Date,
    meetingAt: Date,
    proposalAt: Date,
    wonAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for Lead Age (in days)
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes for fast lookups
leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ email: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export { leadSchema };
export default Lead;
