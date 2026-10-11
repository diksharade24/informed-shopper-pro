/**
 * Runtime configuration. Only public values belong here (VITE_* is shipped to the browser).
 * Mock mode is explicit: it is ON unless VITE_API_BASE_URL is set and VITE_USE_MOCKS !== "true".
 */
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
const forceMocks = import.meta.env.VITE_USE_MOCKS === "true";

export const env = {
  apiBaseUrl,
  useMocks: forceMocks || apiBaseUrl === "",
  requestTimeoutMs: 15_000,
} as const;
