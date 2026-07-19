import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../controllers/notificationController.js';

const router = express.Router();

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
