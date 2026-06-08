// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE_URL = "https://mhc-backend-ten.vercel.app/api";

export const API_ENDPOINTS = {
  submitApplication: `${BASE_URL}/appliactions/apply`,
  sendContact: `${BASE_URL}/contact/send`,
};