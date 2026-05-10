export const ADMIN_ACCESS_STORAGE_KEY = 'zakup_admin_access_v1';
export const ADMIN_ACCESS_EVENT = 'zakup-admin-access-changed';
export const ADMIN_PIN_ENV = 'REACT_APP_ADMIN_PIN';

const getAdminPin = () => process.env.REACT_APP_ADMIN_PIN?.trim() || '';

const getAccessToken = () => {
  const pin = getAdminPin();
  return pin ? `pin:${window.btoa(pin)}` : '';
};

export const hasAdminAccess = () => {
  const token = getAccessToken();
  return Boolean(token) && localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY) === token;
};

export const grantAdminAccess = () => {
  const token = getAccessToken();

  if (!token) {
    return;
  }

  localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, token);
  window.dispatchEvent(new Event(ADMIN_ACCESS_EVENT));
};

export const revokeAdminAccess = () => {
  localStorage.removeItem(ADMIN_ACCESS_STORAGE_KEY);
  window.dispatchEvent(new Event(ADMIN_ACCESS_EVENT));
};
