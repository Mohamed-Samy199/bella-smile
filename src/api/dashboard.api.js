import client from "./client.js";

export const dashboardApi = {
  getStats: () => client.get("/dashboard/stats"),
};