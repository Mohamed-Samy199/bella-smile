import client from "./client.js";

export const authApi = {
  login:          (data)              => client.post("/auth/login",           data),
  register:       (data)              => client.post("/auth/register",        data),
  me:             ()                  => client.get("/auth/me"),
  changePassword: (data)              => client.patch("/auth/change-password", data),
  forgotPassword: (data)              => client.post("/auth/forgot-password", data),
  resetPassword:  (token, data)       => client.post(`/auth/reset-password/${token}`, data),
  changeRole:     (userId, role)      => client.patch(`/auth/users/${userId}/role`, { role }),
};