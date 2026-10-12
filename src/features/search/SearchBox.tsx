import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Search, X } from "lucide-react";
import { catalogService } from "@/services/catalog";
import { usePrefs } from "@/store/preferences";
import { isCategorySlug } from "@/config/categories";
import type { SearchSuggestion } from "@/types/catalog";
import { cn } from "@/lib/utils";

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

type Option = { kind: "recent"; label: string } | { kind: "suggestion"; s: SearchSuggestion };

export function SearchBox({ initial = "", onDone, autoFocus }: { initial?: string; onDone?: () => void; autoFocus?: boolean }) {
  const [text, setText] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(text.trim(), 200);
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { recentSearches, addSearch, clearSearches } = usePrefs();

  // Query key change aborts the previous request through the signal.
  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["search", "suggest", debounced],
    queryFn: ({ signal }) => catalogService.suggest(debounced, signal),
    enabled: debounced.length >= 2,
    staleTime: 30_000,
  });

  useEffect(() => setText(initial), [initial]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const options: Option[] =
    text.trim().length < 2
      ? recentSearches.map((label) => ({ kind: "recent", label }))
      : suggestions.map((s) => ({ kind: "suggestion", s }));

  const submit = (q: string) => {
    const query = q.trim();
    if (!query) return;
    addSearch(query);
    setOpen(false);
    onDone?.();
    void navigate({ to: "/products", search: { q: query } });
  };

  const choose = (o: Option) => {
    setOpen(false);
    onDone?.();
    if (o.kind === "recent") return submit(o.label);
    const { s } = o;
    if (s.type === "product") void navigate({ to: "/products/$slug", params: { slug: s.value } });
    else if (s.type === "category" && isCategorySlug(s.value)) void navigate({ to: "/products", search: { category: s.value } });
    else void navigate({ to: "/products", search: { brands: s.value } });
  };

  const showList = open && options.length > 0;

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && options[active]) choose(options[active]);
          else submit(text);
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">Search products</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Search headphones, tees, serums…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(options.length - 1, a + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
            else if (e.key === "Escape") { setOpen(false); setActive(-1); }
          }}
          className="h-11 w-full rounded-full border bg-card pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setText(""); setActive(-1); }}
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </form>
      {showList && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border bg-popover p-2 shadow-lift">
          {text.trim().length < 2 && (
            <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground">
              <span>Recent searches</span>
              <button type="button" className="font-semibold text-primary hover:underline" onClick={clearSearches}>Clear</button>
            </div>
          )}
          <ul id={listId} role="listbox" aria-label="Search suggestions">
            {options.map((o, i) => (
              <li
                key={o.kind === "recent" ? `r-${o.label}` : `${o.s.type}-${o.s.value}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => { e.preventDefault(); choose(o); }}
                className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm", i === active ? "bg-accent" : "hover:bg-muted")}
              >
                {o.kind === "recent" ? (
                  <><Clock className="size-4 text-muted-foreground" aria-hidden />{o.label}</>
                ) : (
                  <>
                    <Search className="size-4 text-muted-foreground" aria-hidden />
                    <span className="flex-1">{o.s.label}</span>
                    <span className="text-xs capitalize text-muted-foreground">{o.s.type}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <span className="sr-only" aria-live="polite">{isFetching ? "Loading suggestions" : showList ? `${options.length} suggestions` : ""}</span>
    </div>
  );
}
