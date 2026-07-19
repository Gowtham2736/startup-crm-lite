import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * Get all leads for the logged-in user with filters, search, and pagination
 * GET /api/leads
 */
export const getLeads = async (req, res, next) => {
  try {
    const { 
      status, 
      search, 
      source,
      dateFrom,
      dateTo,
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Filter initialized with owner isolation
    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { company: regex },
        { email: regex }
      ];
    }

    // Filter by date ranges if provided
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Run parallel count and search queries
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortOptions)
        .skip(skipNum)
        .limit(limitNum),
      Lead.countDocuments(filter)
    ]);

    if (process.env.NODE_ENV === 'development') {
      console.log(`Retrieved ${leads.length} leads for user: ${req.user._id}`);
    }

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lead
 * POST /api/leads
 */
export const createLead = async (req, res, next) => {
  try {
    const body = req.body;
    
    // Automatically set status lifecycle timestamps on creation
    const timeline = {};
    if (body.status === 'Contacted') timeline.contactedAt = new Date();
    if (body.status === 'Meeting Scheduled') timeline.meetingAt = new Date();
    if (body.status === 'Proposal Sent') timeline.proposalAt = new Date();
    if (body.status === 'Won') timeline.wonAt = new Date();

    const lead = await Lead.create({
      ...body,
      ...timeline,
      owner: req.user._id
    });

    await Notification.create({
      user: req.user._id,
      message: `New lead created: ${lead.name} from ${lead.company}`,
      type: 'info',
      relatedLead: lead._id
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single lead by ID
 * GET /api/leads/:id
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }
    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update one lead completely
 * PUT /api/leads/:id
 */
export const updateLead = async (req, res, next) => {
  try {
    const body = req.body;
    
    // Prevent changing the owner via PUT
    delete body.owner;

    // Track status changes and set timestamps
    const existingLead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!existingLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    if (body.status && body.status !== existingLead.status) {
      if (body.status === 'Contacted' && !existingLead.contactedAt) body.contactedAt = new Date();
      if (body.status === 'Meeting Scheduled' && !existingLead.meetingAt) body.meetingAt = new Date();
      if (body.status === 'Proposal Sent' && !existingLead.proposalAt) body.proposalAt = new Date();
      if (body.status === 'Won' && existingLead.status !== 'Won') {
        body.wonAt = body.wonAt || new Date();
        await Notification.create({
          user: req.user._id,
          message: `Deal Won! You closed ${existingLead.name} (${existingLead.company})`,
          type: 'success',
          relatedLead: existingLead._id
        });
      }
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: body },
      { new: true, runValidators: true }
    );

    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update lead status only
 * PATCH /api/leads/:id/status
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status value', 400);
    }

    const updateFields = { status };
    if (status === 'Contacted') updateFields.contactedAt = new Date();
    if (status === 'Meeting Scheduled') updateFields.meetingAt = new Date();
    if (status === 'Proposal Sent') updateFields.proposalAt = new Date();
    if (status === 'Won') {
      updateFields.wonAt = new Date();
      await Notification.create({
        user: req.user._id,
        message: `Deal Won! You just closed a deal via status update.`,
        type: 'success'
      });
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a lead permanently
 * DELETE /api/leads/:id
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();
    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Autocomplete quick search endpoint
 * GET /api/leads/search
 */
export const searchAutocomplete = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) {
      return successResponse(res, [], 'Search query empty');
    }

    const regex = new RegExp(q, 'i');
    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: regex },
        { company: regex }
      ]
    })
    .select('_id name company email status')
    .limit(parseInt(limit, 10));

    return successResponse(res, leads, 'Search autocomplete completed');
  } catch (error) {
    next(error);
  }
};

/**
 * Single aggregation pipeline for the Dashboard summary stats
 * GET /api/leads/stats/summary
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    // Run parallel aggregation pipelines
    const [stats] = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lostLeads: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
          pipelineValue: { 
            $sum: { 
              $cond: [
                { $and: [{ $ne: ['$status', 'Won'] }, { $ne: ['$status', 'Lost'] }] },
                '$value', 
                0
              ] 
            } 
          },
          wonRevenue: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0] } },
          totalSalesCycleTime: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$status', 'Won'] }, { $ifNull: ['$wonAt', false] }, { $ifNull: ['$createdAt', false] }] },
                { $subtract: ['$wonAt', '$createdAt'] },
                0
              ]
            }
          }
        }
      }
    ]);

    // Format status distribution
    const statusCounts = await Lead.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusBreakdown = { New: 0, Contacted: 0, Meeting: 0, Proposal: 0, Won: 0, Lost: 0 };
    statusCounts.forEach(s => {
      let key = s._id;
      if (key === 'Meeting Scheduled') key = 'Meeting';
      if (key === 'Proposal Sent') key = 'Proposal';
      if (statusBreakdown[key] !== undefined) {
        statusBreakdown[key] = s.count;
      }
    });

    // Format source distribution
    const sourceCounts = await Lead.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sourceBreakdown = {};
    sourceCounts.forEach(s => {
      sourceBreakdown[s._id || 'Other'] = s.count;
    });

    // Calculate this month vs last month lead creation for growth rates
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [monthlyCreation] = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          thisMonthCount: { $sum: { $cond: [{ $gte: ['$createdAt', startOfThisMonth] }, 1, 0] } },
          lastMonthCount: { 
            $sum: { 
              $cond: [
                { $and: [{ $gte: ['$createdAt', startOfLastMonth] }, { $lt: ['$createdAt', startOfThisMonth] }] },
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);

    const total = stats ? stats.totalLeads : 0;
    const won = stats ? stats.wonLeads : 0;
    const lost = stats ? stats.lostLeads : 0;
    const totalSalesCycle = stats ? stats.totalSalesCycleTime : 0;
    
    // Average Sales Cycle length in Days
    const avgSalesCycle = won > 0 ? Math.round(totalSalesCycle / (won * 1000 * 60 * 60 * 24)) : 0;

    const conversionRate = total > 0 ? parseFloat(((won / total) * 100).toFixed(1)) : 0;
    const lostRate = total > 0 ? parseFloat(((lost / total) * 100).toFixed(1)) : 0;

    const thisMonth = monthlyCreation ? monthlyCreation.thisMonthCount : 0;
    const lastMonth = monthlyCreation ? monthlyCreation.lastMonthCount : 0;
    const growthRate = lastMonth > 0 ? parseFloat((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)) : 0;

    const statsObj = {
      totalLeads: total,
      wonLeads: won,
      lostLeads: lost,
      pipelineValue: stats ? stats.pipelineValue : 0,
      wonRevenue: stats ? stats.wonRevenue : 0,
      avgSalesCycle,
      conversionRate,
      lostRate,
      statusBreakdown,
      sourceBreakdown,
      thisMonthLeads: thisMonth,
      lastMonthLeads: lastMonth,
      growthRate
    };

    return successResponse(res, statsObj, 'Summary metrics aggregated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly aggregated stats for Recharts bar & line charts
 * GET /api/leads/stats/monthly
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    // Group leads by year and month
    const monthlyData = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          total: 1,
          won: 1,
          lost: 1,
          conversionRate: {
            $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$won', '$total'] }, 100] }, 0]
          }
        }
      }
    ]);

    // Handle missing months dynamically to cover the last 6 months chronologically
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mIdx = d.getMonth() + 1;
      const yr = d.getFullYear();

      const match = monthlyData.find(item => item.month === mIdx && item.year === yr);
      
      result.push({
        month: `${months[d.getMonth()]} ${yr}`,
        total: match ? match.total : 0,
        won: match ? match.won : 0,
        lost: match ? match.lost : 0,
        conversionRate: match ? parseFloat(match.conversionRate.toFixed(1)) : 0
      });
    }

    return successResponse(res, result, 'Monthly stats aggregated successfully');
  } catch (error) {
    next(error);
  }
};
