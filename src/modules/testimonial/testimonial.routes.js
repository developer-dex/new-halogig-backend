import { Router } from 'express';
import testimonialController from './testimonial.controller';

const router = Router();
router.get('/testimonials', testimonialController.getAllTestimonials);
export default router;
