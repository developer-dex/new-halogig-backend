const ACTIONS = ['view', 'create', 'edit', 'delete'];

const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeActionValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return value === 'true' || value === '1';
  return false;
};

/**
 * Check if a module permission value grants access.
 * Supports: true (boolean), or { view: true, ... } action map.
 */
export const isModuleAllowed = (value) => {
  if (value === true) return true;
  if (!value || typeof value !== 'object') return false;
  return !!(value.view || value.create || value.edit || value.delete);
};

/**
 * Normalize permissions input into: moduleKey -> true
 */
export const normalizePermissions = (permissions) => {
  if (!isPlainObject(permissions)) return null;

  const normalized = {};

  Object.keys(permissions).forEach((moduleKey) => {
    const raw = permissions[moduleKey];

    if (typeof raw === 'boolean') {
      if (raw === true) normalized[moduleKey] = true;
      return;
    }

    if (Array.isArray(raw)) {
      const allowed = raw.some((action) => ACTIONS.includes(action));
      if (allowed) normalized[moduleKey] = true;
      return;
    }

    if (isPlainObject(raw)) {
      const allowed = ACTIONS.some((action) => normalizeActionValue(raw[action]) === true);
      if (allowed) normalized[moduleKey] = true;
    }
  });

  return normalized;
};

export const hasAtLeastOnePermission = (normalizedPermissions) => {
  if (!isPlainObject(normalizedPermissions)) return false;
  return Object.keys(normalizedPermissions).some((key) => normalizedPermissions[key] === true);
};
