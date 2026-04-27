import { Feedback, User } from '../../models';

const createFeedback = async ({ body, userId }) => {
  const data = { ...body, client_id: userId };
  return Feedback.create(data);
};

const getFreelancerFeedback = async (freelancerId) => {
  const feedbacks = await Feedback.findAll({
    where: { freelancer_id: freelancerId },
    attributes: ['id', 'ratings', 'comment', 'createdAt'],
    include: [{ model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'], required: true }],
    order: [['createdAt', 'DESC']],
  });

  return feedbacks.map((f) => {
    const d = f.toJSON();
    return {
      id: d.id, ratings: d.ratings, comment: d.comment,
      client_name: d.client ? `${d.client.first_name || ''} ${d.client.last_name || ''}`.trim() : '',
      client_email: d.client?.email || '', created_at: d.createdAt,
    };
  });
};

export default { createFeedback, getFreelancerFeedback };
