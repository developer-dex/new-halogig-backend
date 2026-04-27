import { Router } from 'express';
import sowController from './sow.controller';
import validate from '../../middlewares/validate.middleware';
import sowValidation from './sow.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.post('/sow', authMiddleware, validate(sowValidation.createSow), sowController.createSow);
router.put('/sow/:id/update', authMiddleware, validate(sowValidation.updateSow), sowController.updateSow);
router.get('/sow/:id', authMiddleware, validate(sowValidation.idParam), sowController.getSowDetail);
router.get('/sow', authMiddleware, sowController.getAllSow);
router.get('/user/sow', authMiddleware, sowController.getAllUserSow);
router.delete('/sow/:id', authMiddleware, validate(sowValidation.idParam), sowController.deleteSow);

export default router;
