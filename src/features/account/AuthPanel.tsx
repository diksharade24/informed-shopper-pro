import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { accountErrorMessage, accountKeys, accountService, isAccountMock } from "@/services/account";
import { validateEmail, validateName, validatePassword, type Errors } from "@/services/account/validation";
import { DemoBadge, Field } from "./Field";

type Mode = "signin" | "register";

export function AuthPanel() {
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors<keyof typeof form>>({});

  const m = useMutation({
    mutationFn: () =>
      mode === "signin"
        ? accountService.signIn(form.email, form.password)
        : accountService.register(form.name, form.email, form.password),
    onSuccess: (user) => {
      qc.setQueryData(accountKeys.me, user);
      toast.success(mode === "signin" ? `Welcome back, ${user.name.split(" ")[0]}!` : "Account created — welcome to the crew!");
    },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors<keyof typeof form> = {
      email: validateEmail(form.email),
      password: mode === "signin" ? (form.password ? undefined : "Enter your password") : validatePassword(form.password),
    };
    if (mode === "register") {
      next.name = validateName(form.name);
      next.confirm = form.confirm === form.password ? undefined : "Passwords don't match";
    }
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    m.mutate();
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  return (
    <div className="grid overflow-hidden rounded-[2rem] border bg-card shadow-soft md:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-lavender p-10 md:flex">
        <div aria-hidden className="blob absolute -right-10 -top-10 size-48 bg-peach" />
        <div aria-hidden className="blob absolute -bottom-12 left-10 size-40 bg-butter" />
        <div className="relative">
          <Sparkles className="size-8" aria-hidden />
          <h2 className="mt-4 text-4xl font-extrabold leading-tight">Your shop,<br />your vibe.</h2>
          <p className="mt-3 max-w-xs text-foreground/80">Save addresses, track orders and keep your wishlist close.</p>
        </div>
        <ul className="relative space-y-2 text-sm font-semibold">
          <li className="w-fit rounded-full bg-card px-3 py-1.5">📦 Order history in one place</li>
          <li className="w-fit rounded-full bg-card px-3 py-1.5">🏠 Faster checkout with saved addresses</li>
          <li className="w-fit rounded-full bg-card px-3 py-1.5">💖 Wishlist that sticks around</li>
        </ul>
      </div>

      <div className="p-6 sm:p-10">
        <div role="tablist" aria-label="Account access" className="mb-6 inline-flex rounded-full bg-muted p-1">
          {(["signin", "register"] as const).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={mode === k}
              onClick={() => { setMode(k); setErrors({}); m.reset(); }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${mode === k ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              {k === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <h1 className="text-3xl font-extrabold">{mode === "signin" ? "Hey, welcome back 👋" : "Join ShopSmart AI ✨"}</h1>
        {isAccountMock && <div className="mt-3"><DemoBadge /></div>}

        <form noValidate onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && <Field label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />}
          <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Field
            label="Password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            hint={mode === "register" ? "8+ characters with letters and numbers" : undefined}
          />
          {mode === "register" && <Field label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />}
          {m.isError && <p role="alert" className="rounded-xl bg-peach/70 px-3 py-2 text-sm font-medium">{accountErrorMessage(m.error)}</p>}
          <Button type="submit" size="lg" className="h-12 w-full rounded-full text-base font-bold" disabled={m.isPending}>
            {m.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {mode === "signin" ? "Sign in" : "Create my account"}
          </Button>
        </form>
        {isAccountMock && (
          <p className="mt-4 text-xs text-muted-foreground">Demo accounts are not secure and exist only in this browser. Real sign-in turns on when the store's account service is connected.</p>
        )}
      </div>
    </div>
  );
}
