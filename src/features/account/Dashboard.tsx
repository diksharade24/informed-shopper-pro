import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Home, Loader2, LogOut, MapPin, Package, Pencil, Plus, Settings, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState, ErrorState } from "@/components/feedback/States";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/store/wishlist";
import { accountErrorMessage, accountKeys, accountService, addressesQuery, isAccountMock, ordersQuery } from "@/services/account";
import type { Address, AddressInput, AvatarColor, UserProfile } from "@/services/account/types";
import { validateName, validatePassword, validatePhone, validatePincode, type Errors } from "@/services/account/validation";
import { DemoBadge, Field } from "./Field";

const AVATAR_BG: Record<AvatarColor, string> = { lavender: "bg-lavender", peach: "bg-peach", butter: "bg-butter", mint: "bg-mint" };
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

type Tab = "profile" | "addresses" | "orders" | "settings";
const TABS: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-soft sm:p-7" aria-label={title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Dashboard({ user }: { user: UserProfile }) {
  const [tab, setTab] = useState<Tab>("profile");
  const qc = useQueryClient();
  const navigate = useNavigate();
  const wishCount = useWishlist((s) => s.ids.length);
  const signOut = useMutation({
    mutationFn: () => accountService.signOut(),
    onSuccess: () => {
      qc.setQueryData(accountKeys.me, null);
      qc.removeQueries({ queryKey: ["account", "addresses"] });
      qc.removeQueries({ queryKey: ["account", "orders"] });
      toast("Signed out. See you soon!");
      void navigate({ to: "/account", replace: true });
    },
    onError: (e) => toast.error(accountErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-peach p-6 sm:p-8">
        <div aria-hidden className="blob absolute -right-8 -top-12 size-44 bg-butter/80" />
        <div aria-hidden className="blob absolute -bottom-16 right-32 size-36 bg-lavender/80" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className={cn("flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-card text-2xl font-extrabold shadow-soft", AVATAR_BG[user.avatarColor])} aria-hidden>
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground/70">Hey there,</p>
            <h1 className="truncate text-3xl font-extrabold sm:text-4xl">{user.name}</h1>
            <p className="truncate text-sm text-foreground/75">{user.email}</p>
            {isAccountMock && <div className="mt-2"><DemoBadge /></div>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="rounded-full bg-card font-bold hover:bg-card/80">
              <Link to="/wishlist"><Heart className="size-4" aria-hidden /> Wishlist{wishCount ? ` (${wishCount})` : ""}</Link>
            </Button>
            <Button variant="outline" className="rounded-full bg-card/60 font-bold" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
              {signOut.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogOut className="size-4" aria-hidden />} Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account sections" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-col">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={tab === id ? "page" : undefined}
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors lg:rounded-2xl",
                tab === id ? "bg-foreground text-background" : "bg-card hover:bg-lavender",
              )}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </nav>
        <div>
          {tab === "profile" && <ProfileSection user={user} />}
          {tab === "addresses" && <AddressesSection />}
          {tab === "orders" && <OrdersSection />}
          {tab === "settings" && <SettingsSection user={user} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user }: { user: UserProfile }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: user.name, phone: user.phone ?? "", avatarColor: user.avatarColor });
  const [errors, setErrors] = useState<Errors<"name" | "phone">>({});
  const m = useMutation({
    mutationFn: () => accountService.updateProfile({ name: form.name.trim(), phone: form.phone.trim() || undefined, avatarColor: form.avatarColor }),
    onSuccess: (u) => { qc.setQueryData(accountKeys.me, u); toast.success("Profile updated ✨"); },
    onError: (e) => toast.error(accountErrorMessage(e)),
  });
  const dirty = form.name !== user.name || form.phone !== (user.phone ?? "") || form.avatarColor !== user.avatarColor;

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = { name: validateName(form.name), phone: validatePhone(form.phone) };
    setErrors(next);
    if (!next.name && !next.phone) m.mutate();
  }

  return (
    <Card title="Personal details">
      <form noValidate onSubmit={submit} className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Avatar colour</legend>
          <div className="flex gap-3">
            {(Object.keys(AVATAR_BG) as AvatarColor[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={form.avatarColor === c}
                onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                className={cn("flex size-12 items-center justify-center rounded-full text-sm font-extrabold ring-offset-2 transition", AVATAR_BG[c], form.avatarColor === c && "ring-2 ring-foreground")}
              >
                {initials(form.name || user.name)}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
          <Field label="Mobile number" type="tel" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone} hint="Optional — for delivery updates" />
          <Field label="Email" value={user.email} disabled hint="Email can't be changed here yet" />
          <Field label="Member since" value={new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} disabled />
        </div>
        <Button type="submit" className="rounded-full font-bold" disabled={!dirty || m.isPending}>
          {m.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save changes
        </Button>
      </form>
    </Card>
  );
}

const EMPTY_ADDR: AddressInput = { label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false };

function AddressesSection() {
  const qc = useQueryClient();
  const { data, isPending, isError, error, refetch } = useQuery(addressesQuery());
  const [editing, setEditing] = useState<{ id?: string; value: AddressInput } | null>(null);
  const [toDelete, setToDelete] = useState<Address | null>(null);
  const del = useMutation({
    mutationFn: (id: string) => accountService.deleteAddress(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: accountKeys.addresses }); toast.success("Address removed"); setToDelete(null); },
    onError: (e) => toast.error(accountErrorMessage(e)),
  });

  return (
    <Card
      title="Saved addresses"
      action={<Button className="rounded-full font-bold" onClick={() => setEditing({ value: EMPTY_ADDR })}><Plus className="size-4" aria-hidden /> Add address</Button>}
    >
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-36 rounded-2xl" /></div>
      ) : isError ? (
        <ErrorState message={accountErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data.length ? (
        <EmptyState icon={<Home className="size-7" aria-hidden />} title="No addresses yet" body="Add one now and checkout will be a breeze later." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.map((a) => (
            <li key={a.id} className={cn("rounded-2xl border-2 p-4", a.isDefault ? "border-primary bg-peach/30" : "border-border")}>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-bold">{a.label}</span>
                {a.isDefault && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">Default</span>}
              </div>
              <p className="mt-3 font-bold">{a.fullName}</p>
              <p className="text-sm text-muted-foreground">{[a.line1, a.line2].filter(Boolean).join(", ")}</p>
              <p className="text-sm text-muted-foreground">{a.city}, {a.state} – {a.pincode}</p>
              <p className="text-sm text-muted-foreground">📞 {a.phone}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditing({ id: a.id, value: { ...a } })} aria-label={`Edit ${a.label} address`}><Pencil className="size-3.5" aria-hidden /> Edit</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => setToDelete(a)} aria-label={`Delete ${a.label} address`}><Trash2 className="size-3.5" aria-hidden /> Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit address" : "New address"}</DialogTitle></DialogHeader>
          {editing && <AddressForm initial={editing.value} id={editing.id} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
            <AlertDialogDescription>{toDelete?.label} — {toDelete?.line1}, {toDelete?.city}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-destructive hover:bg-destructive/90" onClick={(e) => { e.preventDefault(); if (toDelete) del.mutate(toDelete.id); }} disabled={del.isPending}>
              {del.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

type AddrKey = "label" | "fullName" | "phone" | "line1" | "city" | "state" | "pincode";

function AddressForm({ initial, id, onDone }: { initial: AddressInput; id?: string | undefined; onDone: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState<Errors<AddrKey>>({});
  const m = useMutation({
    mutationFn: () => accountService.saveAddress({ ...f, line2: f.line2?.trim() || undefined }, id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: accountKeys.addresses }); toast.success(id ? "Address updated" : "Address saved 🏠"); onDone(); },
  });
  const bind = (k: AddrKey | "line2") => ({
    value: f[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value })),
    error: k === "line2" ? undefined : errors[k],
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const req = (v: string, msg: string) => (v.trim() ? undefined : msg);
    const next: Errors<AddrKey> = {
      label: req(f.label, "Give it a label"),
      fullName: validateName(f.fullName),
      phone: validatePhone(f.phone, true),
      line1: req(f.line1, "Enter house / street"),
      city: req(f.city, "Enter city"),
      state: req(f.state, "Enter state"),
      pincode: validatePincode(f.pincode),
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) m.mutate();
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick label">
        {["Home", "Work", "Other"].map((l) => (
          <button key={l} type="button" aria-pressed={f.label === l} onClick={() => setF((x) => ({ ...x, label: l }))} className={cn("rounded-full px-3 py-1.5 text-sm font-bold", f.label === l ? "bg-foreground text-background" : "bg-muted")}>{l}</button>
        ))}
      </div>
      <Field label="Label" {...bind("label")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" autoComplete="name" {...bind("fullName")} />
        <Field label="Mobile number" type="tel" autoComplete="tel" {...bind("phone")} />
      </div>
      <Field label="House no., street" autoComplete="address-line1" {...bind("line1")} />
      <Field label="Area, landmark (optional)" autoComplete="address-line2" {...bind("line2")} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" autoComplete="address-level2" {...bind("city")} />
        <Field label="State" autoComplete="address-level1" {...bind("state")} />
        <Field label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" {...bind("pincode")} />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="addr-default" checked={f.isDefault} onCheckedChange={(c) => setF((x) => ({ ...x, isDefault: c === true }))} />
        <Label htmlFor="addr-default">Make this my default address</Label>
      </div>
      {m.isError && <p role="alert" className="rounded-xl bg-peach/70 px-3 py-2 text-sm font-medium">{accountErrorMessage(m.error)}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" className="rounded-full" onClick={onDone}>Cancel</Button>
        <Button type="submit" className="rounded-full font-bold" disabled={m.isPending}>{m.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save address</Button>
      </div>
    </form>
  );
}

const STATUS_TONE = { placed: "bg-butter", shipped: "bg-lavender", delivered: "bg-mint", cancelled: "bg-muted" } as const;

function OrdersSection() {
  const { data, isPending, isError, error, refetch } = useQuery(ordersQuery());
  return (
    <Card title="Order history">
      {isPending ? (
        <div className="space-y-3"><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /></div>
      ) : isError ? (
        <ErrorState message={accountErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data.length ? (
        <EmptyState
          icon={<Package className="size-7" aria-hidden />}
          title="No orders yet"
          body={isAccountMock ? "Checkout isn't live yet, so there are no real orders to show. Your orders will appear here once it is." : "When you place an order it'll show up here."}
          action={<Button asChild className="rounded-full"><Link to="/products">Start shopping</Link></Button>}
        />
      ) : (
        <ul className="space-y-3">
          {data.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
              <div>
                <p className="font-bold">Order #{o.id}</p>
                <p className="text-sm text-muted-foreground">{new Date(o.placedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", STATUS_TONE[o.status])}>{o.status}</span>
                <span className="font-extrabold">{formatPrice(o.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function SettingsSection({ user }: { user: UserProfile }) {
  const qc = useQueryClient();
  const prefs = useMutation({
    mutationFn: (patch: Partial<Pick<UserProfile, "marketingEmails" | "orderUpdates">>) => accountService.updateProfile(patch),
    onSuccess: (u) => { qc.setQueryData(accountKeys.me, u); toast.success("Preferences saved"); },
    onError: (e) => toast.error(accountErrorMessage(e)),
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Errors<keyof typeof pw>>({});
  const change = useMutation({
    mutationFn: () => accountService.changePassword(pw.current, pw.next),
    onSuccess: () => { setPw({ current: "", next: "", confirm: "" }); toast.success("Password changed 🔒"); },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      current: pw.current ? undefined : "Enter your current password",
      next: validatePassword(pw.next),
      confirm: pw.confirm === pw.next ? undefined : "Passwords don't match",
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) change.mutate();
  }

  const toggles = [
    { key: "orderUpdates" as const, label: "Order & delivery updates", body: "Shipping and delivery notifications." },
    { key: "marketingEmails" as const, label: "Deals & drops emails", body: "New arrivals and offers, max once a week." },
  ];

  return (
    <div className="space-y-6">
      <Card title="Notifications">
        <ul className="space-y-4">
          {toggles.map((t) => (
            <li key={t.key} className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-4">
              <div>
                <Label htmlFor={`pref-${t.key}`} className="font-bold">{t.label}</Label>
                <p className="text-sm text-muted-foreground">{t.body}</p>
              </div>
              <Switch id={`pref-${t.key}`} checked={user[t.key]} disabled={prefs.isPending} onCheckedChange={(v) => prefs.mutate({ [t.key]: v })} />
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Change password">
        <form noValidate onSubmit={submit} className="space-y-4">
          <Field label="Current password" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((x) => ({ ...x, current: e.target.value }))} error={errors.current} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((x) => ({ ...x, next: e.target.value }))} error={errors.next} hint="8+ characters with letters and numbers" />
            <Field label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((x) => ({ ...x, confirm: e.target.value }))} error={errors.confirm} />
          </div>
          {change.isError && <p role="alert" className="rounded-xl bg-peach/70 px-3 py-2 text-sm font-medium">{accountErrorMessage(change.error)}</p>}
          <Button type="submit" className="rounded-full font-bold" disabled={change.isPending}>{change.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />} Update password</Button>
        </form>
      </Card>
    </div>
  );
}
