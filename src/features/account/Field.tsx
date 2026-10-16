import { useId, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Field({ label, error, hint, ...props }: { label: string; error?: string | undefined; hint?: string | undefined } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-semibold">{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? msgId : undefined}
        className="h-11 rounded-xl bg-card"
        {...props}
      />
      {error ? (
        <p id={msgId} className="text-sm font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p id={msgId} className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-butter px-2.5 py-1 text-xs font-bold">
      Demo mode · saved on this device only
    </span>
  );
}
