import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly fetch notifications for a user, sorted by date
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
