import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import testimonialService from './testimonial.service';

const getAllTestimonials = asyncHandler(async (req, res) => {
  const result = await testimonialService.getAllTestimonials();
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: 'Testimonials retrieved successfully' });
});

export default { getAllTestimonials };
