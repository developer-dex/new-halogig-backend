import { Router } from 'express';
import userController from './user.controller';
import validate from '../../middlewares/validate.middleware';
import userValidation from './user.validation';
import authMiddleware, { optionalAuthMiddleware } from '../../middlewares/auth.middleware';
import fileUpload from '../../middlewares/fileUpload.middleware';

const router = Router();

// Registration
router.put('/user/registration', optionalAuthMiddleware, validate(userValidation.userRegistration), userController.userRegistration);
router.put('/public/user/registration/:token/update', validate(userValidation.tokenParam), userController.userRegistrationByToken);

// User details
router.put('/user/update-details', authMiddleware, validate(userValidation.updateUser), userController.updateUser);
router.put('/admin/update-details', userController.adminUpdateUser);
router.post('/user/details', authMiddleware, validate(userValidation.addOrUpdateReadyMadeApp), userController.addOrUpdateReadyMadeApp);
router.get('/user/details', authMiddleware, userController.getUserDetail);
router.get('/public/profile/:token/info', validate(userValidation.tokenParam), userController.getUserDetailByToken);

// Publish
router.patch('/user/readymad/publish', authMiddleware, validate(userValidation.publishReadyMadeApp), userController.publishReadyMadeApp);
router.patch('/user/profile-publish', authMiddleware, userController.publishUserProfile);

// Thumbnails & Videos
router.post('/user/details/thumbnail', authMiddleware, fileUpload.uploadThumbnail, userController.userThumbnail);
router.put('/user/details/thumbnail/:id', authMiddleware, validate(userValidation.idParam), userController.updateThumbnail);
router.post('/user/details/video', authMiddleware, fileUpload.uploadVideo, userController.userVideo);

// Profile Image
router.post('/user/profile-image', authMiddleware, fileUpload.uploadProfileImage, userController.updateProfileImage);
router.post('/user/profile-image/:token/upload', fileUpload.uploadProfileImage, userController.updateProfileImageByToken);

// Internal Data
router.post('/user/details/internal-pages', authMiddleware, fileUpload.uploadInternalData, userController.userIntenalData);
router.put('/user/details/internal-data/:id', authMiddleware, validate(userValidation.idParam), userController.updateInternalData);
router.post('/user/details/internal-pages-image-remove', authMiddleware, validate(userValidation.deleteInternalImage), userController.deleteInternalImage);

// Education
router.post('/user/details/education', authMiddleware, userController.userEducation);
router.get('/user/details/education', authMiddleware, userController.getEducation);

// Certificates
router.post('/user/details/certificate', authMiddleware, userController.userCertificate);
router.get('/user/details/certificate', authMiddleware, userController.getCertificate);
router.delete('/user/details/certificate', authMiddleware, validate(userValidation.deleteCertificate), userController.deleteUserCertificate);

// Professional Detail
router.post('/user/details/professional-detail', authMiddleware, userController.userProfessionalDetail);
router.get('/user/details/professional-detail', authMiddleware, userController.getProfessionalDetail);
router.put('/user/professional-detail/:id', authMiddleware, validate(userValidation.idParam), userController.updateProfessionalDetail);
router.get('/professional-detail', userController.getAllProfessionalDetail);

// Projects (portfolio)
router.post('/user/details/project', authMiddleware, userController.addUserProject);
router.get('/user/details/project', authMiddleware, userController.getUserProject);
router.delete('/user/details/project', authMiddleware, validate(userValidation.deleteProject), userController.deleteUserProject);
router.put('/user/project/:id', authMiddleware, validate(userValidation.idParam), userController.updateUserProject);

// Application
router.get('/user/details/application', authMiddleware, userController.userApplication);
router.get('/user/details/application/:id', authMiddleware, validate(userValidation.idParam), userController.userApplicationDetail);

// Categories
router.get('/category', userController.getAllCategory);
router.get('/user/category', authMiddleware, userController.getAllCategory);
router.get('/sub-category', userController.getAllSubCategory);
router.get('/user/sub-category/:id', userController.getAllSubCategory);

export default router;
