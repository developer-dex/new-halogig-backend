import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import bidService from './bid.service';
import platformNotificationService from '../../services/platformNotification.service';

const ok = (req, res, data, msgKey = 'SIGNUP') => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, msgKey) });
const bad = (req, res, msgKey = 'FALSE_RESPONSE') => res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });

const createProjectBid = asyncHandler(async (req, res) => {
  const result = await bidService.createProjectBid({ body: req.body, userId: req.user.id, files: req.files });
  if (result) {
    platformNotificationService.notifyClientNewProjectBid({ projectBid: result, freelancerUser: req.user, body: req.body });
  }
  return result ? ok(req, res, result) : bad(req, res);
});

const updateProjectBid = asyncHandler(async (req, res) => {
  const result = await bidService.updateProjectBid({ id: req.params.id, body: req.body });
  if (result) {
    platformNotificationService.notifyClientProjectBidUpdated({ bidId: req.params.id, freelancerUser: req.user, body: req.body, updateResult: result });
  }
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserBid = asyncHandler(async (req, res) => {
  const result = await bidService.getUserBids({ userId: req.user.id, query: req.query });
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserBidDetail = asyncHandler(async (req, res) => {
  const result = await bidService.getUserBidDetail(req.params.id);
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserDetailData = asyncHandler(async (req, res) => {
  const result = await bidService.getUserDetailData(req.params.id);
  return result ? ok(req, res, result) : bad(req, res);
});

const getClientBid = asyncHandler(async (req, res) => {
  const result = await bidService.getClientBids({ userId: req.user.id, query: req.query });
  return result ? ok(req, res, result) : bad(req, res);
});

const updateCandidateProfileStatus = asyncHandler(async (req, res) => {
  const result = await bidService.updateCandidateProfileStatus({
    candidateProfileId: req.params.id, status: req.body.status, userId: req.user.id,
  });
  return result ? ok(req, res, result) : bad(req, res);
});

const getFreelancerDeliveryProject = asyncHandler(async (req, res) => {
  const result = await bidService.getFreelancerDeliveryProject(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

const getClientDeliveryProject = asyncHandler(async (req, res) => {
  const result = await bidService.getClientDeliveryProject(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

const sendMilestoneToClient = asyncHandler(async (req, res) => {
  const result = await bidService.sendMilestoneToClient({ milestoneId: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});

const sendMilestoneToFreelancer = asyncHandler(async (req, res) => {
  const result = await bidService.sendMilestoneToFreelancer({ milestoneId: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});

export default {
  createProjectBid, updateProjectBid, getUserBid, getUserBidDetail, getUserDetailData,
  getClientBid, updateCandidateProfileStatus,
  getFreelancerDeliveryProject, getClientDeliveryProject,
  sendMilestoneToClient, sendMilestoneToFreelancer,
};
