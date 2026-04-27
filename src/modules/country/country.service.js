import { Country, Designation, Technology } from '../../models';

/**
 * Create a new country record.
 * @param {Object} data - Country fields (name, countries_isd_code, sortName)
 * @returns {Promise<Object>} Created country
 */
const createCountry = async (data) => {
  const country = await Country.create(data);
  return country;
};

/**
 * Fetch all countries.
 * @returns {Promise<Array>}
 */
const getAllCountries = async () => {
  const countries = await Country.findAll();
  return countries;
};

/**
 * Fetch all designations.
 * @returns {Promise<Array>}
 */
const getAllDesignations = async () => {
  const designations = await Designation.findAll();
  return designations;
};

/**
 * Fetch all technologies.
 * @returns {Promise<Array>}
 */
const getAllTechnologies = async () => {
  const technologies = await Technology.findAll();
  return technologies;
};

export default {
  createCountry,
  getAllCountries,
  getAllDesignations,
  getAllTechnologies,
};
