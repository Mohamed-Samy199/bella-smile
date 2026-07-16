import client from "./client.js";

export const doctorApi = {
  getAll:      (params)   => client.get("/doctors",         { params }),
  getById:     (id)       => client.get(`/doctors/${id}`),
  getOverview: (id)       => client.get(`/doctors/${id}/overview`),
  getMe:       ()         => client.get("/doctors/me"),
  create:      (data)     => client.post("/doctors",        data),
  update:      (id, data) => client.put(`/doctors/${id}`,   data),
  deactivate:  (id)       => client.delete(`/doctors/${id}`),
};