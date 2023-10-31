export const UPLOAD_URL =
  process.env.MODE == 'dev'
    ? 'http://localhost:8080/api/'
    : 'http://45.159.250.142:4012/api/';
