import { queryOptions } from "@tanstack/react-query";
import { env } from "@/config/env";
import { friendlyError } from "@/services/api-client";
import { httpAccountService } from "./http";
import { createMockAccountService } from "./mock";
import { AccountError, type AccountService } from "./types";

export const accountService: AccountService = env.useMocks ? createMockAccountService() : httpAccountService;
export const isAccountMock = env.useMocks;

export const accountKeys = {
  me: ["account", "me"] as const,
  addresses: ["account", "addresses"] as const,
  orders: ["account", "orders"] as const,
};

export const meQuery = () => queryOptions({ queryKey: accountKeys.me, queryFn: () => accountService.me(), staleTime: 60_000 });
export const addressesQuery = () => queryOptions({ queryKey: accountKeys.addresses, queryFn: () => accountService.listAddresses() });
export const ordersQuery = () => queryOptions({ queryKey: accountKeys.orders, queryFn: () => accountService.listOrders() });

export function accountErrorMessage(e: unknown) {
  return e instanceof AccountError ? e.message : friendlyError(e);
}
