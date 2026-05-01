import {
  Sow, SowInput, ProjectBid, ProjectBidMilestone, ClientProject,
} from '../../models';
import { UserStatus } from '../../constants/enums';

/**
 * Create or update a SOW with optional milestones.
 */
const createSow = async ({ body, userId }) => {
  const data = { ...body, user_id: userId };

  if (data.id) {
    // Update existing SOW
    const sowId = data.id;
    delete data.id;

    const existing = await Sow.findByPk(sowId);
    if (!existing) throw new Error('SOW not found');

    data.status = UserStatus.INCOMPLETE;
    await existing.update(data);

    // Update milestones if provided
    if (data.milestones && Array.isArray(data.milestones)) {
      await ProjectBidMilestone.destroy({ where: { project_bid_id: data.project_leads_id } });
      await Promise.all(data.milestones.map((m) => ProjectBidMilestone.create({
        project_bid_id: data.project_leads_id,
        hours: m.hours, scope: m.scope, amount: m.amount, is_paid: false,
      })));
    }

    return existing;
  }

  // Create new SOW
  const sow = await Sow.create(data);

  if (data.milestones && Array.isArray(data.milestones)) {
    await Promise.all(data.milestones.map((m) => ProjectBidMilestone.create({
      project_bid_id: data.project_leads_id,
      hours: m.hours, scope: m.scope, amount: m.amount, is_paid: false,
    })));
  }

  return sow;
};

/**
 * Update SOW fields.
 */
const updateSow = async ({ id, body }) => Sow.update(body, { where: { id } });

/**
 * Get SOW detail with inputs and milestones.
 * Only returns the SOW if it belongs to the requesting user.
 */
const getSowDetail = async (projectLeadsId, userId) => Sow.findOne({
  where: { project_leads_id: projectLeadsId, user_id: userId },
  include: [
    { model: SowInput, required: false },
    {
      model: ProjectBid, required: false, as: 'bidder',
      include: [{ model: ProjectBidMilestone, required: false, as: 'milestones' }],
    },
  ],
});

/**
 * Get all SOWs with related data.
 */
const getAllSow = async () => Sow.findAll({
  include: [
    { model: ProjectBid, required: false },
    { model: ClientProject, required: false },
    { model: SowInput, required: false },
  ],
});

/**
 * Get all SOWs for a specific user.
 */
const getAllUserSow = async (userId) => Sow.findAll({ where: { user_id: userId } });

/**
 * Delete a SOW.
 * Only the SOW owner can delete it — returns null if not found, throws 403 if not owner.
 */
const deleteSow = async (id, userId) => {
  const sow = await Sow.findOne({ where: { id } });
  if (!sow) return null;
  if (sow.user_id !== userId) {
    const err = new Error('Access denied');
    err.status = 403;
    throw err;
  }
  return Sow.destroy({ where: { id, user_id: userId } });
};

export default {
  createSow, updateSow, getSowDetail, getAllSow, getAllUserSow, deleteSow,
};
