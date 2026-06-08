import client from "./client.js";

export const distributorApi = {
  getAll:     (params)   => client.get("/distributors",         { params }),
  getById:    (id)       => client.get(`/distributors/${id}`),
  create:     (data)     => client.post("/distributors",        data),
  update:     (id, data) => client.put(`/distributors/${id}`,   data),
  deactivate: (id)       => client.delete(`/distributors/${id}`),
};