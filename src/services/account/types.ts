export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | undefined;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
  avatarColor: AvatarColor;
  marketingEmails: boolean;
  orderUpdates: boolean;
  createdAt: string;
}

export type AvatarColor = "lavender" | "peach" | "butter" | "mint";

export interface OrderSummary {
  id: string;
  placedAt: string;
  status: "placed" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
}

export type ProfileUpdate = Partial<Pick<UserProfile, "name" | "phone" | "avatarColor" | "marketingEmails" | "orderUpdates">>;
export type AddressInput = Omit<Address, "id">;

/** Components depend only on this interface; mock vs FastAPI is chosen in ./index.ts. */
export interface AccountService {
  me(): Promise<UserProfile | null>;
  signIn(email: string, password: string): Promise<UserProfile>;
  register(name: string, email: string, password: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  updateProfile(patch: ProfileUpdate): Promise<UserProfile>;
  changePassword(current: string, next: string): Promise<void>;
  listAddresses(): Promise<Address[]>;
  saveAddress(input: AddressInput, id?: string): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
  listOrders(): Promise<OrderSummary[]>;
}

export class AccountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountError";
  }
}
