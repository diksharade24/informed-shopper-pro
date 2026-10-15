import { describe, expect, it } from "vitest";
import { validateEmail, validatePassword, validatePhone, validatePincode } from "@/services/account/validation";

describe("account validation", () => {
  it("requires 8+ char passwords mixing letters and digits", () => {
    expect(validatePassword("abc12")).toBeDefined();
    expect(validatePassword("abcdefgh")).toBeDefined();
    expect(validatePassword("abcdefg1")).toBeUndefined();
  });
  it("accepts 10-digit Indian mobiles starting 6-9", () => {
    expect(validatePhone("98765 43210")).toBeUndefined();
    expect(validatePhone("+919876543210")).toBeUndefined();
    expect(validatePhone("5876543210")).toBeDefined();
    expect(validatePhone("", true)).toBeDefined();
  });
  it("requires 6-digit pincodes not starting with 0", () => {
    expect(validatePincode("560001")).toBeUndefined();
    expect(validatePincode("060001")).toBeDefined();
  });
  it("rejects malformed emails", () => {
    expect(validateEmail("a@b")).toBeDefined();
    expect(validateEmail("me@shop.in")).toBeUndefined();
  });
});
