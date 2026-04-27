import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import emailCampaignService from './emailCampaign.service';

const getEmailCampaigns = asyncHandler(async (req, res) => {
  const result = await emailCampaignService.getEmailCampaigns(req.query);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  getEmailCampaigns,
};
