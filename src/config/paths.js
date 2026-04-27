import path from 'path';

/**
 * Centralized file path constants for uploads and static assets.
 * Most paths resolve to a `public/` directory OUTSIDE the project root
 * (one level up), matching the original project's behavior.
 */

export const PROJECT_DOCUMENT_PATH = 'public/freelancer/projectDocuments';
export const THUMBNAIL_PATH = path.join(process.cwd(), '..', 'public', 'thumbnails');
export const USER_PROFILE_IMAGES_PATH = path.join(process.cwd(), '..', 'public', 'userProfileImages');
export const INTERNAL_DATA_PATH = 'public/freelancer/internalData';
export const VIDEO_PATH = 'public/freelancer/video';
export const CUSTOMER_RESUME_PATH = path.join(process.cwd(), '..', 'public', 'customerResume');
export const GST_IMAGE_PATH = path.join(process.cwd(), '..', 'public', 'gstImages');
export const INVOICE_PATH = path.join(process.cwd(), '..', 'public', 'invoices');
export const SALE_ORDER_PATH = path.join(process.cwd(), '..', 'public', 'saleOrders');
export const BLOG_IMAGE_PATH = path.join(process.cwd(), '..', 'public', 'blogImages');
export const BLOG_THUMBNAIL_PATH = path.join(process.cwd(), '..', 'public', 'blogThumbnails');
export const WEBSITE_VIDEO_THUMBNAIL_PATH = path.join(process.cwd(), '..', 'public', 'videoThumbnailWebsiteData');

// Admin notification email
export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'ankur@halogig.com';
