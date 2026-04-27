import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import adminService from './admin.service';
import platformNotificationService from '../../services/platformNotification.service';

const ok = (res, data, message = '') => res.status(getHttpStatus('OK')).json({ success: true, data, message });
const notFound = (res, msg = 'Not found') => res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: msg });
const created = (res, data, message = 'Created') => res.status(getHttpStatus('CREATED')).json({ success: true, data, message });

// ---- User Management ----
const getAllUsers = asyncHandler(async (req, res) => ok(res, await adminService.getAllUsers(req.query)));
const getClients = asyncHandler(async (req, res) => ok(res, await adminService.getClients(req.query)));
const updateUserStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateUserStatus(req.params.id, req.body.status);
  return result ? ok(res, result, 'Status updated') : notFound(res);
});
const getFreelancers = asyncHandler(async (req, res) => ok(res, await adminService.getFreelancers(req.query)));
const getReferralPartners = asyncHandler(async (req, res) => ok(res, await adminService.getReferralPartners(req.query)));

// ---- Sales Referral Leads ----
const getSalesReferralLeads = asyncHandler(async (req, res) => ok(res, await adminService.getSalesReferralLeads(req.query)));
const getSalesReferralLeadById = asyncHandler(async (req, res) => {
  const result = await adminService.getSalesReferralLeadById(req.params.id);
  return result ? ok(res, result) : notFound(res);
});
const updateSalesReferralLeadStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateSalesReferralLeadStatus(req.params.id, req.body.status);
  return result ? ok(res, result, 'Status updated') : notFound(res);
});

// ---- Projects & Applications ----
const getClientProjects = asyncHandler(async (req, res) => ok(res, await adminService.getClientProjects(req.query)));
const getApplications = asyncHandler(async (req, res) => ok(res, await adminService.getApplications(req.query)));
const getProposals = asyncHandler(async (req, res) => ok(res, await adminService.getProposals(req.query)));
const getContactUs = asyncHandler(async (req, res) => ok(res, await adminService.getContactUsEntries(req.query)));
const updateClientStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateClientStatus(req.body.userId, req.body.status);
  return result ? ok(res, result, 'Client status updated') : notFound(res);
});
const createUser = asyncHandler(async (req, res) => created(res, await adminService.createUser(req.body), 'User created'));

// ---- Analytics ----
const getPageAnalytics = asyncHandler(async (req, res) => ok(res, await adminService.getPageAnalytics(req.query)));
const getIpAnalytics = asyncHandler(async (req, res) => ok(res, await adminService.getIpAnalytics(req.query)));

// ---- Projects ----
const getProjects = asyncHandler(async (req, res) => ok(res, await adminService.getProjects(req.query)));
const getProjectDetails = asyncHandler(async (req, res) => {
  const result = await adminService.getProjectDetails(req.params.id);
  return result ? ok(res, result) : notFound(res);
});
const getUserDetails = asyncHandler(async (req, res) => {
  const result = await adminService.getUserDetails(req.params.id);
  return result ? ok(res, result) : notFound(res);
});
const createClientProject = asyncHandler(async (req, res) => created(res, await adminService.createClientProject(req.body)));
const updateProjectStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateProjectStatus(req.params.id, req.body.status);
  if (result) {
    platformNotificationService.notifyClientProjectStatusChangedByAdmin({ project: result, adminUser: req.user, status: req.body.status });
  }
  return result ? ok(res, result, 'Project status updated') : notFound(res);
});
const updateProject = asyncHandler(async (req, res) => {
  const result = await adminService.updateProject(req.params.id, req.body);
  return result ? ok(res, result, 'Project updated') : notFound(res);
});

// ---- Project Bids ----
const getProjectBids = asyncHandler(async (req, res) => ok(res, await adminService.getProjectBids(req.query)));
const getProjectBidById = asyncHandler(async (req, res) => {
  const result = await adminService.getProjectBidById(req.params.bidId);
  return result ? ok(res, result) : notFound(res);
});


// ---- Logs ----
const getLogs = asyncHandler(async (req, res) => ok(res, await adminService.getLogs(req.query)));
const getLogById = asyncHandler(async (req, res) => {
  const result = await adminService.getLogById(req.params.id);
  return result ? ok(res, result) : notFound(res);
});
const resolveLog = asyncHandler(async (req, res) => {
  const result = await adminService.resolveLog(req.params.id);
  return result ? ok(res, result, 'Log resolved') : notFound(res);
});
const getLogStatistics = asyncHandler(async (req, res) => ok(res, await adminService.getLogStatistics()));

// ---- User Functions ----
const getUserFunctions = asyncHandler(async (req, res) => ok(res, await adminService.getUserFunctions(req.query)));

// ---- Freelancer Management ----
const getFreelancerCompleteData = asyncHandler(async (req, res) => {
  const result = await adminService.getFreelancerCompleteData(req.params.userId);
  return result ? ok(res, result) : notFound(res);
});
const updateFreelancerPrimaryIntroduction = asyncHandler(async (req, res) => {
  const result = await adminService.updateFreelancerPrimaryIntroduction(req.params.userId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const updateFreelancerProfessionalExperience = asyncHandler(async (req, res) => {
  const result = await adminService.updateFreelancerProfessionalExperience(req.params.userId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const updateFreelancerProjects = asyncHandler(async (req, res) => {
  const result = await adminService.updateFreelancerProjects(req.params.userId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const updateFreelancerEducation = asyncHandler(async (req, res) => {
  const result = await adminService.updateFreelancerEducation(req.params.userId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const sendFreelancerEmail = asyncHandler(async (req, res) => {
  const result = await adminService.sendFreelancerEmail(req.params.userId, req.body);
  return ok(res, result, 'Email sent');
});
const getFreelancerCountryPreferences = asyncHandler(async (req, res) => {
  return ok(res, await adminService.getFreelancerCountryPreferences(req.params.userId));
});
const updateFreelancerCountryPreferences = asyncHandler(async (req, res) => {
  const result = await adminService.updateFreelancerCountryPreferences(req.params.userId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const createFreelancerCountryPreference = asyncHandler(async (req, res) => {
  return created(res, await adminService.createFreelancerCountryPreference(req.params.userId, req.body));
});
const deleteFreelancerCountryPreference = asyncHandler(async (req, res) => {
  const result = await adminService.deleteFreelancerCountryPreference(req.params.userId, req.params.preferenceId);
  return result ? ok(res, null, 'Deleted') : notFound(res);
});
const updateMaxProposalValue = asyncHandler(async (req, res) => {
  const result = await adminService.updateMaxProposalValue(req.params.userId, req.body.max_proposal_value);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const updateMaxDeliveryInProgress = asyncHandler(async (req, res) => {
  const result = await adminService.updateMaxDeliveryInProgress(req.params.userId, req.body.max_delivery_in_progress);
  return result ? ok(res, result, 'Updated') : notFound(res);
});

// ---- Billing ----
const getBillingDetails = asyncHandler(async (req, res) => {
  return ok(res, await adminService.getBillingDetails(req.params.milestoneId, req.params.projectbidId));
});
const saveInvoiceInformation = asyncHandler(async (req, res) => {
  return created(res, await adminService.saveInvoiceInformation(req.body, req.file));
});
const saveSaleOrderInformation = asyncHandler(async (req, res) => {
  return created(res, await adminService.saveSaleOrderInformation(req.body, req.file));
});
const milestoneApprovedByAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.milestoneApprovedByAdmin(req.body);
  return result ? ok(res, result, 'Milestone approved') : notFound(res);
});

// ---- Project Bid Management ----
const updateProjectBid = asyncHandler(async (req, res) => {
  const result = await adminService.updateProjectBid(req.params.projectBidId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const createProjectBidMilestone = asyncHandler(async (req, res) => {
  return created(res, await adminService.createProjectBidMilestone(req.params.projectBidId, req.body));
});
const updateProjectBidMilestone = asyncHandler(async (req, res) => {
  const result = await adminService.updateProjectBidMilestone(req.params.milestoneId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const approveProjectBidByAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.approveProjectBidByAdmin(req.params.projectBidId);
  return result ? ok(res, result, 'Approved') : notFound(res);
});

// ---- Chat Room ----
const suspendChatRoom = asyncHandler(async (req, res) => {
  const result = await adminService.suspendChatRoom(req.params.chatRoomId);
  return result ? ok(res, result, 'Chat room suspension toggled') : notFound(res);
});
const getChatRoomsNotCreatedByAdmin = asyncHandler(async (req, res) => {
  return ok(res, await adminService.getChatRoomsNotCreatedByAdmin(req.query));
});

// ---- Misc Admin ----
const getEmailDomainAnalysis = asyncHandler(async (req, res) => ok(res, await adminService.getEmailDomainAnalysis(req.query)));
const createUniqueSpecialCategory = asyncHandler(async (req, res) => created(res, await adminService.createUniqueSpecialCategory(req.body)));
const getBatchNames = asyncHandler(async (req, res) => ok(res, await adminService.getBatchNames()));
const getHtmlTemplates = asyncHandler(async (req, res) => ok(res, await adminService.getHtmlTemplates(req.query)));
const getWebsiteDataSlugs = asyncHandler(async (req, res) => ok(res, await adminService.getWebsiteDataSlugs()));
const getEmailCampaigns = asyncHandler(async (req, res) => ok(res, await adminService.getEmailCampaigns(req.query)));
const markUserViewedByAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.markUserViewedByAdmin(req.params.userId);
  return result ? ok(res, result, 'Marked as viewed') : notFound(res);
});
const deleteContactUs = asyncHandler(async (req, res) => {
  const result = await adminService.deleteContactUs(req.params.contactUsId);
  return result ? ok(res, null, 'Deleted') : notFound(res);
});
const getPendingViewCounts = asyncHandler(async (req, res) => ok(res, await adminService.getPendingViewCounts()));
const getFreelancerPayments = asyncHandler(async (req, res) => ok(res, await adminService.getFreelancerPayments(req.query)));
const getDisputes = asyncHandler(async (req, res) => ok(res, await adminService.getDisputes(req.query)));
const getAllDisputes = asyncHandler(async (req, res) => ok(res, await adminService.getAllDisputes(req.query)));
const updateDisputeStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateDisputeStatus({ disputeId: req.params.disputeId, status: req.body.status });
  if (!result) return res.status(404).json({ success: false, data: null, message: 'Dispute not found' });
  return ok(res, result);
});

// ---- Testimonials ----
const createTestimonial = asyncHandler(async (req, res) => created(res, await adminService.createTestimonial(req.body)));
const getTestimonials = asyncHandler(async (req, res) => ok(res, await adminService.getTestimonials(req.query)));
const updateTestimonial = asyncHandler(async (req, res) => {
  const result = await adminService.updateTestimonial(req.params.testimonialId, req.body);
  return result ? ok(res, result, 'Updated') : notFound(res);
});
const deleteTestimonial = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTestimonial(req.params.testimonialId);
  return result ? ok(res, null, 'Deleted') : notFound(res);
});

// ---- Profile Complete Reminder ----
const sendProfileCompleteReminder = asyncHandler(async (req, res) => {
  return created(res, await adminService.sendProfileCompleteReminder(req.body));
});
const sendBulkProfileCompleteReminder = asyncHandler(async (req, res) => {
  return created(res, await adminService.sendBulkProfileCompleteReminder(req.body));
});

// ---- Website Data Categories ----
const getWebsiteDataUniqueCategories = asyncHandler(async (req, res) => {
  return ok(res, await adminService.getWebsiteDataUniqueCategories());
});

export default {
  getAllUsers, getClients, updateUserStatus, getFreelancers, getReferralPartners,
  getSalesReferralLeads, getSalesReferralLeadById, updateSalesReferralLeadStatus,
  getClientProjects, getApplications, getProposals, getContactUs,
  updateClientStatus, createUser, getPageAnalytics, getIpAnalytics,
  getProjects, getProjectDetails, getUserDetails, createClientProject,
  updateProjectStatus, updateProject, getProjectBids, getProjectBidById,
  getLogs, getLogById, resolveLog, getLogStatistics, getUserFunctions,
  getFreelancerCompleteData, updateFreelancerPrimaryIntroduction,
  updateFreelancerProfessionalExperience, updateFreelancerProjects,
  updateFreelancerEducation, sendFreelancerEmail,
  getFreelancerCountryPreferences, updateFreelancerCountryPreferences,
  createFreelancerCountryPreference, deleteFreelancerCountryPreference,
  updateMaxProposalValue, updateMaxDeliveryInProgress,
  getBillingDetails, saveInvoiceInformation, saveSaleOrderInformation,
  milestoneApprovedByAdmin, updateProjectBid, createProjectBidMilestone,
  updateProjectBidMilestone, approveProjectBidByAdmin,
  suspendChatRoom, getChatRoomsNotCreatedByAdmin,
  getEmailDomainAnalysis, createUniqueSpecialCategory, getBatchNames,
  getHtmlTemplates, getWebsiteDataSlugs, getEmailCampaigns,
  markUserViewedByAdmin, deleteContactUs, getPendingViewCounts,
  getFreelancerPayments, getDisputes, getAllDisputes, updateDisputeStatus,
  createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial,
  sendProfileCompleteReminder, sendBulkProfileCompleteReminder,
  getWebsiteDataUniqueCategories,
};
