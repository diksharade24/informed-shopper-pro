import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePrefs } from "@/store/preferences";

/** Configurable messages — replace with backend-provided announcements later. */
export const ANNOUNCEMENTS = ["New here? Explore the catalog and save favourites to your wishlist ✨", "Try the shopping finder — describe what you need in your own words."];

export function AnnouncementBar() {
  const dismissed = usePrefs((s) => s.announcementDismissed);
  const dismiss = usePrefs((s) => s.dismissAnnouncement);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (ANNOUNCEMENTS.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  if (dismissed) return null;
  return (
    <div role="region" aria-label="Announcements" className="bg-foreground text-background">
      <div className="container-page flex min-h-9 items-center justify-center gap-3 py-1.5 text-center text-xs sm:text-sm">
        <p aria-live="polite" className="flex-1">{ANNOUNCEMENTS[i]}</p>
        <button type="button" onClick={dismiss} aria-label="Dismiss announcement" className="inline-flex size-7 items-center justify-center rounded-full hover:bg-background/15">
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
