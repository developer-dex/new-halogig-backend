import { Router } from 'express';
import projectController from './project.controller';
import validate from '../../middlewares/validate.middleware';
import projectValidation from './project.validation';
import authMiddleware, { optionalAuthMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/client-project', authMiddleware, validate(projectValidation.createClientProject), projectController.createClientProject);
router.get('/client-project', authMiddleware, projectController.getUserClientProject);
router.patch('/user/client-project/publish', validate(projectValidation.publishClientProject), projectController.updatePublishClientProject);
router.get('/client-project/:id/details', validate(projectValidation.idParam), projectController.getUserClientprojectDetailsbyId);
router.put('/client-project/:id/details', authMiddleware, validate(projectValidation.idParam), projectController.updateUserClientprojectDetailsbyId);
router.put('/client-project/:id/status', authMiddleware, validate(projectValidation.updateClientProjectStatus), projectController.updateUserClientprojectStatusbyId);
router.get('/client-project/:id', authMiddleware, validate(projectValidation.idParam), projectController.getUserClientProjectDetail);
router.get('/client-projects', optionalAuthMiddleware, validate(projectValidation.getClientProjectsListing), projectController.getClientProjectsListing);
router.get('/saved-project', authMiddleware, projectController.getSavedProject);
router.post('/saved-project', authMiddleware, validate(projectValidation.savedProject), projectController.savedProject);
router.get('/project-details-count', authMiddleware, projectController.getProjectDetailsCount);

export default router;
