import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/States";
import { accountErrorMessage, meQuery } from "@/services/account";
import { AuthPanel } from "@/features/account/AuthPanel";
import { Dashboard } from "@/features/account/Dashboard";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your account — ShopSmart AI" },
      { name: "description", content: "Sign in to manage your profile, saved addresses, orders and settings on ShopSmart AI." },
      { property: "og:title", content: "Your account — ShopSmart AI" },
      { property: "og:description", content: "Manage your profile, addresses, orders and settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { data, isPending, isError, error, refetch } = useQuery(meQuery());
  return (
    <div className="container-page py-8 sm:py-12">
      {isPending ? (
        <div aria-busy="true" aria-label="Loading your account" className="space-y-6">
          <Skeleton className="h-40 rounded-[2rem]" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      ) : isError ? (
        <ErrorState message={accountErrorMessage(error)} onRetry={() => void refetch()} />
      ) : data ? (
        <Dashboard user={data} />
      ) : (
        <AuthPanel />
      )}
    </div>
  );
}
