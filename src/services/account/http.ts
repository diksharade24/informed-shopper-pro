import { apiRequest, ApiError } from "@/services/api-client";
import type { AccountService, Address, OrderSummary, UserProfile } from "./types";

/** FastAPI account endpoints. Auth is an httpOnly session cookie set by the backend. */
export const httpAccountService: AccountService = {
  async me() {
    try {
      return await apiRequest<UserProfile>("/auth/me");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null;
      throw e;
    }
  },
  signIn: (email, password) => apiRequest<UserProfile>("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) => apiRequest<UserProfile>("/auth/register", { method: "POST", body: { name, email, password } }),
  signOut: () => apiRequest<void>("/auth/logout", { method: "POST" }),
  updateProfile: (patch) => apiRequest<UserProfile>("/account/profile", { method: "PATCH", body: patch }),
  changePassword: (current, next) => apiRequest<void>("/account/password", { method: "POST", body: { current, next } }),
  listAddresses: () => apiRequest<Address[]>("/account/addresses"),
  saveAddress: (input, id) =>
    apiRequest<Address>(id ? `/account/addresses/${id}` : "/account/addresses", { method: id ? "PUT" : "POST", body: input }),
  deleteAddress: (id) => apiRequest<void>(`/account/addresses/${id}`, { method: "DELETE" }),
  listOrders: () => apiRequest<OrderSummary[]>("/orders"),
};
