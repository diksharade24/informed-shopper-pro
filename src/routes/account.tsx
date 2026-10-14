import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/States";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — ShopSmart AI" },
      { name: "description", content: "Your ShopSmart AI account." },
      { property: "og:title", content: "Account — ShopSmart AI" },
      { property: "og:description", content: "Your ShopSmart AI account." },
    ],
  }),
  component: () => (
    <div className="container-page py-12">
      <EmptyState
        icon={<UserRound className="size-7" />}
        title="Accounts are coming next"
        body="Sign-in, profiles, addresses and order history will open once the secure account service is connected. Your cart and wishlist are saved on this device meanwhile."
        action={<Button asChild><Link to="/products">Keep shopping</Link></Button>}
      />
    </div>
  ),
});
