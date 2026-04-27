import multer from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import {
  PROJECT_DOCUMENT_PATH, THUMBNAIL_PATH, INTERNAL_DATA_PATH, VIDEO_PATH,
  USER_PROFILE_IMAGES_PATH, CUSTOMER_RESUME_PATH, GST_IMAGE_PATH,
  INVOICE_PATH, SALE_ORDER_PATH, BLOG_IMAGE_PATH, BLOG_THUMBNAIL_PATH,
  WEBSITE_VIDEO_THUMBNAIL_PATH,
} from '../config/paths';

const createMulterMiddleware = (uploadPath) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) { cb(null, uploadPath); },
    filename(req, file, cb) {
      const timestamp = moment().format('YYYYMMDD_HHmmss');
      cb(null, `${timestamp}_${file.originalname}`);
    },
  });
  return multer({ storage });
};

const wrapUpload = (uploadPath, method = 'any') => async (req, res, next) => {
  try {
    const m = createMulterMiddleware(uploadPath);
    m[method]()(req, res, (err) => {
      if (err) { const e = new Error('File upload failed'); e.status = 400; e.message = err; return next(e); }
      return next();
    });
  } catch (error) { next(error); }
};

const uploadDocument = wrapUpload(PROJECT_DOCUMENT_PATH);
const uploadThumbnail = wrapUpload(THUMBNAIL_PATH);
const uploadInternalData = wrapUpload(INTERNAL_DATA_PATH);
const uploadVideo = wrapUpload(VIDEO_PATH);

const uploadProfileImage = async (req, res, next) => {
  try {
    const m = createMulterMiddleware(USER_PROFILE_IMAGES_PATH);
    m.single('profile_image')(req, res, (err) => {
      if (err) { const e = new Error('Profile image upload failed'); e.status = 400; return next(e); }
      next();
    });
  } catch (error) { next(error); }
};

const uploadCustomerResume = wrapUpload(CUSTOMER_RESUME_PATH);
const uploadGstImage = wrapUpload(GST_IMAGE_PATH);
const uploadInvoice = wrapUpload(INVOICE_PATH);
const uploadSaleOrder = wrapUpload(SALE_ORDER_PATH);

const uploadBlogImage = async (req, res, next) => {
  try {
    if (!fs.existsSync(BLOG_IMAGE_PATH)) fs.mkdirSync(BLOG_IMAGE_PATH, { recursive: true });
    if (!fs.existsSync(BLOG_THUMBNAIL_PATH)) fs.mkdirSync(BLOG_THUMBNAIL_PATH, { recursive: true });

    const storage = multer.diskStorage({
      destination: (r, file, cb) => cb(null, file.fieldname === 'thumbnail_image' ? BLOG_THUMBNAIL_PATH : BLOG_IMAGE_PATH),
      filename: (r, file, cb) => cb(null, `${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
    });
    multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })
      .fields([{ name: 'image', maxCount: 1 }, { name: 'thumbnail_image', maxCount: 1 }])(req, res, (err) => {
      if (err) { const e = new Error('Blog image upload failed'); e.status = 400; return next(e); }
      next();
    });
  } catch (error) { next(error); }
};

const uploadWebsiteDataExcel = async (req, res, next) => {
  try {
    const dir = path.join(process.cwd(), '..', 'public', 'websiteData');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const storage = multer.diskStorage({
      destination: (r, f, cb) => cb(null, dir),
      filename: (r, f, cb) => cb(null, `website-data-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(f.originalname)}`),
    });
    const fileFilter = (r, f, cb) => {
      const ext = path.extname(f.originalname).toLowerCase();
      if (['.xls', '.xlsx'].includes(ext)) cb(null, true);
      else cb(new Error('Only Excel files (.xls, .xlsx) are allowed'), false);
    };
    multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
      .single('excelFile')(req, res, (err) => {
      if (err) { const e = new Error(err.message || 'Excel upload failed'); e.status = 400; return next(e); }
      next();
    });
  } catch (error) { next(error); }
};

const uploadWebsiteVideoThumbnail = async (req, res, next) => {
  try {
    if (!fs.existsSync(WEBSITE_VIDEO_THUMBNAIL_PATH)) fs.mkdirSync(WEBSITE_VIDEO_THUMBNAIL_PATH, { recursive: true });
    const storage = multer.diskStorage({
      destination: (r, f, cb) => cb(null, WEBSITE_VIDEO_THUMBNAIL_PATH),
      filename: (r, f, cb) => cb(null, `${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(f.originalname)}`),
    });
    multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })
      .single('video_thumbnail')(req, res, (err) => {
      if (err) { const e = new Error('Thumbnail upload failed'); e.status = 400; return next(e); }
      next();
    });
  } catch (error) { next(error); }
};

export default {
  uploadDocument, uploadThumbnail, uploadInternalData, uploadVideo,
  uploadProfileImage, uploadCustomerResume, uploadGstImage,
  uploadInvoice, uploadSaleOrder, uploadBlogImage,
  uploadWebsiteDataExcel, uploadWebsiteVideoThumbnail,
};
