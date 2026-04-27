import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import countryService from './country.service';

/**
 * POST /api/country
 * Create a new country.
 */
const createCountry = asyncHandler(async (req, res) => {
  const result = await countryService.createCountry(req.body);

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true,
      data: result,
      message: getMessage(req, false, 'SIGNUP'),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false,
    data: null,
  });
});

/**
 * GET /api/country
 * Get all countries.
 */
const getAllCountry = asyncHandler(async (req, res) => {
  const result = await countryService.getAllCountries();

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
  });
});

/**
 * GET /api/designation
 * Get all designations.
 */
const getDesignation = asyncHandler(async (req, res) => {
  const result = await countryService.getAllDesignations();

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
  });
});

/**
 * GET /api/technology
 * Get all technologies.
 */
const getTechnology = asyncHandler(async (req, res) => {
  const result = await countryService.getAllTechnologies();

  if (result) {
    return res.status(getHttpStatus('OK')).json({
      success: true,
      data: result,
      message: getMessage(req, false, 'SIGNUP'),
    });
  }

  return res.status(getHttpStatus('BAD_REQUEST')).json({
    success: false,
    data: null,
  });
});

export default {
  createCountry,
  getAllCountry,
  getDesignation,
  getTechnology,
};
