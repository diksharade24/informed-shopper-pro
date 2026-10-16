<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Components depend only on the `CatalogService` interface (`src/services/catalog/types.ts`); mock vs HTTP is chosen in `src/services/catalog/index.ts` from `VITE_API_BASE_URL`/`VITE_USE_MOCKS` — so switching to the FastAPI backend needs no UI changes.
- Server state lives in TanStack Query; Zustand stores (`src/store`) hold only client state (guest cart, wishlist IDs, prefs) and use `skipHydration` + rehydrate in `__root` to avoid SSR mismatches.
- Catalog filters/sort/page live in URL search params (`features/catalog/search-params.ts`) so refresh and back/forward work.
- Sample fixtures stay in `src/mocks` and are never imported by HTTP services; mock mode is always labeled in the UI.
- Routing is TanStack Router (fixed by the platform), not React Router.
- Account features depend only on the `AccountService` interface (`src/services/account/types.ts`); mock (device-only localStorage, clearly labeled demo) vs FastAPI HTTP is chosen in `src/services/account/index.ts` by the same env switch as the catalog.
