import { Router } from 'express';
import adminController from './admin.controller';
import validate from '../../middlewares/validate.middleware';
import adminValidation from './admin.validation';
import adminAuthMiddleware from '../../middlewares/adminAuth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

// ---- User Management ----
router.get('/admin/user', adminAuthMiddleware, adminController.getAllUsers);
router.get('/admin/clients', adminAuthMiddleware, adminController.getClients);
router.patch('/admin/user/:id/status', adminAuthMiddleware, validate(adminValidation.updateUserStatus), adminController.updateUserStatus);
router.get('/admin/freelancers', adminAuthMiddleware, adminController.getFreelancers);
router.get('/admin/referral-partners', adminAuthMiddleware, adminController.getReferralPartners);

// ---- Sales Referral Leads ----
router.get('/admin/sales-referral-leads', adminAuthMiddleware, adminController.getSalesReferralLeads);
router.get('/admin/sales-referral-leads/:id', adminAuthMiddleware, validate(adminValidation.idParam), adminController.getSalesReferralLeadById);
router.patch('/admin/sales-referral-leads/:id/status', adminAuthMiddleware, validate(adminValidation.updateSalesReferralLeadStatus), adminController.updateSalesReferralLeadStatus);

// ---- Projects & Applications ----
router.get('/admin/client-project', adminAuthMiddleware, adminController.getClientProjects);
router.get('/admin/application', adminAuthMiddleware, adminController.getApplications);
router.get('/admin/proposal', adminAuthMiddleware, adminController.getProposals);
router.get('/admin/contact-us', adminAuthMiddleware, adminController.getContactUs);
router.post('/admin/update-client-status', adminAuthMiddleware, validate(adminValidation.updateClientStatus), adminController.updateClientStatus);
router.post('/admin/create-user', adminAuthMiddleware, validate(adminValidation.createUser), adminController.createUser);

// ---- Analytics ----
router.get('/admin/page-analytics', adminAuthMiddleware, adminController.getPageAnalytics);
router.get('/admin/ip-analytics', adminAuthMiddleware, adminController.getIpAnalytics);

// ---- Projects ----
router.get('/admin/projects', adminAuthMiddleware, adminController.getProjects);
router.get('/admin/project/:id/details', adminAuthMiddleware, validate(adminValidation.idParam), adminController.getProjectDetails);
router.get('/admin/user/:id/details', adminAuthMiddleware, validate(adminValidation.idParam), adminController.getUserDetails);
router.post('/admin/client-project', adminAuthMiddleware, adminController.createClientProject);
router.patch('/admin/project/:id/status', adminAuthMiddleware, validate(adminValidation.updateProjectStatus), adminController.updateProjectStatus);
router.put('/admin/project/:id/update', adminAuthMiddleware, validate(adminValidation.updateProject), adminController.updateProject);

// ---- Project Bids ----
router.get('/admin/project-bids', adminAuthMiddleware, adminController.getProjectBids);
router.get('/admin/project-bids/:bidId', adminAuthMiddleware, validate(adminValidation.bidIdParam), adminController.getProjectBidById);

// ---- Logs ----
router.get('/admin/logs', adminAuthMiddleware, adminController.getLogs);
router.get('/admin/logs/statistics', adminAuthMiddleware, adminController.getLogStatistics);
router.get('/admin/logs/:id', adminAuthMiddleware, validate(adminValidation.logIdParam), adminController.getLogById);
router.patch('/admin/logs/:id/resolve', adminAuthMiddleware, validate(adminValidation.logIdParam), adminController.resolveLog);

// ---- User Functions ----
router.get('/admin/user-functions', adminAuthMiddleware, adminController.getUserFunctions);


// ---- Freelancer Management ----
router.get('/admin/freelancer/:userId/complete-data', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.getFreelancerCompleteData);
router.put('/admin/freelancer/:userId/primary-introduction', adminAuthMiddleware, validate(adminValidation.freelancerPrimaryIntroduction), adminController.updateFreelancerPrimaryIntroduction);
router.put('/admin/freelancer/:userId/professional-experience', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.updateFreelancerProfessionalExperience);
router.put('/admin/freelancer/:userId/projects', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.updateFreelancerProjects);
router.put('/admin/freelancer/:userId/education', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.updateFreelancerEducation);
router.post('/admin/freelancer/:userId/send-email', adminAuthMiddleware, validate(adminValidation.sendFreelancerEmail), adminController.sendFreelancerEmail);
router.get('/admin/freelancer/:userId/current-country-preferences', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.getFreelancerCountryPreferences);
router.patch('/admin/freelancer/:userId/current-country-preferences', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.updateFreelancerCountryPreferences);
router.post('/admin/freelancer/:userId/current-country-preferences', adminAuthMiddleware, validate(adminValidation.userIdParam), adminController.createFreelancerCountryPreference);
router.delete('/admin/freelancer/:userId/current-country-preferences/:preferenceId', adminAuthMiddleware, validate(adminValidation.preferenceIdParam), adminController.deleteFreelancerCountryPreference);
router.patch('/admin/freelancer/:userId/max-proposal-value', adminAuthMiddleware, validate(adminValidation.updateMaxProposalValue), adminController.updateMaxProposalValue);
router.patch('/admin/freelancer/:userId/max-delivery-in-progress', adminAuthMiddleware, validate(adminValidation.updateMaxDeliveryInProgress), adminController.updateMaxDeliveryInProgress);

// ---- Billing ----
router.get('/admin/billing/:milestoneId/details/:projectbidId/information', adminAuthMiddleware, validate(adminValidation.billingDetailsParam), adminController.getBillingDetails);
router.post('/admin/save-invoice-information', adminAuthMiddleware, fileUpload.uploadInvoice, adminController.saveInvoiceInformation);
router.post('/admin/save-sale-order-information', adminAuthMiddleware, fileUpload.uploadSaleOrder, adminController.saveSaleOrderInformation);
router.post('/admin/milestone-approved-by-admin', adminAuthMiddleware, adminController.milestoneApprovedByAdmin);

// ---- Project Bid Management ----
router.patch('/admin/project-bid/:projectBidId/update', adminAuthMiddleware, validate(adminValidation.updateProjectBid), adminController.updateProjectBid);
router.post('/admin/project-bid/:projectBidId/milestone', adminAuthMiddleware, validate(adminValidation.createMilestone), adminController.createProjectBidMilestone);
router.patch('/admin/project-bid/milestone/:milestoneId/update', adminAuthMiddleware, validate(adminValidation.updateMilestone), adminController.updateProjectBidMilestone);
router.post('/admin/project-bid/:projectBidId/approved-by-admin', adminAuthMiddleware, validate(adminValidation.projectBidIdParam), adminController.approveProjectBidByAdmin);

// ---- Chat Room ----
router.patch('/admin/chat-room/:chatRoomId/suspend', adminAuthMiddleware, validate(adminValidation.suspendChatRoom), adminController.suspendChatRoom);
router.get('/admin/chat-room/not-created-by-admin', adminAuthMiddleware, adminController.getChatRoomsNotCreatedByAdmin);

// ---- Misc Admin ----
router.get('/admin/email-domain-analysis', adminAuthMiddleware, adminController.getEmailDomainAnalysis);
router.post('/admin/unique-special-category', adminAuthMiddleware, validate(adminValidation.uniqueSpecialCategory), adminController.createUniqueSpecialCategory);
router.get('/admin/batch-name', adminAuthMiddleware, adminController.getBatchNames);
router.get('/admin/html-template', adminAuthMiddleware, adminController.getHtmlTemplates);
router.get('/admin/website-data-slug', adminAuthMiddleware, adminController.getWebsiteDataSlugs);
router.get('/admin/email-campaigns', adminAuthMiddleware, adminController.getEmailCampaigns);
router.patch('/admin/user/:userId/view-by-admin', adminAuthMiddleware, validate(adminValidation.viewByAdmin), adminController.markUserViewedByAdmin);
router.delete('/admin/contact-us/:contactUsId/delete', adminAuthMiddleware, validate(adminValidation.deleteContactUs), adminController.deleteContactUs);
router.get('/admin/pending-view-counts', adminAuthMiddleware, adminController.getPendingViewCounts);
router.get('/admin/freelancer-payments', adminAuthMiddleware, adminController.getFreelancerPayments);
router.get('/admin/disputes', adminAuthMiddleware, adminController.getDisputes);
router.get('/admin/disputes/all', adminAuthMiddleware, adminController.getAllDisputes);
router.patch('/admin/disputes/:disputeId/status', adminAuthMiddleware, adminController.updateDisputeStatus);

// ---- Testimonials ----
router.post('/admin/testimonial', adminAuthMiddleware, validate(adminValidation.createTestimonial), adminController.createTestimonial);
router.get('/admin/testimonials', adminAuthMiddleware, adminController.getTestimonials);
router.put('/admin/testimonial/:testimonialId/update', adminAuthMiddleware, validate(adminValidation.testimonialIdParam), adminController.updateTestimonial);
router.delete('/admin/testimonial/:testimonialId/delete', adminAuthMiddleware, validate(adminValidation.testimonialIdParam), adminController.deleteTestimonial);

// ---- Profile Complete Reminder ----
router.post('/admin/profile-complete-reminder', adminAuthMiddleware, adminController.sendProfileCompleteReminder);
router.post('/admin/profile-complete-reminder/bulk', adminAuthMiddleware, adminController.sendBulkProfileCompleteReminder);

// ---- Website Data Categories ----
router.get('/admin/website-data/unique-categories', adminAuthMiddleware, adminController.getWebsiteDataUniqueCategories);

export default router;
