import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import industryService from './industry.service';

/**
 * POST /api/industry
 */
const createIndustry = asyncHandler(async (req, res) => {
  const result = await industryService.createIndustry(req.body);

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true,
      data: result,
      message: getMessage(req, false, ''),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false,
    data: null,
    message: getMessage(req, false, 'Industry Already Exist'),
  });
});

/**
 * GET /api/industry
 */
const getIndustry = asyncHandler(async (req, res) => {
  const result = await industryService.getAllIndustries();

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true,
      data: result,
      message: getMessage(req, false, ''),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false,
    data: null,
    message: getMessage(req, false, 'Industry Already Exist'),
  });
});

/**
 * GET /api/customerIndustry
 */
const getCustomerIndustries = asyncHandler(async (req, res) => {
  const result = await industryService.getCustomerIndustries();

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true,
      data: result,
      message: getMessage(req, false, ''),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false,
    data: null,
    message: getMessage(req, false, 'Industry Already Exist'),
  });
});

export default {
  createIndustry,
  getIndustry,
  getCustomerIndustries,
};
