import { SalesReferralLead, Industry } from '../../models';

const createSalesReferralLead = async ({ body, userId }) => {
  const payload = {
    user_id: userId, company_name: body.company_name, contact_person: body.contact_person,
    designation: body.designation, email_address: body.email_address, mobile_number: body.mobile_number,
    country: body.country, state: body.state, city: body.city, website_address: body.website_address,
    customer_industry_id: body.customer_industry_id || null, customer_industry: body.customer_industry || null,
    requirement_details: body.requirement_details, has_spoken_to_customer: !!body.has_spoken_to_customer,
    commission_type: body.commission_type || null, expected_commission_value: body.expected_commission_value || null,
    status: 'pending',
  };
  return SalesReferralLead.create(payload);
};

const getSalesReferralLeads = async (userId) => {
  const where = {};
  if (userId) where.user_id = userId;
  return SalesReferralLead.findAll({ where, order: [['created_at', 'DESC']] });
};

const getSalesReferralLeadDetail = async ({ id, userId }) => {
  const where = { id };
  if (userId) where.user_id = userId;
  return SalesReferralLead.findOne({
    where,
    include: [{ model: Industry, as: 'industry', required: false, attributes: ['id', 'industry'] }],
  });
};

export default { createSalesReferralLead, getSalesReferralLeads, getSalesReferralLeadDetail };
