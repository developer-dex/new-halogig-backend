import { Industry, CustomerIndustries } from '../../models';

/**
 * Create a new industry.
 * @param {Object} data - Industry fields (industry, status)
 * @returns {Promise<Object>} Created industry
 */
const createIndustry = async (data) => {
  const industry = await Industry.create(data);
  return industry;
};

/**
 * Fetch all industries.
 * @returns {Promise<Array>}
 */
const getAllIndustries = async () => {
  const industries = await Industry.findAll();
  return industries;
};

/**
 * Fetch all customer industries.
 * @returns {Promise<Array>}
 */
const getCustomerIndustries = async () => {
  if (!CustomerIndustries) {
    throw new Error('CustomerIndustries model not available');
  }
  const industries = await CustomerIndustries.findAll();
  return industries;
};

export default {
  createIndustry,
  getAllIndustries,
  getCustomerIndustries,
};
