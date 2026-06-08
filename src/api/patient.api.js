import client from "./client.js";

export const patientApi = {
  // ── CRUD ────────────────────────────────────────────────────────────────────
  getAll: (params) => client.get("/patients", { params }),
  getById: (id) => client.get(`/patients/${id}`),
  create: (data) => client.post("/patients", data),
  update: (id, data) => client.put(`/patients/${id}`, data),
  remove: (id) => client.delete(`/patients/${id}`),
  changePhase: (id, data) => client.patch(`/patients/${id}/phase`, data),

  // ── Workflow ─────────────────────────────────────────────────────────────────
  workflow: (id, action, data = {}) => client.post(`/patients/${id}/${action}`, data),
  toggleStlRequest: (id) => client.patch(`/patients/${id}/stl-request`),
  setAcceptanceDecision: (id, decision) => client.patch(`/patients/${id}/acceptance-decision`, { decision, }),


  // Documents
  uploadDocuments: (id, formData) =>
    client.post(`/patients/${id}/data/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteDocument: (id, docIndex) =>
    client.delete(`/patients/${id}/documents/${docIndex}`),

  // Management
  updateManagement: (id, data) =>
    client.put(`/patients/${id}/management`, data),

  // Lavorazioni
  addLavorazione: (id, data) => client.post(`/patients/${id}/lavorazioni`, data),
  updateLavorazione: (id, lavId, data) => client.put(`/patients/${id}/lavorazioni/${lavId}`, data),
  deleteLavorazione: (id, lavId) => client.delete(`/patients/${id}/lavorazioni/${lavId}`),

  // Care Plan
  updateCarePlan: (id, data) => client.put(`/patients/${id}/care-plan`, data),

  // Activity Log
  getActivityLog: (id, params = {}) => client.get(`/patients/${id}/activity-log`, { params }),

  addNote: (id, message) => client.post(`/patients/${id}/notes`, { message }),
  getNotes: (id) => client.get(`/patients/${id}/notes`),

};