import fs from 'fs';
import path from 'path';
import {
  User, ProfessionalDetail, ProfessionalDetailSubCategory, Education, Certificate,
  Project, ProjectDetail, Thumbnail, ThumbnailImage, Video, InternalData, InternalImage,
  Industry, Designation, FreelancerCurrentCountryPreference, Category, SubCategory,
} from '../../models';
import { generateHash } from '../../utils/hash';
import jwtUtil from '../../utils/jwt';
import { UserStatus } from '../../constants/enums';
import emailTemplateService from '../../services/emailTemplate.service';
import logger from '../../config/logger';

/**
 * User registration — complete profile setup.
 */
const userRegistration = async ({ body, userId }) => {
  const updateBody = { ...body };

  if (updateBody.other_entity_name && updateBody.is_other) {
    const newDesignation = await Designation.create({
      name: updateBody.other_entity_name, is_admin_approved: false, from_others: true,
    });
    updateBody.designation = newDesignation.dataValues.id;
  }

  if (updateBody.password) updateBody.password = await generateHash(updateBody.password);

  updateBody.status = (updateBody.register_as === '2' || updateBody.register_as === '3')
    ? UserStatus.APPROVED : UserStatus.INCOMPLETE;
  updateBody.is_profile_published = false;

  await User.update(updateBody, { where: { id: userId } });
  const token = jwtUtil.createToken({ id: userId });
  const userData = await User.findOne({ where: { id: userId } });

  // Save country preference for freelancers
  if (updateBody.register_as === '1' && updateBody.country) {
    const existing = await FreelancerCurrentCountryPreference.findOne({
      where: { user_id: userId, added_from: 'primary_introduction' },
    });
    if (existing) {
      const countryExists = await FreelancerCurrentCountryPreference.findOne({
        where: { user_id: userId, country: updateBody.country },
      });
      if (!countryExists) await existing.update({ country: updateBody.country, add_by_admin: false });
    } else {
      await FreelancerCurrentCountryPreference.create({
        user_id: userId, country: updateBody.country, added_from: 'primary_introduction',
        is_currrently_active: true, add_by_admin: false,
      });
    }
  }

  return { token, userData };
};

/**
 * Public registration by token (no auth).
 */
const userRegistrationByToken = async ({ token, body }) => {
  if (!token) return false;
  const user = await User.findOne({ where: { token } });
  if (!user) return false;

  const updateBody = { ...body };
  delete updateBody.id;
  delete updateBody.password;
  updateBody.status = UserStatus.PENDING;
  updateBody.is_profile_published = true;

  await User.update(updateBody, { where: { id: user.id } });
  return true;
};

/**
 * Update user details.
 */
const updateUser = async ({ body, userId }) => {
  await User.update(body, { where: { id: userId } });
  return true;
};

/**
 * Admin update user (no auth).
 */
const adminUpdateUser = async (body) => {
  await User.update(body, { where: { id: body.id } });
  return true;
};

/**
 * Get user detail with all related data.
 */
const getUserDetail = async (userId) => {
  const userData = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'first_name', 'last_name', 'email', 'username', 'register_as', 'status', 'createdAt', 'updatedAt', 'country', 'city', 'company_name', 'doi', 'state', 'profile_image', 'is_profile_published', 'created_by_admin', 'designation', 'is_referral_partner'],
    include: [
      { model: ProfessionalDetail, required: false },
      { model: Education, required: false },
    ],
  });

  if (!userData) return null;

  const certificates = await Certificate.findAll({ where: { userId } });
  const projects = await Project.findAll({
    where: { user_id: userId },
    include: [{ model: Industry, as: 'industryData', required: false }],
  });

  let readyMadeApps = await ProjectDetail.findAll({
    where: { userId },
    include: [{ model: Thumbnail, required: false, as: 'Thumbnail', include: [{ model: ThumbnailImage, required: false, as: 'thumbnailImages' }] }],
  });

  let readyMapAppsVideo = await Video.findAll({
    where: { projectDetailId: readyMadeApps.map((app) => app.id) },
  });

  const baseURL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
  readyMadeApps = readyMadeApps.map((app) => {
    const a = app.toJSON();
    if (a.Thumbnail?.thumbnailImages) {
      a.Thumbnail.thumbnailImages = a.Thumbnail.thumbnailImages.map((img) => ({
        ...img, imageUrl: `${baseURL}/thumbnails/${img.imageUrl.split('/').pop()}`,
      }));
    }
    return a;
  });

  readyMapAppsVideo = readyMapAppsVideo.map((v) => {
    const video = v.toJSON();
    if (video.videoUrl) video.videoUrl = `${baseURL}/videos/${video.videoUrl.split('/').pop()}`;
    return video;
  });

  const result = userData.toJSON();
  result.Projects = projects.map((p) => p.toJSON());
  result.readyMadeApps = readyMadeApps;
  result.readyMapAppsVideo = readyMapAppsVideo;
  result.certificates = certificates.map((c) => c.toJSON());
  if (result.profile_image) result.profile_image = process.env.BACKEND_BASE_URL + result.profile_image;

  // Attach subcategories to professional details
  if (result.ProfessionalDetails?.length > 0) {
    result.ProfessionalDetails = await Promise.all(result.ProfessionalDetails.map(async (pd) => {
      const updated = { ...pd };
      if (pd.model_engagement === '1') updated.model_engagement_type = 'hourly';
      else if (pd.model_engagement === '2') updated.model_engagement_type = 'retainership';
      else if (pd.model_engagement === '3') updated.model_engagement_type = 'fixed';

      const peId = pd.professional_experience_id || pd.id;
      if (peId) {
        const subs = await ProfessionalDetailSubCategory.findAll({
          where: { professional_experience_id: peId }, attributes: ['sub_category_id'], raw: true,
        });
        updated.project_sub_category = subs.length > 0
          ? subs.map((s) => s.sub_category_id).filter(Boolean).join(',') : null;
      } else {
        updated.project_sub_category = null;
      }
      return updated;
    }));
  }

  return result;
};

/**
 * Get user detail by token (public, no auth).
 */
const getUserDetailByToken = async (token) => {
  if (!token) return null;
  const user = await User.findOne({
    where: { token },
    attributes: ['id', 'first_name', 'last_name', 'email', 'register_as', 'status', 'country', 'city', 'company_name', 'doi', 'profile_image', 'gender', 'created_by_admin', 'state', 'designation', 'is_profile_published'],
  });
  if (!user) return null;
  const result = user.toJSON();
  if (result.profile_image) result.profile_image = process.env.BACKEND_BASE_URL + result.profile_image;
  return result;
};

/**
 * Add/update ready-made app.
 */
const addOrUpdateReadyMadeApp = async ({ body, userId }) => {
  const data = { ...body, userId };
  if (data.id) {
    data.is_published = false;
    await ProjectDetail.update(data, { where: { id: data.id } });
    return { id: data.id };
  }
  const created = await ProjectDetail.create(data);
  return { id: created.id };
};

/**
 * Publish ready-made app.
 */
const publishReadyMadeApp = async (projectId) => {
  const app = await ProjectDetail.findOne({ where: { id: projectId } });
  if (!app) return false;
  app.is_published = true;
  await app.save();
  return true;
};

/**
 * Publish user profile.
 */
const publishUserProfile = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) return false;
  user.is_profile_published = true;
  await user.save();

  if (!user.welcome_email_sent) {
    emailTemplateService.sendWelcomeOnboarding({
      email: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
    }).catch((err) => logger.error(`Welcome email error: ${err}`));
    await User.update({ welcome_email_sent: true }, { where: { id: userId } });
  }
  return true;
};

// ---- Certificates ----
const userCertificate = async ({ body, userId }) => {
  await Promise.all(body.map(async (element) => {
    const value = { userId, ...element };
    if (value.certificate_id) {
      await Certificate.update(value, { where: { certificate_id: value.certificate_id } });
    } else {
      await Certificate.create(value);
    }
    await User.update({ user_last_path: value.user_last_path }, { where: { id: userId } });
  }));
  return true;
};

const deleteUserCertificate = async ({ certificateId, userId }) => {
  await Certificate.destroy({ where: { certificate_id: certificateId, userId } });
  return true;
};

const getCertificate = async (userId) => Certificate.findAll({ where: { userId } });

// ---- Education ----
const userEducation = async ({ body, userId }) => {
  await Promise.all(body.map(async (element) => {
    const value = { userId, ...element };
    if (value.education_id) {
      await Education.update(value, { where: { education_id: value.education_id } });
    } else {
      await Education.create(value);
    }
    await User.update({ user_last_path: value.user_last_path }, { where: { id: userId } });
  }));
  return true;
};

const getEducation = async (userId) => {
  try {
    const education = await Education.findAll({ where: { userId } });
    return education || [];
  } catch (error) {
    console.error('getEducation error:', error);
    return [];
  }
};

// ---- Professional Detail ----
const userProfessionalDetail = async ({ body, userId }) => {
  const value = { userId, ...body };
  if (value.professional_experience_id) {
    await ProfessionalDetail.update(value, { where: { professional_experience_id: value.professional_experience_id } });
  } else {
    await ProfessionalDetail.create(value);
  }
  await User.update({ user_last_path: value.user_last_path }, { where: { id: userId } });
  return true;
};

const getProfessionalDetail = async (userId) => {
  const pd = await ProfessionalDetail.findOne({ where: { userId } });
  if (pd) {
    const peId = pd.professional_experience_id || pd.id;
    if (peId) {
      const subs = await ProfessionalDetailSubCategory.findAll({
        where: { professional_experience_id: peId }, attributes: ['sub_category_id'], raw: true,
      });
      pd.dataValues.project_sub_category = subs.length > 0
        ? subs.map((s) => s.sub_category_id).filter(Boolean).join(',') : null;
    } else {
      pd.dataValues.project_sub_category = null;
    }
  }
  return pd;
};

const updateProfessionalDetail = async ({ id, body }) => ProfessionalDetail.update(body, { where: { professional_experience_id: id } });

const getAllProfessionalDetail = async () => ProfessionalDetail.findAll();

// ---- Projects (user portfolio) ----
const addUserProject = async ({ body, userId }) => {
  const inputList = Array.isArray(body.inputList) ? body.inputList : [];
  if (inputList.length < 3) throw new Error('At least 3 projects are mandatory.');

  const countyList = [];
  await Promise.all(inputList.map(async (element) => {
    const { user_id, ...rest } = element;
    const value = { user_id: userId, ...rest };
    if (!countyList.includes(value.project_location)) countyList.push(value.project_location);
    if (value.id) await Project.update(value, { where: { id: value.id } });
    else await Project.create(value);
    await User.update({ user_last_path: value.user_last_path }, { where: { id: userId } });
  }));

  // Update country preferences
  await FreelancerCurrentCountryPreference.destroy({ where: { user_id: userId, added_from: 'projects', add_by_admin: false } });
  await Promise.all(countyList.map(async (county) => {
    const exists = await FreelancerCurrentCountryPreference.findOne({ where: { user_id: userId, country: county } });
    if (!exists) {
      await FreelancerCurrentCountryPreference.create({
        user_id: userId, country: county, added_from: 'projects', is_currrently_active: true, add_by_admin: false,
      });
    }
  }));
  return true;
};

const deleteUserProject = async (projectId) => { await Project.destroy({ where: { id: projectId } }); return true; };
const getUserProject = async (userId) => Project.findAll({ where: { user_id: userId } });
const updateUserProject = async ({ id, body }) => Project.update(body, { where: { id } });

// ---- Thumbnails ----
const userThumbnail = async ({ body, userId, files }) => {
  const thumbnail = await Thumbnail.create({
    userId, title: body.title || '', description: body.description || '',
    appId: body.appId || '', project_detail_id: body.projectDetailId,
  });
  const thumbnailImages = await Promise.all(
    files.map((f) => ThumbnailImage.create({ thumbnailId: thumbnail.id, imageUrl: f.path })),
  );
  return { ...thumbnail.toJSON(), thumbnailImages };
};

const updateThumbnail = async ({ id, body }) => Thumbnail.update(body, { where: { id } });

// ---- Videos ----
const userVideo = async ({ body, userId, files }) => {
  const video = await Promise.all(
    files.map((f) => Video.create({ videoUrl: f.path, userId, projectDetailId: body.projectDetailId })),
  );
  return { video };
};

// ---- Internal Data ----
const userInternalData = async ({ body, userId, files }) => {
  if (body.projectDetailId) {
    const existing = await InternalData.findOne({ where: { project_detail_id: body.projectDetailId } });
    if (existing) {
      const images = await Promise.all(
        files.map((f) => InternalImage.create({ internal_data_id: existing.id, image_url: f.path.replace(/\\/g, '/') })),
      );
      return { ...existing.toJSON(), internalDataImages: images.map((i) => i.toJSON()) };
    }
  }

  const internalData = await InternalData.create({
    user_id: userId, title: body.title || '', description: body.description || '',
    appId: body.appId || '', project_detail_id: body.projectDetailId,
  });
  const images = await Promise.all(
    files.map((f) => InternalImage.create({ internal_data_id: internalData.id, image_url: f.path.replace(/\\/g, '/') })),
  );
  return { ...internalData.toJSON(), internalDataImages: images };
};

const updateInternalData = async ({ id, body }) => InternalData.update(body, { where: { id } });

const deleteInternalImage = async (imageId) => {
  const image = await InternalImage.findOne({ where: { id: imageId } });
  if (!image) throw new Error('Internal image not found');
  if (image.image_url) {
    const filePath = path.join(process.cwd(), '..', 'public', image.image_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  await InternalImage.destroy({ where: { id: imageId } });
  return true;
};

// ---- Profile Image ----
const updateProfileImage = async ({ userId, file }) => {
  if (!file) throw new Error('No file uploaded');
  const currentUser = await User.findByPk(userId);
  if (!currentUser) throw new Error('User not found');

  if (currentUser.profile_image) {
    const filename = path.basename(currentUser.profile_image);
    const oldPath = path.join(process.cwd(), '..', 'public', 'userProfileImages', filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const imagePath = `/userProfileImages/${file.filename}`;
  await User.update({ profile_image: imagePath }, { where: { id: userId } });
  return { profile_image: process.env.BACKEND_BASE_URL + imagePath, message: 'Profile image updated successfully' };
};

const updateProfileImageByToken = async ({ token, file }) => {
  if (!token) throw new Error('Token is required');
  if (!file) throw new Error('No file uploaded');
  const user = await User.findOne({ where: { token } });
  if (!user) throw new Error('User not found');

  if (user.profile_image) {
    const filename = path.basename(user.profile_image);
    const oldPath = path.join(process.cwd(), '..', 'public', 'userProfileImages', filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const imagePath = `/userProfileImages/${file.filename}`;
  await User.update({ profile_image: imagePath }, { where: { id: user.id } });
  return { profile_image: process.env.BACKEND_BASE_URL + imagePath, message: 'Profile image updated successfully' };
};

// ---- Categories ----
const getAllCategory = async () => Category.findAll();
const getAllSubCategory = async (categoryId) => {
  const where = {};
  if (categoryId) where.category_id = categoryId;
  return SubCategory.findAll({ where });
};

export default {
  userRegistration, userRegistrationByToken, updateUser, adminUpdateUser,
  getUserDetail, getUserDetailByToken, addOrUpdateReadyMadeApp,
  publishReadyMadeApp, publishUserProfile,
  userCertificate, deleteUserCertificate, getCertificate,
  userEducation, getEducation,
  userProfessionalDetail, getProfessionalDetail, updateProfessionalDetail, getAllProfessionalDetail,
  addUserProject, deleteUserProject, getUserProject, updateUserProject,
  userThumbnail, updateThumbnail, userVideo,
  userInternalData, updateInternalData, deleteInternalImage,
  updateProfileImage, updateProfileImageByToken,
  getAllCategory, getAllSubCategory,
};
