export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(v: string) {
  if (!v.trim()) return "Enter your email";
  if (!EMAIL.test(v.trim())) return "That email doesn't look right";
  return undefined;
}

export function validatePassword(v: string) {
  if (v.length < 8) return "Use at least 8 characters";
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Mix letters and numbers";
  return undefined;
}

export function validateName(v: string) {
  const t = v.trim();
  if (t.length < 2) return "Enter your name";
  if (t.length > 60) return "Keep it under 60 characters";
  return undefined;
}

/** Indian mobile: optional +91, then 10 digits starting 6-9. Empty allowed when optional. */
export function validatePhone(v: string, required = false) {
  const t = v.replace(/[\s-]/g, "");
  if (!t) return required ? "Enter a phone number" : undefined;
  if (!/^(\+91)?[6-9]\d{9}$/.test(t)) return "Enter a valid 10-digit mobile number";
  return undefined;
}

export function validatePincode(v: string) {
  if (!/^[1-9]\d{5}$/.test(v.trim())) return "Enter a valid 6-digit pincode";
  return undefined;
}
