import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import userService from './user.service';

const ok = (req, res, data, msgKey = 'SIGNUP') => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, msgKey) });
const bad = (req, res, msgKey = 'FALSE_RESPONSE') => res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });

const userRegistration = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.body.id;
  const result = await userService.userRegistration({ body: req.body, userId });
  return result ? ok(req, res, result) : bad(req, res);
});

const userRegistrationByToken = asyncHandler(async (req, res) => {
  const result = await userService.userRegistrationByToken({ token: req.params.token, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});

const updateUser = asyncHandler(async (req, res) => {
  const result = await userService.updateUser({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const adminUpdateUser = asyncHandler(async (req, res) => {
  const result = await userService.adminUpdateUser(req.body);
  return result ? ok(req, res, result) : bad(req, res);
});

const addOrUpdateReadyMadeApp = asyncHandler(async (req, res) => {
  const result = await userService.addOrUpdateReadyMadeApp({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserDetail = asyncHandler(async (req, res) => {
  const userId = req.query.user_id || req.user.id;
  const result = await userService.getUserDetail(userId);
  return result ? ok(req, res, result, 'USER_DETAIL') : bad(req, res);
});

const getUserDetailByToken = asyncHandler(async (req, res) => {
  const result = await userService.getUserDetailByToken(req.params.token);
  return result ? ok(req, res, result) : bad(req, res);
});

const publishReadyMadeApp = asyncHandler(async (req, res) => {
  const result = await userService.publishReadyMadeApp(req.body.project_id);
  return result ? ok(req, res, result, 'READY_MADE_APP_PUBLISHED') : bad(req, res);
});

const publishUserProfile = asyncHandler(async (req, res) => {
  const result = await userService.publishUserProfile(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

// Certificates
const userCertificate = asyncHandler(async (req, res) => {
  const result = await userService.userCertificate({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});
const deleteUserCertificate = asyncHandler(async (req, res) => {
  const result = await userService.deleteUserCertificate({ certificateId: req.body.certificate_id, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});
const getCertificate = asyncHandler(async (req, res) => {
  const result = await userService.getCertificate(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

// Education
const userEducation = asyncHandler(async (req, res) => {
  const result = await userService.userEducation({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});
const getEducation = asyncHandler(async (req, res) => {
  const result = await userService.getEducation(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});

// Professional Detail
const userProfessionalDetail = asyncHandler(async (req, res) => {
  const result = await userService.userProfessionalDetail({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});
const getProfessionalDetail = asyncHandler(async (req, res) => {
  const result = await userService.getProfessionalDetail(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});
const updateProfessionalDetail = asyncHandler(async (req, res) => {
  const result = await userService.updateProfessionalDetail({ id: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});
const getAllProfessionalDetail = asyncHandler(async (req, res) => {
  const result = await userService.getAllProfessionalDetail();
  return result ? ok(req, res, result) : bad(req, res);
});

// Projects (portfolio)
const addUserProject = asyncHandler(async (req, res) => {
  const result = await userService.addUserProject({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});
const deleteUserProject = asyncHandler(async (req, res) => {
  const result = await userService.deleteUserProject(req.body.project_id);
  return result ? ok(req, res, result) : bad(req, res);
});
const getUserProject = asyncHandler(async (req, res) => {
  const result = await userService.getUserProject(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});
const updateUserProject = asyncHandler(async (req, res) => {
  const result = await userService.updateUserProject({ id: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});

// Thumbnails & Videos
const userThumbnail = asyncHandler(async (req, res) => {
  const result = await userService.userThumbnail({ body: req.body, userId: req.user.id, files: req.files });
  return result ? ok(req, res, result) : bad(req, res);
});
const updateThumbnail = asyncHandler(async (req, res) => {
  const result = await userService.updateThumbnail({ id: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});
const userVideo = asyncHandler(async (req, res) => {
  const result = await userService.userVideo({ body: req.body, userId: req.user.id, files: req.files });
  return result ? ok(req, res, result) : bad(req, res);
});

// Internal Data
const userIntenalData = asyncHandler(async (req, res) => {
  const result = await userService.userInternalData({ body: req.body, userId: req.user.id, files: req.files });
  return result ? ok(req, res, result) : bad(req, res);
});
const updateInternalData = asyncHandler(async (req, res) => {
  const result = await userService.updateInternalData({ id: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});
const deleteInternalImage = asyncHandler(async (req, res) => {
  const result = await userService.deleteInternalImage(req.body.imageId);
  return result ? ok(req, res, result) : bad(req, res);
});

// Profile Image
const updateProfileImage = asyncHandler(async (req, res) => {
  const result = await userService.updateProfileImage({ userId: req.user.id, file: req.file });
  return result ? ok(req, res, result) : bad(req, res);
});
const updateProfileImageByToken = asyncHandler(async (req, res) => {
  const result = await userService.updateProfileImageByToken({ token: req.params.token, file: req.file });
  return result ? ok(req, res, result) : bad(req, res);
});

// Categories
const getAllCategory = asyncHandler(async (req, res) => {
  const result = await userService.getAllCategory();
  return result ? ok(req, res, result) : bad(req, res);
});
const getAllSubCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id || null;
  const result = await userService.getAllSubCategory(categoryId);
  return result ? ok(req, res, result) : bad(req, res);
});

// Application
const userApplication = asyncHandler(async (req, res) => {
  const result = await userService.getUserDetail(req.user.id);
  return result ? ok(req, res, result) : bad(req, res);
});
const userApplicationDetail = asyncHandler(async (req, res) => {
  const result = await userService.getUserDetail(req.params.id);
  return result ? ok(req, res, result) : bad(req, res);
});

export default {
  userRegistration, userRegistrationByToken, updateUser, adminUpdateUser,
  addOrUpdateReadyMadeApp, getUserDetail, getUserDetailByToken,
  publishReadyMadeApp, publishUserProfile,
  userCertificate, deleteUserCertificate, getCertificate,
  userEducation, getEducation,
  userProfessionalDetail, getProfessionalDetail, updateProfessionalDetail, getAllProfessionalDetail,
  addUserProject, deleteUserProject, getUserProject, updateUserProject,
  userThumbnail, updateThumbnail, userVideo,
  userIntenalData, updateInternalData, deleteInternalImage,
  updateProfileImage, updateProfileImageByToken,
  getAllCategory, getAllSubCategory,
  userApplication, userApplicationDetail,
};
