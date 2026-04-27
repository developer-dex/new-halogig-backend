import { Router } from 'express';
import path from 'path';
import countryRoutes from '../modules/country/country.routes';
import contactRoutes from '../modules/contact/contact.routes';
import industryRoutes from '../modules/industry/industry.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import adminAuthRoutes from '../modules/adminAuth/adminAuth.routes';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import projectRoutes from '../modules/project/project.routes';
import bidRoutes from '../modules/bid/bid.routes';
import sowRoutes from '../modules/sow/sow.routes';
import feedbackRoutes from '../modules/feedback/feedback.routes';
import disputeRoutes from '../modules/dispute/dispute.routes';
import testimonialRoutes from '../modules/testimonial/testimonial.routes';
import salesReferralRoutes from '../modules/salesReferral/salesReferral.routes';
import supportRoutes from '../modules/support/support.routes';
import billingRoutes from '../modules/billing/billing.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import chatRoutes from '../modules/chat/chat.routes';
import blogRoutes from '../modules/blog/blog.routes';
import websiteDataRoutes from '../modules/websiteData/websiteData.routes';
import webRotDataRoutes from '../modules/webRotData/webRotData.routes';
import linkedInMarketingRoutes from '../modules/linkedInMarketing/linkedInMarketing.routes';
import twitterMarketingRoutes from '../modules/twitterMarketing/twitterMarketing.routes';
import googleMeetRoutes from '../modules/googleMeet/googleMeet.routes';
import categoryRoutes from '../modules/category/category.routes';
import adminRoutes from '../modules/admin/admin.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import aiDraftRoutes from '../modules/aiDraft/aiDraft.routes';
import logManagerRoutes from '../modules/logManager/logManager.routes';

const router = Router();

/**
 * Central route registration.
 * Each module's routes will be imported and mounted here as they are built.
 */
const registerRoutes = (app) => {
  app.use(router);

  // Special case: standalone route registered outside /api prefix (matches old project behavior)
  app.get('/api/admin/referral-partners', async (req, res, next) => {
    try {
      const adminService = (await import('../modules/admin/admin.service')).default;
      const result = await adminService.getReferralPartners(req.query);
      res.status(200).json({ success: true, data: result, message: 'Your Account Has Been Created. Please Login' });
    } catch (error) { next(error); }
  });

  // Serve frontend build for non-API GET requests
  app.get('/*', (req, res, next) => {
    if (req.path.includes('/api')) return next();
    const indexPath = path.join(`${__dirname}/../../build/index.html`);
    return res.sendFile(indexPath, (err) => {
      if (err) next(err);
    });
  });

  // Mount all module routes under /api
  router.use('/api', [
    countryRoutes,
    contactRoutes,
    industryRoutes,
    paymentRoutes,
    adminAuthRoutes,
    authRoutes,
    userRoutes,
    projectRoutes,
    bidRoutes,
    sowRoutes,
    feedbackRoutes,
    disputeRoutes,
    testimonialRoutes,
    salesReferralRoutes,
    supportRoutes,
    billingRoutes,
    notificationRoutes,
    chatRoutes,
    blogRoutes,
    websiteDataRoutes,
    webRotDataRoutes,
    linkedInMarketingRoutes,
    twitterMarketingRoutes,
    googleMeetRoutes,
    categoryRoutes,
    adminRoutes,
    analyticsRoutes,
    aiDraftRoutes,
    logManagerRoutes,
  ]);
};

export default registerRoutes;
