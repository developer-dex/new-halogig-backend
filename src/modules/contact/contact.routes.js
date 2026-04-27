import { Router } from 'express';
import contactController from './contact.controller';
import validate from '../../middlewares/validate.middleware';
import contactValidation from './contact.validation';

const router = Router();

router.post(
  '/contact-us',
  validate(contactValidation.createContact),
  contactController.createContact,
);

export default router;
