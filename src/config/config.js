const baseURL = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3000";
export { baseURL };
export const LOG_LEVEL = process.env.NODE_ENV === "production" ? "warn" : "log";
