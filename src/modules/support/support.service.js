import { ReportProblem } from '../../models';

const createReportProblem = async ({ body, userId }) => {
  if (!body.first_name || !body.last_name || !body.mobile_number || !body.email || !body.message) {
    throw new Error('Missing required fields');
  }
  return ReportProblem.create({
    user_id: userId, first_name: body.first_name, last_name: body.last_name,
    mobile_number: body.mobile_number, email: body.email,
    company_name: body.company_name || null, message: body.message,
  });
};

export default { createReportProblem };
