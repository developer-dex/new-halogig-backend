import { Router } from 'express';
import logManagerController from './logManager.controller';
import validate from '../../middlewares/validate.middleware';
import logManagerValidation from './logManager.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.get('/logs', authMiddleware, logManagerController.getLogs);
router.get('/logs/statistics', authMiddleware, logManagerController.getLogStatistics);
router.get('/logs/critical', authMiddleware, logManagerController.getCriticalErrors);
router.get('/logs/unresolved', authMiddleware, logManagerController.getUnresolvedErrors);
router.get('/logs/user/:userId', authMiddleware, validate(logManagerValidation.userIdParam), logManagerController.getUserLogs);
router.get('/logs/endpoint/:endpoint', authMiddleware, logManagerController.getApiEndpointLogs);
router.patch('/logs/:id/resolve', authMiddleware, validate(logManagerValidation.idParam), logManagerController.markLogAsResolved);
router.delete('/logs/cleanup', authMiddleware, logManagerController.cleanupOldLogs);

export default router;
