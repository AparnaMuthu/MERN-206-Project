import axios from 'axios';

/**
 * Shared axios instance with base configuration.
 * All service functions use this instance so the base URL
 * is defined in one place.
 *
 * If the API moves to a different host (e.g., production),
 * you only change it here.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
