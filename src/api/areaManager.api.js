import client from "./client.js";

export const areaManagerApi = {
  getAll:     (params)   => client.get("/area-managers",         { params }),
  getById:    (id)       => client.get(`/area-managers/${id}`),
  create:     (data)     => client.post("/area-managers",        data),
  getDashboard: (id) => client.get(`/area-managers/${id}/dashboard`),
  update:     (id, data) => client.put(`/area-managers/${id}`,   data),
  deactivate: (id)       => client.delete(`/area-managers/${id}`),
};