import { AccountError, type AccountService, type Address, type UserProfile } from "./types";

/**
 * Demo account service. Everything is stored in this browser's localStorage only —
 * it is NOT secure authentication and never leaves the device. Orders are always empty
 * because checkout isn't live yet (we never fabricate orders).
 */
interface Stored {
  users: Record<string, { profile: UserProfile; passwordHash: string; addresses: Address[] }>;
  session: string | null;
}

const KEY = "shopsmart-demo-accounts";
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function load(): Stored {
  if (typeof localStorage === "undefined") return { users: {}, session: null };
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? "") as Stored) ?? { users: {}, session: null };
  } catch {
    return { users: {}, session: null };
  }
}
const save = (s: Stored) => localStorage.setItem(KEY, JSON.stringify(s));

async function hash(pw: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`shopsmart-demo:${pw}`));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function current(s: Stored) {
  const u = s.session ? s.users[s.session] : undefined;
  if (!u) throw new AccountError("Please sign in again.");
  return u;
}

export function createMockAccountService(): AccountService {
  return {
    async me() {
      await delay(150);
      const s = load();
      return s.session ? (s.users[s.session]?.profile ?? null) : null;
    },
    async signIn(email, password) {
      await delay();
      const s = load();
      const u = s.users[email.trim().toLowerCase()];
      if (!u || u.passwordHash !== (await hash(password))) throw new AccountError("Email or password is incorrect.");
      s.session = u.profile.email;
      save(s);
      return u.profile;
    },
    async register(name, email, password) {
      await delay();
      const s = load();
      const key = email.trim().toLowerCase();
      if (s.users[key]) throw new AccountError("An account with this email already exists. Try signing in.");
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: key,
        avatarColor: "lavender",
        marketingEmails: false,
        orderUpdates: true,
        createdAt: new Date().toISOString(),
      };
      s.users[key] = { profile, passwordHash: await hash(password), addresses: [] };
      s.session = key;
      save(s);
      return profile;
    },
    async signOut() {
      await delay(150);
      const s = load();
      s.session = null;
      save(s);
    },
    async updateProfile(patch) {
      await delay();
      const s = load();
      const u = current(s);
      u.profile = { ...u.profile, ...patch };
      save(s);
      return u.profile;
    },
    async changePassword(cur, next) {
      await delay();
      const s = load();
      const u = current(s);
      if (u.passwordHash !== (await hash(cur))) throw new AccountError("Your current password is incorrect.");
      u.passwordHash = await hash(next);
      save(s);
    },
    async listAddresses() {
      await delay(200);
      return current(load()).addresses;
    },
    async saveAddress(input, id) {
      await delay();
      const s = load();
      const u = current(s);
      const addr: Address = { ...input, id: id ?? crypto.randomUUID() };
      let list = id ? u.addresses.map((a) => (a.id === id ? addr : a)) : [...u.addresses, addr];
      if (list.length === 1) list = list.map((a) => ({ ...a, isDefault: true }));
      else if (addr.isDefault) list = list.map((a) => ({ ...a, isDefault: a.id === addr.id }));
      u.addresses = list;
      save(s);
      return list.find((a) => a.id === addr.id)!;
    },
    async deleteAddress(id) {
      await delay();
      const s = load();
      const u = current(s);
      const removed = u.addresses.find((a) => a.id === id);
      u.addresses = u.addresses.filter((a) => a.id !== id);
      if (removed?.isDefault && u.addresses[0]) u.addresses[0].isDefault = true;
      save(s);
    },
    async listOrders() {
      await delay(200);
      current(load());
      return [];
    },
  };
}
