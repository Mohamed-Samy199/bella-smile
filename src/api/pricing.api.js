import client from "./client";

export const pricingApi = {
  getCurrent: ()     => client.get("/pricing"),
  update:     (data) => client.put("/pricing", data),
  getHistory: ()     => client.get("/pricing/history"),
};