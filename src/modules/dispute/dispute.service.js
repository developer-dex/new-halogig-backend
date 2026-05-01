import { Op } from 'sequelize';
import {
  Dispute, ProjectBid, ProjectBidMilestone, ClientProject,
} from '../../models';

const createDispute = async ({ body, userId }) => {
  if (!body.projectId || !body.projectBidId) throw new Error('Missing required fields: projectId and projectBidId');

  const bidDetails = await ProjectBid.findOne({ where: { id: body.projectBidId } });
  if (!bidDetails) {
    const err = new Error('Project bid not found');
    err.status = 400;
    throw err;
  }
  const disputeData = {
    dispute_by: userId,
    dispute_for: body.generatedBy === 'freelancer' ? bidDetails.client_id : bidDetails.from_user_id,
    projectId: body.projectId, project_bid_id: body.projectBidId,
    raised_on: new Date(), status: 'pending', message: body.message, type: body.type,
  };

  await ProjectBid.update({ is_dispute: true }, { where: { id: body.projectBidId } });
  return Dispute.create(disputeData);
};

const getOngoingProjects = async ({ userId, generatedBy }) => {
  let where = {};
  if (generatedBy === 'freelancer') where = { from_user_id: userId };
  else if (generatedBy === 'client') where = { client_id: userId };
  else where = { [Op.or]: [{ client_id: userId }, { from_user_id: userId }] };

  const milestones = await ProjectBidMilestone.findAll({
    where: { status: 'ongoing' },
    include: [{
      model: ProjectBid, as: 'projectBid', required: true, where,
      attributes: ['id', 'project_id'],
      include: [{ model: ClientProject, required: true, attributes: ['id', 'project_title'] }],
    }],
    attributes: ['id', 'amount'],
  });

  return milestones.map((m) => {
    const d = m.toJSON();
    return {
      project_id: d.projectBid?.project_id, project_bid_id: d.projectBid?.id,
      milestone_id: d.id, amount: d.amount, project_title: d.projectBid?.ClientProject?.project_title,
    };
  });
};

const getDisputes = async (userId) => {
  const disputes = await Dispute.findAll({
    where: { dispute_by: userId }, attributes: ['id', 'uuid', 'status', 'message', 'raised_on'],
    include: [{
      model: ProjectBid, attributes: ['id'],
      include: [
        { model: ClientProject, attributes: ['id', 'project_title'] },
        { model: ProjectBidMilestone, as: 'milestones', where: { status: 'ongoing' }, required: false, attributes: ['id', 'amount', 'status'] },
      ],
    }],
  });

  return disputes.map((d) => {
    const data = d.toJSON();
    return {
      project_title: data.ProjectBid?.ClientProject?.project_title,
      dispute_uuid: data.uuid, project_bid_milestone_amount: data.ProjectBid?.milestones?.[0]?.amount || null,
      dispute_status: data.status, dispute_message: data.message, dispute_raised_on: data.raised_on,
    };
  });
};

export default { createDispute, getOngoingProjects, getDisputes };
