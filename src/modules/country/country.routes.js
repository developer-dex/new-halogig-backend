import { Router } from 'express';
import countryController from './country.controller';
import validate from '../../middlewares/validate.middleware';
import countryValidation from './country.validation';

const router = Router();

router.post(
  '/country',
  validate(countryValidation.createCountry),
  countryController.createCountry,
);

router.get(
  '/country',
  countryController.getAllCountry,
);

router.get(
  '/designation',
  countryController.getDesignation,
);

router.get(
  '/technology',
  countryController.getTechnology,
);

export default router;
