import { EmailCampaign, CampaignBatch } from '../../models';
import { calculatePagination } from '../../utils/pagination';

/**
 * Get all email campaigns with pagination.
 */
const getEmailCampaigns = async (query) => {
  try {
    const { page, limit } = query;
    const { offset, parsedLimit } = calculatePagination(page, limit);
    const { count, rows } = await EmailCampaign.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit: parsedLimit,
    });
    return { total: count, campaigns: rows, page: Number(page) || 1, limit: parsedLimit };
  } catch (error) {
    console.error('getEmailCampaigns error:', error);
    return { campaigns: [], total_count: 0 };
  }
};

/**
 * Get email campaign by ID.
 */
const getEmailCampaignById = async (id) => {
  const campaign = await EmailCampaign.findByPk(id);
  return campaign;
};

/**
 * Get campaign batches for a campaign.
 */
const getCampaignBatches = async (campaignId) => {
  const batches = await CampaignBatch.findAll({ where: { campaign_id: campaignId } });
  return batches;
};

export default {
  getEmailCampaigns,
  getEmailCampaignById,
  getCampaignBatches,
};
