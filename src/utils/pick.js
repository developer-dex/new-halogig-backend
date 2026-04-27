/**
 * Creates an object composed of the picked object properties.
 * @param {Object} object - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object}
 */
const pick = (object, keys) => keys.reduce((obj, key) => {
  if (object && Object.prototype.hasOwnProperty.call(object, key)) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = object[key];
  }
  return obj;
}, {});

export default pick;
