import { Router } from 'express';
import bidController from './bid.controller';
import validate from '../../middlewares/validate.middleware';
import bidValidation from './bid.validation';
import authMiddleware from '../../middlewares/auth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

router.post('/freelancer/bids', authMiddleware, fileUpload.uploadCustomerResume, validate(bidValidation.createProjectBid), bidController.createProjectBid);
router.put('/bids/:id/update', authMiddleware, validate(bidValidation.updateProjectBid), bidController.updateProjectBid);
router.get('/freelancer/bids', authMiddleware, validate(bidValidation.getUserBid), bidController.getUserBid);
router.get('/freelancer/bids/:id', authMiddleware, validate(bidValidation.idParam), bidController.getUserBidDetail);
router.get('/bid/:id', authMiddleware, validate(bidValidation.idParam), bidController.getUserDetailData);
router.get('/client/my-project', authMiddleware, validate(bidValidation.getClientBid), bidController.getClientBid);
router.patch('/candidate-profile/:id/status', authMiddleware, validate(bidValidation.updateCandidateProfileStatus), bidController.updateCandidateProfileStatus);
router.get('/freelancer/delivery-project', authMiddleware, bidController.getFreelancerDeliveryProject);
router.get('/client/delivery-project', authMiddleware, bidController.getClientDeliveryProject);
router.put('/freelancer/milestone/:id/send-to-client', authMiddleware, validate(bidValidation.sendMilestone), bidController.sendMilestoneToClient);
router.put('/client/milestone/:id/send-to-freelancer', authMiddleware, validate(bidValidation.sendMilestone), bidController.sendMilestoneToFreelancer);

export default router;
