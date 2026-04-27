import axios from 'axios';
import env from '../../config/env';

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in INR (not paise)
 * @returns {Promise<Object>} Razorpay order object
 */
const createRazorpayOrder = async (amount) => {
  const apiUrl = 'https://api.razorpay.com/v1/orders';
  const authHeader = {
    Authorization: `Basic ${Buffer.from(`${env.razorpay.apiKey}:${process.env.razorpayApiSecret}`).toString('base64')}`,
  };

  const data = {
    amount: amount * 100,
    currency: 'INR',
    receipt: 'receipt#1',
    notes: { key1: 'value3', key2: 'value2' },
  };

  const response = await axios.post(apiUrl, data, { headers: authHeader });
  return response.data;
};

/**
 * Get Razorpay order details by orderId.
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
const getRazorpayOrderDetails = async (orderId) => {
  const apiUrl = `https://api.razorpay.com/v1/orders/${orderId}`;
  const authHeader = {
    Authorization: `Basic ${Buffer.from(`${env.razorpay.apiKey}:${process.env.razorpayApiSecret}`).toString('base64')}`,
  };

  const response = await axios.get(apiUrl, { headers: authHeader });
  return response.data;
};

export default {
  createRazorpayOrder,
  getRazorpayOrderDetails,
};
