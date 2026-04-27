import axios from 'axios';

const getPaypalBaseUrl = (mode) => (mode === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com');

const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET).');
  }

  const baseUrl = getPaypalBaseUrl(mode);
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post(
    `${baseUrl}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    },
  );

  return response.data.access_token;
};

const createCheckoutOrder = async ({
  amount, currency, returnUrl, cancelUrl, customId,
}) => {
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  const baseUrl = getPaypalBaseUrl(mode);
  const accessToken = await getAccessToken();

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Invalid amount for PayPal order.');
  }

  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: { currency_code: currency || 'USD', value: numericAmount.toFixed(2) },
      ...(customId ? { custom_id: customId } : {}),
    }],
    application_context: {
      ...(returnUrl ? { return_url: returnUrl } : {}),
      ...(cancelUrl ? { cancel_url: cancelUrl } : {}),
      brand_name: 'Halogig',
      user_action: 'PAY_NOW',
    },
  };

  const response = await axios.post(`${baseUrl}/v2/checkout/orders`, body, {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });

  const paypalOrder = response.data;
  const approvalLink = paypalOrder.links?.find((l) => l.rel === 'approve');
  return { id: paypalOrder.id, approvalUrl: approvalLink?.href };
};

const verifyWebhookSignature = async ({
  eventBody, transmissionId, transmissionTime, certUrl, authAlgo, transmissionSig, webhookId,
}) => {
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  const baseUrl = getPaypalBaseUrl(mode);
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: eventBody,
    },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
  );

  return response.data?.verification_status === 'SUCCESS';
};

export default { createCheckoutOrder, verifyWebhookSignature };
