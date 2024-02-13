const baseURL = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3000";
export { baseURL };
export const LOG_LEVEL = process.env.NODE_ENV === "production" ? "warn" : "log";
export const S3_ACCESS_URL = process.env.RECAT_APP_S3_ACCESS_URL;
export const PDF_UPLOAD_URL = process.env.REACT_APP_PDF_SERVER_URL;
