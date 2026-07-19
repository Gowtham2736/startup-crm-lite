import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get all notifications for the logged-in user
 * GET /api/notifications
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50
    return successResponse(res, notifications, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }
    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    return successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
