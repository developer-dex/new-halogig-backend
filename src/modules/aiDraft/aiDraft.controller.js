import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import aiDraftService from './aiDraft.service';

const getDraftCampaignNames = asyncHandler(async (req, res) => {
  const result = await aiDraftService.getDraftCampaignNames();
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

const startFollowup = asyncHandler(async (req, res) => {
  const result = await aiDraftService.startFollowup(req.body);
  return res.status(getHttpStatus('OK')).json({ success: true, data: result, message: '' });
});

export default {
  getDraftCampaignNames,
  startFollowup,
};
