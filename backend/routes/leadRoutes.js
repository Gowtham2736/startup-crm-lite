import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  searchAutocomplete,
  getLeadStats,
  getMonthlyStats
} from '../controllers/leadController.js';

const router = express.Router();

// Apply authorization guard to all endpoints in this router
router.use(protect);

// Lead Input Validation Rules
const leadRules = [
  body('name').trim().notEmpty().withMessage('Lead name is required').isLength({ min: 2 }).withMessage('Lead name must be at least 2 characters'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
  body('phone').optional().trim(),
  body('status').optional().isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost']).withMessage('Invalid status value'),
  body('source').optional().isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other']).withMessage('Invalid source value'),
  body('value').optional().isNumeric().withMessage('Deal value must be a number'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
];

const statusPatchRules = [
  body('status').notEmpty().withMessage('Status is required').isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost']).withMessage('Invalid status value')
];

// Lead Analytics & Autocomplete Search (Must be declared before parameterized paths)
router.get('/search', searchAutocomplete);
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);

// Lead CRUD Endpoints
router.route('/')
  .get(getLeads)
  .post(validate(leadRules), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(leadRules), updateLead)
  .delete(deleteLead);

router.patch('/:id/status', validate(statusPatchRules), updateLeadStatus);

export default router;
