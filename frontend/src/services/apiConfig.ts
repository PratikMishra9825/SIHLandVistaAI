// LANDVISTA AI - Unified API Configuration
// In local dev, relative /api requests are proxied by Vite.
// In production on Vercel, relative /api requests route to the serverless function.
// If VITE_BACKEND_URL is explicitly set, it prepends that base URL.

const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
export const API_BASE = envBackendUrl ? envBackendUrl.replace(/\/+$/, '') : '';

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}
