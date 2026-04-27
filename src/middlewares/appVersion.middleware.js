import semver from 'semver';

/**
 * Mobile app version check middleware.
 * Compares the app-version header against configured minimum version.
 */
const appVersionMiddleware = async (req, res, next) => {
  try {
    if (req.baseUrl === '/api/setting') return next();

    const appVersion = req.headers['app-version'];
    if (!appVersion) return next();

    const deviceType = (req.headers['device-type'] || '').toLowerCase();
    const settingDetail = {};
    const configBuildVersion = deviceType === 'android'
      ? settingDetail.android_app_version
      : settingDetail.ios_app_version;
    const forceUpdate = deviceType === 'android'
      ? settingDetail.android_force_update
      : settingDetail.ios_force_update;

    if (configBuildVersion && !semver.gte(appVersion, configBuildVersion) && parseInt(forceUpdate, 10)) {
      return res.status(403).json({
        success: false,
        data: [],
        message: 'A newer version is available on the store, please update the application.',
        isForceUpdate: parseInt(forceUpdate, 10),
        isUpdate: true,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default appVersionMiddleware;
