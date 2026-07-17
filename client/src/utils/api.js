const rawApiUrl = import.meta.env.VITE_API_URL || 'https://salon-5xgd.onrender.com';

export const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export function apiPath(path) {
  return `${apiBaseUrl}${path}`;
}
