import { HalogigTestimonial } from '../../models';

const getAllTestimonials = async () => {
  const testimonials = await HalogigTestimonial.findAll({ order: [['created_at', 'DESC']] });
  return testimonials.map((t) => t.toJSON());
};

export default { getAllTestimonials };
