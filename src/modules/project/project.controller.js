import asyncHandler from '../../utils/asyncHandler';
import getHttpStatus from '../../utils/httpStatus';
import getMessage from '../../utils/message';
import projectService from './project.service';

const ok = (req, res, data, msgKey = 'SIGNUP') => res.status(getHttpStatus('OK')).json({ success: true, data, message: getMessage(req, false, msgKey) });
const bad = (req, res, msgKey = 'FALSE_RESPONSE') => res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });
const notFound = (req, res, msgKey = 'PROJECT_NOT_FOUND') => res.status(getHttpStatus('NOT_FOUND')).json({ success: false, data: null, message: getMessage(req, false, msgKey) });

const createClientProject = asyncHandler(async (req, res) => {
  const result = await projectService.createClientProject({ body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserClientProject = asyncHandler(async (req, res) => {
  const result = await projectService.getUserClientProjects(req.user.id, req.query);
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserClientprojectDetailsbyId = asyncHandler(async (req, res) => {
  const result = await projectService.getClientProjectDetailsById(req.params.id);
  return result ? ok(req, res, result) : notFound(req, res);
});

const updateUserClientprojectDetailsbyId = asyncHandler(async (req, res) => {
  const result = await projectService.updateClientProjectDetails({ id: req.params.id, body: req.body, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const updateUserClientprojectStatusbyId = asyncHandler(async (req, res) => {
  const result = await projectService.updateClientProjectStatus({ id: req.params.id, body: req.body });
  return result ? ok(req, res, result) : bad(req, res);
});

const getUserClientProjectDetail = asyncHandler(async (req, res) => {
  try {
    const result = await projectService.getClientProjectDetail(req.params.id, req.user.id);
    return result ? ok(req, res, result) : notFound(req, res);
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ success: false, data: null, message: 'Access denied' });
    }
    throw error;
  }
});

const getClientProjectsListing = asyncHandler(async (req, res) => {
  const result = await projectService.getClientProjectsListing({ query: req.query, userId: req.user?.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const updatePublishClientProject = asyncHandler(async (req, res) => {
  const projectId = req.body.project_id;
  if (!projectId) {
    return res.status(getHttpStatus('BAD_REQUEST')).json({ success: false, data: null, message: 'project_id is required' });
  }
  const result = await projectService.updatePublishClientProject(projectId);
  return result ? ok(req, res, result) : bad(req, res);
});

const savedProject = asyncHandler(async (req, res) => {
  const result = await projectService.savedProject({ projectId: req.body.projectId, userId: req.user.id });
  return result ? ok(req, res, result) : bad(req, res);
});

const getSavedProject = asyncHandler(async (req, res) => {
  const result = await projectService.getSavedProjects({ userId: req.user.id, query: req.query });
  return ok(req, res, result);
});

const getProjectDetailsCount = asyncHandler(async (req, res) => {
  const result = await projectService.getProjectDetailsCount({ userId: req.user.id, query: req.query });
  return result ? ok(req, res, result, 'PROJECT_DETAILS_COUNT_SUCCESS') : bad(req, res, 'PROJECT_DETAILS_COUNT_FAILED');
});

export default {
  createClientProject, getUserClientProject, getUserClientprojectDetailsbyId,
  updateUserClientprojectDetailsbyId, updateUserClientprojectStatusbyId,
  getUserClientProjectDetail, getClientProjectsListing, updatePublishClientProject,
  savedProject, getSavedProject, getProjectDetailsCount,
};
