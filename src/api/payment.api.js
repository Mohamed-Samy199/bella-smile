import client from "./client";

export const paymentApi = {
  createSession: (data) => client.post("/payments/create-session", data),
  checkSession: (sessionId) => client.get(`/payments/session-status/${sessionId}`),
  getMyPayments: () => client.get("/payments/my-payments"),
  toggleExempt: (id, exempt) => client.patch(`/payments/exempt/${id}`, { exempt }),
};