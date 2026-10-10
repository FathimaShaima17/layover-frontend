/**
 * Shared event names dispatched on `window` for cross-layer messaging.
 */

/**
 * Dispatched by API repositories when the backend responds with 401
 * (invalid or expired JWT). The AuthProvider listens for this event
 * and clears the active session.
 */
export const AUTH_EXPIRED_EVENT = 'hiddenatlas:auth-expired';
