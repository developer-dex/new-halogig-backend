import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import supportService from './support.service';

const createReportProblem = asyncHandler(async (req, res) => {
  const result = await supportService.createReportProblem({ body: req.body, userId: req.user.id });
  res.status(getHttpStatus('OK')).json({ success: true, data: result, message: getMessage(req, false, 'SIGNUP') });
});

export default { createReportProblem };
