import fs from 'fs';
import path from 'path';
import {
  ClientBillingDetails, User, ProjectBid, Payment, ClientProject,
} from '../../models';

const addBillingDetails = async ({ body, userId }) => {
  const data = { ...body, user_id: userId };
  const existing = await ClientBillingDetails.findOne({ where: { user_id: userId } });
  if (existing) return ClientBillingDetails.update(data, { where: { user_id: userId } });
  return ClientBillingDetails.create(data);
};

const addGstDetails = async ({ body, files, userId }) => {
  const data = { ...body, user_id: userId };
  if (files && files.length > 0) data.gst_exemted_file = files[0].filename;
  const existing = await ClientBillingDetails.findOne({ where: { user_id: userId } });
  if (existing) return ClientBillingDetails.update(data, { where: { user_id: userId } });
  return ClientBillingDetails.create(data);
};

const updateBillingDetails = async ({ body, file }) => {
  if (file?.gst_exemted_file) {
    const oldPath = path.join(process.cwd(), '..', 'public', file.gst_exemted_file);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    body.gst_exemted_file = `/gstImages/${file.filename}`;
  }
  return ClientBillingDetails.update(body, { where: { id: body.id } });
};

const getBillingInformation = async (userId) => {
  const result = await ClientBillingDetails.findOne({ where: { user_id: userId } });
  if (result?.gst_exemted_file) result.gst_exemted_file = process.env.BACKEND_BASE_URL + result.gst_exemted_file;
  return result;
};

const getClientCountyCityState = async (userId) => User.findOne({
  where: { id: userId }, attributes: ['country', 'state', 'city'],
});

const updateGstDetails = async ({ bidId, body, files, userId }) => {
  const updateData = {};
  if (files?.length > 0) updateData.gst_image_path = files[0].filename;
  if (body.gstNote !== undefined) updateData.gst_note = body.gstNote;
  if (body.isGstApplied !== undefined) updateData.is_gst_applied = body.isGstApplied;
  if (body.gst_number) await User.update({ gst_number: body.gst_number }, { where: { id: userId } });
  const [count] = await ProjectBid.update(updateData, { where: { id: bidId } });
  return count > 0;
};

const createPayment = async (body) => Payment.create({
  date_of_transaction: new Date(), project_id: body.project_id,
  freelancer_id: body.freelancer_id, amount: body.amount, status: 'withdrawn',
});

const changePaymentStatus = async (body) => {
  const update = { status: body.status };
  if (body.invoice_number) update.invoice_number = body.invoice_number;
  if (body.tax_type) update.tax_type = body.tax_type;
  if (body.tax_amount) update.tax_amount = body.tax_amount;
  return Payment.update(update, { where: { id: body.id } });
};

const getFreelancerPaymentDashboard = async (freelancerId) => {
  const result = await Payment.findAll({ where: { freelancer_id: freelancerId } });
  const collected = Number(result.reduce((acc, c) => acc + (Number(c.amount) || 0), 0));
  const commission = Number((collected * 0.2).toFixed(2));
  return {
    collected_amount: collected, halogig_commission: commission,
    amount_available_for_withdrawal: Number((collected - commission).toFixed(2)),
    total_payments: result.length,
  };
};

const getFreelancerPaymentList = async ({ freelancerId, query }) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Payment.findAndCountAll({
    where: { freelancer_id: freelancerId },
    include: [{ model: ClientProject, as: 'project', attributes: ['project_title', 'created_by_admin'] }],
    order: [['date_of_transaction', 'DESC']], limit, offset,
  });

  const data = rows.map((p) => {
    const amount = Number(p.amount) || 0;
    const isAdmin = p.project?.created_by_admin === true;
    const comm = isAdmin ? null : Number((amount * 0.2).toFixed(2));
    return {
      id: p.id, payment_uuid: p.uuid, date_of_transaction: p.date_of_transaction,
      project_name: p.project?.project_title || '', amount, commission: comm,
      final_amount: isAdmin ? amount : Number((amount - comm).toFixed(2)),
      status: p.status, invoice_number: p.invoice_number, tax_type: p.tax_type, tax_amount: p.tax_amount,
    };
  });

  return { data, pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
};

export default {
  addBillingDetails, addGstDetails, updateBillingDetails, getBillingInformation,
  getClientCountyCityState, updateGstDetails, createPayment, changePaymentStatus,
  getFreelancerPaymentDashboard, getFreelancerPaymentList,
};
