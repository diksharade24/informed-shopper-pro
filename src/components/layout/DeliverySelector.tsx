import { useState } from "react";
import { MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/store/preferences";

export function DeliverySelector() {
  const pincode = usePrefs((s) => s.pincode);
  const setPincode = usePrefs((s) => s.setPincode);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pincode);
  const [error, setError] = useState("");

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) { setValue(pincode); setError(""); } }}>
      <PopoverTrigger className="flex items-center gap-2 rounded-full px-3 py-2 text-left text-xs hover:bg-muted">
        <MapPin className="size-4 text-primary" aria-hidden />
        <span>
          <span className="block text-muted-foreground">Deliver to</span>
          <span className="block font-semibold">{pincode || "Set pincode"}</span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[1-9]\d{5}$/.test(value)) return setError("Enter a valid 6-digit Indian pincode.");
            setPincode(value);
            setOpen(false);
          }}
        >
          <label htmlFor="pincode" className="text-sm font-semibold">Delivery pincode</label>
          <input
            id="pincode"
            inputMode="numeric"
            maxLength={6}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!error}
            aria-describedby="pincode-help"
            className="mt-2 h-10 w-full rounded-xl border bg-card px-3 text-sm"
          />
          <p id="pincode-help" className={error ? "mt-1 text-xs text-destructive" : "mt-1 text-xs text-muted-foreground"}>
            {error || "Delivery availability is confirmed at checkout."}
          </p>
          <Button type="submit" size="sm" className="mt-3 w-full">Save</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
