const rawApiUrl = import.meta.env.VITE_API_URL || '';

export const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export function apiPath(path) {
  return `${apiBaseUrl}${path}`;
}
