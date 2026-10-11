import { env } from "@/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: "network" | "timeout" | "http" | "aborted" = "http",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Friendly copy for customers — never expose raw technical errors. */
export function friendlyError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "timeout") return "That took too long. Please try again.";
    if (err.code === "network") return "We couldn't reach the store. Check your connection and retry.";
    if (err.status === 401) return "Your session has expired. Please sign in again.";
    if (err.status === 404) return "We couldn't find that.";
  }
  return "Something went wrong. Please try again.";
}

type Query = Record<string, string | number | boolean | string[] | undefined>;

function toSearch(query?: Query): string {
  if (!query) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    sp.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export async function apiRequest<T>(
  path: string,
  opts: { method?: string; query?: Query; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), env.requestTimeoutMs);
  const onAbort = () => controller.abort("aborted");
  opts.signal?.addEventListener("abort", onAbort);
  try {
    const res = await fetch(`${env.apiBaseUrl}${path}${toSearch(opts.query)}`, {
      method: opts.method ?? "GET",
      headers: opts.body ? { "Content-Type": "application/json" } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      credentials: "include", // auth via httpOnly cookies set by the backend
      signal: controller.signal,
    });
    if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (controller.signal.aborted) {
      const reason = controller.signal.reason === "timeout" ? "timeout" : "aborted";
      throw new ApiError(reason, 0, reason);
    }
    throw new ApiError("Network error", 0, "network");
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener("abort", onAbort);
  }
}
